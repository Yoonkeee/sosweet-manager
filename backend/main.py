from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
import db_interface
import ipdb
app = FastAPI()

# Configure CORS settings
# origins = [
#     "http://localhost:3000",
#     "https://localhost:3000",
#     "http://localhost",
#     "http://localhost:8000",
#     "https://localhost:8000",
#     "http://localhost:80",
#     "http://localhost:8080",
# ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    # allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    print('log')
    return {"message": "Hello World"}


@app.post("/api/post/add-new_dog/")
async def add_new_dog(request):
    data = await request.json()
    print(data)
    db_interface.Interface().add_dog_info(data)
    return {"message": "/api/post/add-new_dog/"}


# @app.get("/api/post/add-new_dog/")
# async def add_new_dog():
#     return {"message": "/api/post/add-new_dog/"}
#     # data = await request.json()
#     # db_interface.Interface().add_dog_info(data)
