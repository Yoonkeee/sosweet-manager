import {
  Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Button, HStack, IconButton, Text, useDisclosure, Tooltip,
} from '@chakra-ui/react'
import {MinusIcon, PlusSquareIcon, SearchIcon} from "@chakra-ui/icons";
import {useState} from "react";
// import "react-icons/all";
import {BiPlus} from "react-icons/bi";
import Checkout from "./Checkout";
import CheckinTimeModify from "./CheckinTimeModify";

export default function DogsListRow(data) {
  const [name, breed, note, gender, phone, weight] = data.data
  console.log(data)
  console.log(name, breed, note, gender, phone, weight);
  return (<>
    <Tr textAlign={'center'}>
      <Td>
        <Text fontSize={'md'} textAlign={'center'} fontWeight={'semibold'} textColor={'#1a2a52'}>
          {name}
        </Text>
      </Td>
      <Td textAlign={'center'}>
        <Text fontSize={'md'} textAlign={'center'} fontWeight={'semibold'} textColor={'#1a2a52'}>
          {note}
        </Text>
      </Td>
      <Td textAlign={'center'}>
        <Text fontSize={'md'} textAlign={'center'} fontWeight={'semibold'} textColor={'#1a2a52'}>
          {breed}
        </Text>
      </Td>
      <Td textAlign={'center'}>
        <Text fontSize={'md'} textAlign={'center'} fontWeight={'semibold'} textColor={'#1a2a52'}>
          {gender}
        </Text>
      </Td>
      <Td textAlign={'center'}>
        <Text fontSize={'md'} textAlign={'center'} fontWeight={'semibold'} textColor={'#1a2a52'}>
          {phone}
        </Text>
      </Td>
      <Td textAlign={'center'}>
        <Text fontSize={'md'} textAlign={'center'} fontWeight={'semibold'} textColor={'#1a2a52'}>
          {weight}
        </Text>
      </Td>
    </Tr>
  </>)
}