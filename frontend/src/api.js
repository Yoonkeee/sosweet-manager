import axios from "axios";
import Cookies from "js-cookie";

const instance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/", withCredentials: true,
});

export const addNewDog = (data) => {
  console.log(data);
  instance.post("/post/add-new-dog", {data},
    {
      headers: {
        "X-CSRFToken": Cookies.get("csrftoken") || "",
      },
    });
}

