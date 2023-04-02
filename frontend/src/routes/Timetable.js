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
import {useSelector, useDispatch} from "react-redux";
import moment from "moment/moment";
import 'moment/locale/ko'
import {useState} from "react";
import {useQuery, useQueryClient} from "react-query";
import {dogsList, getTimeTable} from "../api";
import {tomorrow, yesterday} from "../store";

export default function Timetable() {
  let nowDate = new Date();
  const options = {
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  };
  let date = useSelector((state) => state.currentDate);
  const dispatch = useDispatch();
  let formattedDate = moment.utc(date, 'YYYY-MM-DD').format('M월 D일 dddd');
  const {isLoading, data} = useQuery(["timetable", date], getTimeTable);
  console.log(data)
  const queryClient = useQueryClient();
  
  return (
    <VStack w={'100%'}>
      <HStack w={'100%'} justifyContent={'center'}>
        <IconButton rounded={'xl'} w={'6%'} h={'80%'} bg={'#1a2a52'} color={'white'} isRound={true} position={'inherit'}
                    _hover={{
                    textDecoration: 'none', color: 'white', bg: '#526491', rounded: 'xl', transform: 'scale(1.2)'
                  }}  aria-label={''} icon={
          <ArrowBackIcon fontSize={'3xl'} fontWeight={'extrabold'}/>}
          onClick={() => {
            dispatch(yesterday())
            console.log(date)
            queryClient.refetchQueries(["timetable"]);
          }}
        />
        <Text mt={'2vh'} fontSize={'2xl'} fontWeight={'bold'} w={'25%'} textAlign={'center'} id={'formattedNowDate'}>
          {formattedDate}
        </Text>
        <IconButton rounded={'xl'} w={'6%'} h={'80%'} bg={'#1a2a52'} color={'white'} isRound={true} position={'inherit'}
                    _hover={{
                      textDecoration: 'none', color: 'white', bg: '#526491', rounded: 'xl', transform: 'scale(1.2)'
                    }}  aria-label={''} icon={
          <ArrowForwardIcon  fontSize={'3xl'} fontWeight={'extrabold'}/>}
                    onClick={() => {
                      dispatch(tomorrow())
                      console.log(date)
                    }}
        />
      </HStack>
      <TableContainer w={'100%'}>
        <Table variant='striped' colorScheme='blue' layout={'fixed'}>
          <Thead w={'100%'} borderBottomColor={'black'} borderBottomWidth={5} textAlign={'center'}>
            <Tr textAlign={'center'}>
              <Td textAlign={'center'} fontSize={'xl'} w={'20%'}>이름</Td>
              <Th textAlign={'center'} fontSize={'xl'} w={'20%'}>입장시간</Th>
              <Th textAlign={'center'} fontSize={'xl'} w={'20%'}>퇴장하기</Th>
              <Th textAlign={'center'} fontSize={'xl'} w={'30%'}>매너벨트</Th>
              <Th textAlign={'center'} fontSize={'xl'} w={'10%'}>갯수</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data && data.map((item) => (
              <TimetableRow
                id={item.id}
                name={item.name}
                in_time={item.in_time}
                // belts={item.belts}
              />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
}