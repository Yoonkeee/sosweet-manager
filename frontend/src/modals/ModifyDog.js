import {
  Box,
  Button,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Text,
  useDisclosure,
  useToast,
  VStack
} from "@chakra-ui/react";
import {useForm} from "react-hook-form";
import {useMutation, useQuery} from "react-query";
import {addNewDog, dogsList, getDogInfo} from "../api";
import {useEffect, useState} from "react";

export default function ModifyDog({isOpen, onClose}) {
  // const {isOpen, onOpen, onClose} = useDisclosure()
  const {register, reset, handleSubmit, formState: {errors}} = useForm();
  const toast = useToast();
  const [name, setName] = useState('');
  const [info, setInfo] = useState('');
  const mutation = useMutation(addNewDog, {
    onSuccess: () => {
      toast({
        title: "댕댕이 수정에 성공했어요~~", status: "success", position: "top", duration: 3000, isClosable: true,
      });
      onClose();
      reset();
    },
  });
  const {isLoading: selectIsLoading, data: selectData} = useQuery(["dogs-list"], dogsList);
  const options = selectData?.map(item => ({
    value: item.name, label: item.name,
  }));
  const onSubmit = () => {
    mutation.mutate();
  }
  useEffect(() => {
    getDogInfo(name).then((res) => {
      setInfo(res[0])
    })
    return () => {
      setInfo('');
    }
  }, [name]);
  useEffect(() => {
    console.log(info);
    reset({
      officialName: info.official_name,
      dogInfo: info.note,
      dogBreed: info.breed,
      dogGender: info.gender,
      phone: info.phone,
      dogWeight: info.weight,
    })
  }, [info]);
  
  
  return (<Modal isOpen={isOpen} onClose={() => {
    reset()
    setName('')
    onClose()
  }}>
    <ModalOverlay/>
    <ModalContent>
      <ModalHeader>댕댕이 정보 수정~</ModalHeader>
      <ModalCloseButton/>
      <ModalBody as={'form'} onSubmit={handleSubmit(onSubmit)}>
        <VStack>
          {selectIsLoading ? <Text>Loading options...</Text> : (<Select
            // w={'40%'}
            placeholder={"댕댕이 선택"}
            required={true}
            position={'inherit'}
            id={'name'}
            onChange={(e) => {
              // console.log(e.target.value);
              document.getElementById('name').style.position = 'inherit'
              setName(prev => e.target.value);
            }}
          >
            {options && options.map((option) => (<option key={option.value} value={option.value}>
              {option.label}
            </option>))}
          </Select>)}
          <Input
            variant={"filled"}
            // value={officialName}
            placeholder={"메세지에 보낼 댕댕이 이름(선택) 미입력시 이름과 동일"}
            {...register("officialName")}
          />
          <Input
            variant={"filled"}
            // value={dogInfo}
            placeholder={"특이사항(선택)"}
            {...register("dogInfo")}
          />
          <InputGroup>
            <Input
              mr={1}
              variant={"filled"}
              // value={dogBreed}
              placeholder={"견종(선택)"}
              {...register("dogBreed")}
            />
            <Input
              ml={1}
              variant={"filled"}
              // value={dogGender}
              placeholder={"성별(선택)"}
              {...register("dogGender")}
            />
          </InputGroup>
          <InputGroup>
            <Input
              mr={1}
              variant={"filled"}
              // value={phone}
              placeholder={"견주 전화번호(선택)"}
              {...register("phone")}
            />
            <Input
              ml={1}
              variant={"filled"}
              // value={dogWeight}
              placeholder={"몸무게(선택)"}
              {...register("dogWeight")}
            />
          </InputGroup>
        
        </VStack>
        <ModalFooter>
          <Button colorScheme='red' mr={3} onClick={() => {
            debugger;
            reset()
            setName('')
            onClose()
          }}
                  rounded={'xl'} _hover={{
            textDecoration: 'none', color: 'white', rounded: 'xl', transform: 'scale(1.2)'
          }}>
            취소
          </Button>
          <Button bg={'#1a2a52'} color={'white'} rounded={'xl'}
                  type={'submit'}
                  _hover={{
                    textDecoration: 'none', color: 'white', bg: '#526491', rounded: 'xl', transform: 'scale(1.2)'
                  }}>등록~</Button>
        </ModalFooter>
      </ModalBody>
    </ModalContent>
  </Modal>);
};