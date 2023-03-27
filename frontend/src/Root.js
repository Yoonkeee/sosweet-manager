import {Outlet} from "react-router-dom";
import {Box, Flex} from "@chakra-ui/react";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Root() {
  const intMainWidth = 1007
  const mainWidth = intMainWidth + 'px';
  return (
    <Box w={mainWidth} m={'0 auto'} overflow={'hidden'}>
      <Box position="fixed" top={0} left={`calc((100% - ${mainWidth})/2)`} w={mainWidth}>
        <Header/>
      </Box>
      <Flex my={'10vh'} w={mainWidth} overflow={'hidden'} >
        <Outlet overflow={'hidden'}/>
      </Flex>
      <Box position="fixed" bottom={0} left={`calc((100% - ${mainWidth})/2)`} w={mainWidth}>
        <Footer/>
      </Box>
    </Box>)
}