import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer, Text, VStack, useBreakpointValue,
} from '@chakra-ui/react'
import DogsListRow from "../components/DogsListRow";
import {useQuery} from "react-query";
import {dogsList} from "../api";

export default function DogsList() {
  const {isLoading, data} = useQuery(["dogs-list"], dogsList, { cacheTime: 0 });
  // console.log(data)
  const showBreed = useBreakpointValue({ base: false, md: true });
  const showGender = useBreakpointValue({ base: false, md: true });
  const showPhone = useBreakpointValue({ base: false, md: true });
  const showWeight = useBreakpointValue({ base: false, md: true });
  const nameWidth = useBreakpointValue({ base: '35vw', md: '10vw' });
  const noteWidth = useBreakpointValue({ base: '50vw', md: '30vw' });
  const remainingWidth = useBreakpointValue({ base: '15vw', md: '10vw' });
  return (
    <VStack w={'100%'} mt={'2vh'} mb={'10vh'}>
      <Text mt={'1vh'} fontSize={'3xl'} fontWeight={'extrabold'} textAlign={'center'}>
        🥰쏘스윗 댕댕이 목록🥰
      </Text>
      <TableContainer w={'100%'} overflowX="unset" overflowY="unset">
        <Table variant='striped' colorScheme='blue' layout={'fixed'}>
          <Thead w={'100%'} borderBottomColor={'black'} borderBottomWidth={5} textAlign={'center'}
                 position={'sticky'} top={0} zIndex="docked">
            <Tr textAlign={'center'} position={'sticky'} top={0}>
              <Th textAlign={'center'} w={nameWidth} px={0} fontSize={'xl'}>이름</Th>
              <Th textAlign={'center'} w={noteWidth} px={0} fontSize={'xl'}>특이사항</Th>
              {showBreed && <Th textAlign={'center'} w={'10vw'} px={0} fontSize={'xl'}>견종</Th>}
              {showGender && <Th textAlign={'center'} w={'6vw'} px={0} fontSize={'xl'}>성별</Th>}
              {showPhone && <Th textAlign={'center'} w={'20vw'} px={0} fontSize={'xl'}>전화번호</Th>}
              {showWeight && <Th textAlign={'center'} w={'8vw'} px={0} fontSize={'xl'}>몸무게</Th>}
              <Th textAlign={'center'} w={remainingWidth} px={0} fontSize={'md'}>남은시간</Th>
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