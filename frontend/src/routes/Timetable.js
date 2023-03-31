import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer, Box, Text, HStack, VStack, Button, IconButton,
} from '@chakra-ui/react'
import TimetableRow from "../components/TimetableRow";
import {ArrowBackIcon, ArrowForwardIcon} from "@chakra-ui/icons";
import {useSelector} from "react-redux";
import moment from "moment/moment";
import 'moment/locale/ko'

export default function Timetable() {
  let nowDate = new Date();
  const options = {
    // year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  };
  let date = useSelector((state) => state.currentDate);
  let formattedDate = moment.utc(date, 'YYYYMMDD').format('M월 D일 dddd');
  return (
    <VStack w={'100%'}>
      <HStack w={'100%'} justifyContent={'center'}>
        <IconButton rounded={'xl'} w={'10%'} bg={'#1a2a52'} color={'white'} isRound={true} position={'inherit'}
                    _hover={{
                    textDecoration: 'none', color: 'white', bg: '#526491', rounded: 'xl', transform: 'scale(1.2)'
                  }}  aria-label={''} icon={<ArrowBackIcon />}/>
        <Text mt={'2vh'} fontSize={'2xl'} fontWeight={'bold'} textAlign={'center'} id={'formattedNowDate'}>
          {formattedDate}
        </Text>
        <IconButton rounded={'xl'} w={'10%'} bg={'#1a2a52'} color={'white'} isRound={true} position={'inherit'}
                    _hover={{
                      textDecoration: 'none', color: 'white', bg: '#526491', rounded: 'xl', transform: 'scale(1.2)'
                    }}  aria-label={''} icon={<ArrowForwardIcon />}/>
      </HStack>
      <TableContainer w={'100%'}>
        <Table variant='striped' colorScheme='blue'>
          {/*<TableCaption>Imperial to metric conversion factors</TableCaption>*/}
          <Thead w={'100%'} borderBottomColor={'black'} borderBottomWidth={5} textAlign={'center'}>
            {/*<Box w={'100%'}>*/}
            {/*<HStack w={'100%'}>*/}
            {/*<Text></Text>*/}
            {/*<Text></Text>*/}
            {/*</HStack>*/}
            {/*</Box>*/}
            <Tr textAlign={'center'}>
              <Td textAlign={'center'} fontSize={'xl'}>이름</Td>
              <Th textAlign={'center'} fontSize={'xl'}>입장시간</Th>
              <Th textAlign={'center'} fontSize={'xl'}>퇴장하기</Th>
              <Th textAlign={'center'} fontSize={'xl'}>매너벨트</Th>
              <Th textAlign={'center'} fontSize={'xl'}>갯수</Th>
            </Tr>
          </Thead>
          <Tbody>
            <TimetableRow/>
            <TimetableRow/>
            <TimetableRow/>
            <TimetableRow/>
            <TimetableRow/>
            <TimetableRow/>
            <TimetableRow/>
            <TimetableRow/>
            <TimetableRow/>
            <TimetableRow/>
            <TimetableRow/>
            <TimetableRow/>
            <TimetableRow/>
            <TimetableRow/>
            <TimetableRow/>
            <TimetableRow/>
            <TimetableRow/>
            <TimetableRow/>
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
}