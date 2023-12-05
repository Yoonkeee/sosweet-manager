import { Outlet, useLocation } from 'react-router-dom';
import { Box, HStack, Img, Text } from '@chakra-ui/react';
import Header from './components/Header';
import Footer from './components/Footer';
import { Helmet } from 'react-helmet';
import React, { useEffect, useRef } from 'react';
import { setStatusBarHeight } from './store';
import { useDispatch, useSelector } from 'react-redux';
import { mainColor } from './api';

export default function Root() {
  const dispatch = useDispatch();
  useEffect(() => {
    if (window.navigator.standalone && window.innerHeight !== window.outerHeight) {
      // running as a standalone PWA on iOS and the viewport height doesn't match the device height
      const height = window.outerHeight - window.innerHeight;
      dispatch(setStatusBarHeight(height));
    }
  }, []);
  if (window.innerWidth < 500) {
    dispatch(setStatusBarHeight('env(safe-area-inset-top)'));
  } else {
    dispatch(setStatusBarHeight('0px'));
  }
  let statusBarHeight = useSelector(state => state.statusBarHeight);
  let location = useLocation().pathname;
  window.pulltorefresh = true;
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const div = useRef(null);
  const loading = useRef(null);
  const touchStartY = useRef(0);
  const loadingHeight = useRef(0);
  const handleRefresh = useRef(() => {
    window.location.reload();
  });
  const pxForVh = window.innerHeight / 100;
  const MAX_HEIGHT = pxForVh * 17;

  // const loadingBox = () => <Box h={'10vh'} bgColor={'red'}/>
  function handleTouchStart(e) {
    if (!div.current || div.current.scrollTop !== 0) return;
    touchStartY.current = e.changedTouches[0].screenY;
    const el = document.createElement('div');
    // el.style.cssText = 'background-color: "red"; transition: height 0s';
    el.style.cssText = 'background-color: #1a2a52; transition: height 0s';
    // el.style.cssText = '';
    // el.style.cssText = 'background-color: red; transition: height 0.3s ease-in-out;';
    // el.style.backgroundColor = 'red';
    // el.style.backgroundColor = 'transition: height 0.3s ease-in-out';
    // el.classList.add('loadingBox'); // 스타일을 지정해주자.
    div.current.prepend(el); // 스크롤되는 요소의 최상단에 추가해준다.
    loading.current = el;
  }

  function handleTouchMove(e) {
    // 만약 로딩 요소가 생성되었다면
    if (loading.current) {
      const screenY = e.changedTouches[0].screenY;
      const height = Math.floor(screenY - touchStartY.current);
      // const height = Math.floor((screenY - touchStartY.current) * 0.3);
      // height 가 0 보다 크다면
      if (height >= 0) {
        loading.current.style.height = `${height}px`;
        loadingHeight.current = height;
      }
      loading.current.style.cssText = 'background-color: #1a2a52; transition: height 0.3s; height: 0px';
    }
  }

  function handleTouchEnd() {
    // 로딩 요소의 높이가 MAX_HEIGHT 보다 크다면
    if (loading.current && loadingHeight.current >= MAX_HEIGHT) {
      document.documentElement.style.backgroundColor = mainColor;
      console.log(loadingHeight.current);
      // 새로고침 함수를 실행한다.
      handleRefresh.current();
      // div.current.removeChild(loading.current); // 로딩 요소를 제거
      loading.current = null;
      loadingHeight.current = 0;
      touchStartY.current = 0;
    } else {
      // loading.current.style.cssText = 'transition: height 0.3s; height: 0px';
      // loading.current.style.height = `0px`;
      // console.log(loadingHeight.current)
      touchStartY.current = 0;
    }
  }

  document.addEventListener('touchstart', handleTouchStart, { passive: true });
  document.addEventListener('touchmove', handleTouchMove, { passive: true });
  document.addEventListener('touchend', handleTouchEnd, { passive: true });
  return (
    <>
      <Helmet>
        <title>쏘스윗 매니저</title>
        <meta
          content="initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover"
          name="viewport"
        />
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="쏘스윗 매니저" />
        <link rel="shortcut icon" href="app_icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="app_icon.png" />
        {/*<link rel="apple-touch-startup-image" href="splash_screens/iPhone_14_Pro_Max_portrait.png" />*/}
        <link
          href="splash_screens/iPhone_14_Pro_Max_portrait.png"
          media="screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        />
        <link
          href="splash_screens/iPhone_14_Pro_Max_landscape.png"
          media="screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
          rel="apple-touch-startup-image"
        />
        />
        <link
          href="splash_screens/iPhone_14_Pro_landscape.png"
          media="screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
          rel="apple-touch-startup-image"
        />
        />
        <link
          href="splash_screens/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_landscape.png"
          media="screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
          rel="apple-touch-startup-image"
        />
        />
        <link
          href="splash_screens/iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_landscape.png"
          media="screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
          rel="apple-touch-startup-image"
        />
        />
        <link
          href="splash_screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_landscape.png"
          media="screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
          rel="apple-touch-startup-image"
        />
        />
        <link
          href="splash_screens/iPhone_11_Pro_Max__iPhone_XS_Max_landscape.png"
          media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
          rel="apple-touch-startup-image"
        />
        />
        <link
          href="splash_screens/iPhone_11__iPhone_XR_landscape.png"
          media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
          rel="apple-touch-startup-image"
        />
        />
        <link
          href="splash_screens/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_landscape.png"
          media="screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
          rel="apple-touch-startup-image"
        />
        />
        <link
          href="splash_screens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_landscape.png"
          media="screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
          rel="apple-touch-startup-image"
        />
        />
        <link
          href="splash_screens/4__iPhone_SE__iPod_touch_5th_generation_and_later_landscape.png"
          media="screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
          rel="apple-touch-startup-image"
        />
        />
        <link
          href="splash_screens/12.9__iPad_Pro_landscape.png"
          media="screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
          rel="apple-touch-startup-image"
        />
        />
        <link
          href="splash_screens/11__iPad_Pro__10.5__iPad_Pro_landscape.png"
          media="screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
          rel="apple-touch-startup-image"
        />
        />
        <link
          href="splash_screens/10.9__iPad_Air_landscape.png"
          media="screen and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
          rel="apple-touch-startup-image"
        />
        />
        <link
          href="splash_screens/10.5__iPad_Air_landscape.png"
          media="screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
          rel="apple-touch-startup-image"
        />
        />
        <link
          href="splash_screens/10.2__iPad_landscape.png"
          media="screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
          rel="apple-touch-startup-image"
        />
        />
        <link
          href="splash_screens/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_landscape.png"
          media="screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
          rel="apple-touch-startup-image"
        />
        />
        <link
          href="splash_screens/8.3__iPad_Mini_landscape.png"
          media="screen and (device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
          rel="apple-touch-startup-image"
        />
        />
        <link
          href="splash_screens/iPhone_14_Pro_portrait.png"
          media="screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        />
        <link
          href="splash_screens/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_portrait.png"
          media="screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        />
        <link
          href="splash_screens/iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_portrait.png"
          media="screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        />
        <link
          href="splash_screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_portrait.png"
          media="screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        />
        <link
          href="splash_screens/iPhone_11_Pro_Max__iPhone_XS_Max_portrait.png"
          media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        />
        <link
          href="splash_screens/iPhone_11__iPhone_XR_portrait.png"
          media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        />
        <link
          href="splash_screens/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_portrait.png"
          media="screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        />
        <link
          href="splash_screens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_portrait.png"
          media="screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        />
        <link
          href="splash_screens/4__iPhone_SE__iPod_touch_5th_generation_and_later_portrait.png"
          media="screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        />
        <link
          href="splash_screens/12.9__iPad_Pro_portrait.png"
          media="screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        />
        <link
          href="splash_screens/11__iPad_Pro__10.5__iPad_Pro_portrait.png"
          media="screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        />
        <link
          href="splash_screens/10.9__iPad_Air_portrait.png"
          media="screen and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        />
        <link
          href="splash_screens/10.5__iPad_Air_portrait.png"
          media="screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        />
        <link
          href="splash_screens/10.2__iPad_portrait.png"
          media="screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        />
        <link
          href="splash_screens/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_portrait.png"
          media="screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        />
        <link
          href="splash_screens/8.3__iPad_Mini_portrait.png"
          media="screen and (device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        />
      </Helmet>
      <Box m={'0'} overflow={'hidden'} style={{ fontFamily: 'GmarketSans' }} bgColor={mainColor} ref={div}>
        <Box bgColor={mainColor} h={'10vh'} position="fixed" top={0} w={'100%'} zIndex={1}>
          <Box
            h={statusBarHeight}
            bgColor={mainColor}
            textAlign={'center'}
            justifyContent={'center'}
            zIndex={55}
          />
          <Header />
        </Box>
        <Box overflowX={'hidden'} bgColor={'white'} zIndex={54}>
          <Box
            h={`calc(10vh + ${statusBarHeight})`}
            display={'flex'}
            bgColor={mainColor}
            justifyContent={'center'}
            alignItems={'flex-end'}
            zIndex={55}
          >
            <HStack alignItems={'flex-end'}>
              <Text
                color={'white'}
                fontFamily={'SingleDay'}
                fontSize={'small'}
                fontWeight={'extrabold'}
                lineHeight={'1.1em'}
                mb={'0.2em'}
              >
                새<br />로<br />고<br />침
              </Text>
              <Img src={'./logo/refresh_icon.png'} w={'50vw'} />
            </HStack>
            {/*window.location.reload()*/}
            {/*<Text color={'white'}>*/}
            {/*    새로고침*/}
            {/*</Text>*/}
          </Box>
          <Outlet overflowX={'hidden'} h={`calc(80vh + ${statusBarHeight})`} zIndex={56} />
        </Box>
        <Box bottom={0} h={'10vh'} position="fixed" w={'100%'} zIndex={0}>
          <Footer />
        </Box>
      </Box>
    </>
  );
}
