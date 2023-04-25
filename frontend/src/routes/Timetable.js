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
import {useEffect, useState} from "react";
import {useQuery, useQueryClient} from "react-query";
import {dogsList, getCheckoutTimetable, getTimeTable, notOutTimetable, strToLocaleWithoutWeekday} from "../api";
import {tomorrow, yesterday, setToday, getTemporal, makeTemporal} from "../store";
import CheckoutTimetableRow from "../components/CheckoutTimetableRow";
import {Temporal} from "@js-temporal/polyfill";

export default function Timetable() {
    let date = makeTemporal(useSelector((state) => state.currentDate))
    const dispatch = useDispatch();
    let formattedDate = date.toLocaleString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' });
    const {isLoading, data} = useQuery(["timetable", date], getTimeTable);
    const {
        isLoading: checkoutIsLoading,
        data: checkoutData
    } = useQuery(['checkoutTimetable', date], getCheckoutTimetable);
    const {isLoading: notOutIsLoading, data: notOutData} = useQuery("notOut", notOutTimetable);
    const queryClient = useQueryClient();
    const toast = useToast();
    const toastId = 'notOutToast'
    // notout 체크아웃 리페치
    useEffect(() => {
        toast.closeAll()
        if (notOutData && notOutData.length > 0) {
            toast({
                // id: toastId + Temporal.Now.instant.toString(),
                title: "체크아웃 하지 않은 댕댕이가 있습니다.",
                description: notOutData.map((notOut) => {
                    let notOutDate = strToLocaleWithoutWeekday(notOut.date)
                    return <Text>{notOutDate} {notOut.name}</Text>
                }),
                status: "warning",
                duration: 700,
                isClosable: true,
                position: 'top'
            })
        }
        queryClient.refetchQueries('notOut')
    }, [date]);
    useEffect(() => {
        dispatch(setToday());
        queryClient.refetchQueries('notOut')
    }, []);
    useEffect(() => {
        // console.log('checkoutData: ', checkoutData);
    }, [checkoutData]);

    return (
        <VStack w={'100%'} mt={'2vh'} mb={'10vh'}>
            <HStack w={'100%'} justifyContent={'center'}>
                <IconButton rounded={'xl'} w={'6%'} h={'80%'} bg={'#1a2a52'} color={'white'} isRound={true}
                            position={'inherit'}
                            _hover={{
                                textDecoration: 'none',
                                color: 'white',
                                bg: '#526491',
                                rounded: 'xl',
                                transform: 'scale(1.2)'
                            }} aria-label={''} icon={
                    <ArrowBackIcon fontSize={'3xl'} fontWeight={'extrabold'}/>}
                            onClick={() => {
                                dispatch(yesterday())
                                // console.log(date)
                                queryClient.refetchQueries(["timetable"]);
                            }}
                />
                <Text mt={'2vh'} fontSize={'2xl'} fontWeight={'bold'} marginX={'10px'} textAlign={'center'}
                      id={'formattedNowDateTimetable'}>
                    {formattedDate}
                </Text>
                <IconButton rounded={'xl'} w={'6%'} h={'80%'} bg={'#1a2a52'} color={'white'} isRound={true}
                            position={'inherit'}
                            _hover={{
                                textDecoration: 'none',
                                color: 'white',
                                bg: '#526491',
                                rounded: 'xl',
                                transform: 'scale(1.2)'
                            }} aria-label={''} icon={
                    <ArrowForwardIcon fontSize={'3xl'} fontWeight={'extrabold'}/>}
                            onClick={() => {
                                dispatch(tomorrow())
                                // console.log(date)
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
                                data={item}
                                key={item.id}
                                // len={data.length}
                            />
                        ))}
                        {data && data.length !== 0 && checkoutData && checkoutData.length !== 0 &&
                            <Tr borderY="2px solid"><Td p={'3vh'}/><Td p={'3vh'}/><Td p={'3vh'}/><Td p={'3vh'}/><Td
                                p={'3vh'}/></Tr>}
                        {checkoutData && checkoutData.map((item) => (
                        // {checkoutData && checkoutData.length !== 0 && checkoutData.map((item) => (
                            <CheckoutTimetableRow
                                data={item}
                                key={item.id}
                                // len={checkoutData.length}
                            />
                        ))
                        }
                    </Tbody>
                </Table>
            </TableContainer>
        </VStack>
    );
}