import {
  AspectRatio,
  Box,
  Button,
  HStack,
  Image,
  Text,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import { mainColor } from '../api';
import { Link } from 'react-router-dom';
import ModifyDog from '../modals/ModifyDog';

let homeBoxWidth;
let homePaddingX;
let homeBoxBetweenMargin;
let homeBoxPadding;
let statusBarHeight;

function getHomePaddingTop() {
  const gap = window.outerHeight - window.innerHeight;
  statusBarHeight = gap + 'px';
  let unitVh = window.innerHeight / 100;
  const height = window.innerHeight - gap;
  const paddingVh = 1.36;
  const result = (paddingVh * unitVh * 100) / height; // 59px in iPhone 14 Pro Max
  // console.log(window.outerHeight);
  // console.log(window.innerHeight);
  // console.log(window.outerHeight - window.innerHeight);
  // console.log(result);
  // console.log(unitVh);
  // console.log(result * unitVh);
  return result + 'vh';
}

export const homeGapY = getHomePaddingTop();
export default function Home() {
  // export const homeBoxWidth = (45.4 * viewRatio) + 'vw'
  const viewRatio = useBreakpointValue({ base: 1, md: 0.4 });
  homeBoxWidth = 45.4 * viewRatio + 'vw';
  homePaddingX = 3.41 * viewRatio + 'vw';
  homeBoxBetweenMargin = 2.32 * viewRatio + 'vw';
  homeBoxPadding = 3.56 * viewRatio + 'vw';

  return (
    <>
      <Box
        bgColor={'gray.200'}
        h={'100%'}
        mx={0}
        p={0}
        paddingTop={homeGapY}
        w={'100%'}
        // marginBottom={'150px'}
      >
        {/*  ROW 1  */}
        <HStack
          alignContent={'center'}
          alignItems={'center'}
          justifyContent={'center'}
          mb={homeGapY}
          px={homePaddingX}
        >
          {/*  LEFT  */}
          <HomeSquareBox
            image={'./logo/박프로.webp'}
            letterColor={'#752D2A'}
            link={'/hotelling'}
            title={'호텔링'}
          />
          <Box vw={homeBoxBetweenMargin} />
          {/*  RIGHT  */}
          <HomeSquareBox
            image={'./logo/박하로.webp'}
            letterColor={'#ffffff'}
            link={'/timetable'}
            title={'놀이방'}
          />
        </HStack>
        {/*  ROW 2  */}
        <HStack
          alignContent={'center'}
          alignItems={'center'}
          justifyContent={'center'}
          mb={homeGapY}
          px={homePaddingX}
        >
          {/*  LEFT  */}
          <HomeSquareBox
            bgColor={'#FEBE8C'}
            image={'./logo/프로4.png'}
            letterColor={'#1F7480'}
            link={'/dogs-list'}
            title={'🐶 목록'}
          />
          <Box vw={homeBoxBetweenMargin} />
          {/*  RIGHT  */}
          <HomeSquareBox
            bgColor={'#95BDFF'}
            image={'./logo/프로3.png'}
            letterColor={'white'}
            link={'/get-message'}
            title={'메세지'}
            // letterColor={'#95BDFF'}
          />
        </HStack>

        {/*  ROW 3  */}
        <HStack
          alignContent={'center'}
          alignItems={'center'}
          justifyContent={'center'}
          mb={homeGapY}
          px={homePaddingX}
        >
          {/*  LEFT  */}
          <HomeRectBoxTwoByOne
            bgColor={'#DFFFD8'}
            image={'./logo/프로1.png'}
            letterColor={mainColor}
            link={'/history'}
            title={'이용 내역'}
          />
          {/*  RIGHT  */}
          <HomeRectBoxTwoByOne
            bgColor={'#F7C8E0'}
            image={'./logo/프로2.png'}
            letterColor={'white'}
            link={'/pay-history'}
            title={'결제 내역'}
          />
        </HStack>

        {/*  ROW 4  */}
        <HStack
          alignContent={'center'}
          alignItems={'center'}
          justifyContent={'center'}
          mb={homeGapY}
          px={homePaddingX}
        >
          {/*  LEFT  */}
          <HomeRectBoxTwoByOneModal
            // link={''}
            bgColor={'#FFF6BD'}
            component={ModifyDog}
            image={'./logo/프로6.png'}
            letterColor={'#4B437D'}
            title={'🐶 수정'}
          />
          {/*  RIGHT  */}
          <HomeRectBoxTwoByOne
            bgColor={mainColor}
            image={'./logo/프로5.png'}
            letterColor={'white'}
            link={'/'}
            title={'남는버튼'}
          />
        </HStack>
        <Box h={'4vh'} />
      </Box>
      {/*<Box h={'30vh'} bgColor={mainColor}/>*/}
      <Box bgColor={'gray.200'} h={'15vh'} />
    </>
  );
}

const HomeSquareBox = props => {
  return (
    <AspectRatio ratio={1} w={homeBoxWidth}>
      <Link h={'100%'} to={props.link} w={'100%'}>
        <Box
          bgColor={props.bgColor}
          border={`2px solid ${mainColor}`}
          dropShadow={'lg'}
          h={'100%'}
          rounded={'2xl'}
          w={'100%'}
        >
          <Image rounded="xl" src={props.image} />
          <Text
            bottom={homeBoxPadding}
            color={props.letterColor}
            fontSize="4xl"
            fontWeight="extrabold"
            left={homeBoxPadding}
            position="absolute"
            textAlign="center"
            top={homeBoxPadding}
          >
            {props.title}
          </Text>
        </Box>
      </Link>
    </AspectRatio>
  );
};

const HomeRectBoxTwoByOne = props => {
  return (
    <AspectRatio ratio={2} w={homeBoxWidth}>
      <Link h={'100%'} to={props.link} w={'100%'}>
        <Box
          bgColor={props.bgColor}
          border={`2px solid ${mainColor}`}
          dropShadow={'lg'}
          h={'100%'}
          rounded={'2xl'}
          w={'100%'}
        >
          <Image rounded="xl" src={props.image} />
          <Text
            bottom={homeBoxPadding}
            color={props.letterColor}
            fontSize="2xl"
            fontWeight="extrabold"
            left={homeBoxPadding}
            position="absolute"
            textAlign="center"
            top={homeBoxPadding}
          >
            {props.title}
          </Text>
        </Box>
      </Link>
    </AspectRatio>
  );
};
const HomeRectBoxTwoByOneModal = props => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <AspectRatio ratio={2} w={homeBoxWidth}>
        <Button h={'100%'} m={0} onClick={onOpen} p={0} w={'100%'}>
          <Box
            bgColor={props.bgColor}
            border={`2px solid ${mainColor}`}
            dropShadow={'lg'}
            h={'100%'}
            rounded={'2xl'}
            w={'100%'}
          >
            <Image rounded="xl" src={props.image} w={'100%'} />
            <Text
              bottom={homeBoxPadding}
              color={props.letterColor}
              fontSize="2xl"
              fontWeight="extrabold"
              left={homeBoxPadding}
              position="absolute"
              textAlign="center"
              top={homeBoxPadding}
            >
              {props.title}
            </Text>
          </Box>
        </Button>
      </AspectRatio>
      <props.component isOpen={isOpen} onClose={onClose} />
    </>
  );
};
