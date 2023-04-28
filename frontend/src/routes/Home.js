import {useEffect} from "react";
import {AspectRatio, Box, Button, HStack, Image, Text, useDisclosure} from "@chakra-ui/react";
import {homeBoxBetweenMargin, homeBoxPadding, homeBoxWidth, homeGapY, homePaddingX, mainColor} from "../api";
import {useSelector} from "react-redux";
import {Link} from "react-router-dom";
import ModifyDog from "../modals/ModifyDog";


export default function Home() {
    return (
        <Box w={'100%'} h={'100%'} m={0} p={0} bgColor={'gray.200'}
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
                    image={'박프로.webp'}
                    letterColor={'#752D2A'}
                />
                <Box vw={homeBoxBetweenMargin}/>
                {/*  RIGHT  */}
                <HomeSquareBox
                    link={'/timetable'}
                    title={'놀이방'}
                    image={'박하로.webp'}
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
                    image={'박프로.webp'}
                    letterColor={'#752D2A'}
                />
                <Box vw={homeBoxBetweenMargin}/>
                {/*  RIGHT  */}
                <HomeSquareBox
                    link={'/get-message'}
                    title={'메세지'}
                    image={'박하로.webp'}
                    letterColor={'#ffffff'}
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
                    image={'프로1.png'}
                    letterColor={mainColor}
                />
                {/*  RIGHT  */}
                <HomeRectBoxTwoByOne
                    link={'/pay-history'}
                    title={'결제 내역'}
                    image={'프로1.png'}
                    letterColor={mainColor}
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
                    image={'프로1.png'}
                    letterColor={mainColor}
                />
                {/*  RIGHT  */}
                <HomeRectBoxTwoByOne
                    link={'/'}
                    title={'뭐만들지?'}
                    image={'프로1.png'}
                    letterColor={mainColor}
                />
            </HStack>
            <Box h={'4vh'}/>
        </Box>
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
                    bgColor={'white'}
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
                        bgColor={'white'}
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