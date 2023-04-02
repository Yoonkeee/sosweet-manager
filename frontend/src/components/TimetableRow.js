import {
  Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Button, HStack, IconButton, Text, useDisclosure, Tooltip,
} from '@chakra-ui/react'
import {MinusIcon, PlusSquareIcon, SearchIcon} from "@chakra-ui/icons";
import {useState} from "react";
// import "react-icons/all";
import {BiPlus} from "react-icons/bi";
import Checkout from "./Checkout";
import ChangeCheckInTime from "./ChangeCheckInTime";

export default function TimetableRow({id, name, in_time, out_time}) {
  const [belts, setBelts] = useState(0);
  const {
    isOpen: isOutOpen, onOpen: onOutOpen, onClose: onOutClose
  } = useDisclosure()
  const {
    isOpen: checkinModIsOpen, onOpen: checkinModOnOpen, onClose: checkinModOnClose
  } = useDisclosure()
  
  return (<>
    <Tr textAlign={'center'}>
      <Td>
        <Text fontSize={'xl'} textAlign={'center'} fontWeight={'bold'} textColor={'1a2a52'}>
          {name}
        </Text>
      </Td>
      <Td textAlign={'center'}>
        <Tooltip hasArrow label='체크인 시간 수정' fontSize={'md'} bg='yellow.300' color='black'>
          <Button fontSize={'xl'} fontWeight={'bold'} textColor={'#1a2a52'} colorScheme={'white'}
                  onClick={checkinModOnOpen}>
            {in_time}
            <ChangeCheckInTime isOpen={checkinModIsOpen} onClose={checkinModOnClose}
            id={id} name={name} in_time={in_time}/>
          </Button>
        </Tooltip>
      </Td>
      <Td textAlign={'center'}>
        <Button position={'inherit'} onClick={onOutOpen} bg={'#1a2a52'} color={'white'}
                fontSize={'md'}
                _hover={{
                  textDecoration: 'none', color: 'white', bg: '#526491', transform: 'scale(1.2)'
                }}>
          체크아웃</Button>
      </Td>
      <Td textAlign={'center'}>
        <HStack justifyContent={'center'}>
          {/*<Text>{() => { if (belts > 0) {return belts}}}</Text>*/}
          <IconButton
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