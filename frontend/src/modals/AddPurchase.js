import {useForm} from "react-hook-form";
import {
  Button, HStack,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay, Select, Switch, Text, useToast,
  VStack
} from "@chakra-ui/react";
import {useMutation} from "react-query";
import {addNewDog} from "../api";

export default function AddPurchase({isOpen, onClose}) {
  const {register, reset,handleSubmit, formState:{errors}} = useForm();
  const toast = useToast();
  const mutation = useMutation(addNewDog, {
    onSuccess: () => {
      toast({
        title: "결제 내역 등록에 성공했어요~~",
        status: "success",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      // queryClient.refetchQueries(["me"]);
      reset();
    },
    // onError: () => {
    //   console.log("Mutation 에러낫음..ㅠ");
    // },
  });
  const onSubmit = (register) => {
    mutation.mutate(register);
    // console.log(register);
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader>결제 등록!</ModalHeader>
        <ModalCloseButton/>
        <ModalBody as={'form'} onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={3}>
            <HStack>
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
              <Input
                w={'30%'}
                type={'number'}
                variant={"filled"}
                placeholder={"결제 시간"}
                {...register("time", {required: true})}
              />
              <Text>
                시간
              </Text>
            </HStack>
            <HStack>
              <Text>매너벨트 15개 같이 결제</Text>
              <Switch size='lg'/>
            </HStack>
          </VStack>
          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={onClose} rounded={'xl'}
                    _hover={{textDecoration: 'none', color: 'white', rounded: 'xl', transform: 'scale(1.2)'}}>
              취소
            </Button>
            <Button bg={'#1a2a52'} color={'white'} rounded={'xl'} type={'submit'}
                    _hover={{textDecoration: 'none', color: 'white', bg: '#526491', rounded: 'xl', transform: 'scale(1.2)'}}>구매!</Button>
          </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
};