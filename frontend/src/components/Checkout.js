import {
  Box,
  Button, Heading,
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
  Portal,
  Text, useToast,
  VStack
} from "@chakra-ui/react";
import {useRef} from "react";
import {useForm} from "react-hook-form";
import {useMutation} from "react-query";
import {addNewDog} from "../api";

export default function Checkout({isOpen, onClose}) {
  const ref = useRef(null)
  const {register, reset,handleSubmit, formState:{errors}} = useForm();
  const toast = useToast();
  const mutation = useMutation(addNewDog, {
    onSuccess: () => {
      toast({
        title: "체크아웃 했어요~~",
        status: "success",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      reset();
    },
  });
  const onSubmit = (dog) => {
    mutation.mutate(dog);
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay/>
      <ModalContent ref={ref}>
        <ModalHeader>댕댕이 체크아웃!</ModalHeader>
        <ModalCloseButton/>
        <ModalBody as={'form'} onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={3}>
            <HStack>
              <Text>김프로 퇴장시간</Text>
              <HStack>
                <PinInput placeholder='0'>
                  <PinInputField w={'40px'}/>
                  <PinInputField w={'40px'}/>
                  <Text fontSize={'3xl'} fontWeight={'bold'}>:</Text>
                  <PinInputField w={'40px'}/>
                  <PinInputField w={'40px'}/>
                </PinInput>
              </HStack>
            </HStack>
            <HStack>
              <Text>매너벨트 사용량</Text>
              <NumberInput size='md' maxW={'30%'} defaultValue={0} min={0}>
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
                    <Button colorScheme='yellow' onClick={onClose}>취소할게요!</Button>
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