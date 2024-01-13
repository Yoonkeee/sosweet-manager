import os
import shutil
import time
from fastapi import FastAPI, Request, Response, status, BackgroundTasks, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta

from pathlib import Path
import os
from starlette.responses import FileResponse

import db_interface
from pydantic import BaseModel
from typing import Optional
import json
import pytz
from apscheduler.schedulers.background import BackgroundScheduler
import requests
import logging
# from dotenv import load_dotenv
from dotenv import dotenv_values


# load env variables. This replaces environ.
# load_dotenv()
env = dotenv_values(".env")

logger = logging.getLogger(__name__)




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
# env = environ.Env()
# BASE_DIR = Path(__file__).resolve().parent
# environ.Env.read_env(os.path.join(BASE_DIR, ".env"))
# CF_ID, CF_TOKEN = env("CF_ID"), env("CF_TOKEN")


CF_ID, CF_TOKEN = env["CF_ID"], env["CF_TOKEN"]


@app.middleware("http")
async def log_date_time(request: Request, call_next):
    current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    user_agent = request.headers.get("User-Agent", "unknown")
    print(f"Request user: {user_agent}")
    print(f"Request time: {current_time}")
    response = await call_next(request)
    return response


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
for h in range(10, 21):
    for m in [1, 31]:
        scheduler.add_job(set_backup, 'cron', hour=h, minute=m, timezone=tz)

scheduler.add_job(execute_keep_alive, 'cron', minute='15', timezone=tz)
# scheduler.add_job(set_backup, 'cron', hour=9, minute=0, timezone=tz)
# scheduler.add_job(set_backup, 'cron', hour=12, minute=0, timezone=tz)
# scheduler.add_job(set_backup, 'cron', hour=15, minute=0, timezone=tz)
# scheduler.add_job(set_backup, 'cron', hour=18, minute=0, timezone=tz)
# scheduler.add_job(set_backup, 'cron', hour=21, minute=0, timezone=tz)
# scheduler.add_job(set_backup, 'interval', hours=12, next_run_time=datetime.now(tz) + timedelta(minutes=1))
scheduler.start()


class DictModel(BaseModel):
    data: dict


class ArrayModel(BaseModel):
    data: list


class StringModel(BaseModel):
    data: str


class ProfileModel(BaseModel):
    name: str
    fileId: str


@app.get('/api/get/profile/upload-url')
async def get_upload_url():
    # url = f'https://api.cloudflare.com/client/v4/accounts/{CF_ID}/images/v1'
    url = f"https://api.cloudflare.com/client/v4/accounts/{CF_ID}/images/v2/direct_upload"
    one_time_url = requests.post(
        url, headers={"Authorization": f"Bearer {CF_TOKEN}"}
    )
    # return one_time_url
    one_time_url = one_time_url.json()
    result = one_time_url.get("result")
    return result
    # return Response({"id": result.get("id"), "uploadURL": result.get("uploadURL")})
    # return Response({"uploadURL": result.get("uploadURL")})


@app.post("/api/post/add-profile")
async def add_profile(request: ProfileModel):
    print('in add_profile', request.name, request.fileId)
    name = request.name
    file_id = request.fileId

    if db_interface.add_profile(name, file_id):
        return Response(status_code=status.HTTP_200_OK)
    else:
        return Response(status_code=status.HTTP_400_BAD_REQUEST)


@app.get("/api/get/profile/{name}")
async def get_profile(name: str):
    result = db_interface.get_profile(name)
    print('in get_profile', name)
    print(result)
    if result:
        return result
    else:
        return ''


# @app.post("/api/post/add-profile/{name}")
# async def add_profile(file: UploadFile = File(...), name: str = None):
#     print(file)
#     name = name.replace(" ", "")
#     file_location = f"profiles/{name}.png"
#     with open(file_location, "wb") as buffer:
#         shutil.copyfileobj(file.file, buffer)
#     return {"filename": name}
#
#
# @app.get("/api/get/profile/{name}")
# async def get_profile(name: str):
#     print('in get_profile', name)
#     name = name.replace(" ", "")
#     # look for directory if profiles/{name} exists
#     path = f"profiles/{name}"
#     if os.path.exists(path):
#         print('exist')
#         # response = f"http://127.0.0.1:8000/profiles/{name}"
#         response = FileResponse(f"profiles/{name}", media_type="image/png")
#     else:
#         print('not exist')
#         response = ''
#     print(response)
#     return response


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


# TODO: 놀이방 시간표에 존재하는 강아지들이 이 쿼리로 조회됨. 확인 필요
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

# get allergy
@app.get('/api/get/allergy/{name}')
async def get_allergy(name: str):
    print('in get_allergy')
    # print(row_id)
    result = db_interface.get_allergy(name)
    # print(result)
    return result


@app.get('/api/get/switch-history-to-paid/{row_id}')
async def switch_history_to_paid(row_id: str):
    print('in switch_history_to_paid')
    # print(row_id)
    result = db_interface.switch_history_to_paid(row_id)
    print(result)
    if result:
        return Response(status_code=status.HTTP_200_OK)
    else:
        return Response(status_code=status.HTTP_400_BAD_REQUEST)

    # def get_dogs_not_paid_belts(self):
    # def get_dogs_not_paid_minutes(self):


@app.get('/api/get/pay-belts-required')
async def get_pay_belts_required():
    result = db_interface.get_pay_belts_required()
    # print(result)
    return result


@app.get('/api/get/pay-time-required')
async def get_pay_time_required():
    result = db_interface.get_pay_time_required()
    # print(result)
    return result
