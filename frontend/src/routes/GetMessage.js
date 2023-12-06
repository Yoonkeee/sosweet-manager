import {
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
  VStack,
} from '@chakra-ui/react';
import { useQuery, useQueryClient } from 'react-query';
import { useEffect, useState } from 'react';
import GetMessageRow from '../components/GetMessageRow';
import { getHistory, uncheckedDogsList } from '../api';
import MakeMessage from '../modals/MakeMessage';

export default function GetMessage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();
  const { isLoading: selectIsLoading, data: selectData } = useQuery(
    ['unchecked-dogs-list'],
    uncheckedDogsList,
  );
  const [name, setName] = useState('');
  const { isLoading, data } = useQuery(['history', name, 'getMessage'], getHistory);
  const options =
    selectData &&
    selectData.map(item => ({
      value: item.name,
      label: item.name,
    }));
  const [checked, setChecked] = useState([]);
  const [selected, setSelected] = useState(false);
  const showInTime = useBreakpointValue({ base: false, md: true });
  const showOutTime = useBreakpointValue({ base: false, md: true });
  const showBelt = useBreakpointValue({ base: false, md: true });
  const handleSelectChange = e => {
    // document.getElementById('name').style.position = 'inherit'
    const selectedName = e.target.value;
    const matchingRows = data.filter(row => row.name === selectedName);
    const ids = matchingRows && matchingRows.map(row => row.id);
    setChecked(ids);
    setName(e.target.value);
    setSelected(true);
  };
  useEffect(() => {
    if (selected) {
      onOpen();
    }
  }, [selected]);
  const onCloseFn = () => {
    queryClient.refetchQueries(['unchecked-dogs-list']).then(() => {
      document.getElementById('name').value = '';
      onClose();
      setName('');
      setChecked([]);
      setSelected(false);
    });
  };
  return (
    <VStack mb="10vh" minH="80vh" mt="2vh" w="100%">
      <TableContainer w="100%">
        <Table colorScheme="blue" layout="fixed" variant="striped">
          <Thead alignItems="center" borderBottomColor="black" borderBottomWidth={5} w="100%">
            <Tr textAlign="center">
              <Th fontSize="xl" px={0} textAlign="center" w="15vw">
                {selectIsLoading ? (
                  <Text>Loading options...</Text>
                ) : (
                  <Select
                    css={{ WebkitPaddingEnd: 0, WebkitPaddingStart: 10 }}
                    icon={<></>}
                    id="name"
                    mr={5}
                    onChange={e => handleSelectChange(e)}
                    p={0}
                    paddingInlineEnd={0}
                    paddingInlineStart={0}
                    placeholder="메세지 보낼 댕댕이"
                    position="inherit"
                    px={0}
                    required
                    // iconSize={0}
                    w="100%"
                  >
                    {options &&
                      options.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                  </Select>
                )}
              </Th>
              <Th fontSize="xl" px={0} textAlign="center" w="12vw">
                이용날짜
              </Th>
              {showInTime && (
                <Th fontSize="xl" px={0} textAlign="center" w="10vw">
                  입장시간
                </Th>
              )}
              {showOutTime && (
                <Th fontSize="xl" px={0} textAlign="center" w="10vw">
                  퇴장시간
                </Th>
              )}
              <Th fontSize="xl" px={0} textAlign="center" w="10vw">
                이용시간
              </Th>
              {showBelt && (
                <Th fontSize="xl" px={0} textAlign="center" w="10vw">
                  매너벨트
                </Th>
              )}
              {/* <Th p={0} textAlign={'center'} fontSize={'xl'} w={'10vw'}> */}
              {/*    <Button onClick={onOpen} position={'inherit'} bg={'#1a2a52'} color={'white'} rounded={'xl'} */}
              {/*            _hover={{ */}
              {/*                textDecoration: 'none', */}
              {/*                color: 'white', */}
              {/*                bg: '#526491', */}
              {/*                rounded: 'xl', */}
              {/*                transform: 'scale(1.2)' */}
              {/*            }}> */}
              {/*        메세지생성</Button> */}
              {/* </Th> */}
              <MakeMessage checked={checked} isOpen={isOpen} name={name} onClose={onCloseFn} />
            </Tr>
          </Thead>
          <Tbody>
            {!isLoading &&
              data &&
              data.map(item => (
                <GetMessageRow
                  data={item}
                  isEmpty={checked.length === 0}
                  key={item.id}
                  keys={item.id}
                  selectedName={name}
                  state={[checked, setChecked]}
                />
              ))}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
}
