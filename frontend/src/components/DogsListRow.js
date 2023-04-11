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
  var remainingMinutes = data.remaining_minutes;
  var remainingDuration = moment.utc(Math.abs(remainingMinutes) * 60 * 1000);
  var formattedDuration = (remainingMinutes < 0 ? '-' : '') + remainingDuration.format('H:mm');
  
  return (<>
    <Tr textAlign={'center'}>
      <Td borderRight="1px solid" borderColor="gray.300" textAlign={'center'} p={2}>
        <Text fontSize={'md'} textAlign={'center'} fontWeight={'semibold'} textColor={'#1a2a52'}>
          {data.name}
        </Text>
      </Td>
      <Td borderRight="1px solid" borderColor="gray.300" textAlign={'center'} p={2}>
        <Text fontSize={'md'} textAlign={'center'} fontWeight={'semibold'} textColor={'#1a2a52'}
        whiteSpace={'pre-line'}>
          {data.note}
        </Text>
      </Td>
      <Td borderRight="1px solid" borderColor="gray.300" textAlign={'center'} p={0}>
        <Text fontSize={'md'} textAlign={'center'} fontWeight={'semibold'} textColor={'#1a2a52'}>
          {data.breed}
        </Text>
      </Td>
      <Td borderRight="1px solid" borderColor="gray.300" textAlign={'center'} p={2}>
        <Text fontSize={'md'} textAlign={'center'} fontWeight={'semibold'} textColor={'#1a2a52'}>
          {data.gender}
        </Text>
      </Td>
      <Td borderRight="1px solid" borderColor="gray.300" textAlign={'center'} p={2}>
        <Text fontSize={'md'} textAlign={'center'} fontWeight={'semibold'} textColor={'#1a2a52'}>
          {data.phone}
        </Text>
      </Td>
      <Td borderRight="1px solid" borderColor="gray.300" textAlign={'center'} p={2}>
        <Text fontSize={'md'} textAlign={'center'} fontWeight={'semibold'} textColor={'#1a2a52'}>
          {data.weight}
        </Text>
      </Td>
      <Td borderRight="1px solid" borderColor="gray.300" textAlign={'center'} p={2}>
        <Text fontSize={'md'} textAlign={'center'} fontWeight={'semibold'} textColor={'#1a2a52'}>
          {formattedDuration}
        </Text>
      </Td>
    </Tr>
  </>)
}