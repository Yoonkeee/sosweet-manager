import {
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

export default function DogInfo({isOpen, onClose, name}) {
// export default function DogInfo(props) {
    console.log('DogInfo');
    // console.log(props)
    // console.log(props.isOpen)
    // console.log(props.onClose)

    // const {isOpen, onClose} = [props.isOpen, props.onClose]
    // const name = props.name;
    // const {isOpen, onOpen, onClose} = useDisclosure()
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
            onCloseFn();
        },
    });
    const onSubmit = (res) => {
        console.log(res);
        mutation.mutate(res);
    }
    useEffect(() => {
        getDogInfo(name).then((res) => {
            setInfo(res[0])
        })
        return () => {
            setInfo('');
        }
    }, [name]);
    useEffect(() => {
        console.log(info);
        reset({
            officialName: info.official_name,
            dogInfo: info.note,
            dogBreed: info.breed,
            dogGender: info.gender,
            phone: info.phone,
            dogWeight: info.weight,
        })
    }, [info]);
    const onCloseFn = () => {
        reset();
        onClose();
    }
    return (
        <Modal isOpen={isOpen} onClose={onCloseFn}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>{name} 정보</ModalHeader>
                <ModalCloseButton/>
                <ModalBody as={'form'} onSubmit={handleSubmit(onSubmit)}>
                    <VStack w={'100%'}>
                        <HStack w={'100%'}>
                            <Text w={'25%'}>공식 이름</Text>
                            <Input
                                variant={"filled"}
                                placeholder={"메세지에 보낼 댕댕이 이름(선택) 미입력시 이름과 동일"}
                                {...register("officialName")}
                            />
                        </HStack>
                        <HStack w={'100%'}>
                            <Text w={'25%'}>특이사항</Text>
                            <Input
                                variant={"filled"}
                                placeholder={"특이사항(선택)"}
                                {...register("dogInfo")}
                            />
                        </HStack>
                        <HStack w={'100%'}>
                            <Text w={'25%'}>견종</Text>
                            <Input
                                mr={1}
                                variant={"filled"}
                                placeholder={"견종(선택)"}
                                {...register("dogBreed")}
                            />
                        </HStack>
                        <HStack w={'100%'}>
                            <Text w={'25%'}>성별</Text>
                            <Input
                                ml={1}
                                variant={"filled"}
                                placeholder={"성별(선택)"}
                                {...register("dogGender")}
                            />
                        </HStack>
                        <HStack w={'100%'}>
                            <Text w={'25%'}>전화번호</Text>
                            <Input
                                mr={1}
                                variant={"filled"}
                                placeholder={"견주 전화번호(선택)"}
                                {...register("phone")}
                            />
                        </HStack>
                        <HStack w={'100%'}>
                            <Text w={'25%'}>몸무게</Text>
                            <Input
                                ml={1}
                                variant={"filled"}
                                // value={dogWeight}
                                placeholder={"몸무게(선택)"}
                                {...register("dogWeight")}
                            />
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
                                }}>등록~</Button>
                    </ModalFooter>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
