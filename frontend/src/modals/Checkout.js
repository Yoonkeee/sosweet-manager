import {
  Box,
  Button, FormControl, FormLabel, Heading,
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
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal, Switch,
  Text, useToast,
  VStack
} from "@chakra-ui/react";
import {useRef, useState} from "react";
import {useForm} from "react-hook-form";
import {useMutation, useQueryClient} from "react-query";
import {addNewDog, cancelCheckin, checkOut} from "../api";
import {useSelector} from "react-redux";
import moment from "moment/moment";


function minutesToHHMM(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainderMinutes = minutes % 60;
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = remainderMinutes.toString().padStart(2, '0');
  return `${formattedHours}:${formattedMinutes}`;
}


export default function Checkout({isOpen, onClose, id, name, in_time, belts}) {
  const ref = useRef(null)
  let checkoutData = {};
  const {register, reset,handleSubmit, formState:{errors}} = useForm();
  const toast = useToast();
  let date = useSelector((state) => state.currentDate);
  const queryClient = useQueryClient();
  const [payToday, setPayToday] = useState(false);
  const mutation = useMutation(checkOut, {
    onSuccess: (data) => {
      toast({
        title: (
          <>
            체크아웃! <br/>
            댕댕이 : {checkoutData.name} <br/>
            입장시간 : {checkoutData.in_time} <br/>
            퇴장시간 : {checkoutData.out_time} <br/>
            이용시간 : {minutesToHHMM(checkoutData.minutes)} <br/>
            매너벨트 : {checkoutData.belts}개 <br/>
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
    
    // const moment = require('moment');
    const inTime = moment(in_time, 'HH:mm');
    const outTime = moment(pinNumber, 'HH:mm');
    if (!outTime.isValid()) {
      toast({
        title: "퇴장 시간이 올바른 형식이 아닙니다.",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (inTime >= outTime) {
      toast({
        title: "퇴장 시간이 입장 시간보다 빠릅니다.",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const diffMinutes = outTime.diff(inTime, 'minutes');
    checkoutData = {
      id: id,
      name: name,
      in_time: in_time,
      out_time: pinNumber,
      belts: data.belts,
      date: date,
      minutes: diffMinutes,
      payToday: payToday
    }
    console.log(checkoutData);
    mutation.mutate(checkoutData);
  }
  const cancel = () => {
    cancelCheckin(id);
    // console.log(id);
    onClose();
    reset();
    queryClient.refetchQueries(["timetable"]);
  };
  // TODO 모달창 vw -> %로 변경
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay/>
      <ModalContent ref={ref}>
        <ModalHeader>댕댕이 체크아웃!</ModalHeader>
        <ModalCloseButton/>
        <ModalBody as={'form'} onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={3} alignItems={'flex-start'}>
            <HStack>
              <Text w={'15vw'}>{name} 퇴장시간</Text>
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
            <HStack>
              <Text w={'15vw'}>매너벨트 사용량</Text>
              <NumberInput size='md' maxW={'30%'} min={0}
                           value={belts}
                           {...register('belts')}>
                <NumberInputField/>
                <NumberInputStepper>
                  <NumberIncrementStepper/>
                  <NumberDecrementStepper/>
                </NumberInputStepper>
              </NumberInput>
            </HStack>
            <FormControl display='flex' alignItems='center'>
              <FormLabel mb='0' w={'14.5vw'}>
                당일 결제
              </FormLabel>
              <Switch size={'lg'} onChange={(e) => {
                if (e.target.checked) {
                  setPayToday(true);
                } else {
                  setPayToday(false);
                }
              }
              }/>
            </FormControl>
          </VStack>
          <ModalFooter>
            <Popover placement='top-start'>
              <PopoverTrigger>
                <Button colorScheme='yellow' mr={3} rounded={'xl'} _hover={{
                  textDecoration: 'none', color: 'white', rounded: 'xl', transform: 'scale(1.2)'
                }}>
                  체크인 취소
                </Button>
              </PopoverTrigger>
              <Portal containerRef={ref}>
                <PopoverContent bg={'gray.200'} w={'100%'}>
                  <PopoverArrow />
                  {/*<PopoverHeader>체크인 취소할까요?</PopoverHeader>*/}
                  <PopoverCloseButton />
                  <PopoverBody>
                    <Heading fontSize={'2xl'} my={'3vh'}>체크인 취소할까요?</Heading>
                    <Button colorScheme='yellow' onClick={cancel}>취소할게요!</Button>
                  </PopoverBody>
                </PopoverContent>
              </Portal>
            </Popover>
            
            {/*<Button colorScheme='yellow' mr={3} onClick={onClose} rounded={'xl'} _hover={{*/}
            {/*  textDecoration: 'none', color: 'white', rounded: 'xl', transform: 'scale(1.2)'*/}
            {/*}}>*/}
            {/*  체크인 취소*/}
            {/*</Button>*/}
            <Button colorScheme='red' mr={3} onClick={onClose} rounded={'xl'} _hover={{
              textDecoration: 'none', color: 'white', rounded: 'xl', transform: 'scale(1.2)'
            }}>
              취소
            </Button>
            <Button bg={'#1a2a52'} color={'white'} rounded={'xl'} type={'submit'}
                    _hover={{
                      textDecoration: 'none', color: 'white', bg: '#526491', rounded: 'xl', transform: 'scale(1.2)'
                    }}>체크아웃!</Button>
          </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}