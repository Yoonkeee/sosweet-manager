import {createBrowserRouter} from "react-router-dom";
import Root from "./Root";
import {Heading, Image} from "@chakra-ui/react";
import Timetable from "./routes/Timetable";
import NewDog from "./components/NewDog";
import GetMessage from "./routes/GetMessage";
import History from "./routes/History";
// import Home from "./routes/Home";
// import Company from "./routes/Company";
// import CompanyDetail from "./components/CompanyDetail";
// import NotFound from "./routes/NotFound";
// import StackDetail from "./components/StackDetail";
// import {Stack} from "@chakra-ui/react";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
    children: [
      {
        path: '',
        element: <Image h={'80vh'} w={'100%'} src={'main_img2.jpeg'} objectFit={'cover'}></Image>
      },
      {
        path: 'timetable',
        element: <Timetable/>
      },
      {
        path: 'get-message',
        element: <GetMessage/>
      },
      {
        path: 'history',
        element: <History/>
      },
      
    ]
  }
])

export default router;