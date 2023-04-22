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
import {addNewDog, dogsList, getDogInfo, modDog} from "../api";
import {useEffect, useState} from "react";
import {formatMinuteToTime} from "../api";

export default function DogInfo({isOpen, onClose, name}) {
    console.log('DogInfo');
    const {register, reset, handleSubmit, formState: {errors}} = useForm();
    const toast = useToast();
    const [info, setInfo] = useState('');
    const queryClient = useQueryClient();
    const mutation = useMutation(modDog, {
        onSuccess: () => {
            toast({
                title: name + " 수정에 성공했어요~~", status: "success", position: "top", duration: 1000, isClosable: true,
            });
            queryClient.refetchQueries('dogs-list');
            queryClient.refetchQueries(['dog_info', name]);
            onCloseFn();
        },
    });
    const onSubmit = (res) => {
        console.log(res);
        res = {...res, name: name};
        mutation.mutate(res);
    }
    const {isLoading, data} = useQuery(['dog_info', name], getDogInfo);
    const [remainingTime, setRemainingTime] = useState('');
    const [usedBelts, setUsedBelts] = useState('');
    const [beltColor, setBeltColor] = useState('green');
    const [lastVisited, setLastVisited] = useState('');
    const [visitColor, setVisitColor] = useState('telegram');
    useEffect(() => {
        if (data && !isLoading) {
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
        }
    }, [data]);
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
        }
    }, [isOpen]);
    const onReset = () => {
        reset({
            officialName: '',
            dogInfo: '',
            dogBreed: '',
            dogGender: '',
            phone: '',
            dogWeight: '',
        })
    }
    const onCloseFn = () => {
        onClose();
        onReset();
    }
    const [timeColor, setTimeColor] = useState('green');
    useEffect(() => {
        if (data && data.remaining_minutes < 0) {
            setTimeColor('red')
        }
    }, [remainingTime]);
    return (
        <Modal isOpen={isOpen} onClose={onCloseFn}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>🐶{name}🥰 정보</ModalHeader>
                <ModalCloseButton/>
                <ModalBody as={'form'} onSubmit={handleSubmit(onSubmit)}>
                    <VStack w={'100%'}>
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
                            <Badge ml='1' fontSize='xl' colorScheme={'telegram'}>
                                {data && data.last_visited}
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
        </Modal>
    )
}
