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
import DogsListRow from "../components/DogsListRow";
import {useQuery} from "react-query";
import {dogsList} from "../api";

export default function DogsList() {
  const {isLoading, data} = useQuery(["dogsList"], dogsList);
  console.log(data)
  return (
    <VStack w={'100%'}>
      <Text mt={'2vh'} fontSize={'2xl'} fontWeight={'bold'} textAlign={'center'}>
        등록된 댕댕이 목록~
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
              <Th textAlign={'center'} fontSize={'xl'}>특이사항</Th>
              <Th textAlign={'center'} fontSize={'xl'}>견종</Th>
              <Th textAlign={'center'} fontSize={'xl'}>성별</Th>
              <Th textAlign={'center'} fontSize={'xl'}>전화번호</Th>
              <Th textAlign={'center'} fontSize={'xl'}>몸무게</Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLoading? '' : (data.map((dogData) => (<DogsListRow data={dogData}/>)))}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
}