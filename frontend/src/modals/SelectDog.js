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
import {useMutation, useQuery, useQueryClient} from "react-query";
import {addNewDog, checkIn, dogsList, getHistory, testAPI} from "../api";
import {useDispatch, useSelector} from "react-redux";
import {setDog} from "../store";
import {useNavigate} from "react-router-dom";

export default function SelectDog({setter}) {
  const navigate = useNavigate();
  const {isOpen, onOpen, onClose} = useDisclosure();
  const {register, reset, handleSubmit, formState: {errors}} = useForm();
  const {isLoading, data} = useQuery(["dogs-list"], dogsList);
  const toast = useToast();
  let name = '';
  const mutation = useMutation(getHistory,{
    onSuccess: () => {
      toast({
        title: (
          <>
            {name}의 이용 내역을 불러왔어요! <br/>
          </>),
        status: "success",
        position: "top",
        duration: 800,
        isClosable: true,
      });
      onClose();
      reset();
    },
  });
  const onSubmit = (dogName) => {
    name = dogName.name
    onClose();
    reset();
    // console.log(name);
    setter(name);
    // navigate(`/history/${name.name}`)
    // mutation.mutate(name);
  };
  const options = data?.map(item => ({
    value: item.name,
    label: item.name,
  }));
  return (<>
    <Button onClick={onOpen}>
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
              {isLoading ? <Text>Loading options...</Text> :
                (
                  <Select
                    w={'40%'}
                    icon={<></>}
                    mr={5}
                    placeholder={"댕댕이 선택"}
                    required={true}
                    {...register("name")}
                  >
                    {options && options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                )}
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