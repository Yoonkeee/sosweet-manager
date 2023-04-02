import {
  Button, ChakraProvider,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent, ModalFooter,
  ModalHeader,
  ModalOverlay, PinInput, PinInputField, Select, Text,
  useDisclosure, useToast,
  VStack
} from "@chakra-ui/react";
import {useForm} from "react-hook-form";
import {useSelector} from "react-redux";
import {useMutation, useQueryClient} from "react-query";
import {changeCheckIn, checkIn} from "../api";
import moment from "moment";

export default function ChangeCheckInTime({isOpen, onClose, id, name}) {
  const {register, reset, handleSubmit, formState: {errors}} = useForm();
  const toast = useToast();
  let date = useSelector((state) => state.currentDate);
  let dogData = {};
  const queryClient = useQueryClient();
  const mutation = useMutation(changeCheckIn, {
    onSuccess: () => {
      toast({
        title: (
          <>
            체크인 수정! <br/>
            댕댕이 : {dogData.name} <br/>
            입장시간 : {dogData.in_time}
          </>),
        status: "success",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
      queryClient.refetchQueries(["timetable"]);
      console.log('체크인 수정 성공');
      onClose();
      reset();
    },
  });
  const onSubmit = (data) => {
    const pinNumber = data.pinNumber.join("").replace(/(\d{2})(\d{2})/, "$1:$2");
    console.log(pinNumber); // outputs "12:34"
    const outTime = moment(pinNumber, 'HH:mm');
    if (!outTime.isValid()) {
      toast({
        title: "시간이 올바른 형식이 아닙니다.",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    dogData = {
      name: name,
      in_time: pinNumber,
      date: date,
      id: id
    };
    console.log(dogData)
    mutation.mutate(dogData);
    console.log('체크인 수정 요청');
  };
  return (<>
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader>댕댕이 체크인 시간 수정!</ModalHeader>
        <ModalCloseButton/>
        <ModalBody as={'form'} onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={3}>
            <HStack>
              <Text>{name}</Text>
              <HStack>
                <PinInput placeholder='0'>
                  <PinInputField w={'40px'} {...register("pinNumber[0]")} required={true}/>
                  <PinInputField w={'40px'} {...register("pinNumber[1]")} required={true}/>
                  <Text fontSize={'3xl'} fontWeight={'bold'}>:</Text>
                  <PinInputField w={'40px'} {...register("pinNumber[2]")} required={true}/>
                  <PinInputField w={'40px'} {...register("pinNumber[3]")} required={true}/>
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
                    }}>수정!</Button>
          </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
  </>);
};