import { Table, TableContainer, Tbody, Th, Thead, Tr, useToast, VStack } from '@chakra-ui/react';
import { useQuery, useQueryClient } from 'react-query';
import { getPayHistory } from '../api';
import { useState } from 'react';
import PayHistoryRow from '../components/PayHistoryRow';

export default function PayHistory() {
  const toast = useToast();
  // const {register, reset, handleSubmit, formState: {errors}} = useForm();
  // const dispatch = useDispatch();
  // const {isOpen, onOpen, onClose} = useDisclosure();
  const queryClient = useQueryClient();
  // const {isLoading: selectIsLoading, data: selectData} = useQuery(["dogs-list"], dogsList);
  const [name, setName] = useState('');
  const { isLoading, data } = useQuery(['getPayHistory'], getPayHistory);
  // const mutation = useMutation(getPayHistory, {
  //   onSuccess: (response) => {
  //     toast({
  //       title: (
  //         <>
  //           {name}의 이용 내역을 불러왔어요! <br/>
  //         </>),
  //       status: "success",
  //       position: "top",
  //       duration: 3000,
  //       isClosable: true,
  //     });
  //     // console.log(response);
  //   },
  // });
  // const options = selectData?.map(item => ({
  //   value: item.name,
  //   label: item.name,
  // }));
  // if Select option is changed, set mutation
  // useEffect(() => {
  //   if (name) {
  //     console.log('mutated '+name);
  //     queryClient.refetchQueries(["getPayHistory", name]);
  //     // mutation.mutate(name);
  //   }
  // }, [name]);

  return (
    <VStack mb={'10vh'} mt={'2vh'} w={'100%'}>
      <TableContainer w={'100%'}>
        <Table colorScheme="blue" variant="striped">
          <Thead alignItems={'center'} borderBottomColor={'black'} borderBottomWidth={5} h={'8vh'} w={'100%'}>
            <Tr textAlign={'center'}>
              <Th fontSize={'xl'} px={0} textAlign={'center'} w={'10vw'}>
                댕댕이
              </Th>
              <Th fontSize={'xl'} px={0} textAlign={'center'} w={'10vw'}>
                결제시간
              </Th>
              <Th fontSize={'xl'} px={0} textAlign={'center'} w={''}>
                결제일
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {data &&
              data.map(item => (
                <>
                  <PayHistoryRow data={item} key={item.id} />
                </>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
}
