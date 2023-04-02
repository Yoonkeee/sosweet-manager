import axios from "axios";
import Cookies from "js-cookie";
import {QueryFunctionContext} from "react-query";

const instance = axios.create({
  baseURL: "/api", withCredentials: true,
});

// export const getRoomReviews = ({ queryKey }: QueryFunctionContext) => {
//   const [_, roomPk] = queryKey;
//   return instance
//     .get(`rooms/${roomPk}/reviews`)
//     .then((response) => response.data);
// };

// export const addNewDog = ({ queryKey }: QueryFunctionContext) => {
//   const [_, data] = queryKey
//   console.log(data);
//   instance.post("post/add-new-dog", {data},
//     {
//       headers: {
//         "X-CSRFToken": Cookies.get("csrftoken") || "",
//       },
//     }).then((response) => {console.log(response.data)});
// }


export const test = () => {
  console.log("test");
  instance.get('test', {
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken") || "",
    },
  }).then((response) => console.log(response.data));
}


export const addNewDog = (data) => {
  return instance.post("/post/add-new-dog", {data},
    {
      headers: {
        "X-CSRFToken": Cookies.get("csrftoken") || "",
      },
    }).then((response) => response.data);
}

export const dogsList = () => {
  return instance.get("/get/dogs-list").then((response) => response.data);
}

export const checkIn = (data) => {
  return instance.post("/post/check-in", {data},
    {
      headers: {
        "X-CSRFToken": Cookies.get("csrftoken") || "",
      },
    }).then((response) => response.data);
}


export const checkOut = (data) => {
  return instance.post("/post/check-out", {data},
    {
      headers: {
        "X-CSRFToken": Cookies.get("csrftoken") || "",
      },
    }).then((response) => response.data);
}

// change check-in time
export const changeCheckIn = (data) => {
  return instance.post("/post/change-check-in", {data},
    {
      headers: {
        "X-CSRFToken": Cookies.get("csrftoken") || "",
      },
    }).then((response) => response.data);
}


// get timetable from fast api server. url is /get/timetable and passing date for parameter.
export const getTimeTable = ({queryKey}) => {
  const [_, date] = queryKey;
  console.log(date);
  return instance.get(`/get/timetable/${date}`).then((response) => response.data);
}


// get history from fast api server. url is /get/history and passing dog name for parameter.
export const getHistory = ({queryKey}) => {
  const [_, name] = queryKey;
  console.log(name);
  
  if(name === undefined || name === null || typeof name === "object")
    return null
  console.log('in api ' + name);
  return instance.get(`/get/history/${name}`).then((response) => response.data);
}


export const testAPI = (data) => {
  return data;
}












