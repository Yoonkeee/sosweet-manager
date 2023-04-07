import {
  Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Button, HStack, IconButton, Text, useDisclosure, Checkbox,
} from '@chakra-ui/react'
import {MinusIcon, PlusSquareIcon, SearchIcon} from "@chakra-ui/icons";
import {useEffect, useState} from "react";
// import "react-icons/all";
import {BiPlus} from "react-icons/bi";
import Checkout from "../modals/Checkout";
import moment from "moment/moment";

export default function GetMessageRow(data) {
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
  const {belts, date, id, in_time, name, out_time, used_minutes, state} = data;
  const [checked, setChecked] = state;
  // const [checked, setChecked] = useState([]);
  // useEffect(() => {
  //   console.log('in use effect');
  //   console.log(checked);
  // }, [checked]);
  
  return (<>
    <Tr>
      <Td>
        <Text fontSize='xl' fontWeight='bold' textColor='#1a2a52'>
          {name}
        </Text>
      </Td>
      <Td>
        <Text fontSize={'md'} textAlign={'center'} fontWeight={'bold'} textColor={'#1a2a52'}>
          {formatDate(date)}
        </Text>
      </Td>
      <Td>
        <Text fontSize='lg' textAlign={'center'} fontWeight={'bold'} textColor={'#1a2a52'}>
          {formatTime(in_time)}
        </Text>
      </Td>
      <Td>
        <Text fontSize='lg' textAlign={'center'} fontWeight={'bold'} textColor={'#1a2a52'}>
          {formatTime(out_time)}
        </Text>
      </Td>
      <Td>
        <Text fontSize='lg' textAlign={'center'} fontWeight={'bold'} textColor={'#1a2a52'}>
          {formatTimeFromMinutes(used_minutes)}
        </Text>
      </Td>
      <Td>
        <Text fontSize='lg' textAlign={'center'} fontWeight={'bold'} textColor={'#1a2a52'}>
          {belts > 0 ? <Text fontSize='lg'>{belts}</Text> : ''}
        </Text>
      </Td>
      <Td>
        <Text textAlign={'center'} fontWeight={'bold'} textColor={'#1a2a52'}>
          <Checkbox size={'lg'} borderColor={'black'}
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