import {
  Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Button, HStack, IconButton, Text, useDisclosure, Checkbox,
} from '@chakra-ui/react'
import {MinusIcon, PlusSquareIcon, SearchIcon} from "@chakra-ui/icons";
import {useState} from "react";
// import "react-icons/all";
import {BiPlus} from "react-icons/bi";
import Checkout from "./Checkout";

export default function GetMessageRow() {
  const [belts, setBelts] = useState(0);
  const {
    isOpen: isOutOpen, onOpen: onOutOpen, onClose: onOutClose
  } = useDisclosure()
  return (<>
    <Tr>
      <Td>
        <Text fontSize='lg' textAlign={'center'} fontWeight={'bold'} textColor={'#1a2a52'}>
          김프로
        </Text>
      </Td>
      <Td>
        <Text fontSize='md' textAlign={'center'} fontWeight={'bold'} textColor={'#1a2a52'}>
          3월15일
        </Text>
      </Td>
      <Td fontSize='lg' textAlign={'center'} fontWeight={'bold'} textColor={'#1a2a52'}>13:55</Td>
      <Td fontSize='lg' textAlign={'center'} fontWeight={'bold'} textColor={'#1a2a52'}>
        15:55
      </Td>
      <Td fontSize='lg' textAlign={'center'} fontWeight={'bold'} textColor={'#1a2a52'}>
        2:00
      </Td>
      <Td fontSize='lg' textAlign={'center'} fontWeight={'bold'} textColor={'#1a2a52'}>
        <Checkbox size={'lg'} borderColor={'black'}/>
      </Td>
    </Tr>
  </>)
}