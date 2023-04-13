import {Outlet} from "react-router-dom";
import {Box, Flex} from "@chakra-ui/react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import {atom, useRecoilState} from "recoil";
import {Helmet} from "react-helmet"

export default function Root() {
    // const intMainWidth = 1007
    // const mainWidth = intMainWidth + 'px';
    return (
        <>
            <Helmet>
                <title>쏘스윗 매니저</title>
            </Helmet>
            <Box m={'0'} overflow={'hidden'} bg={'white'}>
                <Box w={'100%'} h={'10vh'} top={0}>
                    {/*<Box position="fixed" w={'100%'} top={0}>*/}
                    {/*<Box position="fixed" top={0} left={`calc((100% - ${mainWidth})/2)`} w={mainWidth}>*/}
                    <Header/>
                </Box>
                <Flex overflow={'hidden'}>
                    <Outlet overflow={'hidden'}/>
                </Flex>
                <Box position="fixed" bottom={0} w={'100%'}>
                    {/*<Box position="fixed" bottom={0} left={`calc((100% - ${mainWidth})/2)`} w={mainWidth}>*/}
                    <Footer/>
                </Box>
            </Box>
        </>
    )
}