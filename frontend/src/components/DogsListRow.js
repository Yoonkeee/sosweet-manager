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
    Tooltip,
    useBreakpointValue, VStack,
} from '@chakra-ui/react'
import {MinusIcon, PlusSquareIcon, SearchIcon} from "@chakra-ui/icons";
import {useEffect, useState} from "react";
// import "react-icons/all";
import {BiPlus} from "react-icons/bi";
import Checkout from "../modals/Checkout";
import ChangeCheckInTime from "../modals/ChangeCheckInTime";
import moment from "moment";
import {formatMinuteToTime} from "../api";

export default function DogsListRow(props) {
    console.log(props.data);
    var minutes = props.data.remaining_minutes;
    var data = props.data
    var remainingMinutes = props.data.remaining_minutes;
    var remainingDuration = moment.utc(Math.abs(remainingMinutes) * 60 * 1000);
    console.log(remainingMinutes)
    console.log(remainingDuration.format('H:mm'))
    var formattedDuration = formatMinuteToTime(remainingMinutes);

    const showBreed = useBreakpointValue({base: false, md: true});
    const showGender = useBreakpointValue({base: false, md: true});
    const showPhone = useBreakpointValue({base: false, md: true});
    const showWeight = useBreakpointValue({base: false, md: true});
    // useEffect(() => {
    //   data = props.data
    //   remainingMinutes = props.data.remaining_minutes;
    //   remainingDuration = moment.utc(Math.abs(remainingMinutes) * 60 * 1000);
    //   formattedDuration = (remainingMinutes < 0 ? '-' : '') + remainingDuration.format('H:mm');
    // }, []);

    const [nameColor, setNameColor] = useState('#1a2a52')
    useEffect(() => {
        if (remainingMinutes < 0) {
            setNameColor('red')
        }
    }, [remainingMinutes]);
    return (<>
        <Tr textAlign={'center'}>
            <Td borderRight="1px solid" borderColor="gray.300" textAlign={'center'} p={2}>
                <Text fontSize={'md'} textAlign={'center'} fontWeight={'semibold'} textColor={'#1a2a52'}>
                    {data.name}
                </Text>
            </Td>
            <Td borderRight="1px solid" borderColor="gray.300" textAlign={'center'} p={2}>
                <HStack fontSize={'md'}  justifyContent={'center'} fontWeight={'semibold'} whiteSpace={'pre-line'}>
                    <Text textColor={'#1a2a52'}>
                        {data.note}
                    </Text>
                        <Text textColor={'darkgreen'}>{data.weight ? '   ' + data.weight + (data.weight.includes('kg') ? '' : 'kg') : ''}</Text>
                </HStack>
            </Td>
            {showBreed && <Td borderRight="1px solid" borderColor="gray.300" textAlign={'center'} p={0}>
                <Text fontSize={'md'} textAlign={'center'} fontWeight={'semibold'} textColor={'#1a2a52'}>
                    {data.breed}
                </Text>
            </Td>}
            {showGender && <Td borderRight="1px solid" borderColor="gray.300" textAlign={'center'} p={2}>
                <Text fontSize={'md'} textAlign={'center'} fontWeight={'semibold'} textColor={'#1a2a52'}>
                    {data.gender}
                </Text>
            </Td>}
            {showPhone && <Td borderRight="1px solid" borderColor="gray.300" textAlign={'center'} p={2}>
                <Text fontSize={'md'} textAlign={'center'} fontWeight={'semibold'} textColor={'#1a2a52'}>
                    {data.phone}
                </Text>
            </Td>}
            {showWeight && <Td borderRight="1px solid" borderColor="gray.300" textAlign={'center'} p={2}>
                <Text fontSize={'md'} textAlign={'center'} fontWeight={'semibold'} textColor={'#1a2a52'}>
                    {data.weight}
                </Text>
            </Td>}
            <Td borderRight="1px solid" borderColor="gray.300" textAlign={'center'} p={2}>
                <Text fontSize={'md'} textAlign={'center'} fontWeight={'semibold'} textColor={nameColor}>
                    {formattedDuration}
                </Text>
            </Td>
        </Tr>
    </>)
}