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

export default function ProfileAvatar(props) {
    const {isOpen, onOpen, onClose} = useDisclosure()
    return (
        <>
            <Avatar h={'5vh'} w={'5vh'}
                    bgColor={'transparent'}
                    src={props.profileUrl}
                    onClick={onOpen}
                    icon={<Text fontSize={'3xl'}>🐶</Text>}
            />
            <Modal onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay/>
                <ModalContent w={'70%'} p={0} m={0}>
                    <ModalHeader>{props.name}</ModalHeader>
                    <ModalCloseButton  p={0} m={0}/>
                    <ModalBody p={0} m={0} display={'flex'} alignContent={'center'} justifyContent={'center'}>
                        {props.profileUrl === '' ? <Text fontSize={'9xl'}>🐶</Text> : <Image src={props.profileUrl}/>}
                    </ModalBody>
                    <ModalFooter py={'1.5vh'}>
                        <Button h={'5vh'} bgColor={'#1a2a52'} color={'white'} onClick={onClose}>닫기</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}