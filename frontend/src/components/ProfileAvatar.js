import {
    Avatar, Button,
    Modal, ModalBody,
    ModalCloseButton,
    ModalContent, ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure, Image, Box
} from "@chakra-ui/react";
import {useQuery} from "react-query";
import {useEffect, useState} from "react";
import {getProfile} from "../api";

export default function ProfileAvatar(props) {
    const {isOpen, onOpen, onClose} = useDisclosure()
    const name = props.name
    const clickable = props.hasOwnProperty('clickable') ? props.clickable : true;
    const {isLoading, data} = useQuery(['profile', name], getProfile)
    const [profileUrl, setProfileUrl] = useState('')
    useEffect(() => {
        if (!isLoading) {
            setProfileUrl(data)
        }
    }, [data])

    const imageClick = () => {
        // e.event.preventDefault()
        if (clickable)
            onOpen()
    }
    return (
        <>
            <Avatar h={'5vh'} w={'5vh'}
                    cursor={'pointer'}
                    bgColor={'transparent'}
                    src={profileUrl}
                    onClick={imageClick}
                    icon={<Text fontSize={'3xl'}>🐶</Text>}
            />
            <Modal onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay/>
                <ModalContent w={'70%'} px={'5vw'} paddingTop={'5vw'}>
                    {/*<ModalHeader>{props.name}</ModalHeader>*/}
                    <ModalBody p={0} m={0} display={'flex'} alignContent={'center'} justifyContent={'center'}>
                        {profileUrl === '' ? <Text fontSize={'9xl'}>🐶</Text> :
                            <Box border={'5px solid lightgray'}>
                                <Image src={profileUrl}/>
                            </Box>
                        }
                    </ModalBody>
                    <ModalFooter py={'2vh'}>
                        <Text fontFamily={'SingleDay'} fontSize={'3xl'} fontWeight={'bold'}>{props.name}❤️</Text>
                        {/*<Button h={'5vh'} bgColor={'#1a2a52'} color={'white'} onClick={onClose}>닫기</Button>*/}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}