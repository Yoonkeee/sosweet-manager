import {
  Box, Button, effect, HStack, Select, Table, TableContainer, Tbody, Text, Th, Thead, Tr, useDisclosure, useToast, VStack
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
  const {isLoading, data} = useQuery(["history", name], getHistory);
  const options = selectData?.map(item => ({
    value: item.name, label: item.name,
  }));
  // if Select option is changed, set mutation
  useEffect(() => {
    queryClient.removeQueries('history')
    setChecked([])
    if (name) {
      queryClient.refetchQueries(["history", name]);
    }
  }, [name]);
  const [checked, setChecked] = useState([]);
  
  return (<VStack w={'100%'}>
    <TableContainer w={'100%'}>
      <Table variant='striped' colorScheme='blue' layout={'fixed'}>
        <Thead w={'100%'} borderBottomColor={'black'} borderBottomWidth={5} alignItems={'center'}>
          <Tr textAlign={'center'}>
            <Th textAlign={'center'} fontSize={'xl'} px={0}>
              {selectIsLoading ? <Text>Loading options...</Text> : (<Select
                // w={'40%'}
                p={0}
                mr={5}
                placeholder={"댕댕이 선택"}
                required={true}
                position={'inherit'}
                id={'name'}
                onChange={(e) => {
                  // console.log(e.target.value);
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
            <Th textAlign={'center'} fontSize={'xl'}>이용날짜</Th>
            <Th textAlign={'center'} fontSize={'xl'}>입장시간</Th>
            <Th textAlign={'center'} fontSize={'xl'}>퇴장시간</Th>
            <Th textAlign={'center'} fontSize={'xl'}>이용시간</Th>
            <Th textAlign={'center'} fontSize={'xl'}>매너벨트</Th>
            <Th p={0} textAlign={'center'} fontSize={'xl'}>
              <Button onClick={onOpen} position={'inherit'}>메세지생성</Button>
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

