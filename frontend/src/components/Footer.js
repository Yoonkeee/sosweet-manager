import { Box, Button, HStack, Icon, Image, Text, useDisclosure, VStack } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import Checkin from '../modals/Checkin';
import { mainColor } from '../api';
import { AddIcon, TimeIcon } from '@chakra-ui/icons';
import { FaDog, FaWonSign } from 'react-icons/fa';
import AddPay from '../modals/AddPay';
import NewDog from '../modals/NewDog';
import { setToday } from '../store';
import { useDispatch } from 'react-redux';
import { useQueryClient } from 'react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';

export default function Footer() {
  const location = useLocation().pathname;
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  return (
    <Suspense>
      <HStack
        alignContent={'center'}
        alignItems={'flex-start'}
        background={'#ffffff'}
        borderTop={`3px solid ${mainColor}`}
        display={'flex'}
        h={'10vh'}
        justifyContent={'space-between'}
        paddingTop={'0.2vh'}
        px={'10vw'}
      >
        <Suspense>
          <FooterButtonModal component={NewDog} icon={FaDog} text={'신규'} />
        </Suspense>
        <Suspense>
          <FooterButtonModal component={AddPay} icon={FaWonSign} text={'결제'} />
        </Suspense>
        <Box>
          <Link to={'/'}>
            <Image h={'8vh'} src={'./logo/logo_dog_btn.png'} />
          </Link>
        </Box>
        <Suspense>
          <FooterButtonLink
            icon={TimeIcon}
            link={'/timetable'}
            onClick={() => {
              dispatch(setToday());
              queryClient.refetchQueries('timetable');
              queryClient.refetchQueries('checkoutTimetable');
            }}
            text={'시간표'}
          />
        </Suspense>
        <Suspense>
          <FooterButtonModal component={Checkin} icon={AddIcon} text={'체크인'} />
        </Suspense>
      </HStack>
    </Suspense>
  );
}
const FooterButtonModal = props => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Button bgColor={'transparent'} h={'100%'} onClick={onOpen} paddingTop={'1vh'} w={'10vw'}>
      <VStack h={'100%'} m={0} p={0} w={'100%'}>
        {/*{props.icon()}*/}
        <Icon as={props.icon} boxSize={7} />
        {/*<FontAwesomeIcon icon="fa-regular fa-sack-dollar" />*/}
        {/*// <props.icon boxSize={6}/>*/}
        <Text fontSize={'sm'} marginY={0} p={0}>
          {props.text}
        </Text>
        <props.component isOpen={isOpen} onClose={onClose} />
      </VStack>
    </Button>
  );
};
const FooterButtonLink = props => {
  return (
    <Box h={'100%'} onClick={props.onClick}>
      <Link h={'100%'} to={props.link} w={'100%'}>
        <Button bgColor={'transparent'} h={'100%'} paddingTop={'1vh'} w={'10vw'}>
          <VStack h={'100%'} m={0} p={0} w={'100%'}>
            <Icon as={props.icon} boxSize={7} />
            <Text fontSize={'sm'} marginY={0} p={0}>
              {props.text}
            </Text>
          </VStack>
        </Button>
      </Link>
    </Box>
  );
};
