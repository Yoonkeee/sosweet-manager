import {Td, Text, Tr,} from '@chakra-ui/react'
// import "react-icons/all";
import moment from "moment/moment";

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
    </Tr>
  </>)
}