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
  PinInput,
  PinInputField,
  Select,
  Text,
  useDisclosure,
  useToast,
  VStack
} from "@chakra-ui/react";
import {useForm} from "react-hook-form";
import {useMutation} from "react-query";
import {addNewDog} from "../api";

export default function Checkin() {
  const {isOpen, onOpen, onClose} = useDisclosure()
  const {register, reset, handleSubmit, formState: {errors}} = useForm();
  const toast = useToast();
  const mutation = useMutation(addNewDog, {
    onSuccess: () => {
      toast({
        title: "체크인 했어요~~", status: "success", position: "top", duration: 3000, isClosable: true,
      });
      onClose();
      reset();
    },
  });
  const onSubmit = (dog) => {
    mutation.mutate(dog);
  }
  return (<>
    {/*<Button onClick={onInOpen}>Open Modal</Button>*/}
    <Button
      onClick={onOpen}
      colorScheme={'white'}
      // w={'80%'}
      // h={'5vh'}
      // borderRadius={'20px'}
      // mt={'1vh'}
      fontSize={'1.5rem'}>
      체크인
    </Button>
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader>댕댕이 체크인!</ModalHeader>
        <ModalCloseButton/>
        <ModalBody as={'form'} onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={3}>
            <HStack>
              <Select
                w={'40%'}
                mr={5}
                placeholder={"댕댕이 선택"}
              />
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
          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={onClose} rounded={'xl'} _hover={{
              textDecoration: 'none', color: 'white', rounded: 'xl', transform: 'scale(1.2)'
            }}>
              취소
            </Button>
            <Button bg={'#1a2a52'} color={'white'} rounded={'xl'} type={'submit'}
                    _hover={{
                      textDecoration: 'none', color: 'white', bg: '#526491', rounded: 'xl', transform: 'scale(1.2)'
                    }}>입장!</Button>
          </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
  </>);
};