import {
  Avatar,
  Box,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { useEffect, useState } from 'react';
import { getProfile } from '../api';

export default function ProfileAvatar(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const name = props.name;
  const clickable = props.hasOwnProperty('clickable') ? props.clickable : true;
  const { isLoading, data } = useQuery(['profile', name], getProfile);
  const [profileUrl, setProfileUrl] = useState('');
  useEffect(() => {
    if (!isLoading) {
      setProfileUrl(data);
    }
  }, [data]);

  const imageClick = () => {
    // e.event.preventDefault()
    if (clickable) onOpen();
  };
  return (
    <>
      <Avatar
        bgColor={'transparent'}
        cursor={'pointer'}
        h={'5vh'}
        icon={<Text fontSize={'3xl'}>🐶</Text>}
        onClick={imageClick}
        src={profileUrl}
        w={'5vh'}
      />
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent paddingTop={'5vw'} px={'5vw'} w={'70%'}>
          {/*<ModalHeader>{props.name}</ModalHeader>*/}
          <ModalBody alignContent={'center'} display={'flex'} justifyContent={'center'} m={0} p={0}>
            {profileUrl === '' ? (
              <Text fontSize={'9xl'}>🐶</Text>
            ) : (
              <Box border={'5px solid lightgray'}>
                <Image src={profileUrl} />
              </Box>
            )}
          </ModalBody>
          <ModalFooter py={'2vh'}>
            <Text fontFamily={'SingleDay'} fontSize={'3xl'} fontWeight={'bold'}>
              {props.name}❤️
            </Text>
            {/*<Button h={'5vh'} bgColor={'#1a2a52'} color={'white'} onClick={onClose}>닫기</Button>*/}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
