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
import {useMutation, useQuery, useQueryClient} from "react-query";
import {addNewDog, checkIn, dogsList} from "../api";
import {useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";

export default function Checkin() {
  const {isLoading, data} = useQuery(["dogs-list"], dogsList);
  const {isOpen, onOpen, onClose} = useDisclosure()
  const {register, reset, handleSubmit, formState: {errors}} = useForm();
  const toast = useToast();
  const queryClient = useQueryClient();
  
  let date = useSelector((state) => state.currentDate);
  let dogData = {};
  const mutation = useMutation(checkIn,{
    onSuccess: () => {
      toast({
        title: (
          <>
            체크인! <br/>
            댕댕이 : {dogData.name} <br/>
            입장시간 : {dogData.in_time}
            </>),
        status: "success",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      reset();
      queryClient.refetchQueries(["timetable"]);
    },
  });
  const onSubmit = (data) => {
    const pinNumber = data.pinNumber.join("").replace(/(\d{2})(\d{2})/, "$1:$2");
    console.log(pinNumber); // outputs "12:34"
    dogData = {
      name: data.dogName,
      in_time: pinNumber,
      date: date,
      id: Date.now()
    };
    console.log(dogData)
    mutation.mutate(dogData);
  };
  const options = data?.map(item => ({
    value: item.name,
    label: item.name,
  }));

  // TODO 모달창 vw -> %로 변경
  return (<>
    <Button
      onClick={onOpen}
      colorScheme={'white'}
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
              {isLoading ? <Text>Loading options...</Text> :
                  (
                <Select
                  w={'40%'}
                  icon={<></>}
                  mr={5}
                  placeholder={"댕댕이 선택"}
                  required={true}
                  {...register("dogName")}
                >
                  {options && options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                  )}
              <HStack>
                <PinInput placeholder='0' autoFocus={true}>
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
                    }}>입장!</Button>
          </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
  </>);
};