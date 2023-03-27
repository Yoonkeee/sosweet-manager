import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  PinInput,
  PinInputField, Select,
  Text,
  useDisclosure,
  VStack
} from "@chakra-ui/react";

export default function SelectDog() {
  const {isOpen, onOpen, onClose} = useDisclosure();
  return (<>
    <Button colorScheme={'white'} fontSize={'1.5rem'} onClick={onOpen}>
      댕댕이 선택
    </Button>
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader>불러올 댕댕이 선택!</ModalHeader>
        <ModalCloseButton/>
        <ModalBody as={'form'}>
          <VStack spacing={3}>
            <HStack w={'100%'}>
              <Select
                w={'40%'}
                mr={5}
                placeholder={"댕댕이 선택"}
              >
  
                <option>김프로</option>
                <option>하로</option>
                <option>박프로</option>
                <option>요미</option>
                <option>꼬미</option>
                <option>감자</option>
              </Select>
            </HStack>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='red' mr={3} onClick={onClose} rounded={'xl'} _hover={{
            textDecoration: 'none', color: 'white', rounded: 'xl', transform: 'scale(1.2)'
          }}>
            취소
          </Button>
          <Button bg={'#1a2a52'} color={'white'} rounded={'xl'}
                  _hover={{
                    textDecoration: 'none', color: 'white', bg: '#526491', rounded: 'xl', transform: 'scale(1.2)'
                  }}>불러오기!</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </>)
}