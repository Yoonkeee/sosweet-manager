import {
    Tr,
    Td,
    HStack,
    Text,
    useBreakpointValue,
} from '@chakra-ui/react'
import {useEffect, useState} from "react";
import {formatMinuteToTime} from "../api";

export default function DogsListRow(props) {
    // console.log(props.data);
    let minutes = props.data.remaining_minutes;
    let data = props.data
    let remainingMinutes = props.data.remaining_minutes;
    let formattedDuration = formatMinuteToTime(remainingMinutes);

    const showBreed = useBreakpointValue({base: false, md: true});
    const showGender = useBreakpointValue({base: false, md: true});
    const showPhone = useBreakpointValue({base: false, md: true});
    const showWeight = useBreakpointValue({base: false, md: true});

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