import {
  Box,
  Button,
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
  Text,
  useDisclosure,
  useToast,
  VStack
} from "@chakra-ui/react";
import {useForm} from "react-hook-form";
import {useEffect, useState} from "react";

export default function MakeMessageModal({isOpen, onClose}) {
  // const {isOpen, onOpen, onClose} = useDisclosure()
  const toast = useToast()
  const [text, setText] = useState('')
  const {register, handleSubmit, watch, formState: {errors}} = useForm();
  const onSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log(watch());
    onClose();
  }
  useEffect(() => {
    return () => {
      setText('\n' + '안녕하세요~쏘스윗펫입니다😊\n'
        + '❤프로❤놀이방 이용 내역 알려드립니다. \n'
        + '놀이방 남은 시간:18시간45분 \n'
        + '\n' + '2월17일 16:10-19:05(2:55) \n'
        + '2월19일 11:00-12:40(1:40) \n'
        + '2월22일 17:30-20:05(2:35) \n'
        + '\n' + '총 사용시간:7시간10분 \n'
        + '차감 후 남은 시간:11시간35분입니다. \n'
        + '감사합니다🐶❤\n')
    };
  }, []);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    toast({
      title: '복사되었습니다!', description: "카톡으로 보내세용~~", position: 'top', status: 'success', duration: 5000, isClosable: true,
    })
  }
  return (<Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay/>
    <ModalContent>
      <ModalHeader>댕댕이 시간 계산하기~</ModalHeader>
      <ModalCloseButton/>
      <ModalBody as={'form'} onSubmit={handleSubmit(onSubmit)}>
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
          <Button bg={'#1a2a52'} color={'white'} rounded={'xl'}
                  type={'submit'}
                  _hover={{
                    textDecoration: 'none', color: 'white', bg: '#526491', rounded: 'xl', transform: 'scale(1.2)'
                  }}>전송 완료~</Button>
        </ModalFooter>
      </ModalBody>
    </ModalContent>
  </Modal>);
};