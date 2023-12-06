import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  addProfile,
  dogsList,
  formatMinuteToTime,
  getDogInfo,
  getProfile,
  getUploadUrl,
  modDog,
  uploadImage,
} from '../api';
import { useEffect, useRef, useState } from 'react';
import ProfileAvatar from '../components/ProfileAvatar';

export default function ModifyDog({ isOpen, onClose }) {
  // const {isOpen, onOpen, onClose} = useDisclosure()
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const toast = useToast();
  const [name, setName] = useState('');
  const [info, setInfo] = useState('');
  const [beltColor, setBeltColor] = useState('green');
  const [usedBelts, setUsedBelts] = useState('');
  const [lastVisited, setLastVisited] = useState('');
  const [visitColor, setVisitColor] = useState('telegram');
  const [timeColor, setTimeColor] = useState('green');
  const queryClient = useQueryClient();
  const mutation = useMutation(modDog, {
    onSuccess: () => {
      toast({
        title: name + ' 수정에 성공했어요~~',
        status: 'success',
        position: 'top',
        duration: 1000,
        isClosable: true,
      });
      queryClient.refetchQueries('dogs-list');
      onCloseFn();
    },
  });
  const { isLoading: selectIsLoading, data: selectData } = useQuery(['dogs-list'], dogsList);
  const { isLoading, data } = useQuery(['dog_info', name], getDogInfo);
  const options =
    selectData &&
    selectData?.map(item => ({
      value: item.name,
      label: item.name,
    }));
  const onSubmit = res => {
    // console.log(res);
    mutation.mutate(res);
  };
  const [remainingTime, setRemainingTime] = useState('');
  useEffect(() => {
    if (data && !isLoading) {
      reset({
        officialName: data.official_name,
        dogInfo: data.note,
        dogBreed: data.breed,
        dogGender: data.gender,
        phone: data.phone,
        dogWeight: data.weight,
      });
      setRemainingTime(formatMinuteToTime(data.remaining_minutes));
      setUsedBelts(data.used_belts + '개');
      if (data.used_belts > 0) {
        setBeltColor('orange');
      }
      if (data.last_visited) {
        setVisitColor('telegram');
        setLastVisited(data.last_visited);
      } else {
        setVisitColor('pink');
        setLastVisited('기록에 없어요ㅜ');
      }
      if (data && data.remaining_minutes < 0) {
        setTimeColor('red');
      } else {
        setTimeColor('green');
      }
    }
  }, [data]);
  const onReset = () => {
    reset({
      officialName: '',
      dogInfo: '',
      dogBreed: '',
      dogGender: '',
      phone: '',
      dogWeight: '',
    });
    document.getElementById('name').value = '';
    setName('');
    setUsedBelts('');
    setRemainingTime('');
    setLastVisited('');
    setBeltColor('green');
    setFile(null);
    setProfileUrl('');
    setIsUploaded(true);
  };
  const onCloseFn = () => {
    onClose();
    onReset();
  };
  const onNameChange = e => {
    if (e.target.value === '') {
      onReset();
    } else {
      document.getElementById('name').style.position = 'inherit';
      setName(prev => e.target.value);
    }
  };
  const [file, setFile] = useState(null);
  const imageRef = useRef(null);
  const onUploadImageButtonClick = () => {
    if (!imageRef.current) {
      return;
    }
    imageRef.current.click();
  };
  useEffect(() => {
    if (file) setIsFileUploaded(true);
    else setIsFileUploaded(false);
  }, [file]);
  const onFileChange = e => {
    const {
      target: { files },
    } = e;
    const theFile = files[0];
    setFile(theFile);
  };
  const { isLoading: isProfileLoading, data: profileData } = useQuery(['profile', name], getProfile);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [uploadURL, setuploadURL] = useState('');
  const [isUploaded, setIsUploaded] = useState(true);
  const [profileUrl, setProfileUrl] = useState('');
  useEffect(() => {
    if (profileData) {
      setProfileUrl(profileData);
    } else {
      setProfileUrl('');
    }
  }, [profileData]);

  const onUploadServerButtonClick = () => {
    if (file == null) return;
    setIsUploaded(false);
    getUploadUrl().then(res => {
      setuploadURL(res.uploadURL);
    });
  };
  const [fileId, setFileId] = useState('');

  useEffect(() => {
    if (uploadURL === '') return;
    uploadImage(file, uploadURL).then(res => {
      setFileId(res.result.id);
    });
  }, [uploadURL]);

  useEffect(() => {
    if (fileId) {
      addProfile(name, fileId).then(res => {
        if (res) {
          queryClient.refetchQueries(['dog_info', name]);
          queryClient.refetchQueries(['profile', name]);
          toast({
            title: name + ' 사진 업로드에 성공했어요~~',
            status: 'success',
            position: 'top',
            duration: 1000,
            isClosable: true,
          });
        } else {
          queryClient.refetchQueries(['dog_info', name]);
          queryClient.refetchQueries(['profile', name]);
          toast({
            title: name + ' 사진 업로드에 실패했어요ㅜㅜ',
            status: 'error',
            position: 'top',
            duration: 1000,
            isClosable: true,
          });
        }
        setIsUploaded(true);
        onCloseFn();
      });
    }
  }, [fileId]);

  return (
    <Modal isOpen={isOpen} onClose={onCloseFn}>
      <ModalOverlay />
      <ModalContent top={'10vh'}>
        <ModalHeader>🐶{data !== undefined && data.length !== 0 ? name : '댕댕이'}🥰 정보</ModalHeader>
        <ModalCloseButton />
        <ModalBody as={'form'} onSubmit={handleSubmit(onSubmit)}>
          <VStack w={'100%'}>
            {selectIsLoading ? (
              <Text>Loading options...</Text>
            ) : (
              <HStack w={'100%'}>
                <Box textAlign={'left'} w={'25%'}>
                  <ProfileAvatar name={name} />
                </Box>
                <Select
                  css={{ WebkitPaddingEnd: 0, WebkitPaddingStart: 10 }}
                  icon={<></>}
                  paddingInlineEnd={0}
                  paddingInlineStart={0}
                  // w={'100%'}
                  placeholder={'댕댕이 선택'}
                  position={'inherit'}
                  px={0}
                  required={true}
                  w={'75%'}
                  {...register('name')}
                  id={'name'}
                  onChange={e => onNameChange(e)}
                >
                  {options &&
                    options.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                </Select>
              </HStack>
            )}
            <HStack w={'100%'}>
              <Text minW={'25%'}>공식 이름</Text>
              <Input
                placeholder={'공식 이름 미입력시 이름과 동일(선택)'}
                variant={'filled'}
                {...register('officialName')}
              />
            </HStack>
            <HStack w={'100%'}>
              <Text minW={'25%'}>특이사항</Text>
              <Input placeholder={'특이사항(선택)'} variant={'filled'} {...register('dogInfo')} />
            </HStack>
            <HStack w={'100%'}>
              <Text minW={'25%'}>견종&성별</Text>
              <Input
                minW={'55%'}
                mr={1}
                placeholder={'견종(선택)'}
                variant={'filled'}
                {...register('dogBreed')}
              />
              <Input ml={1} placeholder={'성별(선택)'} variant={'filled'} {...register('dogGender')} />
            </HStack>
            <HStack w={'100%'}>
              <Text minW={'25%'}>
                전화번호&
                <br />
                매벨 사용량
              </Text>
              <Input
                mr={1}
                placeholder={'견주 전화번호(선택)'}
                variant={'filled'}
                w={'55%'}
                {...register('phone')}
              />
              <Badge colorScheme={beltColor} fontSize="xl" ml="1">
                {usedBelts}
              </Badge>
            </HStack>
            <HStack w={'100%'}>
              <Text minW={'25%'}>
                몸무게&
                <br />
                잔여시간
              </Text>
              <Input
                ml={1}
                placeholder={'몸무게(선택)'}
                variant={'filled'}
                // value={dogWeight}
                w={'55%'}
                {...register('dogWeight')}
              />
              <Badge colorScheme={timeColor} fontSize="xl" ml="1">
                {remainingTime}
              </Badge>
              {/*<Text ml={1} w={'50%'}></Text>*/}
            </HStack>
            <HStack w={'100%'}>
              <Text minW={'25%'}>최근방문</Text>
              <Badge colorScheme={visitColor} fontSize="xl" ml="1">
                {lastVisited}
              </Badge>
            </HStack>
          </VStack>
          <ModalFooter mx={0} px={0}>
            <Flex
              css={{ WebkitMarginStart: 0 }}
              justifyContent={'flex-end'}
              m={0}
              marginInlineStart={0}
              p={0}
              w={'100%'}
            >
              {name ? (
                <>
                  <Input
                    accept={'image/*'}
                    display={'none'}
                    onChange={onFileChange}
                    ref={imageRef}
                    type={'file'}
                  />
                  {isFileUploaded ? (
                    <Button
                      _hover={{
                        textDecoration: 'none',
                        color: 'white',
                        rounded: 'xl',
                        transform: 'scale(1.2)',
                      }}
                      colorScheme="green"
                      isLoading={!isUploaded}
                      onClick={onUploadServerButtonClick}
                      rounded={'xl'}
                    >
                      업로드!
                    </Button>
                  ) : (
                    <Button
                      _hover={{
                        textDecoration: 'none',
                        color: 'white',
                        rounded: 'xl',
                        transform: 'scale(1.2)',
                      }}
                      colorScheme="twitter"
                      onClick={onUploadImageButtonClick}
                      rounded={'xl'}
                    >
                      사진등록
                    </Button>
                  )}
                </>
              ) : (
                <></>
              )}
              <Button
                _hover={{
                  textDecoration: 'none',
                  color: 'white',
                  rounded: 'xl',
                  transform: 'scale(1.2)',
                }}
                colorScheme="red"
                mx={3}
                onClick={onCloseFn}
                rounded={'xl'}
              >
                취소
              </Button>
              <Button
                _hover={{
                  textDecoration: 'none',
                  color: 'white',
                  bg: '#526491',
                  rounded: 'xl',
                  transform: 'scale(1.2)',
                }}
                bg={'#1a2a52'}
                color={'white'}
                rounded={'xl'}
                type={'submit'}
              >
                수정~
              </Button>
            </Flex>
          </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
