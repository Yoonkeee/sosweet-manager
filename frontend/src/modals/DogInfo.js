import {
    Avatar,
    Badge,
    Button, Flex, HStack,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text, useToast,
    VStack
} from "@chakra-ui/react";
import {useForm} from "react-hook-form";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {addProfile, getDogInfo, getProfile, getUploadUrl, modDog, uploadImage} from "../api";
import React, {useEffect, useRef, useState} from "react";
import {formatMinuteToTime} from "../api";
import {HttpStatusCode} from "axios";
import ProfileAvatar from "../components/ProfileAvatar";

export default function DogInfo({isOpen, onClose, name, setRandomState}) {
    const {register, reset, handleSubmit, formState: {errors}} = useForm();
    const toast = useToast();
    const [info, setInfo] = useState('');
    const queryClient = useQueryClient();
    const mutation = useMutation(modDog, {
        onSuccess: () => {
            toast({
                title: name + " 수정에 성공했어요~~", status: "success", position: "top", duration: 1000, isClosable: true,
            });
            queryClient.refetchQueries('dogs-list');
            queryClient.refetchQueries(['dog_info', name]);
            onCloseFn();
        },
    });
    const onSubmit = (res) => {
        // console.log(res);
        res = {...res, name: name};
        mutation.mutate(res);
    }
    const {isLoading, data} = useQuery(['dog_info', name], getDogInfo);
    const [remainingTime, setRemainingTime] = useState('');
    const [usedBelts, setUsedBelts] = useState('');
    const [beltColor, setBeltColor] = useState('green');
    const [lastVisited, setLastVisited] = useState('');
    const [visitColor, setVisitColor] = useState('telegram');
    useEffect(() => {
        if (data && !isLoading) {
            setRemainingTime(formatMinuteToTime(data.remaining_minutes))
            setUsedBelts(data.used_belts + '개')
            if (data.used_belts > 0) {
                setBeltColor('orange')
            }
            if (data.last_visited) {
                setVisitColor('telegram')
                setLastVisited(data.last_visited)
            } else {
                setVisitColor('pink')
                setLastVisited('기록에 없어요ㅜ')
            }
        }
    }, [data]);
    useEffect(() => {
        if (data && !isLoading) {
            reset({
                officialName: data.official_name,
                dogInfo: data.note,
                dogBreed: data.breed,
                dogGender: data.gender,
                phone: data.phone,
                dogWeight: data.weight,
            })
        }
    }, [isLoading]);
    const onReset = () => {
        reset({
            officialName: '',
            dogInfo: '',
            dogBreed: '',
            dogGender: '',
            phone: '',
            dogWeight: '',
        })
        setFile(null)
        setProfileUrl('')
        setIsFileUploaded(false)
    }
    const onCloseFn = () => {
        onClose();
        onReset();
    }
    const [timeColor, setTimeColor] = useState('green');
    useEffect(() => {
        if (data && data.remaining_minutes < 0) {
            setTimeColor('red')
        }
    }, [remainingTime]);

    // upload image
    const [file, setFile] = useState(null);
    const imageRef = useRef(null);
    const onUploadImageButtonClick = (() => {
        if (!imageRef.current) {
            return;
        }
        imageRef.current.click();
    })
    useEffect(() => {
        if (file)
            setIsFileUploaded(true)
        else
            setIsFileUploaded(false)
    }, [file]);
    const onFileChange = (e) => {
        const {target: {files}} = e;
        const theFile = files[0];
        setFile(theFile);
    }
    const {isLoading: isProfileLoading, data: profileData} = useQuery(['profile', name], getProfile);
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const [uploadURL, setuploadURL] = useState('')
    const [isUploaded, setIsUploaded] = useState(true)
    const [profileUrl, setProfileUrl] = useState('')
    useEffect(() => {
        if (profileData) {
            setProfileUrl(profileData)
        } else {
            setProfileUrl('')
        }
    }, [profileData]);

    const onUploadServerButtonClick = (() => {
        if (file == null) return
        setIsUploaded(false)
        getUploadUrl().then((res) => {
            setuploadURL(res.uploadURL)
        })
    })
    const [fileId, setFileId] = useState('')

    useEffect(() => {
        if (uploadURL === '') return
        uploadImage(file, uploadURL).then((res) => {
            setFileId(res.result.id)
        })
    }, [uploadURL]);

    useEffect(() => {
        if (fileId) {
            addProfile(name, fileId).then((res) => {
                if (res) {
                    queryClient.refetchQueries(['dog_info', name]);
                    queryClient.refetchQueries(['profile', name]);
                    toast({
                        title: name + " 사진 업로드에 성공했어요~~",
                        status: "success",
                        position: "top",
                        duration: 1000,
                        isClosable: true,
                    });
                } else {
                    queryClient.refetchQueries(['dog_info', name]);
                    queryClient.refetchQueries(['profile', name]);
                    toast({
                        title: name + " 사진 업로드에 실패했어요ㅜㅜ",
                        status: "error",
                        position: "top",
                        duration: 1000,
                        isClosable: true,
                    });
                }
                setIsUploaded(true)
                onCloseFn()
            })
        }
    }, [fileId]);

    return (
        <Modal isOpen={isOpen} onClose={onCloseFn}>
            <ModalOverlay/>
            <ModalContent top={'10vh'}>
                <ModalHeader>
                    <HStack>
                        <ProfileAvatar profileUrl={profileUrl} name={name} />
                        <Text>
                            {name}🥰 정보
                        </Text>
                    </HStack>
                </ModalHeader>
                <ModalCloseButton/>
                <ModalBody as={'form'} onSubmit={handleSubmit(onSubmit)}>
                    <VStack w={'100%'}>
                        <HStack w={'100%'}>
                            <Text minW={'25%'}>공식 이름</Text>
                            <Input
                                variant={"filled"}
                                placeholder={"공식 이름 미입력시 이름과 동일(선택)"}
                                {...register("officialName")}
                            />
                        </HStack>
                        <HStack w={'100%'}>
                            <Text minW={'25%'}>특이사항</Text>
                            <Input
                                variant={"filled"}
                                placeholder={"특이사항(선택)"}
                                {...register("dogInfo")}
                            />
                        </HStack>
                        <HStack w={'100%'}>
                            <Text minW={'25%'}>견종&성별</Text>
                            <Input
                                mr={1}
                                variant={"filled"}
                                placeholder={"견종(선택)"}
                                {...register("dogBreed")}
                            />
                            <Input
                                ml={1}
                                variant={"filled"}
                                placeholder={"성별(선택)"}
                                {...register("dogGender")}
                            />
                        </HStack>
                        <HStack w={'100%'}>
                            <Text minW={'25%'}>전화번호&<br/>매벨 사용량</Text>
                            <Input
                                w={'55%'}
                                mr={1}
                                variant={"filled"}
                                placeholder={"견주 전화번호(선택)"}
                                {...register("phone")}
                            />
                            <Badge ml='1' fontSize='xl' colorScheme={beltColor}>
                                {usedBelts}
                            </Badge>
                        </HStack>
                        <HStack w={'100%'}>
                            <Text minW={'25%'}>몸무게&<br/>잔여시간</Text>
                            <Input
                                w={'55%'}
                                ml={1}
                                variant={"filled"}
                                // value={dogWeight}
                                placeholder={"몸무게(선택)"}
                                {...register("dogWeight")}
                            />
                            <Badge ml='1' fontSize='xl' colorScheme={timeColor}>
                                {remainingTime}
                            </Badge>
                            {/*<Text ml={1} w={'50%'}></Text>*/}
                        </HStack>
                        <HStack w={'100%'}>
                            <Text minW={'25%'}>최근방문</Text>
                            <Badge ml='1' fontSize='xl' colorScheme={visitColor}>
                                {lastVisited}
                            </Badge>
                        </HStack>
                    </VStack>
                    <ModalFooter mx={0} px={0}>
                        <Flex w={'100%'} m={0} p={0} justifyContent={'flex-end'}
                              marginInlineStart={0}
                              css={{WebkitMarginStart: 0}}
                        >
                            {
                                name ?
                                    <>
                                        <Input type={"file"} accept={"image/*"}
                                               onChange={onFileChange} display={'none'} ref={imageRef}/>
                                        {
                                            isFileUploaded ?
                                                <Button
                                                    isLoading={!isUploaded}
                                                    colorScheme='green' onClick={onUploadServerButtonClick}
                                                        rounded={'xl'}
                                                        _hover={{
                                                            textDecoration: 'none',
                                                            color: 'white',
                                                            rounded: 'xl',
                                                            transform: 'scale(1.2)'
                                                        }}>
                                                    업로드!
                                                </Button>
                                                :
                                                <Button colorScheme='twitter' onClick={onUploadImageButtonClick}
                                                        rounded={'xl'}
                                                        _hover={{
                                                            textDecoration: 'none',
                                                            color: 'white',
                                                            rounded: 'xl',
                                                            transform: 'scale(1.2)'
                                                        }}>
                                                    사진등록
                                                </Button>
                                        }
                                    </>
                                    : <></>
                            }
                            <Button colorScheme='red' mx={3} onClick={onCloseFn}
                                    rounded={'xl'} _hover={{
                                textDecoration: 'none', color: 'white', rounded: 'xl', transform: 'scale(1.2)'
                            }}>
                                취소
                            </Button>
                            <Button bg={'#1a2a52'} color={'white'} rounded={'xl'}
                                    type={'submit'}
                                    _hover={{
                                        textDecoration: 'none',
                                        color: 'white',
                                        bg: '#526491',
                                        rounded: 'xl',
                                        transform: 'scale(1.2)'
                                    }}>수정~</Button>
                        </Flex>
                    </ModalFooter>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
