import { HStack, Td, Text, Tr, useDisclosure } from '@chakra-ui/react';
// import "react-icons/all";
import ModifyPay from '../modals/ModifyPay';
import { strToLocaleWithoutWeekday } from '../api';
import ProfileAvatar from './ProfileAvatar';

export default function PayHistoryRow(props) {
  const { name, minutes, date, id } = props.data;
  const formatDate = dateStr => {
    return strToLocaleWithoutWeekday(dateStr);
  };
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <>
      <Tr onClick={onOpen}>
        <Td px={0} py={'1vh'}>
          <HStack>
            <ProfileAvatar clickable={false} name={name} />
            <Text fontSize="xl" fontWeight="bold" textAlign={'center'} textColor="#1a2a52">
              {name}
            </Text>
          </HStack>
        </Td>
        <Td px={0} textAlign={'center'}>
          <Text fontSize="lg" fontWeight={'bold'} textAlign={'center'} textColor={'#1a2a52'}>
            {Math.floor(minutes / 60)}시간
          </Text>
        </Td>
        <Td px={0} textAlign={'center'}>
          <Text fontSize={'md'} fontWeight={'bold'} textAlign={'center'} textColor={'#1a2a52'}>
            {formatDate(date)}
          </Text>
        </Td>
        <ModifyPay data={props.data} isOpen={isOpen} onClose={onClose} />
      </Tr>
    </>
  );
}
