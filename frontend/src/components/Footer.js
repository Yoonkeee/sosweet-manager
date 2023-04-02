import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, PinInput, PinInputField,
  Select,
  Spacer,
  Stack,
  Switch,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import {Link, useLocation} from "react-router-dom";
import GetMessage from "../routes/GetMessage";
import History from "../routes/History";
import SelectDog from "../modals/SelectDog";
import Checkin from "../modals/Checkin";
import MakeMessage from "../modals/MakeMessage";

export default function Footer() {
  const location = useLocation().pathname;
  const {isOpen, onOpen, onClose} = useDisclosure();
  console.log(location)
  return (<Flex
    alignItems="center"
    justifyContent="space-between"
    h={'10vh'}
    background={'#1a2a52'}
  >
    <Spacer/>
    <Box w={'10vw'} />
    <Box>
      <Image
        h={'8vh'}
        src={'logo_word.png'}
        filter={'invert(1)'}
      />
    </Box>
    <Box w={'10vw'}>
      {location === '/timetable' ? (
          <Checkin/>) :
        (location === '/get-message' ? (
              <>
                <Button colorScheme={'white'} fontSize={'1.5rem'} onClick={onOpen}>메세지 생성</Button>
                <MakeMessage isOpen={isOpen} onClose={onClose}/>
              </>)
            :
            (<></>)
        )}
    </Box>
    <Spacer/>
  </Flex>)
}

