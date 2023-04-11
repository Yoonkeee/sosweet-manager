import time
from fastapi import FastAPI, Request, Response, status, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import db_interface
from pydantic import BaseModel
from typing import Optional
import json
from apscheduler.schedulers.background import BackgroundScheduler

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


def execute_keep_alive():
    print(db_interface.keep_alive())


scheduler = BackgroundScheduler()
scheduler.add_job(execute_keep_alive, 'interval', minutes=60)
scheduler.start()


class DictModel(BaseModel):
    data: dict


class ArrayModel(BaseModel):
    data: list


class StringModel(BaseModel):
    data: str


@app.post("/api/post/add-new-dog")
async def add_new_dog(request: DictModel):
    print('in add_new_dog')
    data = json.loads(request.json())
    response = db_interface.add_dog_info(*data.values())
    print(response)
    if not response:
        return Response(status_code=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(status_code=status.HTTP_200_OK)


@app.post("/api/post/mod-dog")
async def mod_dog(request: DictModel):
    print('in mod_dog')
    data = json.loads(request.json())
    response = db_interface.mod_dog_info(*data.values())
    print(response)
    if not response:
        return Response(status_code=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(status_code=status.HTTP_200_OK)


# mod-history
@app.post("/api/post/mod-history")
async def mod_history(request: DictModel):
    print('in mod_history')
    data = json.loads(request.json())
    response = db_interface.mod_history(*data.values())
    print(response)
    if not response:
        return Response(status_code=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(status_code=status.HTTP_200_OK)


@app.get("/api/get/dog-info/{name}")
async def get_dog_info(name: str):
    print('in get_dog_info')
    return db_interface.get_dog_info(name)


@app.get("/api/get/dogs-list")
async def get_dogs_list():
    print('in get_dogs_list')
    return db_interface.get_dogs_list()


@app.post("/api/post/check-in")
async def check_in(request: DictModel):
    print('in check_in')
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
async def check_out(request: DictModel):
    print('in check_out')
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
async def change_check_in(request: DictModel):
    print('in change_check_in')
    data = json.loads(request.json())
    print(*data.values())
    response = db_interface.change_check_in_time(*data.values())
    return {"message": "change-check-in"}


@app.get('/api/get/timetable/{date}')
async def get_table(date: str):
    print('in get_table')
    print(date)
    return db_interface.get_table(date)


# get data from used_table table with input name
@app.get('/api/get/history/{name}')
async def get_history(name: str):
    print('in get_history')
    print(name)
    result = db_interface.get_history(name)
    print(result)
    return result


# get data from paid table
@app.get('/api/get/pay-history/')
async def get_pay_history():
    print('in get_pay_history')
    result = db_interface.get_pay_history()
    print(result)
    return result


# cancel checkin with given id. url will be /api/post/cancel-checkin
# data will be { id: int }
@app.get("/api/get/cancel-checkin/{row_id}")
async def cancel_checkin(row_id: int):
    print('in cancel_checkin')
    print('row_id' + str(row_id))
    # data = json.loads(request.json())
    # print(*data.values())
    response = db_interface.cancel_checkin(row_id)
    return {"message": "cancel-checkin"}


@app.get("/api/get/cancel-pay/{row_id}")
async def cancel_checkin(row_id: int):
    print('in cancel_checkin')
    print('row_id ' + str(row_id))
    response = db_interface.cancel_pay(row_id)
    return {"message": "cancel-pay"}


@app.post('/api/post/purchase')
async def purchase(request: DictModel):
    print('in purchase')
    data = json.loads(request.json())
    print(*data.values())
    response = db_interface.purchase(*data.values())
    return {"message": "purchase"}


# add belt +1
@app.get('/api/get/set-belt/{row_id}/{belts}')
async def set_belt(row_id: int, belts: int):
    print('in set_belt')
    print(row_id)
    result = db_interface.set_belt(row_id, belts)
    print(result)
    return result


@app.get('/api/get/get-used-belts/{name}')
async def get_used_belts(name: str):
    print('in get_used_belts')
    print(name)
    result = db_interface.get_used_belts(name)
    print(result)
    return result


# check_used_belts
@app.get('/api/get/check-used-belts/{name}')
async def check_used_belts(name: str):
    print('in check_used_belts')
    print(name)
    result = db_interface.check_used_belts(name)
    print(result)
    return result


# post. make message with data coming. data is array of row_id
@app.post('/api/post/make-message')
async def make_message(request: ArrayModel):
    data = json.loads(request.json())
    print('in make_message')
    print(*data.values())
    response = db_interface.make_message(*data.values())
    return response


# post. check_used_date with data incoming. data is array of row_id
@app.post('/api/post/check-used-date')
async def check_used_date(request: ArrayModel):
    print('in check_used_date')
    data = json.loads(request.json())
    print(*data.values())
    response = db_interface.check_used_date(*data.values())
    return response


# @app.get("/api/post/add-new-dog/")
# async def add_new_dog():
#     return {"message": "/api/post/add-new_dog/"}
#     # data = await request.json()
#     # db_interface.Interface().add_dog_info(data)

#
# @app.get('/api/get/list/all/')
# async def get_list_all():
#     return {"message": "/api/post/add-new_dog/"}