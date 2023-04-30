import {
    Tr,
    Td,
    Button,
    HStack,
    IconButton,
    Text,
    useDisclosure,
    useBreakpointValue, useBreakpoint,
} from '@chakra-ui/react'
import {MinusIcon} from "@chakra-ui/icons";
import {useEffect, useState} from "react";
// import "react-icons/all";
import {BiPlus} from "react-icons/bi";
import Checkout from "../modals/Checkout";
import ChangeCheckInTime from "../modals/ChangeCheckInTime";
import {setBelt} from "../api";
import DogInfo from "../modals/DogInfo";
import {useQueryClient} from "react-query";

export default function TimetableRow(props) {
    // console.log('in timetable row')
    // console.log(props.data)
    const {id, name, in_time, out_time, belts: loaded_belts, date} = props.data
    const [belts, setBelts] = useState(loaded_belts)
    const {
        isOpen: isOutOpen, onOpen: onOutOpen, onClose: onOutClose
    } = useDisclosure()
    const {
        isOpen: checkinModIsOpen, onOpen: checkinModOnOpen, onClose: checkinModOnClose
    } = useDisclosure()
    const queryClient = useQueryClient()
    useEffect(() => {
        if (belts)
            // console.log('belts effected')
        // console.log(belts)
        setBelt([id, belts])
        queryClient.refetchQueries(["timetable", date])
    }, [belts]);
    const breakpoint = useBreakpoint({ssr: false})
    const buttonSize = useBreakpointValue({base: 'xs', md: 'md'}, {ssr: false})
    const beltButtonSize = useBreakpointValue({base: 'sm', md: 'md'}, {ssr: false})
    const [nameColor, setNameColor] = useState('#1a2a52')
    useEffect(() => {
        if (props.data.remaining_minutes < 0) {
            setNameColor('#ff7f50')
        }
    }, [props.data.remaining_minutes]);
    const {isOpen: dogInfoModIsOpen, onClose: dogInfoModOnClose, onOpen: dogInfoModOnOpen} = useDisclosure();
    return (<>
        <Tr textAlign={'center'}>
            <Td px={0} textAlign={'center'}>
                <Button fontSize={'xl'} px={0} w={'80%'} fontWeight={'bold'} textColor={nameColor} colorScheme={'white'}
                        onClick={dogInfoModOnOpen}
                        size={buttonSize}>
                    {name}
                </Button>
            </Td>
            <Td px={0} textAlign={'center'}>
                <Button fontSize={'xl'} px={0} w={'80%'} fontWeight={'bold'} textColor={nameColor} colorScheme={'white'}
                        onClick={checkinModOnOpen}
                        size={buttonSize}>
                    {in_time}
                    <ChangeCheckInTime isOpen={checkinModIsOpen} onClose={checkinModOnClose}
                                       id={id} name={name} in_time={in_time} in_or_out={'in'}/>
                </Button>
            </Td>
            <Td p={0} textAlign={'center'} h={'100%'}>
                <Button position={'inherit'} onClick={onOutOpen} bg={'#1a2a52'} color={'white'}
                        fontSize={'md'}
                        h={'4vh'}
                        w={'80%'}
                        size={buttonSize}

                        _hover={{
                            textDecoration: 'none', color: 'white', bg: '#526491', transform: 'scale(1.2)'
                        }}>
                    퇴장</Button>
            </Td>
            <Td textAlign={'center'} px={0}>
                <HStack justifyContent={'center'}>
                    {/*<Text>{() => { if (belts > 0) {return belts}}}</Text>*/}
                    <IconButton
                        mr={'0.5vw'}
                        size={beltButtonSize}
                        position={'inherit'}
                        onClick={() => {
                            if (belts > 0) setBelts(belts - 1)
                        }}
                        colorScheme='red'
                        aria-label='Search database'
                        icon={<MinusIcon/>}
                        _hover={{
                            textDecoration: 'none', transform: 'scale(1.2)'
                        }}
                    />
                    <IconButton
                        size={beltButtonSize}
                        position={'inherit'}
                        onClick={() => {
                            setBelts(belts + 1)
                        }}
                        bg={'#1a2a52'} color={'white'}
                        aria-label='Search database'
                        fontSize={'2xl'}
                        icon={<BiPlus/>}
                        _hover={{
                            textDecoration: 'none', color: 'white', bg: '#526491', transform: 'scale(1.2)'
                        }}
                    />
                </HStack>
            </Td>
            <Td textAlign={'center'} fontSize={'lg'} fontWeight={'extrabold'} p={0}>
                {belts > 0 ? <Text>{belts}</Text> : ''}
            </Td>
        </Tr>
        {/*name, in_time, out_time*/}
        <Checkout isOpen={isOutOpen} onClose={onOutClose} id={id}
                  name={name} in_time={in_time} belts={belts}
        />
        {dogInfoModIsOpen ? <DogInfo isOpen={dogInfoModIsOpen} onClose={dogInfoModOnClose}
                  name={name}/> : ''}
    </>)
}