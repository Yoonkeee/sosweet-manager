import {Button, HStack, Td, Text, Tr, useBreakpointValue, useDisclosure,} from '@chakra-ui/react'
import ModifyHistory from "../modals/ModifyHistory";
import {strToLocaleWithoutWeekday} from "../api";
import {Temporal} from "@js-temporal/polyfill";
import ProfileAvatar from "./ProfileAvatar";

export default function HistoryRow(props) {
    const formatDate = (dateStr) => {
        return strToLocaleWithoutWeekday(dateStr);
    };
    const formatTimeFromMinutes = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        const datetime = Temporal.PlainTime.from({hour: hours, minute: mins});
        return datetime.toLocaleString([], {
            hour12: false,
            hour: 'numeric',
            minute: '2-digit',
        });
    };
    const {belts, date, id, in_time, name, out_time, used_minutes} = props.data;
    const {isOpen, onClose, onOpen} = useDisclosure()
    const showUsedTime = useBreakpointValue({base: false, md: true});
    return (<>
        <Tr onClick={onOpen} cursor={'pointer'}>
            <Td px={0} py={'1vh'}>
                <HStack>
                    <ProfileAvatar name={name} />
                <Text fontSize='sm' isTruncated={true} fontWeight='bold' textColor='#1a2a52'>
                    {name}
                </Text>
                </HStack>
            </Td>
            <Td px={0} py={'1vh'} textAlign={'center'}>
                <Text fontSize={'sm'} textAlign={'center'} fontWeight={'bold'} textColor={'#1a2a52'}>
                    {formatDate(date) + ' ' + in_time + '~' + out_time}
                </Text>
            </Td>
            {showUsedTime && <Td px={0} textAlign={'center'}>
                <Text fontSize='sm' textAlign={'center'} fontWeight={'bold'} textColor={'#1a2a52'}>
                    {formatTimeFromMinutes(used_minutes)}
                </Text>
            </Td>}
            <Td px={0} py={'1vh'} textAlign={'center'}>
                <Text fontSize='sm' textAlign={'center'} fontWeight={'bold'} textColor={'red'}>
                    {belts > 0 ? <Text fontSize='sm'>{belts}</Text> : ''}
                </Text>
            </Td>
                <ModifyHistory isOpen={isOpen} onClose={onClose} data={props.data}/>
        </Tr>
    </>)
}