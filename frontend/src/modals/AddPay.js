import {useForm} from "react-hook-form";
import {
    Button,
    HStack,
    IconButton,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    Switch,
    Text,
    useToast,
    VStack
} from "@chakra-ui/react";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {dogsList, getUsedBelts, pay, temporalToLocale, temporalToStr} from "../api";
import {useEffect, useState} from "react";
import {ArrowBackIcon, ArrowForwardIcon} from "@chakra-ui/icons";
import {Temporal} from "@js-temporal/polyfill";
import ProfileAvatar from "../components/ProfileAvatar";

export default function AddPay({isOpen, onClose}) {
    const {register, reset, handleSubmit, formState: {errors}} = useForm();
    const toast = useToast();
    const {isLoading, data} = useQuery(["dogs-list"], dogsList);
    const [name, setName] = useState('');
    const [belts, setBelts] = useState();
    const [nowDate, setNowDate] = useState(Temporal.Now.plainDateISO());
    const [formattedDate, setFormattedDate] = useState();
    const [isSwitchOn, setIsSwitchOn] = useState(false);
    const queryClient = useQueryClient();
    useEffect(() => {
        setFormattedDate(temporalToLocale(nowDate));
    }, [nowDate]);
    const mutation = useMutation(pay, {
        onSuccess: () => {
            toast({
                title: "결제 내역 등록에 성공했어요~~", status: "success", position: "top", duration: 1000, isClosable: true,
            });
            onClose();
            reset();
            setBelts(0)
            queryClient.refetchQueries("getPayHistory");
        },
    });
    const onSubmit = (register) => {
        register.date = temporalToStr(nowDate)
        register = {...register, isSwitchOn}
        mutation.mutate(register);
    }
    const options = data?.map(item => ({
        value: item.name, label: item.name,
    }));
    useEffect(() => {
        getUsedBelts(name)?.then((res) => {
            // console.log(res);
            setBelts(res)
        });
    }, [name]);

    return (<Modal isOpen={isOpen} onClose={() => {
        onClose()
        reset()
        setBelts(0)
    }}>
        <ModalOverlay/>
        <ModalContent top={'30vh'}>
            <ModalHeader>
                <HStack>
                    <ProfileAvatar name={name}/>
                    <Text>
                        {name} 결제 등록!
                    </Text>
                </HStack>
            </ModalHeader>
            <ModalCloseButton/>
            <HStack w={'100%'} justifyContent={'center'} mb={'2vh'} alignContent={'center'} alignItems={'center'}>
                <IconButton rounded={'xl'} w={'6%'} h={'80%'} bg={'#1a2a52'} color={'white'} isRound={true}
                            position={'inherit'}
                            _hover={{
                                textDecoration: 'none',
                                color: 'white',
                                bg: '#526491',
                                rounded: 'xl',
                                transform: 'scale(1.2)'
                            }} aria-label={''} icon={<ArrowBackIcon fontSize={'3xl'} fontWeight={'extrabold'}/>}
                            onClick={() => {
                                setNowDate(nowDate.subtract({days: 1}))
                            }}
                />
                <Text mt={'2vh'} fontSize={'2xl'} fontWeight={'semibold'} textAlign={'center'}
                      id={'formattedNowDate'}>
                    {formattedDate}
                </Text>
                <IconButton rounded={'xl'} w={'6%'} h={'80%'} bg={'#1a2a52'} color={'white'} isRound={true}
                            position={'inherit'}
                            _hover={{
                                textDecoration: 'none',
                                color: 'white',
                                bg: '#526491',
                                rounded: 'xl',
                                transform: 'scale(1.2)'
                            }} aria-label={''} icon={<ArrowForwardIcon fontSize={'3xl'} fontWeight={'extrabold'}/>}
                            onClick={() => {
                                setNowDate(nowDate.add({days: 1}))
                            }}
                />
            </HStack>
            <ModalBody as={'form'} onSubmit={handleSubmit(onSubmit)}>
                <VStack spacing={3}>
                    <HStack>
                        {isLoading ? <Text>Loading options...</Text> : (<Select
                            w={'40%'}
                            icon={<></>}
                            mr={5}
                            placeholder={"댕댕이 선택"}
                            required={true}
                            {...register("name")}
                            onChange={(e) => {
                                setName(e.target.value)}}
                        >
                            {options && options.map((option) => (<option key={option.value} value={option.value}>
                                {option.label}
                            </option>))}
                        </Select>)}
                        <Input
                            w={'30%'}
                            type={'number'}
                            variant={"filled"}
                            placeholder={"결제 시간"}
                            {...register("hours", {required: true})}
                        />
                        <Text>
                            시간
                        </Text>
                    </HStack>
                    <HStack>
                        {belts === 0 || belts === undefined ? <></> : <>
                            <Text fontWeight={'semibold'}>매너벨트 {belts}개 같이 결제</Text>
                            <Switch size='lg' onChange={((e) => {
                                if (e.target.checked) {
                                    setIsSwitchOn(true)
                                } else {
                                    setIsSwitchOn(false)
                                }
                            })}
                            />
                        </>}
                    </HStack>
                </VStack>
                <ModalFooter>
                    <Button colorScheme='red' mr={3} onClick={() => {
                        onClose()
                        reset()
                        setBelts(0)
                    }} rounded={'xl'}
                            _hover={{textDecoration: 'none', color: 'white', rounded: 'xl', transform: 'scale(1.2)'}}>
                        취소
                    </Button>
                    <Button bg={'#1a2a52'} color={'white'} rounded={'xl'} type={'submit'}
                            _hover={{
                                textDecoration: 'none',
                                color: 'white',
                                bg: '#526491',
                                rounded: 'xl',
                                transform: 'scale(1.2)'
                            }}>결제!</Button>
                </ModalFooter>
            </ModalBody>
        </ModalContent>
    </Modal>)
};