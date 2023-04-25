import {
  Button, Heading,
  HStack, IconButton,
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
  PopoverTrigger,
  Portal, Text, useToast,
  VStack
} from "@chakra-ui/react";
import {useEffect, useRef, useState} from "react";
import {useForm} from "react-hook-form";
import {useMutation, useQueryClient} from "react-query";
import {cancelHistory, dateStrToTemporal, modHistory} from "../api";
import moment from "moment/moment";
import {ArrowBackIcon, ArrowForwardIcon} from "@chakra-ui/icons";


function minutesToHHMM(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainderMinutes = minutes % 60;
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = remainderMinutes.toString().padStart(2, '0');
  return `${formattedHours}:${formattedMinutes}`;
}

export default function ModifyHistory(props) {
  const [onClose, isOpen] = [props.onClose, props.isOpen];
  const {id, name, belts, in_time, out_time, date:propDate} = props.data;
  const [tobeDate, setTobeDate] = useState(dateStrToTemporal(propDate));
  const [originDate, setoriginDate] = useState(dateStrToTemporal(propDate));
  const [formattedDate, setFormattedDate] = useState();
  useEffect(() => {
    setFormattedDate(tobeDate.toLocaleString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' }));
  }, [tobeDate]);
  const ref = useRef(null)
  let checkoutData = {};
  const defaultInTime = in_time.replace(":", '');
  const defaultOutTime = out_time.replace(":", '');
  let inPinNumber = defaultInTime.split("");
  let outPinNumber = defaultOutTime.split("");
  const {register, reset, handleSubmit, setValue} = useForm(
    {
      defaultValues: {
        inPinNumber: inPinNumber,
        outPinNumber: outPinNumber,
        belts: belts,
      }}
  );
  const toast = useToast();
  const queryClient = useQueryClient();
  const mutation = useMutation(modHistory, {
    onSuccess: (data) => {
      // console.log('mod History date, name');
      // console.log(originDate)
      // console.log(name)
      toast({
        title: (
          <>
            사용내역 수정! <br/>
            댕댕이 : {checkoutData.name} <br/>
            사용날짜 : {formattedDate} <br/>
            입장시간 : {checkoutData.in_time} <br/>
            퇴장시간 : {checkoutData.out_time} <br/>
            이용시간 : {minutesToHHMM(checkoutData.minutes)} <br/>
            매너벨트 : {checkoutData.belts}개 <br/>
          </>),
        status: "success",
        position: "top",
        duration: 1500,
        isClosable: true,
      });
      onClose();
      reset();
      // console.log('refetchQueries');
      // console.log(originDate)
      queryClient.refetchQueries(["timetable", originDate]);
      queryClient.refetchQueries(["checkoutTimetable", originDate]);
      queryClient.refetchQueries(["history"]);
      queryClient.refetchQueries(["history", name]);
    },
  });
  const onSubmit = (data) => {
    inPinNumber = data.inPinNumber.join("").replace(/(\d{2})(\d{2})/, "$1:$2");
    outPinNumber = data.outPinNumber.join("").replace(/(\d{2})(\d{2})/, "$1:$2");
    const inTime = moment(inPinNumber, 'HH:mm');
    const outTime = moment(outPinNumber, 'HH:mm');
    if (!outTime.isValid()) {
      toast({
        title: "퇴장 시간이 올바른 형식이 아닙니다.",
        status: "error",
        position: "top",
        duration: 1000,
        isClosable: true,
      });
      return;
    }
    if (inTime >= outTime) {
      toast({
        title: "퇴장 시간이 입장 시간보다 빠릅니다.",
        status: "error",
        position: "top",
        duration: 1000,
        isClosable: true,
      });
      return;
    }
    const diffMinutes = outTime.diff(inTime, 'minutes');
    checkoutData = {
      id: id,
      name: name,
      in_time: inPinNumber,
      out_time: outPinNumber,
      belts: data.belts,
      date: tobeDate,
      minutes: diffMinutes,
      check_today: false,
    }
    // console.log(checkoutData);
    mutation.mutate(checkoutData);
  }
  const cancelMutation = useMutation(cancelHistory, {
    onSuccess: (data) => {
      toast({
        title: (
          <>
            사용내역 삭제! <br/>
            댕댕이 : {name} <br/>
            사용날짜 : {document.getElementById('formattedNowDate').innerText} <br/>
          </>),
        status: "success",
        position: "top",
        duration: 1000,
        isClosable: true,
      });
      onClose();
      reset();
      queryClient.refetchQueries(["history", name]);
      queryClient.refetchQueries(["timetable", originDate]);
      queryClient.refetchQueries(['checkoutTimetable', originDate]);
    },

  });
  const cancel = () => {
    cancelMutation.mutate(id)
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay/>
      <ModalContent ref={ref}>
        <ModalHeader>{name} 사용내역 수정</ModalHeader>
        <ModalCloseButton/>
        <ModalBody as={'form'} onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={3} alignItems={'flex-start'}>
            <HStack w={'100%'} justifyContent={'flex-start'} alignContent={'center'} alignItems={'center'}>
              <Text w={'30%'}>입장날짜</Text>
                <IconButton rounded={'xl'} w={'6%'} h={'80%'} bg={'#1a2a52'} color={'white'} isRound={true} position={'inherit'}
                            _hover={{
                              textDecoration: 'none', color: 'white', bg: '#526491', rounded: 'xl', transform: 'scale(1.2)'
                            }} aria-label={''} icon={
                  <ArrowBackIcon fontSize={'2xl'} fontWeight={'extrabold'}/>}
                            onClick={() => {
                              setTobeDate(tobeDate.subtract({days: 1}))
                            }}
                />
                <Text mt={'2vh'} fontSize={'xl'} fontWeight={'semibold'} textAlign={'center'}
                      id={'formattedNowDate'}>
                  {formattedDate}
                </Text>
                <IconButton rounded={'xl'} w={'6%'} h={'80%'} bg={'#1a2a52'} color={'white'} isRound={true} position={'inherit'}
                            _hover={{
                              textDecoration: 'none', color: 'white', bg: '#526491', rounded: 'xl', transform: 'scale(1.2)'
                            }} aria-label={''} icon={
                  <ArrowForwardIcon fontSize={'2xl'} fontWeight={'extrabold'}/>}
                            onClick={() => {
                              setTobeDate(tobeDate.add({days: 1}))
                            }}
              />
            </HStack>
            <HStack w={'100%'}>
              <Text w={'30%'}>입장시간</Text>
              <HStack>
                <PinInput placeholder='0' defaultValue={defaultInTime}>
                  <PinInputField w={'40px'} {...register("inPinNumber[0]")} required={true}/>
                  <PinInputField w={'40px'} {...register("inPinNumber[1]")} required={true}/>
                  <Text fontSize={'3xl'} fontWeight={'bold'}>:</Text>
                  <PinInputField w={'40px'} {...register("inPinNumber[2]")} required={true}/>
                  <PinInputField w={'40px'} {...register("inPinNumber[3]")} required={true}/>
                </PinInput>
              </HStack>
            </HStack>
            <HStack w={'100%'}>
              <Text w={'30%'}>퇴장시간</Text>
              <HStack>
                <PinInput placeholder='0' defaultValue={defaultOutTime}>
                  <PinInputField w={'40px'} {...register("outPinNumber[0]")} required={true}/>
                  <PinInputField w={'40px'} {...register("outPinNumber[1]")} required={true}/>
                  <Text fontSize={'3xl'} fontWeight={'bold'}>:</Text>
                  <PinInputField w={'40px'} {...register("outPinNumber[2]")} required={true}/>
                  <PinInputField w={'40px'} {...register("outPinNumber[3]")} required={true}/>
                </PinInput>
              </HStack>
            </HStack>
            <HStack w={'100%'}>
              <Text w={'30%'}>매너벨트 사용량</Text>
              <NumberInput size='md' maxW={'30%'} min={0}
                           defaultValue={belts > 0 ? belts : 0}
                           {...register('belts')}>
                <NumberInputField/>
                <NumberInputStepper>
                  <NumberIncrementStepper/>
                  <NumberDecrementStepper/>
                </NumberInputStepper>
              </NumberInput>
            </HStack>
          </VStack>
          <ModalFooter>
            <Popover placement='top-start'>
              <PopoverTrigger>
                <Button colorScheme='yellow' mr={3} rounded={'xl'} _hover={{
                  textDecoration: 'none', color: 'white', rounded: 'xl', transform: 'scale(1.2)'
                }}>
                  사용내역 취소
                </Button>
              </PopoverTrigger>
              <Portal containerRef={ref}>
                <PopoverContent bg={'gray.200'} w={'100%'}>
                  <PopoverArrow/>
                  <PopoverCloseButton/>
                  <PopoverBody>
                    <Heading fontSize={'2xl'} my={'3vh'}>내역을 삭제할까요?</Heading>
                    <Button colorScheme='yellow' onClick={cancel}>삭제할게요!</Button>
                  </PopoverBody>
                </PopoverContent>
              </Portal>
            </Popover>
            <Button colorScheme='red' mr={3} onClick={onClose} rounded={'xl'} _hover={{
              textDecoration: 'none', color: 'white', rounded: 'xl', transform: 'scale(1.2)'
            }}>
              취소
            </Button>
            <Button bg={'#1a2a52'} color={'white'} rounded={'xl'} type={'submit'}
                    _hover={{
                      textDecoration: 'none', color: 'white', bg: '#526491', rounded: 'xl', transform: 'scale(1.2)'
                    }}>수정하기</Button>
          </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}