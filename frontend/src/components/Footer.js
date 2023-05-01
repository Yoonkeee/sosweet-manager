import {
    Box, Button,
    Flex, HStack,
    Image,
    Spacer, Stack,
    useDisclosure, VStack,
    Text, Icon
} from "@chakra-ui/react";
import {Link, useLocation} from "react-router-dom";
import Checkin from "../modals/Checkin";
import {mainColor} from "../api";
import {AddIcon, TimeIcon} from "@chakra-ui/icons";
import {FaDog, FaWonSign} from "react-icons/fa";
import AddPay from "../modals/AddPay";
import NewDog from "../modals/NewDog";
import {setToday} from "../store";
import {useDispatch} from "react-redux";
import {useQueryClient} from "react-query";

export default function Footer() {
    const location = useLocation().pathname;
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    return (
        <HStack
            display={'flex'}
            alignContent={'center'}
            justifyContent={'space-between'}
            alignItems={'flex-start'}
            h={'10vh'}
            paddingTop={'0.2vh'}
            px={'10vw'}
            background={'#ffffff'}
            borderTop={`3px solid ${mainColor}`}
        >
            <FooterButtonModal
                icon={FaDog}
                component={NewDog}
                text={'신규'}
            />
            <FooterButtonModal
                icon={FaWonSign}
                component={AddPay}
                text={'결제'}
            />
            <Box>
                <Link to={'/'}>
                    <Image
                        h={'8vh'}
                        src={'./logo/logo_dog_btn.png'}
                    />
                </Link>
            </Box>
            <FooterButtonLink
                icon={TimeIcon}
                link={'/timetable'}
                text={'시간표'}
                onClick={() => {
                    dispatch(setToday())
                    queryClient.refetchQueries('timetable')
                    queryClient.refetchQueries('checkoutTimetable')
                }}
            />
            <FooterButtonModal
                icon={AddIcon}
                component={Checkin}
                text={'체크인'}
            />
        </HStack>)
}
const FooterButtonModal = (props) => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    return (
        <Button bgColor={'transparent'} h={'100%'} paddingTop={'1vh'} w={'10vw'}
                onClick={onOpen}>
            <VStack m={0} p={0} h={'100%'} w={'100%'}>
                {/*{props.icon()}*/}
                <Icon as={props.icon} boxSize={7}/>
                {/*<FontAwesomeIcon icon="fa-regular fa-sack-dollar" />*/}
                {/*// <props.icon boxSize={6}/>*/}
                <Text marginY={0} p={0} fontSize={'sm'}>{props.text}</Text>
                <props.component isOpen={isOpen} onClose={onClose}/>
            </VStack>
        </Button>
    )
}
const FooterButtonLink = (props) => {
    return (
        <Box onClick={props.onClick} h={'100%'}>
            <Link to={props.link} w={'100%'} h={'100%'}>
                <Button bgColor={'transparent'} h={'100%'} paddingTop={'1vh'} w={'10vw'}>
                    <VStack m={0} p={0} h={'100%'} w={'100%'}>
                        <Icon as={props.icon} boxSize={7}/>
                        <Text marginY={0} p={0} fontSize={'sm'}>{props.text}</Text>
                    </VStack>
                </Button>
            </Link>
        </Box>
    )
}
