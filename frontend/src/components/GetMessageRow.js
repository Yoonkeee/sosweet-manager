import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Button,
  HStack,
  IconButton,
  Text,
  useDisclosure,
  Checkbox,
  useBreakpointValue,
} from '@chakra-ui/react'
import {MinusIcon, PlusSquareIcon, SearchIcon} from "@chakra-ui/icons";
import {useEffect, useState} from "react";
// import "react-icons/all";
import {BiPlus} from "react-icons/bi";
import Checkout from "../modals/Checkout";
import moment from "moment/moment";

export default function GetMessageRow(props) {
  const formatDate = (dateStr) => {
    let formattedDate = moment.utc(date, 'YYYY-MM-DD').format('M월 D일');
    return formattedDate
  };
  const formatTime = (timeStr) => {
    return moment(timeStr, 'YYYY-MM-DDTHH:mm:ss').format('HH:mm');
  };
  const formatTimeFromMinutes = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return moment().startOf('day').add(hours, 'hours').add(mins, 'minutes').format('HH:mm');
  };
  const {belts, date, id, in_time, name, out_time, used_minutes} = props.data;
  const [checked, setChecked] = props.state;
  
  const showInTime = useBreakpointValue({ base: false, md: true });
  const showOutTime = useBreakpointValue({ base: false, md: true });
  const showBelt = useBreakpointValue({ base: false, md: true });
  return (<>
    <Tr>
      <Td px={0}>
        <Text fontSize='xl' fontWeight='bold' textAlign={'center'} textColor='#1a2a52'>
          {name}
        </Text>
      </Td>
      <Td px={0}>
        <Text fontSize={'md'} textAlign={'center'} fontWeight={'bold'} textColor={'#1a2a52'}>
          {formatDate(date)}
        </Text>
      </Td>
      {showInTime && <Td px={0}>
        <Text fontSize='lg' textAlign={'center'} fontWeight={'bold'} textColor={'#1a2a52'}>
          {formatTime(in_time)}
        </Text>
      </Td> }
      {showOutTime && <Td px={0}>
        <Text fontSize='lg' textAlign={'center'} fontWeight={'bold'} textColor={'#1a2a52'}>
          {formatTime(out_time)}
        </Text>
      </Td>}
      <Td px={0}>
        <Text fontSize='lg' textAlign={'center'} fontWeight={'bold'} textColor={'#1a2a52'}>
          {formatTimeFromMinutes(used_minutes)}
        </Text>
      </Td>
      {showBelt && <Td px={0}>
        <Text fontSize='lg' textAlign={'center'} fontWeight={'bold'} textColor={'#1a2a52'}>
          {belts > 0 ? <Text fontSize='lg'>{belts}</Text> : ''}
        </Text>
      </Td>}
      <Td px={0}>
        <Text textAlign={'center'} fontWeight={'bold'} textColor={'#1a2a52'}>
          <Checkbox size={'lg'} borderColor={'black'} position={'inherit'}
                    // checked={checked.includes(id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setChecked([...checked, id]);
                      } else {
                        setChecked(checked.filter((rowId) => rowId !== id));
                      }
                    }
                    }/>
        </Text>
      </Td>
    </Tr>
  </>)
}