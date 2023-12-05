import {
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import DogsListRow from '../components/DogsListRow';
import { dogsList } from '../api';

export default function DogsList() {
  const { isLoading, data } = useQuery(['dogs-list'], dogsList, { cacheTime: 0 });
  // console.log(data)
  const showBreed = useBreakpointValue({ base: false, md: true });
  const showGender = useBreakpointValue({ base: false, md: true });
  const showPhone = useBreakpointValue({ base: false, md: true });
  const showWeight = useBreakpointValue({ base: false, md: true });
  const nameWidth = useBreakpointValue({ base: '35vw', md: '10vw' });
  const noteWidth = useBreakpointValue({ base: '50vw', md: '30vw' });
  const remainingWidth = useBreakpointValue({ base: '15vw', md: '10vw' });
  return (
    <VStack mb="10vh" mt="2vh" w="100%">
      <Text fontSize="3xl" fontWeight="extrabold" mt="1vh" textAlign="center">
        🥰쏘스윗 댕댕이 목록🥰
      </Text>
      <TableContainer overflowX="unset" overflowY="unset" w="100%">
        <Table colorScheme="blue" layout="fixed" variant="striped">
          <Thead
            borderBottomColor="black"
            borderBottomWidth={5}
            position="sticky"
            textAlign="center"
            top={0}
            w="100%"
            zIndex="docked"
          >
            <Tr position="sticky" textAlign="center" top={0}>
              <Th fontSize="xl" px={0} textAlign="center" w={nameWidth}>
                이름
              </Th>
              <Th fontSize="xl" px={0} textAlign="center" w={noteWidth}>
                특이사항
              </Th>
              {showBreed && (
                <Th fontSize="xl" px={0} textAlign="center" w="10vw">
                  견종
                </Th>
              )}
              {showGender && (
                <Th fontSize="xl" px={0} textAlign="center" w="6vw">
                  성별
                </Th>
              )}
              {showPhone && (
                <Th fontSize="xl" px={0} textAlign="center" w="20vw">
                  전화번호
                </Th>
              )}
              {showWeight && (
                <Th fontSize="xl" px={0} textAlign="center" w="8vw">
                  몸무게
                </Th>
              )}
              <Th fontSize="md" px={0} textAlign="center" w={remainingWidth}>
                남은시간
              </Th>
            </Tr>
          </Thead>
          <Tbody>{isLoading ? '' : data.map(dogData => <DogsListRow data={dogData} />)}</Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
}
