import {Button, Td, Text, Tr, useDisclosure,} from '@chakra-ui/react'
// import "react-icons/all";
import moment from "moment/moment";
import ModifyHistory from "../modals/ModifyHistory";
import ModifyPay from "../modals/ModifyPay";

export default function PayHistoryRow(props) {
  console.log(props.data);
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
  const {name, minutes, date, id} = props.data;
  const {isOpen, onClose, onOpen} = useDisclosure()
  return (<>
    <Tr>
      <Td>
        <Text textAlign={'center'} fontSize='xl' fontWeight='bold' textColor='#1a2a52'>
          {name}
        </Text>
      </Td>
      <Td px={0} textAlign={'center'}>
        <Text fontSize='lg' textAlign={'center'} fontWeight={'bold'} textColor={'#1a2a52'}>
          {Math.floor(minutes / 60)}시간
        </Text>
      </Td>
      <Td px={0} textAlign={'center'}>
        <Text fontSize={'md'} textAlign={'center'} fontWeight={'bold'} textColor={'#1a2a52'}>
          {formatDate(date)}
        </Text>
      </Td>
      <Td px={0} py={2} textAlign={'center'}>
        <Button position={'inherit'} onClick={onOpen} bg={'#1a2a52'} color={'white'}
                fontSize={'md'}
                _hover={{
                  textDecoration: 'none', color: 'white', bg: '#526491', transform: 'scale(1.2)'
                }}>
          수정하기</Button>
        <ModifyPay isOpen={isOpen} onClose={onClose} data={props.data}/>
      </Td>
    </Tr>
  </>)
}