import {
    Select,
    Table,
    TableContainer,
    Tbody,
    Text,
    Th,
    Thead,
    Tr, useBreakpointValue,
    useToast,
    VStack
} from "@chakra-ui/react";
import HistoryRow from "../components/HistoryRow";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {dogsList, getHistory} from "../api";
import {useEffect, useState} from "react";

export default function History() {
    const toast = useToast();
    // const {register, reset, handleSubmit, formState: {errors}} = useForm();
    // const dispatch = useDispatch();
    // const {isOpen, onOpen, onClose} = useDisclosure();
    const queryClient = useQueryClient();
    const {isLoading: selectIsLoading, data: selectData} = useQuery(["dogs-list"], dogsList);
    const [name, setName] = useState('');
    const {isLoading, data} = useQuery(["history", name], getHistory);
    const mutation = useMutation(getHistory, {
        onSuccess: (response) => {
            toast({
                title: (
                    <>
                        {name}의 이용 내역을 불러왔어요! <br/>
                    </>),
                status: "success",
                position: "top",
                duration: 800,
                isClosable: true,
            });
            // console.log(response);
        },
    });
    const options = selectData?.map(item => ({
        value: item.name,
        label: item.name,
    }));
    // if Select option is changed, set mutation
    useEffect(() => {
        setName('ALL')
    }, []);

    useEffect(() => {
        if (name) {
            // console.log('mutated '+name);
            queryClient.refetchQueries(["history", name]);
            // mutation.mutate(name);
        }
    }, [name]);
    const showUsedTime = useBreakpointValue({base: false, md: true});
    const onNameChange = (e) => {
        if (e.target.value === '') {
            setName('ALL')
            queryClient.refetchQueries(["history", name]);
        } else {
            document.getElementById('name').style.position = 'inherit'
            setName(prev => e.target.value);
        }
    }
    return (
        <VStack w={'100%'} mt={'2vh'} mb={'10vh'} minH={'80vh'}>
            <TableContainer w={'100%'}>
                <Table variant='striped' colorScheme='blue' layout={'fixed'}>
                    <Thead w={'100%'} borderBottomColor={'black'} borderBottomWidth={5} alignItems={'center'}>
                        <Tr textAlign={'center'}>
                            <Th textAlign={'center'} fontSize={'xl'} px={0} w={'30vw'}>
                                {selectIsLoading ? <Text>Loading options...</Text> :
                                    (
                                        <Select
                                            paddingInlineEnd={0}
                                            paddingInlineStart={0}
                                            css={{WebkitPaddingEnd: 0, WebkitPaddingStart: 10}}
                                            w={'100%'}
                                            px={0}
                                            icon={<></>}
                                            mr={5}
                                            placeholder={"댕댕이 선택"}
                                            position={'inherit'}
                                            required={true}
                                            id={'name'}
                                            onChange={onNameChange}
                                        >
                                            {options && options.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </Select>
                                    )}
                                {/*<Button textAlign={'center'} onClick={handleSubmit(onSubmit)}>*/}
                                {/*<SelectDog setter={setName}/>*/}
                                {/*</Button>*/}
                            </Th>
                            <Th textAlign={'center'} w={'35vw'} px={0} fontSize={'xl'}>이용내역</Th>
                            {/*<Th textAlign={'center'} fontSize={'xl'}>입장시간</Th>*/}
                            {/*<Th textAlign={'center'} fontSize={'xl'}>퇴장시간</Th>*/}
                            {showUsedTime && <Th textAlign={'center'} w={'9vw'} px={0} fontSize={'xl'}>이용시간</Th>}
                            <Th textAlign={'center'} w={'12vw'} px={0} fontSize={'xl'}>벨트</Th>
                            {/*<Th textAlign={'center'} w={'12vw'} px={0} fontSize={'xl'}>전송날짜</Th>*/}
                            {/*<Th textAlign={'center'} w={'12vw'} px={0} fontSize={'xl'}>수정</Th>*/}
                        </Tr>
                    </Thead>
                    <Tbody>
                        {data && data.map((item) => (
                            <>
                                <HistoryRow
                                    data={item}
                                    key={item.id}
                                />
                            </>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </VStack>
    )
        ;
}

