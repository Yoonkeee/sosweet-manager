import time
from fastapi import FastAPI, Request, Response, status, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
import db_interface
from pydantic import BaseModel
from typing import Optional
import json
import pytz
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


def set_backup():
    print(db_interface.set_backup())


tz = pytz.timezone('Asia/Seoul')
scheduler = BackgroundScheduler()
# for test 2
# scheduler.add_job(execute_keep_alive, 'interval', minutes=60)
scheduler.add_job(execute_keep_alive, 'cron', minute='15', timezone=tz)
scheduler.add_job(set_backup, 'cron', hour=9, minute=0, timezone=tz)
scheduler.add_job(set_backup, 'cron', hour=12, minute=0, timezone=tz)
scheduler.add_job(set_backup, 'cron', hour=15, minute=0, timezone=tz)
scheduler.add_job(set_backup, 'cron', hour=18, minute=0, timezone=tz)
scheduler.add_job(set_backup, 'cron', hour=21, minute=0, timezone=tz)
# scheduler.add_job(set_backup, 'interval', hours=12, next_run_time=datetime.now(tz) + timedelta(minutes=1))
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
    print('in get_dog_info' + name)
    return db_interface.get_dog_info(name)


@app.get("/api/get/dogs-list")
async def get_dogs_list():
    print('in get_dogs_list')
    return db_interface.get_dogs_list()


@app.get("/api/get/unchecked_used_list")
async def get_unchecked_used_list():
    print('in get_unchecked_used_list')
    return db_interface.get_unchecked_used_list()


@app.post("/api/post/check-in")
async def check_in(request: DictModel):
    print('in check_in')
    data = json.loads(request.json())
    print(*data.values())
    response = db_interface.check_in(*data.values())
    return {"message": "check-in"}


@app.post("/api/post/check-out")
async def check_out(request: DictModel):
    print('in check_out')
    data = json.loads(request.json())
    print(*data.values())
    response = db_interface.check_out(*data.values())
    return {"message": "check-out"}


#get_used_row_info
@app.get("/api/get/used-row-info/{row_id}")
async def get_used_row_info(row_id: int):
    print('in get_used_row_info')
    print(row_id)
    return db_interface.get_used_row_info(row_id)


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


@app.get('/api/get/checkout-timetable/{date}')
async def get_checkout_timetable(date: str):
    print('in get_checkout_timetable')
    print(date)
    return db_interface.get_checkout_timetable(date)


# get data from used_table table with input name
@app.get('/api/get/history-nonchecked')
async def get_history_nonchecked():
    print('in get_history_nonchecked')
    result = db_interface.get_history_nonchecked()
    print(result)
    return result


# get data from used_table table with input name
@app.get('/api/get/history/{name}')
async def get_history(name: str):
    print('in get_history')
    print(name)
    result = db_interface.get_history(name, False)
    print(result)
    return result


@app.get('/api/get/history/{name}/{message}')
async def get_history(name: str):
    print('in get_history with message')
    print(name)
    result = db_interface.get_history(name, True)
    print(result)
    return result


# get data from paid table
@app.get('/api/get/pay-history')
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


@app.get("/api/get/cancel-history/{row_id}")
async def cancel_history(row_id: int):
    print('in cancel_history')
    print('row_id' + str(row_id))
    # data = json.loads(request.json())
    # print(*data.values())
    response = db_interface.cancel_history(row_id)
    return {"message": "cancel-history"}


@app.get("/api/get/cancel-pay/{row_id}")
async def cancel_checkin(row_id: int):
    print('in cancel_checkin')
    print('row_id ' + str(row_id))
    response = db_interface.cancel_pay(row_id)
    return {"message": "cancel-pay"}


@app.post('/api/post/pay')
async def pay(request: DictModel):
    print('in pay')
    data = json.loads(request.json())
    print(*data.values())
    response = db_interface.pay(*data.values())
    return {"message": "pay"}


@app.post('/api/post/mod-pay')
async def mod_pay(request: DictModel):
    print('in mod_pay')
    data = json.loads(request.json())
    print(*data.values())
    response = db_interface.mod_pay(*data.values())
    return {"message": "pay"}


# get_id_belt
@app.get('/api/get/id-belt/{row_id}')
async def get_id_belt(row_id: int):
    print('in get_id_belt')
    print(row_id)
    result = db_interface.get_id_belt(row_id)
    print(result)
    return result


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


@app.get('/api/get/not_out_timetable')
async def not_out_timetable():
    print('in not_out_timetable')
    result = db_interface.not_out_timetable()
    print(result)
    return result


# get_id_info
@app.get('/api/get/id-info/{row_id}')
async def get_id_info(row_id: int):
    print('in get_id_info')
    print(row_id)
    result = db_interface.get_id_info(row_id)
    print(result)
    return result

# @app.get("/api/post/add-new-dog/")
# async def add_new_dog():
#     return {"message": "/api/post/add-new_dog/"}
#     # data = await request.json()
#     # db_interface.Interface().add_dog_info(data)

#
# @app.get('/api/get/list/all/')
# async def get_list_all():
#     return {"message": "/api/post/add-new_dog/"}