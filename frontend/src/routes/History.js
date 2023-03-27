import {Box, HStack, Table, TableContainer, Tbody, Text, Th, Thead, Tr, VStack} from "@chakra-ui/react";
import GetMessageRow from "../components/GetMessageRow";
import HistoryRow from "../components/HistoryRow";

export default function History() {
  let today = new Date();
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  };
  let formattedDate = today.toLocaleDateString('ko-KR', options);
  return (
    <VStack w={'100%'}>
      <Text mt={'2vh'} fontSize={'2xl'} fontWeight={'bold'} textAlign={'center'} textColor={'#1a2a52'}>
        {formattedDate}
      </Text>
      <TableContainer w={'100%'}>
        <Table variant='striped' colorScheme='blue'>
          {/*<TableCaption>Imperial to metric conversion factors</TableCaption>*/}
          <Thead w={'100%'} borderBottomColor={'black'} borderBottomWidth={3} alignItems={'center'}>
            <Tr>
              <Th textAlign={'center'} fontSize={'xl'}>이름</Th>
              <Th textAlign={'center'} fontSize={'xl'}>이용날짜</Th>
              <Th textAlign={'center'} fontSize={'xl'}>입장시간</Th>
              <Th textAlign={'center'} fontSize={'xl'}>퇴장시간</Th>
              <Th textAlign={'center'} fontSize={'xl'}>이용시간</Th>
              <Th textAlign={'center'} fontSize={'xl'}>매너벨트</Th>
            </Tr>
          </Thead>
          <Tbody>
            <HistoryRow/>
            <HistoryRow/>
            <HistoryRow/>
            <HistoryRow/>
            <HistoryRow/>
            <HistoryRow/>
            <HistoryRow/>
            <HistoryRow/>
            <HistoryRow/>
            <HistoryRow/>
            <HistoryRow/>
            <HistoryRow/>
            <HistoryRow/>
            <HistoryRow/>
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
}