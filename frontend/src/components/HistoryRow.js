import {Button, Td, Text, Tr, useDisclosure,} from '@chakra-ui/react'
// import "react-icons/all";
import moment from "moment/moment";
import ModifyHistory from "../modals/ModifyHistory";

export default function HistoryRow(data) {
  console.log('in history row');
  console.log(data);
  const formatDate = (dateStr) => {
    return moment.utc(dateStr, 'YYYY-MM-DD').format('M월 D일')
  };
  const formatTime = (timeStr) => {
    return moment(timeStr, 'YYYY-MM-DDTHH:mm:ss').format('HH:mm');
  };
  const formatTimeFromMinutes = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return moment().startOf('day').add(hours, 'hours').add(mins, 'minutes').format('HH:mm');
  };
  const {belts, checked, checked_date, date, id, in_time, name, out_time, used_minutes} = data;
  const {isOpen, onClose, onOpen} = useDisclosure()
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
          {formatTimeFromMinutes(used_minutes)}
        </Text>
      </Td>
      <Td>
        <Text fontSize='lg' textAlign={'center'} fontWeight={'bold'} textColor={'#1a2a52'}>
          {belts > 0 ? <Text fontSize='lg'>{belts}</Text> : ''}
        </Text>
      </Td>
      <Td>
        {checked ?
          <Text fontSize='lg' textAlign={'center'} fontWeight={'bold'} textColor={'#1a2a52'}>
            {formatDate(checked_date)}
          </Text>
          : (<></>)}
      </Td>
      <Td>
        <Button position={'inherit'} onClick={onOpen} bg={'#1a2a52'} color={'white'}
                fontSize={'md'}
                _hover={{
                  textDecoration: 'none', color: 'white', bg: '#526491', transform: 'scale(1.2)'
                }}>
          수정하기</Button>
        <ModifyHistory isOpen={isOpen} onClose={onClose} data={data}/>
      </Td>
    </Tr>
  </>)
}