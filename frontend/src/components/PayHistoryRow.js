import {Button, HStack, Td, Text, Tr, useDisclosure,} from '@chakra-ui/react'
// import "react-icons/all";
import ModifyPay from "../modals/ModifyPay";
import {strToLocaleWithoutWeekday} from "../api";
import ProfileAvatar from "./ProfileAvatar";

export default function PayHistoryRow(props) {
    const {name, minutes, date, id} = props.data;
    const formatDate = (dateStr) => {
        return strToLocaleWithoutWeekday(dateStr)
    };
    const {isOpen, onClose, onOpen} = useDisclosure()
    return (<>
        <Tr onClick={onOpen}>
            <Td px={0} py={'1vh'}>
                <HStack>
                    <ProfileAvatar name={name}/>
                    <Text textAlign={'center'} fontSize='xl' fontWeight='bold' textColor='#1a2a52'>
                        {name}
                    </Text>
                </HStack>
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
            <ModifyPay isOpen={isOpen} onClose={onClose} data={props.data}/>
        </Tr>
    </>)
}