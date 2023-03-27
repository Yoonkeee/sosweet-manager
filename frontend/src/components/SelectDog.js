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

export default function SelectDog() {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const {register, reset, handleSubmit, formState: {errors}} = useForm();
  const toast = useToast();
  const mutation = useMutation(addNewDog, {
    onSuccess: () => {
      toast({
        title: "이용내역을 불러왔어요~~",
        status: "success",
        position: "top",
        duration: 2000,
        isClosable: true,
      });
      onClose();
      // queryClient.refetchQueries(["me"]);
      reset();
    }, // onError: () => {
    //   console.log("Mutation 에러낫음..ㅠ");
    // },
  });
  const onSubmit = (register) => {
    mutation.mutate(register);
    // console.log(register);
  }
  return (<>
    <Button colorScheme={'white'} fontSize={'1.5rem'} onClick={onOpen}>
      댕댕이 선택
    </Button>
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader>불러올 댕댕이 선택!</ModalHeader>
        <ModalCloseButton/>
        <ModalBody as={'form'} onSubmit={handleSubmit(onSubmit)}>
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
        <ModalFooter>
          <Button colorScheme='red' mr={3} onClick={onClose} rounded={'xl'} _hover={{
            textDecoration: 'none', color: 'white', rounded: 'xl', transform: 'scale(1.2)'
          }}>
            취소
          </Button>
          <Button bg={'#1a2a52'} color={'white'} rounded={'xl'} type={'submit'}
                  _hover={{
                    textDecoration: 'none', color: 'white', bg: '#526491', rounded: 'xl', transform: 'scale(1.2)'
                  }}>불러오기!</Button>
        </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
  </>)
}