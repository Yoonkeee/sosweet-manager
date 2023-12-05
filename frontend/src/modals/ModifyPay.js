import {
  Button,
  Heading,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { cancelPay, dateStrToTemporal, modPay, temporalToLocale } from '../api';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import ProfileAvatar from '../components/ProfileAvatar';

function minutesToHHMM(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainderMinutes = minutes % 60;
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = remainderMinutes.toString().padStart(2, '0');
  return `${formattedHours}:${formattedMinutes}`;
}

export default function ModifyPay(props) {
  // debugger;
  const [onClose, isOpen] = [props.onClose, props.isOpen];
  const { name, minutes, date: propDate, id } = props.data;
  const hours = Math.floor(minutes / 60);
  const [nowDate, setNowDate] = useState(dateStrToTemporal(propDate));
  const [formattedDate, setFormattedDate] = useState();
  useEffect(() => {
    setNowDate(dateStrToTemporal(propDate));
    // setNowDate(moment.utc(propDate, 'YYYY-MM-DD'));
  }, []);
  useEffect(() => {
    if (nowDate) setFormattedDate(temporalToLocale(nowDate));
  }, [nowDate]);
  const ref = useRef(null);
  let checkoutData = {};
  const { register, reset, handleSubmit, setValue } = useForm({
    defaultValues: {
      hours: hours,
      date: nowDate,
    },
  });
  const toast = useToast();
  const queryClient = useQueryClient();
  const mutation = useMutation(modPay, {
    onSuccess: data => {
      toast({
        title: (
          <>
            구매내역 수정! <br />
            댕댕이 : {checkoutData.name} <br />
            결제시간 : {Math.floor(checkoutData.minutes / 60)}시간 <br />
            결제일 : {formattedDate} <br />
          </>
        ),
        status: 'success',
        position: 'top',
        duration: 1000,
        isClosable: true,
      });
      onClose();
      reset();
      queryClient.refetchQueries('getPayHistory');
    },
  });
  const onSubmit = data => {
    const modDate = nowDate.toString();
    checkoutData = {
      name: name,
      date: modDate,
      minutes: data.hours * 60,
      id: id,
    };
    mutation.mutate(checkoutData);
  };
  const cancel = () => {
    // checkoutData = {
    //   name: name, date: date, hours: hours, id: id
    // }
    cancelMutation.mutate(id);
  };
  const cancelMutation = useMutation(cancelPay, {
    onSuccess: data => {
      toast({
        title: (
          <>
            구매 취소! <br />
            댕댕이 : {name} <br />
            결제시간 : {hours}시간 <br />
            결제일 : {formattedDate} <br />
          </>
        ),
        status: 'success',
        position: 'top',
        duration: 1000,
        isClosable: true,
      });
      onClose();
      reset();
      queryClient.refetchQueries('getPayHistory');
    },
  });
  const onCloseReset = () => {
    onClose();
    reset();
  };
  return (
    <Modal isOpen={isOpen} onClose={onCloseReset}>
      <ModalOverlay />
      <ModalContent ref={ref} top={'10vh'}>
        <ModalHeader>
          <HStack>
            <ProfileAvatar name={name} />
            <Text>{name} 결제 내역 수정</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody as={'form'} onSubmit={handleSubmit(onSubmit)}>
          <VStack alignItems={'flex-start'} spacing={3}>
            <HStack alignContent={'center'} alignItems={'center'} justifyContent={'flex-start'} w={'100%'}>
              <Text w={'30%'}>결제일</Text>
              <IconButton
                _hover={{
                  textDecoration: 'none',
                  color: 'white',
                  bg: '#526491',
                  rounded: 'xl',
                  transform: 'scale(1.2)',
                }}
                aria-label={''}
                bg={'#1a2a52'}
                color={'white'}
                h={'80%'}
                icon={<ArrowBackIcon fontSize={'2xl'} fontWeight={'extrabold'} />}
                isRound={true}
                onClick={() => {
                  setNowDate(nowDate.subtract({ days: 1 }));
                }}
                position={'inherit'}
                rounded={'xl'}
                w={'6%'}
              />
              <Text
                fontSize={'xl'}
                fontWeight={'semibold'}
                id={'formattedNowDate'}
                mt={'2vh'}
                textAlign={'center'}
              >
                {formattedDate}
              </Text>
              <IconButton
                _hover={{
                  textDecoration: 'none',
                  color: 'white',
                  bg: '#526491',
                  rounded: 'xl',
                  transform: 'scale(1.2)',
                }}
                aria-label={''}
                bg={'#1a2a52'}
                color={'white'}
                h={'80%'}
                icon={<ArrowForwardIcon fontSize={'2xl'} fontWeight={'extrabold'} />}
                isRound={true}
                onClick={() => {
                  setNowDate(nowDate.add({ days: 1 }));
                }}
                position={'inherit'}
                rounded={'xl'}
                w={'6%'}
              />
            </HStack>
            <HStack>
              <Text my={'5%'} w={'48%'}>
                결제시간
              </Text>
              <Input
                placeholder={'결제 시간'}
                type={'number'}
                variant={'filled'}
                w={'20%'}
                {...register('hours', { required: true })}
              />
              <Text>시간</Text>
            </HStack>
          </VStack>
          <ModalFooter>
            <Popover placement="top-start">
              <PopoverTrigger>
                <Button
                  _hover={{
                    textDecoration: 'none',
                    color: 'white',
                    rounded: 'xl',
                    transform: 'scale(1.2)',
                  }}
                  colorScheme="yellow"
                  mr={3}
                  rounded={'xl'}
                >
                  결제 취소
                </Button>
              </PopoverTrigger>
              <Portal containerRef={ref}>
                <PopoverContent bg={'gray.200'} w={'100%'}>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverBody>
                    <Heading fontSize={'2xl'} my={'3vh'}>
                      결제 취소할까요?
                    </Heading>
                    <Button colorScheme="yellow" onClick={cancel}>
                      취소할게요!
                    </Button>
                  </PopoverBody>
                </PopoverContent>
              </Portal>
            </Popover>
            <Button
              _hover={{
                textDecoration: 'none',
                color: 'white',
                rounded: 'xl',
                transform: 'scale(1.2)',
              }}
              colorScheme="red"
              mr={3}
              onClick={onCloseReset}
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
              수정하기
            </Button>
          </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
