import {
  Box,
  Button,
  effect,
  HStack,
  Select,
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  useDisclosure,
  useToast,
  VStack
} from "@chakra-ui/react";
import GetMessageRow from "../components/GetMessageRow";
import HistoryRow from "../components/HistoryRow";
import TimetableRow from "../components/TimetableRow";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {dogsList, getHistory} from "../api";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useForm} from "react-hook-form";
import SelectDog from "../modals/SelectDog";
import MakeMessage from "../modals/MakeMessage";

export default function GetMessage() {
  const toast = useToast();
  const {isOpen, onOpen, onClose} = useDisclosure();
  const queryClient = useQueryClient();
  const {isLoading: selectIsLoading, data: selectData} = useQuery(["dogs-list"], dogsList);
  const [name, setName] = useState('');
  // const [data, setData] = useState('');
  const {isLoading, data} = useQuery(["history", name, 'getMessage'], getHistory);
  const options = selectData?.map(item => ({
    value: item.name, label: item.name,
  }));
  // if Select option is changed, set mutation
  useEffect(() => {
    queryClient.removeQueries('history')
    setChecked([])
    if (name) {
      queryClient.refetchQueries(["history", name, 'getMessage']);
    }
  }, [name]);
  const [checked, setChecked] = useState([]);
  
  const showInTime = useBreakpointValue({ base: false, md: true });
  const showOutTime = useBreakpointValue({ base: false, md: true });
  const showBelt = useBreakpointValue({ base: false, md: true });
  return (<VStack w={'100%'} mt={'2vh'} mb={'10vh'}>
    <TableContainer w={'100%'}>
      <Table variant='striped' colorScheme='blue' layout={'fixed'}>
        <Thead w={'100%'} borderBottomColor={'black'} borderBottomWidth={5} alignItems={'center'}>
          <Tr textAlign={'center'}>
            <Th textAlign={'center'} fontSize={'xl'} px={0} w={'15vw'}>
              {selectIsLoading ? <Text>Loading options...</Text> : (<Select
                paddingInlineEnd={0}
                paddingInlineStart={0}
                css={{WebkitPaddingEnd: 0, WebkitPaddingStart: 10}}
                px={0}
                w={'100%'}
                p={0}
                mr={5}
                placeholder={"댕댕이 선택"}
                required={true}
                position={'inherit'}
                id={'name'}
                icon={<></>}
                // iconSize={0}
                onChange={(e) => {
                  document.getElementById('name').style.position = 'inherit'
                  setName(prev => e.target.value);
                }}
              >
                {options && options.map((option) => (<option key={option.value} value={option.value}>
                  {option.label}
                </option>))}
              </Select>)}
              {/*<Button textAlign={'center'} onClick={handleSubmit(onSubmit)}>*/}
              {/*<SelectDog setter={setName}/>*/}
              {/*</Button>*/}
            </Th>
            <Th textAlign={'center'} fontSize={'xl'} px={0} w={'12vw'}>이용날짜</Th>
            {showInTime && <Th textAlign={'center'} px={0} fontSize={'xl'} w={'10vw'}>입장시간</Th>}
            {showOutTime && <Th textAlign={'center'} px={0} fontSize={'xl'} w={'10vw'}>퇴장시간</Th>}
            <Th textAlign={'center'} fontSize={'xl'} px={0} w={'10vw'}>이용시간</Th>
            {showBelt && <Th textAlign={'center'} px={0} fontSize={'xl'} w={'10vw'}>매너벨트</Th>}
            <Th p={0} textAlign={'center'} fontSize={'xl'} w={'10vw'}>
              <Button onClick={onOpen} position={'inherit'} bg={'#1a2a52'} color={'white'} rounded={'xl'}
                      _hover={{
                          textDecoration: 'none', color: 'white', bg: '#526491', rounded: 'xl', transform: 'scale(1.2)'
                        }}>
                          메세지생성</Button>
              <MakeMessage isOpen={isOpen} onClose={onClose}
                           checked={checked}/>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {data && data.map((item) => (<>
            <GetMessageRow
              data={item}
              state={[checked, setChecked]}
            />
          </>))}
        </Tbody>
      </Table>
    </TableContainer>
  </VStack>);
}

