import {
  HStack,
  IconButton,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
} from '@chakra-ui/react';
import TimetableRow from '../components/TimetableRow';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { getCheckoutTimetable, getTimeTable, notOutTimetable, strToLocaleWithoutWeekday } from '../api';
import { makeTemporal, setToday, tomorrow, yesterday } from '../store';
import CheckoutTimetableRow from '../components/CheckoutTimetableRow';

export default function Timetable() {
  let date = makeTemporal(useSelector(state => state.currentDate));
  const dispatch = useDispatch();
  let formattedDate = date.toLocaleString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
  const { isLoading, data } = useQuery(['timetable', date], getTimeTable);
  const { isLoading: checkoutIsLoading, data: checkoutData } = useQuery(
    ['checkoutTimetable', date],
    getCheckoutTimetable,
  );
  const { isLoading: notOutIsLoading, data: notOutData } = useQuery('notOut', notOutTimetable);
  const queryClient = useQueryClient();
  const toast = useToast();
  const toastId = 'notOutToast';
  // notout 체크아웃 리페치
  useEffect(() => {
    if (notOutData && notOutData.length > 0) {
      toast.closeAll();
      toast({
        // id: toastId + Temporal.Now.instant.toString(),
        title: '체크아웃 하지 않은 댕댕이가 있습니다.',
        description:
          notOutData &&
          notOutData.map(notOut => {
            let notOutDate = strToLocaleWithoutWeekday(notOut.date);
            return (
              <Text>
                {notOutDate} {notOut.name}
              </Text>
            );
          }),
        status: 'warning',
        duration: 700,
        isClosable: true,
        position: 'top',
      });
    }
  }, [date]);
  useEffect(() => {
    dispatch(setToday());
    queryClient.refetchQueries('notOut');
  }, []);
  return (
    <VStack mb={'10vh'} minH={'80vh'} mt={'2vh'} w={'100%'}>
      <HStack justifyContent={'center'} w={'100%'}>
        <IconButton
          _hover={{
            textDecoration: 'none',
            color: 'white',
            bg: '#526491',
            rounded: 'xl',
            transform: 'scale(1.2)',
          }}
          aria-label={''}
          bg={'#1a2a52'}
          color={'white'}
          h={'80%'}
          icon={<ArrowBackIcon fontSize={'3xl'} fontWeight={'extrabold'} />}
          isRound={true}
          onClick={() => {
            dispatch(yesterday());
            queryClient.refetchQueries('notOut');
            queryClient.refetchQueries(['checkoutTimetable', date]);
            queryClient.refetchQueries(['timetable', date]);
          }}
          position={'inherit'}
          rounded={'xl'}
          w={'6%'}
        />
        <Text
          fontSize={'2xl'}
          fontWeight={'bold'}
          id={'formattedNowDateTimetable'}
          marginX={'10px'}
          mt={'2vh'}
          textAlign={'center'}
        >
          {formattedDate}
        </Text>
        <IconButton
          _hover={{
            textDecoration: 'none',
            color: 'white',
            bg: '#526491',
            rounded: 'xl',
            transform: 'scale(1.2)',
          }}
          aria-label={''}
          bg={'#1a2a52'}
          color={'white'}
          h={'80%'}
          icon={<ArrowForwardIcon fontSize={'3xl'} fontWeight={'extrabold'} />}
          isRound={true}
          onClick={() => {
            dispatch(tomorrow());
            queryClient.refetchQueries('notOut');
            queryClient.refetchQueries(['checkoutTimetable', date]);
            queryClient.refetchQueries(['timetable', date]);
          }}
          position={'inherit'}
          rounded={'xl'}
          w={'6%'}
        />
      </HStack>
      {isLoading || checkoutIsLoading || notOutIsLoading ? (
        <Skeleton minH="80vh" minW="100vw" />
      ) : (
        <TableContainer w={'100%'}>
          <Table colorScheme="blue" layout={'fixed'} variant="striped">
            <Thead borderBottomColor={'black'} borderBottomWidth={5} textAlign={'center'} w={'100%'}>
              <Tr textAlign={'center'}>
                <Td fontSize={'xl'} px={0} textAlign={'center'} w={'40%'}>
                  이름
                </Td>
                <Th fontSize={'xl'} px={0} textAlign={'center'} w={'20%'}>
                  입장
                </Th>
                <Th fontSize={'xl'} px={0} textAlign={'center'} w={'20%'}>
                  퇴장
                </Th>
                <Th fontSize={'xl'} px={0} textAlign={'center'} w={'20%'}>
                  벨트
                </Th>
                {/*<Th textAlign={'center'} px={0} fontSize={'xl'} w={'7vw'}>갯수</Th>*/}
              </Tr>
            </Thead>
            <Tbody>
              {data &&
                data?.map(item => (
                  <TimetableRow
                    data={item}
                    key={item.id}
                    // len={data.length}
                  />
                ))}
              {data?.length !== 0 && checkoutData && checkoutData.length !== 0 && (
                <Tr borderY="2px solid">
                  <Td p={'3vh'} />
                  <Td p={'3vh'} />
                  <Td p={'3vh'} />
                  <Td p={'3vh'} />
                </Tr>
              )}
              {checkoutData &&
                checkoutData?.map(item => (
                  // {checkoutData && checkoutData.length !== 0 && checkoutData.map((item) => (
                  <CheckoutTimetableRow
                    data={item}
                    key={item.id}
                    // len={checkoutData.length}
                  />
                ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </VStack>
  );
}
