import {
    Badge,
    Box,
    Button, HStack,
    Input,
    InputGroup,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    Stack,
    Text, Tooltip,
    useDisclosure,
    useToast,
    VStack
} from "@chakra-ui/react";
import {useForm} from "react-hook-form";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {addNewDog, dogsList, formatMinuteToTime, getDogInfo, modDog} from "../api";
import {useEffect, useState} from "react";

export default function ModifyDog({isOpen, onClose}) {
    // const {isOpen, onOpen, onClose} = useDisclosure()
    const {register, reset, handleSubmit, formState: {errors}} = useForm();
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
                title: name + " 수정에 성공했어요~~", status: "success", position: "top", duration: 1000, isClosable: true,
            });
            queryClient.refetchQueries('dogs-list');
            onCloseFn();
        },
    });
    const {isLoading: selectIsLoading, data: selectData} = useQuery(["dogs-list"], dogsList);
    const {isLoading, data} = useQuery(['dog_info', name], getDogInfo);
    const options = selectData?.map(item => ({
        value: item.name, label: item.name,
    }));
    const onSubmit = (res) => {
        console.log(res);
        mutation.mutate(res);
    }
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
            })
            setRemainingTime(formatMinuteToTime(data.remaining_minutes))
            setUsedBelts(data.used_belts + '개')
            if (data.used_belts > 0) {
                setBeltColor('orange')
            }
            if (data.last_visited) {
                setVisitColor('telegram')
                setLastVisited(data.last_visited)
            } else {
                setVisitColor('pink')
                setLastVisited('기록에 없어요ㅜ')
            }
            if (data && data.remaining_minutes < 0) {
                setTimeColor('red')
            } else {
                setTimeColor('green')
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
        })
        document.getElementById('name').value = '';
        setName('')
        setUsedBelts('');
        setRemainingTime('')
        setLastVisited('')
        setBeltColor('green')
    }
    const onCloseFn = () => {
        onClose();
        onReset();
    }
    // useEffect(() => {
    //     if (data && data.remaining_minutes < 0) {
    //         setTimeColor('red')
    //     }
    // }, [remainingTime]);
    const onNameChange = (e) => {
        if (e.target.value === '') {
            onReset();
        } else {
            document.getElementById('name').style.position = 'inherit'
            setName(prev => e.target.value);
        }
    }
    return (<Modal isOpen={isOpen} onClose={onCloseFn}>
        <ModalOverlay/>
        <ModalContent>
            <ModalHeader>🐶{(data !== undefined && data.length !== 0) ? name : '댕댕이'}🥰 정보</ModalHeader>
            <ModalCloseButton/>
            <ModalBody as={'form'} onSubmit={handleSubmit(onSubmit)}>
                <VStack w={'100%'}>
                    {selectIsLoading ? <Text>Loading options...</Text> : (<Select
                        // w={'40%'}
                        paddingInlineEnd={0}
                        paddingInlineStart={0}
                        css={{WebkitPaddingEnd: 0, WebkitPaddingStart: 10}}
                        w={'100%'}
                        px={0}
                        placeholder={"댕댕이 선택"}
                        icon={<></>}
                        required={true}
                        position={'inherit'}
                        {...register("name")}
                        id={'name'}
                        onChange={(e) => onNameChange(e)}
                        // (e) => {
                        //         // console.log(e.target.value);
                        //         document.getElementById('name').style.position = 'inherit'
                        //         setName(prev => e.target.value);
                        //       }}
                    >
                        {options && options.map((option) => (<option key={option.value} value={option.value}>
                            {option.label}
                        </option>))}
                    </Select>)}
                    <HStack w={'100%'}>
                        <Text minW={'25%'}>공식 이름</Text>
                        <Input
                            variant={"filled"}
                            placeholder={"공식 이름 미입력시 이름과 동일(선택)"}
                            {...register("officialName")}
                        />
                    </HStack>
                    <HStack w={'100%'}>
                        <Text minW={'25%'}>특이사항</Text>
                        <Input
                            variant={"filled"}
                            placeholder={"특이사항(선택)"}
                            {...register("dogInfo")}
                        />
                    </HStack>
                    <HStack w={'100%'}>
                        <Text minW={'25%'}>견종&성별</Text>
                        <Input
                            mr={1}
                            variant={"filled"}
                            placeholder={"견종(선택)"}
                            {...register("dogBreed")}
                        />
                        <Input
                            ml={1}
                            variant={"filled"}
                            placeholder={"성별(선택)"}
                            {...register("dogGender")}
                        />
                    </HStack>
                    <HStack w={'100%'}>
                        <Text minW={'25%'}>전화번호&<br/>매벨 사용량</Text>
                        <Input
                            w={'55%'}
                            mr={1}
                            variant={"filled"}
                            placeholder={"견주 전화번호(선택)"}
                            {...register("phone")}
                        />
                        <Badge ml='1' fontSize='xl' colorScheme={beltColor}>
                            {usedBelts}
                        </Badge>
                    </HStack>
                    <HStack w={'100%'}>
                        <Text minW={'25%'}>몸무게&<br/>잔여시간</Text>
                        <Input
                            w={'55%'}
                            ml={1}
                            variant={"filled"}
                            // value={dogWeight}
                            placeholder={"몸무게(선택)"}
                            {...register("dogWeight")}
                        />
                        <Badge ml='1' fontSize='xl' colorScheme={timeColor}>
                            {remainingTime}
                        </Badge>
                        {/*<Text ml={1} w={'50%'}></Text>*/}
                    </HStack>
                    <HStack w={'100%'}>
                        <Text minW={'25%'}>최근방문</Text>
                        <Badge ml='1' fontSize='xl' colorScheme={visitColor}>
                            {lastVisited}
                        </Badge>
                    </HStack>
                </VStack>
                <ModalFooter>
                    <Button colorScheme='red' mr={3} onClick={onCloseFn}
                            rounded={'xl'} _hover={{
                        textDecoration: 'none', color: 'white', rounded: 'xl', transform: 'scale(1.2)'
                    }}>
                        취소
                    </Button>
                    <Button bg={'#1a2a52'} color={'white'} rounded={'xl'}
                            type={'submit'}
                            _hover={{
                                textDecoration: 'none',
                                color: 'white',
                                bg: '#526491',
                                rounded: 'xl',
                                transform: 'scale(1.2)'
                            }}>수정~</Button>
                </ModalFooter>
            </ModalBody>
        </ModalContent>
        {/*<ModalContent>*/}
        {/*  <ModalHeader>댕댕이 정보 수정~</ModalHeader>*/}
        {/*  <ModalCloseButton/>*/}
        {/*  <ModalBody as={'form'} onSubmit={handleSubmit(onSubmit)}>*/}
        {/*    <VStack>*/}
        {/*      {selectIsLoading ? <Text>Loading options...</Text> : (<Select*/}
        {/*        // w={'40%'}*/}
        {/*          paddingInlineEnd={0}*/}
        {/*          paddingInlineStart={0}*/}
        {/*          css={{WebkitPaddingEnd: 0, WebkitPaddingStart: 10}}*/}
        {/*        w={'100%'}*/}
        {/*        px={0}*/}
        {/*        placeholder={"댕댕이 선택"}*/}
        {/*        icon={<></>}*/}
        {/*        required={true}*/}
        {/*        position={'inherit'}*/}
        {/*        {...register("name")}*/}
        {/*        id={'name'}*/}
        {/*        onChange={(e) => {*/}
        {/*          // console.log(e.target.value);*/}
        {/*          document.getElementById('name').style.position = 'inherit'*/}
        {/*          setName(prev => e.target.value);*/}
        {/*        }}*/}
        {/*      >*/}
        {/*        {options && options.map((option) => (<option key={option.value} value={option.value}>*/}
        {/*          {option.label}*/}
        {/*        </option>))}*/}
        {/*      </Select>)}*/}
        {/*      <Tooltip label='메세지에 보낼 댕댕이 이름(선택) 미입력시 이름과 동일'>*/}
        {/*        <Input*/}
        {/*          variant={"filled"}*/}
        {/*          // value={officialName}*/}
        {/*          placeholder={"메세지에 보낼 댕댕이 이름(선택) 미입력시 이름과 동일"}*/}
        {/*          {...register("officialName")}*/}
        {/*        />*/}
        {/*      </Tooltip>*/}
        {/*      <Tooltip label={'특이사항(선택)'}>*/}
        {/*        <Input*/}
        {/*          variant={"filled"}*/}
        {/*          placeholder={"특이사항(선택)"}*/}
        {/*          {...register("dogInfo")}*/}
        {/*        />*/}
        {/*      </Tooltip>*/}
        {/*      <InputGroup>*/}
        {/*        <Tooltip label={'견종(선택)'}>*/}
        {/*          <Input*/}
        {/*            mr={1}*/}
        {/*            variant={"filled"}*/}
        {/*            placeholder={"견종(선택)"}*/}
        {/*            {...register("dogBreed")}*/}
        {/*          />*/}
        {/*        </Tooltip>*/}
        {/*        <Tooltip label={'성별(선택)'}>*/}
        {/*          <Input*/}
        {/*            ml={1}*/}
        {/*            variant={"filled"}*/}
        {/*            placeholder={"성별(선택)"}*/}
        {/*            {...register("dogGender")}*/}
        {/*          />*/}
        {/*        </Tooltip>*/}
        {/*      </InputGroup>*/}
        {/*      <InputGroup>*/}
        {/*        <Tooltip label={'견주 전화번호(선택)'}>*/}
        {/*          <Input*/}
        {/*            mr={1}*/}
        {/*            variant={"filled"}*/}
        {/*            placeholder={"견주 전화번호(선택)"}*/}
        {/*            {...register("phone")}*/}
        {/*          />*/}
        {/*        </Tooltip>*/}
        {/*        <Tooltip label={'몸무게(선택)'}>*/}
        {/*          <Input*/}
        {/*            ml={1}*/}
        {/*            variant={"filled"}*/}
        {/*            // value={dogWeight}*/}
        {/*            placeholder={"몸무게(선택)"}*/}
        {/*            {...register("dogWeight")}*/}
        {/*          />*/}
        {/*        </Tooltip>*/}
        {/*      </InputGroup>*/}
        {/*    */}
        {/*    </VStack>*/}
        {/*    <ModalFooter>*/}
        {/*      <Button colorScheme='red' mr={3} onClick={() => {*/}
        {/*        reset()*/}
        {/*        setName('')*/}
        {/*        onClose()*/}
        {/*      }}*/}
        {/*              rounded={'xl'} _hover={{*/}
        {/*        textDecoration: 'none', color: 'white', rounded: 'xl', transform: 'scale(1.2)'*/}
        {/*      }}>*/}
        {/*        취소*/}
        {/*      </Button>*/}
        {/*      <Button bg={'#1a2a52'} color={'white'} rounded={'xl'}*/}
        {/*              type={'submit'}*/}
        {/*              _hover={{*/}
        {/*                textDecoration: 'none', color: 'white', bg: '#526491', rounded: 'xl', transform: 'scale(1.2)'*/}
        {/*              }}>등록~</Button>*/}
        {/*    </ModalFooter>*/}
        {/*  </ModalBody>*/}
        {/*</ModalContent>*/}
    </Modal>);
};