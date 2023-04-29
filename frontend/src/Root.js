import {Outlet, useLocation} from "react-router-dom";
import {Box, Flex, Img, Text} from "@chakra-ui/react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import {Helmet} from "react-helmet"
import React, {useEffect, useState} from "react";
import {makeTemporal, setStatusBarHeight} from "./store";
import {useDispatch, useSelector} from "react-redux";
import {mainColor} from "./api";


export default function Root() {
    const dispatch = useDispatch();
    useEffect(() => {
        if (window.navigator.standalone && window.innerHeight !== window.outerHeight) {
            // running as a standalone PWA on iOS and the viewport height doesn't match the device height
            const height = window.outerHeight - window.innerHeight;
            dispatch(setStatusBarHeight(height))
            console.log('!');
            console.log(height)
            console.log('@');
        }
    }, []);
    // let statusBarHeight;
    if (window.innerWidth < 500) {
        dispatch(setStatusBarHeight('env(safe-area-inset-top)'))
    } else {
        dispatch(setStatusBarHeight('0px'))
    }
    // log it if current location(pwd) is changed
    let statusBarHeight = useSelector(state => state.statusBarHeight)
    let location = useLocation().pathname;

    // useEffect(() => {
    //     console.log('statusBarHeight : ' + (window.outerHeight - window.innerHeight) + 'px');
    //     console.log('inner Height : ' + window.innerHeight + 'px');
    //     console.log('20vh : ' + parseInt(window.innerHeight * 0.2) + 'px');
    //     console.log('current location : ' + location);
    // }, [location]);
    useEffect(() => {
        console.log('#');
        console.log(statusBarHeight)
        console.log('$');
    }, [statusBarHeight]);
// @font-face {
//         font-family: 'GmarketSansMedium';
//         src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansMedium.woff') format('woff');
//         font-weight: normal;
//         font-style: normal;
//     }
    window.pulltorefresh = true;
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return (
        <>
            <Helmet>
                {/*<link rel="preconnect" href="https://fonts.googleapis.com"/>*/}
                {/*<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/>*/}
                {/*<link href='https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansMedium.woff' rel="stylesheet"/>*/}
                <title>쏘스윗 매니저</title>
                <meta name="viewport"
                      content="initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover"/>
                <meta name="apple-mobile-web-app-capable" content="yes"/>
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
                <meta name="apple-mobile-web-app-title" content="쏘스윗 매니저"/>
                <link rel="shortcut icon" href="app_icon.png"/>
                <link rel="apple-touch-icon" sizes="180x180" href="app_icon.png"/>
                {/*<link rel="apple-touch-startup-image" href="splash_screens/iPhone_14_Pro_Max_portrait.png" />*/}
                <link rel="apple-touch-startup-image"
                      media="screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
                      href="splash_screens/iPhone_14_Pro_Max_portrait.png"/>
                <link rel="apple-touch-startup-image"
                      media="screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
                      href="splash_screens/iPhone_14_Pro_Max_landscape.png"/>
                <link rel="apple-touch-startup-image"
                      media="screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
                      href="splash_screens/iPhone_14_Pro_landscape.png"/>
                <link rel="apple-touch-startup-image"
                      media="screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
                      href="splash_screens/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_landscape.png"/>
                <link rel="apple-touch-startup-image"
                      media="screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
                      href="splash_screens/iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_landscape.png"/>
                <link rel="apple-touch-startup-image"
                      media="screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
                      href="splash_screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_landscape.png"/>
                <link rel="apple-touch-startup-image"
                      media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
                      href="splash_screens/iPhone_11_Pro_Max__iPhone_XS_Max_landscape.png"/>
                <link rel="apple-touch-startup-image"
                      media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
                      href="splash_screens/iPhone_11__iPhone_XR_landscape.png"/>
                <link rel="apple-touch-startup-image"
                      media="screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
                      href="splash_screens/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_landscape.png"/>
                <link rel="apple-touch-startup-image"
                      media="screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
                      href="splash_screens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_landscape.png"/>
                <link rel="apple-touch-startup-image"
                      media="screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
                      href="splash_screens/4__iPhone_SE__iPod_touch_5th_generation_and_later_landscape.png"/>
                <link rel="apple-touch-startup-image"
                      media="screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
                      href="splash_screens/12.9__iPad_Pro_landscape.png"/>
                <link rel="apple-touch-startup-image"
                      media="screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
                      href="splash_screens/11__iPad_Pro__10.5__iPad_Pro_landscape.png"/>
                <link rel="apple-touch-startup-image"
                      media="screen and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
                      href="splash_screens/10.9__iPad_Air_landscape.png"/>
                <link rel="apple-touch-startup-image"
                      media="screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
                      href="splash_screens/10.5__iPad_Air_landscape.png"/>
                <link rel="apple-touch-startup-image"
                      media="screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
                      href="splash_screens/10.2__iPad_landscape.png"/>
                <link rel="apple-touch-startup-image"
                      media="screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
                      href="splash_screens/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_landscape.png"/>
                <link rel="apple-touch-startup-image"
                      media="screen and (device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
                      href="splash_screens/8.3__iPad_Mini_landscape.png"/>
                <link rel="apple-touch-startup-image"
                      media="screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
                      href="splash_screens/iPhone_14_Pro_portrait.png"/>
                <link rel="apple-touch-startup-image"
                      media="screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
                      href="splash_screens/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_portrait.png"/>
                <link rel="apple-touch-startup-image"
                      media="screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
                      href="splash_screens/iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_portrait.png"/>
                <link rel="apple-touch-startup-image"
                      media="screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
                      href="splash_screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_portrait.png"/>
                <link rel="apple-touch-startup-image"
                      media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
                      href="splash_screens/iPhone_11_Pro_Max__iPhone_XS_Max_portrait.png"/>
                <link rel="apple-touch-startup-image"
                      media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
                      href="splash_screens/iPhone_11__iPhone_XR_portrait.png"/>
                <link rel="apple-touch-startup-image"
                      media="screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
                      href="splash_screens/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_portrait.png"/>
                <link rel="apple-touch-startup-image"
                      media="screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
                      href="splash_screens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_portrait.png"/>
                <link rel="apple-touch-startup-image"
                      media="screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
                      href="splash_screens/4__iPhone_SE__iPod_touch_5th_generation_and_later_portrait.png"/>
                <link rel="apple-touch-startup-image"
                      media="screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
                      href="splash_screens/12.9__iPad_Pro_portrait.png"/>
                <link rel="apple-touch-startup-image"
                      media="screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
                      href="splash_screens/11__iPad_Pro__10.5__iPad_Pro_portrait.png"/>
                <link rel="apple-touch-startup-image"
                      media="screen and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
                      href="splash_screens/10.9__iPad_Air_portrait.png"/>
                <link rel="apple-touch-startup-image"
                      media="screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
                      href="splash_screens/10.5__iPad_Air_portrait.png"/>
                <link rel="apple-touch-startup-image"
                      media="screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
                      href="splash_screens/10.2__iPad_portrait.png"/>
                <link rel="apple-touch-startup-image"
                      media="screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
                      href="splash_screens/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_portrait.png"/>
                <link rel="apple-touch-startup-image"
                      media="screen and (device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
                      href="splash_screens/8.3__iPad_Mini_portrait.png"/>
            </Helmet>
            {/*<Box m={'0'} overflow={'hidden'}>*/}
            {/*    <Box w={'100%'} h={'10vh'} top={0}>*/}
            {/*        /!*<Box position="fixed" w={'100%'} top={0}>*!/*/}
            {/*        /!*<Box position="fixed" top={0} left={`calc((100% - ${mainWidth})/2)`} w={mainWidth}>*!/*/}
            {/*        <Header/>*/}
            {/*    </Box>*/}
            {/*    <Box overflow={'hidden'}>*/}
            {/*        /!*<Image src={'app_icon.png'} />*!/*/}
            {/*        <Outlet overflow={'hidden'} h={'100%'}/>*/}
            {/*    </Box>*/}
            {/*    <Box position="fixed" bottom={0} w={'100%'}>*/}
            {/*        /!*<Box position="fixed" bottom={0} left={`calc((100% - ${mainWidth})/2)`} w={mainWidth}>*!/*/}
            {/*        <Footer/>*/}
            {/*    </Box>*/}
            {/*</Box>*/}
            <Box m={'0'} overflow={'hidden'} style={{fontFamily: "GmarketSans"}} bgColor={mainColor}>
                <Box w={'100%'} h={'10vh'} top={0} position="fixed" zIndex={1} bgColor={mainColor}>
                <Box h={statusBarHeight} bgColor={mainColor} textAlign={'center'} justifyContent={'center'} zIndex={55} />
                {/*<Box w={'100%'} h={`calc(10vh + ${window.outerHeight - window.innerHeight}px)`} top={0} position="fixed" zIndex={1}>*/}
                {/*<Box w={'100%'} h={'10vh'} top={0} mt={statusBarHeight} position="fixed" zIndex={1}>*/}
                    {/*<Box position="fixed" w={'100%'} top={0}>*/}
                    {/*<Box position="fixed" top={0} left={`calc((100% - ${mainWidth})/2)`} w={mainWidth}>*/}
                    <Header/>
                </Box>
                {/*<Flex overflowX={'hidden'}>*/}
                <Box overflowX={'hidden'} bgColor={'white'} zIndex={54}
                     // overscrollBehavior={'contain'}
                >
                {/*<Box overflowX={'hidden'} h={`calc(80vh - ${statusBarHeight}px)`}>*/}
                    <Box
                        h={`calc(10vh + ${statusBarHeight})`} display={'flex'} bgColor={mainColor}
                        justifyContent={'center'} alignItems={'flex-end'} zIndex={55}>
                        <Img src={'refresh_icon.png'} w={'50vw'}/>
                        {/*<Text color={'white'}>*/}
                        {/*    새로고침*/}
                        {/*</Text>*/}
                    </Box>
                    <Outlet overflowX={'hidden'} h={`calc(80vh + ${statusBarHeight})`} zIndex={56}/>
                    {/*<Outlet overflowX={'hidden'} mb={'10vh'} h={`calc(80vh + ${statusBarHeight})`} zIndex={56}/>*/}
                    {/*<Box*/}
                    {/*    h={`calc(10vh + ${statusBarHeight})`} display={'flex'} bgColor={mainColor}*/}
                    {/*>*/}
                    {/*</Box>*/}
                    {/*<Outlet overflowX={'hidden'} h={'80vh'}/>*/}
                    {/*<Box h={'10vh'} bgColor={'gray.200'}/>*/}
                </Box>
                {/*</Flex>*/}
                <Box position="fixed" bottom={0} w={'100%'} h={'10vh'} zIndex={0}>
                {/*<Box position="fixed" bottom={0} h={'10vh'} w={'100%'}>*/}
                    {/*<Box position="fixed" bottom={0} left={`calc((100% - ${mainWidth})/2)`} w={mainWidth}>*/}
                    <Footer/>
                </Box>
            </Box>
        </>
    )
}

// <Box w={mainWidth} m={'0 auto'} overflow={'hidden'} position={'fixed'} sx={{ overflowX: 'auto' }}>
//     <Box position="fixed" top={0} left={`calc((100% - ${mainWidth})/2)`} w={mainWidth} sx={{ overflowX: 'auto' }}>
//         <Header/>
//     </Box>
//     <Flex my={'10vh'} w={mainWidth} overflow={'hidden'} position={'fixed'} left={`calc((100% - ${mainWidth})/2)`}>
//         <Outlet overflow={'hidden'} />
//     </Flex>
//     <Box position="fixed" bottom={0} left={`calc((100% - ${mainWidth})/2)`} w={mainWidth}>
//         <Footer/>
//     </Box>
// </Box>
// </>
// )
// }
// const mainWidth = '100vw'