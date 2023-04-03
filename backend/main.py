from fastapi import FastAPI, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
import db_interface
from pydantic import BaseModel
from typing import Optional
import json

app = FastAPI()

# Configure CORS settings
origins = [
    "http://localhost:3000",
    "https://localhost:3000",
    "http://localhost",
    "http://localhost:8000",
    "https://localhost:8000",
    "http://localhost:80",
    "http://localhost:8080",
    "http://127.0.0.1:3000",
    "https://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    # allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db_interface = db_interface.Interface()


@app.get("/")
async def root():
    print('log')
    return {"message": "Hello World"}


@app.get("/api/test")
async def test():
    return db_interface.test()


class NewDog(BaseModel):
    data: dict
    # dogName: str
    # dogGender: Optional[str] = None
    # dogBreed: Optional[str] = None
    # dogAge: Optional[str] = None
    # dogWeight: Optional[str] = None
    # dogInfo: Optional[str] = None
    # phone: Optional[str] = None


@app.post("/api/post/add-new-dog")
async def add_new_dog(request: NewDog):
    data = json.loads(request.json())
    response = db_interface.add_dog_info(*data.values())
    print(response)
    if not response:
        return Response(status_code=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(status_code=status.HTTP_200_OK)


@app.get("/api/get/dogs-list")
async def get_dogs_list():
    return db_interface.get_dogs_list()


class CheckInOut(BaseModel):
    data: dict
    # name: str
    # date: str
    # in_time: str
    # id: int


@app.post("/api/post/check-in")
async def check_in(request: CheckInOut):
    data = json.loads(request.json())
    print(*data.values())
    response = db_interface.check_in(*data.values())
    return {"message": "check-in"}

# check_out is post request and data will be {
#     "id": 1680347566755,
#     "name": "나나1",
#     "in_time": "14:14",
#     "out_time": "16:55",
#     "belts": "2",
#     "date": "2023-04-01",
#     "minutes": 161
# }


@app.post("/api/post/check-out")
async def check_out(request: CheckInOut):
    data = json.loads(request.json())
    print(*data.values())
    response = db_interface.check_out(*data.values())
    return {"message": "check-out"}

# change check-in time. url will be /api/post/change-check-in
# data will be {
#     "id": 1680347566755,
#     "check_in_time": "14:14"
# }


@app.post("/api/post/change-check-in")
async def change_check_in(request: CheckInOut):
    data = json.loads(request.json())
    print(*data.values())
    response = db_interface.change_check_in_time(*data.values())
    return {"message": "change-check-in"}


@app.get('/api/get/timetable/{date}')
async def get_table(date: str):
    print(date)
    return db_interface.get_table(date)


# get data from used_table table with input name
@app.get('/api/get/history/{name}')
async def get_history(name: str):
    print(name)
    result = db_interface.get_history(name)
    print(result)
    return result


# cancel checkin with given id. url will be /api/post/cancel-checkin
# data will be { id: int }
@app.get("/api/get/cancel-checkin/{row_id}")
async def cancel_checkin(row_id: int):
    print(row_id)
    # data = json.loads(request.json())
    # print(*data.values())
    response = db_interface.cancel_checkin(row_id)
    return {"message": "cancel-checkin"}



# @app.get("/api/post/add-new-dog/")
# async def add_new_dog():
#     return {"message": "/api/post/add-new_dog/"}
#     # data = await request.json()
#     # db_interface.Interface().add_dog_info(data)

#
# @app.get('/api/get/list/all/')
# async def get_list_all():
#     return {"message": "/api/post/add-new_dog/"}