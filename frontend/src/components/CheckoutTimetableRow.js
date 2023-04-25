import {
    Tr,
    Td,
    Button,
    useDisclosure,
    useBreakpointValue,
    useBreakpoint,
    useToast,
    PopoverTrigger,
    Portal,
    PopoverContent,
    PopoverArrow,
    PopoverCloseButton, PopoverBody, Heading, Popover,
} from '@chakra-ui/react'
import {useEffect, useRef, useState} from "react";
// import "react-icons/all";
import {cancelCheckin, cancelHistory, getHistory} from "../api";
import {useMutation, useQuery, useQueryClient} from "react-query";
import DogInfo from "../modals/DogInfo";
import ModifyHistory from "../modals/ModifyHistory";

export default function CheckoutTimetableRow(props) {
    let {id, name, belts, in_time, out_time, date} = props.data;
    // var {id, name, in_time, out_time} = props.data
    const {
        isOpen: isOutOpen, onOpen: onOutOpen, onClose: onOutClose
    } = useDisclosure()
    const {
        isOpen: checkinModIsOpen, onOpen: checkinModOnOpen, onClose: checkinModOnClose
    } = useDisclosure()
    const {
        isOpen: checkoutModIsOpen, onOpen: checkoutModOnOpen, onClose: checkoutModOnClose
    } = useDisclosure()
    const {isOpen: deleteIsOpen, onOpen: deleteOnOpen, onClose: deleteOnClose} = useDisclosure()
    const {isOpen: modHistoryIsOpen, onOpen: modHistoryOnOpen, onClose: modHistoryOnClose} = useDisclosure()
    const {isOpen: dogInfoModISOpen, onClose: dogInfoModOnClose, onOpen: dogInfoModOnOpen} = useDisclosure();
    const {isLoading, data} = useQuery(["history", name], getHistory);
    const toast = useToast();
    const breakpoint = useBreakpoint({ssr: false})
    const buttonSize = useBreakpointValue({base: 'xs', md: 'md'}, {ssr: false})
    const beltButtonSize = useBreakpointValue({base: 'sm', md: 'md'}, {ssr: false})
    const queryClient = useQueryClient();
    const cancelHistoryMutation = useMutation(cancelHistory);
    const cancelTimetableMutation = useMutation(cancelCheckin, {
        onSuccess: (data) => {
            toast({
                title: (
                    <>
                        사용내역 삭제! <br/>
                        댕댕이 : {name} <br/>
                        사용날짜 : {document.getElementById('formattedNowDateTimetable').innerText} <br/>
                    </>),
                status: "success",
                position: "top",
                duration: 1000,
                isClosable: true,
            });
            queryClient.refetchQueries(["timetable"]);
            queryClient.refetchQueries(["checkoutTimetable"]);
            queryClient.refetchQueries(["timetable", date]);
            queryClient.refetchQueries(['checkoutTimetable', date]);
        },
    });
    const cancel = () => {
        cancelHistoryMutation.mutate(id)
        cancelTimetableMutation.mutate(id)
    };
    const ref = useRef(null)
    const [nameColor, setNameColor] = useState('#1a2a52')
    useEffect(() => {
        if (props.data.remaining_minutes < 0) {
            setNameColor('#ff7f50')
        }
    }, [props.data.remaining_minutes]);
    return (<>
        <Tr textAlign={'center'}>
            <Td px={0}>
                <Button fontSize={'xl'} px={0} w={'80%'} fontWeight={'bold'} textColor={nameColor} colorScheme={'white'}
                        onClick={dogInfoModOnOpen}
                        size={buttonSize}>
                    {name}
                </Button>
            </Td>
            <Td px={0} textAlign={'center'}>
                <Button fontSize={'xl'} px={0} w={'80%'} fontWeight={'bold'} textColor={nameColor} colorScheme={'white'}
                        onClick={modHistoryOnOpen}
                        size={buttonSize}>
                    {in_time}
                    <ModifyHistory isOpen={modHistoryIsOpen} onClose={modHistoryOnClose} data={props.data}/>
                    {/*<ChangeCheckInTime isOpen={checkinModIsOpen} onClose={checkinModOnClose}*/}
                    {/*                   id={id} name={name} in_time={in_time} in_or_out={'in'}/>*/}
                </Button>
            </Td>
            <Td px={0} textAlign={'center'}>
                <Button fontSize={'xl'} px={0} w={'80%'} fontWeight={'bold'} textColor={nameColor} colorScheme={'white'}
                        onClick={modHistoryOnOpen}
                        size={buttonSize}>
                    {out_time}
                    {/*<ChangeCheckInTime isOpen={checkoutModIsOpen} onClose={checkoutModOnClose}*/}
                    {/*                   id={id} name={name} in_time={out_time} in_or_out={'out'}/>*/}
                </Button>
            </Td>
            <Td px={0} textAlign={'center'}>
                <Popover placement='left' isOpen={deleteIsOpen} onClose={deleteOnClose}>
                    <PopoverTrigger>
                        <Button colorScheme='yellow' rounded={'xl'}
                                onClick={deleteOnOpen}
                                _hover={{
                                    textDecoration: 'none', color: 'white', rounded: 'xl', transform: 'scale(1.2)'
                                }}>
                            삭제하기
                        </Button>
                    </PopoverTrigger>
                    <Portal>
                        <PopoverContent bg={'gray.200'} w={'100%'}>
                            <PopoverArrow/>
                            <PopoverCloseButton/>
                            <PopoverBody textAlign={'center'}>
                                <Heading fontSize={'2xl'} my={'3vh'}>내역을 삭제할까요?</Heading>
                                <Button colorScheme='yellow' onClick={() => {
                                    cancel()
                                    deleteOnClose()
                                }}>삭제할게요!</Button>
                            </PopoverBody>
                        </PopoverContent>
                    </Portal>
                </Popover>
            </Td>
            <Td>
                {belts > 0 ? belts : ''}
            </Td>
        </Tr>

        {dogInfoModISOpen ? <DogInfo isOpen={dogInfoModISOpen} onClose={dogInfoModOnClose}
                 name={name}/> : ''}
    </>)
}