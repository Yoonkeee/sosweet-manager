import {
  Box,
  Button, Input, InputGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent, ModalFooter,
  ModalHeader,
  ModalOverlay, Select,
  Stack,
  Text,
  useDisclosure, VStack
} from "@chakra-ui/react";
import {useForm} from "react-hook-form";

export default function ModifyDog({isOpen, onClose}) {
  // const {isOpen, onOpen, onClose} = useDisclosure()
  const {register, handleSubmit, watch, formState:{errors}} = useForm();
  const onSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log(watch());
    onClose();
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader>댕댕이 정보 수정~</ModalHeader>
        <ModalCloseButton/>
        <ModalBody as={'form'} onSubmit={handleSubmit(onSubmit)}>
          <VStack>
            <Select
              w={'100%'}
              placeholder={"댕댕이 선택"}
            >
              <option>김프로</option>
              <option>하로</option>
              <option>박프로</option>
              <option>요미</option>
              <option>꼬미</option>
              <option>감자</option>
            </Select>
            <Input
              variant={"filled"}
              placeholder={"특이사항(선택)"}
            />
            <InputGroup>
              <Input
                mr={1}
                variant={"filled"}
                placeholder={"견종(선택)"}
              />
              <Input
                ml={1}
                variant={"filled"}
                placeholder={"성별(선택)"}
              />
            </InputGroup>
            <InputGroup>
              <Input
                mr={1}
                variant={"filled"}
                placeholder={"견주 전화번호(선택)"}
              />
              <Input
                ml={1}
                variant={"filled"}
                placeholder={"몸무게(선택)"}
              />
            </InputGroup>
          </VStack>
          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={onClose} rounded={'xl'} _hover={{
              textDecoration: 'none', color: 'white', rounded: 'xl', transform: 'scale(1.2)'
            }}>
              취소
            </Button>
            <Button bg={'#1a2a52'} color={'white'} rounded={'xl'}
                    type={'submit'}
                    _hover={{
                      textDecoration: 'none', color: 'white', bg: '#526491', rounded: 'xl', transform: 'scale(1.2)'
                    }}>등록~</Button>
          </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
    );
};