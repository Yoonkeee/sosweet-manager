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
import {useQuery, useQueryClient} from "react-query";
import {dogsList} from "../api";

export default function DogsList() {
  const {isLoading, data} = useQuery(["dogs-list"], dogsList);
  console.log(data)
  return (
    <VStack w={'100%'}>
      <Text mt={'2vh'} fontSize={'2xl'} fontWeight={'bold'} textAlign={'center'}>
        등록된 댕댕이 목록~
      </Text>
      <TableContainer w={'100%'}>
        <Table variant='striped' colorScheme='blue' layout={'fixed'}>
          {/*<TableCaption>Imperial to metric conversion factors</TableCaption>*/}
          <Thead w={'100%'} borderBottomColor={'black'} borderBottomWidth={5} textAlign={'center'}>
            {/*<Box w={'100%'}>*/}
            {/*<HStack w={'100%'}>*/}
            {/*<Text></Text>*/}
            {/*<Text></Text>*/}
            {/*</HStack>*/}
            {/*</Box>*/}
            <Tr textAlign={'center'}>
              <Th textAlign={'center'} w={'10%'} fontSize={'xl'}>이름</Th>
              <Th textAlign={'center'} w={'30%'} fontSize={'xl'}>특이사항</Th>
              <Th textAlign={'center'} fontSize={'xl'}>견종</Th>
              <Th textAlign={'center'} px={0} w={'6%'} fontSize={'xl'}>성별</Th>
              <Th textAlign={'center'} w={'20%'} fontSize={'xl'}>전화번호</Th>
              <Th textAlign={'center'} w={'8%'} px={0} fontSize={'xl'}>몸무게</Th>
              <Th textAlign={'center'} fontSize={'xl'}>남은시간</Th>
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