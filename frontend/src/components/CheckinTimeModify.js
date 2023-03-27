import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent, ModalFooter,
  ModalHeader,
  ModalOverlay, PinInput, PinInputField, Select, Text,
  useDisclosure,
  VStack
} from "@chakra-ui/react";

export default function CheckinTimeModify ({isOpen, onClose}) {
  // const {isOpen, onOpen, onClose} = useDisclosure()
  return (<>
    {/*<Button onClick={onInOpen}>Open Modal</Button>*/}
    {/*<Button*/}
    {/*  onClick={onOpen}*/}
    {/*  colorScheme={'white'}*/}
    {/*  // w={'80%'}*/}
    {/*  // h={'5vh'}*/}
    {/*  // borderRadius={'20px'}*/}
    {/*  // mt={'1vh'}*/}
    {/*  fontSize={'1.5rem'}>*/}
    {/*  체크인*/}
    {/*</Button>*/}
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader>댕댕이 체크인 시간 수정!</ModalHeader>
        <ModalCloseButton/>
        <ModalBody as={'form'}>
          <VStack spacing={3}>
            <HStack>
              <Text>김프로</Text>
              <HStack>
                <PinInput placeholder='0'>
                  <PinInputField/>
                  <PinInputField/>
                  <Text>:</Text>
                  <PinInputField/>
                  <PinInputField/>
                </PinInput>
              </HStack>
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
                  }}>수정!</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </>);
};