import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer, Box, Text, HStack, VStack, Button, IconButton, useToast,
} from '@chakra-ui/react'
import TimetableRow from "../components/TimetableRow";
import {ArrowBackIcon, ArrowForwardIcon} from "@chakra-ui/icons";
import {useSelector, useDispatch} from "react-redux";
import moment, {now} from "moment/moment";
import 'moment/locale/ko'
import {useEffect, useState} from "react";
import {useQuery, useQueryClient} from "react-query";
import {dogsList, getTimeTable, notOutTimetable} from "../api";
import {tomorrow, yesterday, today, setToday} from "../store";

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
  const {isLoading: notOutIsLoading, data: notOutData} = useQuery("notOut", notOutTimetable);
  console.log(data)
  const queryClient = useQueryClient();
  const toast = useToast();
  console.log(notOutData)
  const toastId = 'notOutToast'
  useEffect(() => {
    toast.closeAll()
    if (notOutData && notOutData.length > 0) {
      // if (toast.isActive(toastId))
      //   toast.close(toastId);
        toast({
          id: toastId,
          title: "체크아웃 하지 않은 댕댕이가 있습니다.",
          description: notOutData.map((notOut) => {
            let month = moment.utc(notOut.date, 'YYYY-MM-DD').format('M');
            let day = moment.utc(notOut.date, 'YYYY-MM-DD').format('D');
            // if(parseInt(month) !== todayMonth || parseInt(day) !== todayDate)
              return <Text>{month}월 {day}일 {notOut.name}</Text>
          }),
          status: "warning",
          duration: 2500,
          isClosable: true,
          position: 'center'
        })
      }
  }, [formattedDate]);
  useEffect(() => {
    dispatch(setToday());
  }, []);

  return (
    <VStack w={'100%'} mt={'2vh'} mb={'10vh'}>
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
        <Text mt={'2vh'} fontSize={'2xl'} fontWeight={'bold'} marginX={'10px'} textAlign={'center'} id={'formattedNowDate'}>
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
              <Td textAlign={'center'} px={0} fontSize={'xl'} w={'20vw'}>이름</Td>
              <Th textAlign={'center'} px={0} fontSize={'xl'} w={'15vw'}>입장시간</Th>
              <Th textAlign={'center'} px={0} fontSize={'xl'} w={'15vw'}>퇴장하기</Th>
              <Th textAlign={'center'} px={0} fontSize={'xl'} w={'15vw'}>매너벨트</Th>
              <Th textAlign={'center'} px={0} fontSize={'xl'} w={'10vw'}>갯수</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data && data.map((item) => (
              <TimetableRow
                id={item.id}
                name={item.name}
                in_time={item.in_time}
                loaded_belts={item.belts}
              />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
}