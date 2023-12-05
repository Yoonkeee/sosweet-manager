import { HStack, Td, Text, Tr, useBreakpointValue } from '@chakra-ui/react';
import { strToLocaleWithoutWeekday } from '../api';
import { Temporal } from '@js-temporal/polyfill';
import ProfileAvatar from './ProfileAvatar';

export default function GetMessageRow(props) {
  const formatTime = timeStr => {
    const time = Temporal.PlainTime.from(timeStr);
    return time.toLocaleString([], {
      hour12: false,
      hour: 'numeric',
      minute: '2-digit',
    });
  };
  const formatTimeFromMinutes = minutes => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const datetime = Temporal.PlainTime.from({ hour: hours, minute: mins });
    return datetime.toLocaleString([], {
      hour12: false,
      hour: 'numeric',
      minute: '2-digit',
    });
  };
  const { belts, date, id, in_time, name, out_time, used_minutes } = props.data;
  const [checked, setChecked] = props.state;
  const showInTime = useBreakpointValue({ base: false, md: true });
  const showOutTime = useBreakpointValue({ base: false, md: true });
  const showBelt = useBreakpointValue({ base: false, md: true });

  return (
    <>
      <Tr>
        <Td px={0} py={'1vh'}>
          <HStack>
            <ProfileAvatar name={name} />
            <Text fontSize="xl" fontWeight="bold" textAlign={'center'} textColor="#1a2a52">
              {name}
            </Text>
          </HStack>
        </Td>
        <Td px={0} py={'1vh'}>
          <Text fontSize={'md'} fontWeight={'bold'} textAlign={'center'} textColor={'#1a2a52'}>
            {strToLocaleWithoutWeekday(date)}
          </Text>
        </Td>
        {showInTime && (
          <Td px={0} py={'1vh'}>
            <Text fontSize="lg" fontWeight={'bold'} textAlign={'center'} textColor={'#1a2a52'}>
              {formatTime(in_time)}
            </Text>
          </Td>
        )}
        {showOutTime && (
          <Td px={0} py={'1vh'}>
            <Text fontSize="lg" fontWeight={'bold'} textAlign={'center'} textColor={'#1a2a52'}>
              {formatTime(out_time)}
            </Text>
          </Td>
        )}
        <Td px={0} py={'1vh'}>
          <Text fontSize="lg" fontWeight={'bold'} textAlign={'center'} textColor={'#1a2a52'}>
            {formatTimeFromMinutes(used_minutes)}
          </Text>
        </Td>
        {showBelt && (
          <Td px={0} py={'1vh'}>
            <Text fontSize="lg" fontWeight={'bold'} textAlign={'center'} textColor={'#1a2a52'}>
              {belts > 0 ? <Text fontSize="lg">{belts}</Text> : ''}
            </Text>
          </Td>
        )}
        {/*<Td px={0} py={'1vh'}>*/}
        {/*  <Text textAlign={'center'} fontWeight={'bold'} textColor={'#1a2a52'}>*/}
        {/*    <Checkbox size={'lg'} borderColor={'black'} position={'inherit'}*/}
        {/*              onChange={(e) => {*/}
        {/*                if (e.target.checked) {*/}
        {/*                  setChecked([...checked, id]);*/}
        {/*                } else {*/}
        {/*                  setChecked(checked.filter((rowId) => rowId !== id));*/}
        {/*                }*/}
        {/*              }*/}
        {/*              }/>*/}
        {/*  </Text>*/}
        {/*</Td>*/}
      </Tr>
    </>
  );
}
