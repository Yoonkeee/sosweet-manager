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
    useBreakpointValue, useBreakpoint,
} from '@chakra-ui/react'
import {MinusIcon, PlusSquareIcon, SearchIcon} from "@chakra-ui/icons";
import {useEffect, useState} from "react";
// import "react-icons/all";
import {BiPlus} from "react-icons/bi";
import Checkout from "../modals/Checkout";
import ChangeCheckInTime from "../modals/ChangeCheckInTime";
import {setBelt} from "../api";

export default function TimetableRow({id, name, in_time, out_time, loaded_belts}) {
    const [belts, setBelts] = useState(loaded_belts)
    const {
        isOpen: isOutOpen, onOpen: onOutOpen, onClose: onOutClose
    } = useDisclosure()
    const {
        isOpen: checkinModIsOpen, onOpen: checkinModOnOpen, onClose: checkinModOnClose
    } = useDisclosure()
    useEffect(() => {
        setBelt([id, belts])
    }, [belts]);
    const breakpoint = useBreakpoint({ssr: false})
    const buttonSize = useBreakpointValue({base: 'xs', md: 'md'}, {ssr: false})
    const beltButtonSize = useBreakpointValue({base: 'sm', md: 'md'}, {ssr: false})
    return (<>
        <Tr textAlign={'center'}>
            <Td px={0}>
                <Text fontSize={'xl'} textAlign={'center'} fontWeight={'bold'} textColor={'#1a2a52'}>
                    {name}
                </Text>
            </Td>
            <Td px={0} textAlign={'center'}>
                {/* TODO: 모바일에서 툴팁이 사라지지 않음 */}
                <Button fontSize={'xl'} px={0} w={'80%'} fontWeight={'bold'} textColor={'#1a2a52'} colorScheme={'white'}
                        onClick={checkinModOnOpen}
                        size={buttonSize}>
                    {in_time}
                    <ChangeCheckInTime isOpen={checkinModIsOpen} onClose={checkinModOnClose}
                                       id={id} name={name} in_time={in_time}/>
                </Button>
            </Td>
            <Td px={0} textAlign={'center'}>
                <Button position={'inherit'} onClick={onOutOpen} bg={'#1a2a52'} color={'white'}
                        fontSize={'md'}
                        size={buttonSize}

                        _hover={{
                            textDecoration: 'none', color: 'white', bg: '#526491', transform: 'scale(1.2)'
                        }}>
                    체크아웃</Button>
            </Td>
            <Td textAlign={'center'} px={0}>
                <HStack justifyContent={'center'}>
                    {/*<Text>{() => { if (belts > 0) {return belts}}}</Text>*/}
                    <IconButton
                        mr={'1vw'}
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
            <Td textAlign={'center'} fontSize={'lg'}>
                {belts > 0 ? <Text>{belts}</Text> : ''}
            </Td>
        </Tr>
        {/*name, in_time, out_time*/}
        <Checkout isOpen={isOutOpen} onClose={onOutClose} id={id}
                  name={name} in_time={in_time} belts={belts}
        />
    </>)
}