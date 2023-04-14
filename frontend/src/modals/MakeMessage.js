import {
    Box,
    Button,
    Heading,
    Input,
    InputGroup,
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
    Select,
    Stack,
    Text,
    useDisclosure,
    useToast,
    VStack
} from "@chakra-ui/react";
import {useForm} from "react-hook-form";
import {useEffect, useRef, useState} from "react";
import {useMutation, useQueryClient} from "react-query";
import {addNewDog, checkUsedDate, makeMessage} from "../api";
import copy from 'copy-to-clipboard';

export default function MakeMessage({isOpen, onClose, checked}) {
    const queryClient = useQueryClient()
    const toast = useToast()
    const [text, setText] = useState('')
    useEffect(() => {
        if (isOpen)
            makeMessage(checked)?.then((res) => {
                setText(res)
            })
        else setText('')
    }, [isOpen]);

    const sendButton = () => {
        onClose()
        checkUsedDate(checked).then((res) => {
            console.log(res)
            if (res) {
                toast({
                    title: "전송 완료 처리했어요~~", status: "success", position: "top", duration: 3000, isClosable: true,
                })
                queryClient.refetchQueries(["history"]);
            } else {
                toast({
                    title: "에러가 났어요... 죄송해요ㅜㅜ", status: "error", position: "top", duration: 3000, isClosable: true,
                })
            }
        })
        queryClient.refetchQueries("unchecked-dogs-list");
    }
    const ref = useRef(null)
    const handleCopy = () => {
        copy(text)
        toast({
            title: '복사되었습니다!',
            description: "카톡으로 보내세용~~",
            position: 'top',
            status: 'success',
            duration: 5000,
            isClosable: true,
        })
    }
    return (<Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay/>
        <ModalContent ref={ref}>
            <ModalHeader>댕댕이 시간 계산하기~</ModalHeader>
            <ModalCloseButton/>
            <ModalBody as={'form'}>
                <Text whiteSpace={'pre-line'}>
                    {text}
                </Text>
                <ModalFooter>
                    <Button colorScheme='green' mr={3} onClick={handleCopy} rounded={'xl'} _hover={{
                        textDecoration: 'none', color: 'white', rounded: 'xl', transform: 'scale(1.2)'
                    }}>
                        복사!
                    </Button>
                    <Button colorScheme='red' mr={3} onClick={onClose} rounded={'xl'} _hover={{
                        textDecoration: 'none', color: 'white', rounded: 'xl', transform: 'scale(1.2)'
                    }}>
                        취소
                    </Button>
                    <Popover placement='top-start'>
                        <PopoverTrigger>
                            <Button bg={'#1a2a52'} color={'white'} rounded={'xl'}
                                    _hover={{
                                        textDecoration: 'none',
                                        color: 'white',
                                        bg: '#526491',
                                        rounded: 'xl',
                                        transform: 'scale(1.2)'
                                    }}>전송 완료~</Button>
                        </PopoverTrigger>
                        <Portal containerRef={ref}>
                            <PopoverContent bg={'gray.200'} w={'100%'}>
                                <PopoverArrow/>
                                {/*<PopoverHeader>체크인 취소할까요?</PopoverHeader>*/}
                                <PopoverCloseButton/>
                                <PopoverBody>
                                    <Heading fontSize={'2xl'} my={'3vh'}>카톡 전송 완료 처리할까요?</Heading>
                                    <Button colorScheme='yellow' onClick={sendButton}>네!</Button>
                                </PopoverBody>
                            </PopoverContent>
                        </Portal>
                    </Popover>
                </ModalFooter>
            </ModalBody>
        </ModalContent>
    </Modal>);
}
;