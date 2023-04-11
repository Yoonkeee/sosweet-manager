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

export const getDogInfo = (name) => {
  return instance.get(`/get/dog-info/${name}`).then((response) => response.data);
}

export const addNewDog = (data) => {
  if(data.officialName === '' || data.officialName === null) {
    data.officialName = data.dogName;
  }
  console.log(data);
  return instance.post("/post/add-new-dog", {data}, {
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken") || "",
    },
  }).then((response) => response.data);
}

export const modDog = (data) => {
  if(data.officialName === '' || data.officialName === null) {
    data.officialName = data.dogName;
  }
  console.log(data);
  return instance.post("/post/mod-dog", {data}, {
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken") || "",
    },
  }).then((response) => response.data);
}

export const dogsList = () => {
  return instance.get("/get/dogs-list").then((response) => response.data);
}

export const checkIn = (data) => {
  return instance.post("/post/check-in", {data}, {
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken") || "",
    },
  }).then((response) => response.data);
}


export const checkOut = (data) => {
  return instance.post("/post/check-out", {data}, {
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken") || "",
    },
  }).then((response) => response.data);
}

// change check-in time
export const changeCheckIn = (data) => {
  return instance.post("/post/change-check-in", {data}, {
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken") || "",
    },
  }).then((response) => response.data);
}

// reset data with data
export const modHistory = (data) => {
  return instance.post("/post/mod-history", {data}, {
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken") || "",
    },
  }).then((response) => response.data);
}


export const cancelCheckin = (id) => {
  return instance.get(`/get/cancel-checkin/${id}`).then((response) => response.data);
}


// get timetable from fast api server. url is /get/timetable and passing date for parameter.
export const getTimeTable = ({queryKey}) => {
  const [_, date] = queryKey;
  console.log('in api getTimeTable ' + date);
  return instance.get(`/get/timetable/${date}`).then((response) => response.data);
}


// get history from fast api server. url is /get/history and passing dog name for parameter.
// export const getHistory = (name) => {
export const getHistory = ({queryKey}) => {
  const [_, name] = queryKey;
  console.log('in history ' + name);
  if (name === undefined || name === null ||
    name === '' || typeof name === "object") return null
  console.log('in api history ' + name);
  return instance.get(`/get/history/${name}`).then((response) => response.data);
}


// @app.get('/api/get/get-used-belts/{name}')
// async def get_used_belts(name: str):
// print(name)
// result = db_interface.get_used_belts(name)
// print(result)
// return result
//
//
// # check_used_belts
// @app.get('/api/get/check-used-belts/{name}')
// async def check_used_belts(name: str):
// print(name)
// result = db_interface.check_used_belts(name)
// print(result)
// return result

// set belt with post
export const setBelt = ([id, belt]) => {
  console.log('in api addBelt ' + id + ' ' + belt);
return instance.get(`/get/set-belt/${id}/${belt}`).then((response) => response.data);
}


export const getUsedBelts = (name) => {
  console.log('in api getUsedBelts ' + name);
  if (name === undefined || name === null ||
    name === '' || typeof name === "object") return null
  return instance.get(`/get/get-used-belts/${name}`).then((response) => response.data);
}


export const checkUsedBelts = (name) => {
  console.log('in api checkUsedBelts ' + name);
  return instance.get(`/get/check-used-belts/${name}`).then((response) => response.data);
}


// purchase
export const purchase = (data) => {
  return instance.post("/post/purchase", {data}, {
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken") || "",
    },
  }).then((response) => {
    if(data.belts !== undefined) {
      console.log('in api purchase ' + data.belts);
      checkUsedBelts(data.name);
    }
    return response.data
  });
}

export const makeMessage = (data) => {
  console.log('in api makeMessage ' + data);
  console.log(data);
  
  if (data === undefined || data === null ||
    data === []) return null
  return instance.post("/post/make-message", {data}, {
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken") || "",
    },
  }).then((response) => response.data);
}


// # post. check_used_date with data incoming. data is array of row_id
// @app.post('/api/post/check-used-date')
// async def check_used_date(request: ArrayModel):
// data = json.loads(request.json())
// print(*data.values())
// response = db_interface.check_used_date(*data.values())
// return response

export const checkUsedDate = (data) => {
  console.log('in api checkUsedDate ' + data);
  return instance.post("/post/check-used-date", {data}, {
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken") || "",
    },
  }).then((response) => response.data);
}






export const testAPI = (data) => {
  return data;
}












