import {
    Button, Editable, EditableInput, EditablePreview,
    Heading, HStack,
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
    useToast
} from "@chakra-ui/react";
import {useEffect, useRef, useState} from "react";
import {useQueryClient} from "react-query";
import {checkUsedDate, makeMessage} from "../api";
import CopyToClipboard from 'react-copy-to-clipboard';
import ProfileAvatar from "../components/ProfileAvatar";
import {options} from "axios";

export default function MakeMessage({isOpen, onClose, checked, name}) {
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
                    title: "전송 완료 처리했어요~~", status: "success", position: "top", duration: 1500, isClosable: true,
                })
                queryClient.refetchQueries(["history"]);
            } else {
                toast({
                    title: "에러가 났어요... 죄송해요ㅜㅜ", status: "error", position: "top", duration: 2000, isClosable: true,
                })
            }
        })
        queryClient.refetchQueries(["history", '', 'getMessage']);
        queryClient.refetchQueries(["unchecked-dogs-list"]);
    }
    const ref = useRef(null)

    return (<Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay/>
        <ModalContent top={'15vh'} ref={ref}>
            <ModalHeader>
                <HStack>
                    <ProfileAvatar name={name}/>
                    <Text>
                        {name} 시간 계산하기~
                    </Text>
                </HStack>
            </ModalHeader>
            <ModalCloseButton/>
            <ModalBody as={'form'}>
                {/*<Editable whiteSpace={'pre-line'} value={text}>*/}
                {/*    <EditablePreview />*/}
                {/*    <EditableInput />*/}
                {/*</Editable>*/}
                <Text whiteSpace={'pre-line'}>
                    {text}
                </Text>
                <ModalFooter>
                    <CopyToClipboard
                        options={{format: "text/plain"}}
                        text={text}
                        onCopy={()=>{
                            toast({
                                title: '복사되었습니다!',
                                description: "카톡으로 보내세용~~",
                                position: 'top',
                                status: 'success',
                                duration: 1000,
                                isClosable: true,
                            })
                        }}
                    >
                    <Button colorScheme='green' mr={3} rounded={'xl'} _hover={{
                        textDecoration: 'none', color: 'white', rounded: 'xl', transform: 'scale(1.2)'
                    }}>
                        복사!
                    </Button>
                    </CopyToClipboard>
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