import {
  Button,
  HStack,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Td,
  Text,
  Tr,
  useBreakpoint,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import { MinusIcon } from '@chakra-ui/icons';
import { useEffect, useRef, useState } from 'react';
// import "react-icons/all";
import { BiPlus } from 'react-icons/bi';
import Checkout from '../modals/Checkout';
import ChangeCheckInTime from '../modals/ChangeCheckInTime';
import { getProfile, setBelt } from '../api';
import DogInfo from '../modals/DogInfo';
import { useQuery, useQueryClient } from 'react-query';
import ProfileAvatar from './ProfileAvatar';

export default function TimetableRow(props) {
  // console.log('in timetable row')
  // console.log(props.data)
  const { id, name, in_time, out_time, belts: loaded_belts, date } = props.data;
  const [belts, setBelts] = useState(loaded_belts);
  const { isOpen: isOutOpen, onOpen: onOutOpen, onClose: onOutClose } = useDisclosure();
  const { isOpen: checkinModIsOpen, onOpen: checkinModOnOpen, onClose: checkinModOnClose } = useDisclosure();
  const queryClient = useQueryClient();
  useEffect(() => {
    if (belts)
      // console.log('belts effected')
      // console.log(belts)
      setBelt([id, belts]);
    queryClient.refetchQueries(['timetable', date]);
  }, [belts]);
  const breakpoint = useBreakpoint({ ssr: false });
  const buttonSize = useBreakpointValue({ base: 'xs', md: 'md' }, { ssr: false });
  const beltButtonSize = useBreakpointValue({ base: 'sm', md: 'md' }, { ssr: false });
  const [nameColor, setNameColor] = useState('#1a2a52');
  const [beltBadgeColor, setBeltBadgeColor] = useState('green.500');
  useEffect(() => {
    if (props.data.remaining_minutes < 0) {
      setNameColor('#ff7f50');
    }
  }, [props.data.remaining_minutes]);
  const { isOpen: dogInfoModIsOpen, onClose: dogInfoModOnClose, onOpen: dogInfoModOnOpen } = useDisclosure();
  const dogInfoModOnCloseFn = () => {
    dogInfoModOnClose();
    queryClient.refetchQueries(['timetable', date]);
  };
  useEffect(() => {
    if (belts > 0) setBeltBadgeColor('orange.500');
    else setBeltBadgeColor('green.500');
  }, [belts]);

  // text name resize hook
  const textRef = useRef(null);
  // const handleResize = () => {
  //     const text = textRef.current;
  //     const container = text.parentNode;
  //     const containerWidth = container.offsetWidth;
  //     console.log(text.scrollWidth, containerWidth);
  //     if (text.scrollWidth > containerWidth) {
  //         text.style.fontSize = "0.9rem"; // adjust this value as needed
  //     } else {
  //         text.style.fontSize = "xl";
  //     }
  // };
  // useEffect(() => {
  //     const text = textRef.current;
  //     const container = text.parentNode;
  //     container.addEventListener("resize", handleResize);
  //     return () => {
  //         container.removeEventListener("resize", handleResize);
  //     };
  // }, []);
  // useEffect(() => {
  //     handleResize();
  // }, [textRef.current?.textContent]);

  const { isLoading: isProfileLoading, data: profileData } = useQuery(['profile', name, date], getProfile);
  const [profileUrl, setProfileUrl] = useState('');
  useEffect(() => {
    if (profileData) {
      setProfileUrl(profileData);
    } else {
      setProfileUrl('');
    }
  }, [profileData]);

  return (
    <>
      <Tr textAlign={'center'}>
        <Td p={0} textAlign={'center'}>
          <HStack>
            <ProfileAvatar name={name} />
            <Button
              alignItems={'center'}
              colorScheme={'white'}
              fontSize={'xl'}
              fontWeight={'bold'}
              justifyContent={'flex-start'}
              onClick={dogInfoModOnOpen}
              px={0}
              size={buttonSize}
              textColor={nameColor}
              w={'80%'}
            >
              {/*<Text isTruncated={true} fontSize={'lg'}>*/}
              {/*<Text fontSize={'xl'} style={{ fontSize: "clamp(12px, 2vw, 24px)", overflow: "hidden", textOverflow: "ellipsis"}}>*/}
              <Text fontSize="xl" isTruncated={true} ref={textRef}>
                {name}
              </Text>
            </Button>
          </HStack>
        </Td>
        <Td px={0} textAlign={'center'}>
          <Button
            colorScheme={'white'}
            fontSize={'xl'}
            fontWeight={'bold'}
            onClick={checkinModOnOpen}
            px={0}
            size={buttonSize}
            textColor={nameColor}
            w={'80%'}
          >
            {in_time}
            <ChangeCheckInTime
              id={id}
              in_or_out={'in'}
              in_time={in_time}
              isOpen={checkinModIsOpen}
              name={name}
              onClose={checkinModOnClose}
            />
          </Button>
        </Td>
        <Td h={'100%'} p={0} textAlign={'center'}>
          <Button
            _hover={{
              textDecoration: 'none',
              color: 'white',
              bg: '#526491',
              transform: 'scale(1.2)',
            }}
            bg={'#1a2a52'}
            color={'white'}
            fontSize={'md'}
            h={'4vh'}
            onClick={onOutOpen}
            position={'inherit'}
            size={buttonSize}
            w={'80%'}
          >
            퇴장
          </Button>
        </Td>
        <Td h={'100%'} p={0} textAlign={'center'}>
          <Popover>
            <PopoverTrigger>
              <IconButton
                bgColor={beltBadgeColor}
                color={'white'}
                icon={<Text>{belts}</Text>}
                isRound={true}
                size="md"
              />
            </PopoverTrigger>
            <Portal>
              <PopoverContent w={'100%'}>
                <PopoverArrow />
                <PopoverBody>
                  <HStack justifyContent={'center'}>
                    <IconButton
                      _hover={{
                        textDecoration: 'none',
                        transform: 'scale(1.2)',
                      }}
                      aria-label="Search database"
                      colorScheme="red"
                      icon={<MinusIcon />}
                      mr={'0.5vw'}
                      onClick={() => {
                        if (belts > 0) setBelts(belts - 1);
                      }}
                      position={'inherit'}
                      size={beltButtonSize}
                    />
                    <IconButton
                      _hover={{
                        textDecoration: 'none',
                        color: 'white',
                        bg: '#526491',
                        transform: 'scale(1.2)',
                      }}
                      aria-label="Search database"
                      bg={'#1a2a52'}
                      color={'white'}
                      fontSize={'2xl'}
                      icon={<BiPlus />}
                      onClick={() => {
                        setBelts(belts + 1);
                      }}
                      position={'inherit'}
                      size={beltButtonSize}
                    />
                  </HStack>
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </Popover>
        </Td>
      </Tr>
      {/*name, in_time, out_time*/}
      <Checkout belts={belts} id={id} in_time={in_time} isOpen={isOutOpen} name={name} onClose={onOutClose} />
      {dogInfoModIsOpen ? (
        <DogInfo id={Date.now()} isOpen={dogInfoModIsOpen} name={name} onClose={dogInfoModOnCloseFn} />
      ) : (
        ''
      )}
    </>
  );
}
