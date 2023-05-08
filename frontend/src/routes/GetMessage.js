import {
    Button,
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
    VStack
} from "@chakra-ui/react";
import GetMessageRow from "../components/GetMessageRow";
import {useQuery, useQueryClient} from "react-query";
import {getHistory, uncheckedDogsList} from "../api";
import {useEffect, useState} from "react";
import MakeMessage from "../modals/MakeMessage";

export default function GetMessage() {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const queryClient = useQueryClient();
    const {isLoading: selectIsLoading, data: selectData} = useQuery(["unchecked-dogs-list"], uncheckedDogsList);
    const [name, setName] = useState('');
    const {isLoading, data} = useQuery(["history", name, 'getMessage'], getHistory);
    const options = selectData?.map(item => ({
        value: item.name, label: item.name,
    }));
    const [checked, setChecked] = useState([]);
    const [selected, setSelected] = useState(false);
    const showInTime = useBreakpointValue({base: false, md: true});
    const showOutTime = useBreakpointValue({base: false, md: true});
    const showBelt = useBreakpointValue({base: false, md: true});
    const handleSelectChange = (e) => {
        // document.getElementById('name').style.position = 'inherit'
        const selectedName = e.target.value;
        const matchingRows = data.filter((row) => row.name === selectedName);
        const ids = matchingRows.map((row) => row.id);
        setChecked(ids)
        setName(e.target.value);
        setSelected(true)
    };
    useEffect(() => {
        if (selected) {
            onOpen();
        }
    }, [selected]);
    const onCloseFn = () => {
        queryClient.refetchQueries(["unchecked-dogs-list"]).then(() => {
            document.getElementById('name').value = '';
            onClose();
            setName('');
            setChecked([])
            setSelected(false);
        })
    };
    return (<VStack w={'100%'} mt={'2vh'} mb={'10vh'} minH={'80vh'}>
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
                                placeholder={"메세지 보낼 댕댕이"}
                                required={true}
                                position={'inherit'}
                                id={'name'}
                                icon={<></>}
                                // iconSize={0}
                                onChange={(e) => handleSelectChange(e)}
                            >
                                {options && options.map((option) => (<option key={option.value} value={option.value}>
                                    {option.label}
                                </option>))}
                            </Select>)}
                        </Th>
                        <Th textAlign={'center'} fontSize={'xl'} px={0} w={'12vw'}>이용날짜</Th>
                        {showInTime && <Th textAlign={'center'} px={0} fontSize={'xl'} w={'10vw'}>입장시간</Th>}
                        {showOutTime && <Th textAlign={'center'} px={0} fontSize={'xl'} w={'10vw'}>퇴장시간</Th>}
                        <Th textAlign={'center'} fontSize={'xl'} px={0} w={'10vw'}>이용시간</Th>
                        {showBelt && <Th textAlign={'center'} px={0} fontSize={'xl'} w={'10vw'}>매너벨트</Th>}
                        {/*<Th p={0} textAlign={'center'} fontSize={'xl'} w={'10vw'}>*/}
                        {/*    <Button onClick={onOpen} position={'inherit'} bg={'#1a2a52'} color={'white'} rounded={'xl'}*/}
                        {/*            _hover={{*/}
                        {/*                textDecoration: 'none',*/}
                        {/*                color: 'white',*/}
                        {/*                bg: '#526491',*/}
                        {/*                rounded: 'xl',*/}
                        {/*                transform: 'scale(1.2)'*/}
                        {/*            }}>*/}
                        {/*        메세지생성</Button>*/}
                        {/*</Th>*/}
                        <MakeMessage isOpen={isOpen} onClose={onCloseFn}
                                     checked={checked} name={name}/>
                    </Tr>
                </Thead>
                <Tbody>
                    {!isLoading && data && data.map((item) => (<>
                        <GetMessageRow
                            key={item.id}
                            keys={item.id}
                            data={item}
                            state={[checked, setChecked]}
                            isEmpty={checked.length === 0}
                            selectedName={name}
                        />
                    </>))}
                </Tbody>
            </Table>
        </TableContainer>
    </VStack>);
}

