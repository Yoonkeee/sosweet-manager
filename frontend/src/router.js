import {createBrowserRouter} from "react-router-dom";
import Root from "./Root";
import {Heading, Image} from "@chakra-ui/react";
import Timetable from "./routes/Timetable";
import NewDog from "./modals/NewDog";
import GetMessage from "./routes/GetMessage";
import History from "./routes/History";
import DogsList from "./routes/DogsList";
import PayHistory from "./routes/PayHistory";
import NotFound from "./components/NotFound";
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
    // notFoundElement: <NotFound/>,
    errorElement: <NotFound/>,
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
        element: <History />
      },
      {
        path: 'pay-history',
        element: <PayHistory />
      },
      {
        path: 'dogs-list',
        element: <DogsList/>
      },
      
    ]
  }
])

export default router;