import {useEffect} from "react";
import {AspectRatio, Box, Button, HStack, Image, Text, useBreakpointValue, useDisclosure} from "@chakra-ui/react";
import {mainColor} from "../api";
import {useSelector} from "react-redux";
import {Link} from "react-router-dom";
import ModifyDog from "../modals/ModifyDog";


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
    const paddingVh = 1.36
    const result = (paddingVh * unitVh * 100) / height;  // 59px in iPhone 14 Pro Max
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
    const viewRatio = useBreakpointValue({base: 1, md: 0.4});
    homeBoxWidth = (45.4 * viewRatio) + 'vw'
    homePaddingX = (3.41 * viewRatio) + 'vw'
    homeBoxBetweenMargin = (2.32 * viewRatio) + 'vw'
    homeBoxPadding = (3.56 * viewRatio) + 'vw'

    return (
        <>
            <Box w={'100%'} h={'100%'} mx={0} p={0} bgColor={'gray.200'}
                 paddingTop={homeGapY}
                // marginBottom={'150px'}
            >
                {/*  ROW 1  */}
                <HStack
                    px={homePaddingX}
                    mb={homeGapY}
                    alignContent={'center'}
                    alignItems={'center'}
                    justifyContent={'center'}
                >
                    {/*  LEFT  */}
                    <HomeSquareBox
                        link={'/hotelling'}
                        title={'호텔링'}
                        image={'./logo/박프로.webp'}
                        letterColor={'#752D2A'}
                    />
                    <Box vw={homeBoxBetweenMargin}/>
                    {/*  RIGHT  */}
                    <HomeSquareBox
                        link={'/timetable'}
                        title={'놀이방'}
                        image={'./logo/박하로.webp'}
                        letterColor={'#ffffff'}
                    />
                </HStack>
                {/*  ROW 2  */}
                <HStack
                    px={homePaddingX}
                    alignContent={'center'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    mb={homeGapY}
                >
                    {/*  LEFT  */}
                    <HomeSquareBox
                        link={'/dogs-list'}
                        title={'🐶 목록'}
                        image={'./logo/프로4.png'}
                        bgColor={'#FEBE8C'}
                        letterColor={'#1F7480'}
                    />
                    <Box vw={homeBoxBetweenMargin}/>
                    {/*  RIGHT  */}
                    <HomeSquareBox
                        link={'/get-message'}
                        title={'메세지'}
                        image={'./logo/프로3.png'}
                        letterColor={'white'}
                        bgColor={'#95BDFF'}
                        // letterColor={'#95BDFF'}
                    />
                </HStack>

                {/*  ROW 3  */}
                <HStack
                    px={homePaddingX}
                    alignContent={'center'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    mb={homeGapY}
                >
                    {/*  LEFT  */}
                    <HomeRectBoxTwoByOne
                        link={'/history'}
                        title={'이용 내역'}
                        image={'./logo/프로1.png'}
                        bgColor={'#DFFFD8'}
                        letterColor={mainColor}
                    />
                    {/*  RIGHT  */}
                    <HomeRectBoxTwoByOne
                        link={'/pay-history'}
                        title={'결제 내역'}
                        image={'./logo/프로2.png'}
                        bgColor={'#F7C8E0'}
                        letterColor={'white'}
                    />
                </HStack>

                {/*  ROW 4  */}
                <HStack
                    px={homePaddingX}
                    alignContent={'center'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    mb={homeGapY}
                >
                    {/*  LEFT  */}
                    <HomeRectBoxTwoByOneModal
                        // link={''}
                        component={ModifyDog}
                        title={'🐶 수정'}
                        image={'./logo/프로6.png'}
                        bgColor={'#FFF6BD'}
                        letterColor={'#4B437D'}
                    />
                    {/*  RIGHT  */}
                    <HomeRectBoxTwoByOne
                        link={'/'}
                        title={'남는버튼'}
                        image={'./logo/프로5.png'}
                        bgColor={mainColor}
                        letterColor={'white'}
                    />
                </HStack>
                <Box h={'4vh'}/>
            </Box>
            {/*<Box h={'30vh'} bgColor={mainColor}/>*/}
            <Box h={'15vh'} bgColor={'gray.200'}/>
        </>
    )
}

const HomeSquareBox = (props) => {
    return (
        <AspectRatio w={homeBoxWidth} ratio={1}>
            <Link to={props.link} w={'100%'} h={'100%'}>
                <Box
                    border={`2px solid ${mainColor}`}
                    dropShadow={'lg'}
                    w={'100%'}
                    h={'100%'}
                    rounded={'2xl'}
                    bgColor={props.bgColor}
                >
                    <Image src={props.image} rounded="xl"/>
                    <Text
                        position="absolute"
                        bottom={homeBoxPadding}
                        left={homeBoxPadding}
                        top={homeBoxPadding}
                        textAlign="center"
                        fontSize="4xl"
                        fontWeight="extrabold"
                        color={props.letterColor}
                    >
                        {props.title}
                    </Text>
                </Box>
            </Link>
        </AspectRatio>
    )
}

const HomeRectBoxTwoByOne = (props) => {
    return (
        <AspectRatio w={homeBoxWidth} ratio={2}>
            <Link to={props.link} w={'100%'} h={'100%'}>
                <Box
                    border={`2px solid ${mainColor}`}
                    bgColor={props.bgColor}
                    dropShadow={'lg'}
                    w={'100%'}
                    h={'100%'}
                    rounded={'2xl'}
                >
                    <Image src={props.image} rounded="xl"/>
                    <Text
                        position="absolute"
                        bottom={homeBoxPadding}
                        left={homeBoxPadding}
                        top={homeBoxPadding}
                        textAlign="center"
                        fontSize="2xl"
                        fontWeight="extrabold"
                        color={props.letterColor}
                    >
                        {props.title}
                    </Text>
                </Box>
            </Link>
        </AspectRatio>
    )
}
const HomeRectBoxTwoByOneModal = (props) => {
    const {isOpen, onOpen, onClose} = useDisclosure()
    return (
        <>
            <AspectRatio w={homeBoxWidth} ratio={2}>
                <Button onClick={onOpen} w={'100%'} h={'100%'} p={0} m={0}>
                    <Box
                        border={`2px solid ${mainColor}`}
                        bgColor={props.bgColor}
                        dropShadow={'lg'}
                        w={'100%'}
                        h={'100%'}
                        rounded={'2xl'}
                    >
                        <Image src={props.image} w={'100%'} rounded="xl"/>
                        <Text
                            position="absolute"
                            bottom={homeBoxPadding}
                            left={homeBoxPadding}
                            top={homeBoxPadding}
                            textAlign="center"
                            fontSize="2xl"
                            fontWeight="extrabold"
                            color={props.letterColor}
                        >
                            {props.title}
                        </Text>
                    </Box>
                </Button>
            </AspectRatio>
            <props.component isOpen={isOpen} onClose={onClose}/>
        </>
    )
}