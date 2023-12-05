import { Box, HStack, Td, Text, Tr, useBreakpointValue, useDisclosure } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { formatMinuteToTime } from '../api';
import DogInfo from '../modals/DogInfo';
import ProfileAvatar from './ProfileAvatar';

export default function DogsListRow(props) {
  // console.log(props.data);
  let minutes = props.data.remaining_minutes;
  let data = props.data;
  let remainingMinutes = props.data.remaining_minutes;
  let formattedDuration = formatMinuteToTime(remainingMinutes);

  const showBreed = useBreakpointValue({ base: false, md: true });
  const showGender = useBreakpointValue({ base: false, md: true });
  const showPhone = useBreakpointValue({ base: false, md: true });
  const showWeight = useBreakpointValue({ base: false, md: true });

  const [nameColor, setNameColor] = useState('#1a2a52');
  useEffect(() => {
    if (remainingMinutes < 0) {
      setNameColor('red');
    }
  }, [remainingMinutes]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Tr cursor={'pointer'} onClick={onOpen} textAlign={'center'}>
        <Td borderColor="gray.300" borderRight="1px solid" p={2} textAlign={'center'}>
          <HStack>
            <ProfileAvatar clickable={false} name={data.name} />
            <Text
              fontSize={'sm'}
              fontWeight={'semibold'}
              isTruncated={true}
              textAlign={'center'}
              textColor={'#1a2a52'}
            >
              {data.name}
            </Text>
          </HStack>
        </Td>
        <Td borderColor="gray.300" borderRight="1px solid" p={2} textAlign={'center'}>
          <HStack fontSize={'sm'} fontWeight={'semibold'} justifyContent={'center'} whiteSpace={'pre-line'}>
            <Box w={data.weight ? '70%' : '100%'}>
              <Text textColor={'#1a2a52'}>{data.note}</Text>
            </Box>
            {data.weight ? (
              <Box borderLeft={data.weight ? '1px solid' : ''} w={'30%'}>
                <Text textColor={'darkgreen'}>
                  {data.weight ? '   ' + data.weight + (data.weight.includes('kg') ? '' : 'kg') : ''}
                </Text>
              </Box>
            ) : (
              ''
            )}
          </HStack>
        </Td>
        {showBreed && (
          <Td borderColor="gray.300" borderRight="1px solid" p={0} textAlign={'center'}>
            <Text fontSize={'md'} fontWeight={'semibold'} textAlign={'center'} textColor={'#1a2a52'}>
              {data.breed}
            </Text>
          </Td>
        )}
        {showGender && (
          <Td borderColor="gray.300" borderRight="1px solid" p={2} textAlign={'center'}>
            <Text fontSize={'md'} fontWeight={'semibold'} textAlign={'center'} textColor={'#1a2a52'}>
              {data.gender}
            </Text>
          </Td>
        )}
        {showPhone && (
          <Td borderColor="gray.300" borderRight="1px solid" p={2} textAlign={'center'}>
            <Text fontSize={'md'} fontWeight={'semibold'} textAlign={'center'} textColor={'#1a2a52'}>
              {data.phone}
            </Text>
          </Td>
        )}
        {showWeight && (
          <Td borderColor="gray.300" borderRight="1px solid" p={2} textAlign={'center'}>
            <Text fontSize={'md'} fontWeight={'semibold'} textAlign={'center'} textColor={'#1a2a52'}>
              {data.weight}
            </Text>
          </Td>
        )}
        <Td borderColor="gray.300" borderRight="1px solid" p={2} textAlign={'center'}>
          <Text fontSize={'md'} fontWeight={'semibold'} textAlign={'center'} textColor={nameColor}>
            {formattedDuration}
          </Text>
        </Td>
      </Tr>
      {isOpen ? <DogInfo isOpen={isOpen} name={data.name} onClose={onClose} /> : ''}
    </>
  );
}
