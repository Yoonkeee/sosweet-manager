import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer, Box, Text, HStack, VStack,
} from '@chakra-ui/react'
import TimetableRow from "../components/TimetableRow";

export default function Timetable() {
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
      <Text mt={'2vh'} fontSize={'2xl'} fontWeight={'bold'} textAlign={'center'}>
        {formattedDate}
      </Text>
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