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


class CheckIn(BaseModel):
    data: dict
    # name: str
    # date: str
    # in_time: str


@app.post("/api/post/check-in")
async def check_in(request: CheckIn):
    data = json.loads(request.json())
    print(*data.values())
    response = db_interface.check_in(*data.values())
    return {"message": "check-in"}

# @app.get("/api/post/add-new-dog/")
# async def add_new_dog():
#     return {"message": "/api/post/add-new_dog/"}
#     # data = await request.json()
#     # db_interface.Interface().add_dog_info(data)

#
# @app.get('/api/get/list/all/')
# async def get_list_all():
#     return {"message": "/api/post/add-new_dog/"}