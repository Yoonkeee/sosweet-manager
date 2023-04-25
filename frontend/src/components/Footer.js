import {
  Box,
  Flex,
  Image,
  Spacer,
  useDisclosure,

} from "@chakra-ui/react";
import {useLocation} from "react-router-dom";
import Checkin from "../modals/Checkin";

export default function Footer() {
  const location = useLocation().pathname;
  const {isOpen, onOpen, onClose} = useDisclosure();
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
        mb={'1.5vh'}
        src={'logo_word.png'}
        filter={'invert(1)'}
      />
    </Box>
    <Box w={'10vw'}>
      {location === '/timetable' ? (
          <Checkin/>) : <></>}
    </Box>
    <Spacer/>
  </Flex>)
}

