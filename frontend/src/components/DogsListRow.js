import {
  Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Button, HStack, IconButton, Text, useDisclosure, Tooltip,
} from '@chakra-ui/react'
import {MinusIcon, PlusSquareIcon, SearchIcon} from "@chakra-ui/icons";
import {useState} from "react";
// import "react-icons/all";
import {BiPlus} from "react-icons/bi";
import Checkout from "../modals/Checkout";
import ChangeCheckInTime from "../modals/ChangeCheckInTime";
import moment from "moment";

export default function DogsListRow(props) {
  console.log(props.data);
  const data = props.data
  // {
  //     "name": "브라운",
  //     "breed": "푸들",
  //     "note": "분불심함 패셔니스타",
  //     "gender": "남",
  //     "phone": "",
  //     "weight": "",
  //     "official_name": "브라운",
  //     "minutes": 375
  // }
  // set data
  
  
  // const {breed, gender, minutes, name, note, phone, weight} = data.data
  // const [name, breed, note, gender, phone, weight] = data.data
  // console.log(name, breed, note, gender, phone, weight);
  return (<>
    <Tr textAlign={'center'}>
      <Td textAlign={'center'} p={2}>
        <Text fontSize={'md'} textAlign={'center'} fontWeight={'semibold'} textColor={'#1a2a52'}>
          {data.name}
        </Text>
      </Td>
      <Td textAlign={'center'} p={2}>
        <Text fontSize={'md'} textAlign={'center'} fontWeight={'semibold'} textColor={'#1a2a52'}>
          {data.note}
        </Text>
      </Td>
      <Td textAlign={'center'} p={0}>
        <Text fontSize={'md'} textAlign={'center'} fontWeight={'semibold'} textColor={'#1a2a52'}>
          {data.breed}
        </Text>
      </Td>
      <Td textAlign={'center'} p={2}>
        <Text fontSize={'md'} textAlign={'center'} fontWeight={'semibold'} textColor={'#1a2a52'}>
          {data.gender}
        </Text>
      </Td>
      <Td textAlign={'center'} p={2}>
        <Text fontSize={'md'} textAlign={'center'} fontWeight={'semibold'} textColor={'#1a2a52'}>
          {data.phone}
        </Text>
      </Td>
      <Td textAlign={'center'} p={2}>
        <Text fontSize={'md'} textAlign={'center'} fontWeight={'semibold'} textColor={'#1a2a52'}>
          {data.weight}
        </Text>
      </Td>
      <Td textAlign={'center'} p={2}>
        <Text fontSize={'md'} textAlign={'center'} fontWeight={'semibold'} textColor={'#1a2a52'}>
          {moment.utc(data.minutes * 60 * 1000).format('H:mm')}
        </Text>
      </Td>
    </Tr>
  </>)
}