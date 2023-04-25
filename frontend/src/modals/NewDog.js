import {
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
  useToast,
  VStack
} from "@chakra-ui/react";
import {useForm} from "react-hook-form";
import {addNewDog, dogsList} from "../api";
import {useMutation, useQuery, useQueryClient} from "react-query";

export default function NewDog({isOpen, onClose}) {
  const {register, reset, handleSubmit} = useForm();
  const queryClient = useQueryClient();
  const initQuery = useQuery(["dogs-list"], dogsList);
  const toast = useToast();
  const mutation = useMutation(addNewDog, {
    onSuccess: () => {
      toast({
        title: "댕댕이 등록에 성공했어요~~", status: "success", position: "top", duration: 1000, isClosable: true,
      });
      queryClient.refetchQueries(["dogs-list"]);
      onClose();
      reset();
    },
    onError: () => {
      toast({
        title: "댕댕이 등록에 실패했어요ㅠ 이름이 중복이거나 서버의 에러에요ㅠ", status: "error", position: "top", duration: 1000, isClosable: true,
      });
    }
  });
  const onSubmit = (data) => {
    mutation.mutate(data);
  }
  return (<Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader>댕댕이 등록~</ModalHeader>
        <ModalCloseButton/>
        <ModalBody as={'form'} onSubmit={handleSubmit(onSubmit)}>
          <VStack>
            <Input
              variant={"filled"}
              required={true}
              placeholder={"댕댕이 이름(필수)"}
              {...register("dogName", {required: "댕댕이 이름 입력해주세요!!"})}
            />
            <Input
              variant={"filled"}
              placeholder={"메세지에 보낼 댕댕이 이름(선택) 미입력시 이름과 동일"}
              {...register("officialName")}
            />
            <Input
              variant={"filled"}
              placeholder={"특이사항(선택)"}
              {...register("dogInfo")}
            />
            <InputGroup>
              <Input
                mr={1}
                variant={"filled"}
                placeholder={"견종(선택)"}
                {...register("dogBreed")}
              />
              <Input
                ml={1}
                variant={"filled"}
                placeholder={"성별(선택)"}
                {...register("dogGender")}
              />
            </InputGroup>
            <InputGroup>
              <Input
                mr={1}
                variant={"filled"}
                placeholder={"견주 전화번호(선택)"}
                {...register("phone")}
              />
              <Input
                ml={1}
                variant={"filled"}
                placeholder={"몸무게(선택)"}
                {...register("dogWeight")}
              />
            </InputGroup>
          </VStack>
          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={onClose} rounded={'xl'} _hover={{
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