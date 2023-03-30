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
import {useMutation, useQuery} from "react-query";
import {addNewDog, dogsList} from "../api";
import {useEffect, useState} from "react";

export default function Checkin() {
  const {isLoading, data} = useQuery(["dogs-list"], dogsList);
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
  const options = data?.map(item => ({
    value: item.name,
    label: item.name,
  }));
  
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
                  mr={5}
                  placeholder={"댕댕이 선택"}
                >
                  {options && options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                  )}
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