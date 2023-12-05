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
  VStack,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { addNewDog, dogsList } from '../api';
import { useMutation, useQuery, useQueryClient } from 'react-query';

export default function NewDog({ isOpen, onClose }) {
  const { register, reset, handleSubmit } = useForm();
  const queryClient = useQueryClient();
  const initQuery = useQuery(['dogs-list'], dogsList);
  const toast = useToast();
  const mutation = useMutation(addNewDog, {
    onSuccess: () => {
      toast({
        title: '댕댕이 등록에 성공했어요~~',
        status: 'success',
        position: 'top',
        duration: 1000,
        isClosable: true,
      });
      queryClient.refetchQueries(['dogs-list']);
      onClose();
      reset();
    },
    onError: () => {
      toast({
        title: '댕댕이 등록에 실패했어요ㅠ 이름이 중복이거나 서버의 에러에요ㅠ',
        status: 'error',
        position: 'top',
        duration: 1000,
        isClosable: true,
      });
    },
  });
  const onSubmit = data => {
    mutation.mutate(data);
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent top={'25vh'}>
        <ModalHeader>댕댕이 등록~</ModalHeader>
        <ModalCloseButton />
        <ModalBody as={'form'} onSubmit={handleSubmit(onSubmit)}>
          <VStack>
            <Input
              placeholder={'댕댕이 이름(필수)'}
              required={true}
              variant={'filled'}
              {...register('dogName', { required: '댕댕이 이름 입력해주세요!!' })}
            />
            <Input
              placeholder={'메세지에 보낼 댕댕이 이름(선택) 미입력시 이름과 동일'}
              variant={'filled'}
              {...register('officialName')}
            />
            <Input placeholder={'특이사항(선택)'} variant={'filled'} {...register('dogInfo')} />
            <InputGroup>
              <Input mr={1} placeholder={'견종(선택)'} variant={'filled'} {...register('dogBreed')} />
              <Input ml={1} placeholder={'성별(선택)'} variant={'filled'} {...register('dogGender')} />
            </InputGroup>
            <InputGroup>
              <Input mr={1} placeholder={'견주 전화번호(선택)'} variant={'filled'} {...register('phone')} />
              <Input ml={1} placeholder={'몸무게(선택)'} variant={'filled'} {...register('dogWeight')} />
            </InputGroup>
          </VStack>
          <ModalFooter>
            <Button
              _hover={{
                textDecoration: 'none',
                color: 'white',
                rounded: 'xl',
                transform: 'scale(1.2)',
              }}
              colorScheme="red"
              mr={3}
              onClick={onClose}
              rounded={'xl'}
            >
              취소
            </Button>
            <Button
              _hover={{
                textDecoration: 'none',
                color: 'white',
                bg: '#526491',
                rounded: 'xl',
                transform: 'scale(1.2)',
              }}
              bg={'#1a2a52'}
              color={'white'}
              rounded={'xl'}
              type={'submit'}
            >
              등록~
            </Button>
          </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
