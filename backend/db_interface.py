import pymysql
import environ
import os
from pathlib import Path
from typing import *


class Interface:
    cleansed_data: dict = {}
    cursor: pymysql.Connection.cursor = None
    db: pymysql.connections.Connection = None
    setter: pymysql.Connection.cursor = None
    getter: pymysql.Connection.cursor = None
    # column_names: List[str] = ''

    def __init__(self):
        # database connection
        env = environ.Env()
        BASE_DIR = Path(__file__).resolve().parent
        environ.Env.read_env(os.path.join(BASE_DIR, ".env"))
        HOST, PORT, SCHEMA, DB_USER, PASSWORD = env("HOST"), int(env("PORT")), env("SCHEMA"), env("DB_USER"), env("PASSWORD")
        self.db = pymysql.connect(host=HOST, port=PORT, user=DB_USER, password=PASSWORD, db=SCHEMA, charset="utf8")
        self.setter = self.db.cursor()
        self.getter = self.db.cursor()

    # dogs
    def add_dog_info(self, name, breed='', note='', gender='', phone='', weight=''):
        print('test')
        insert_query = f"""
        INSERT INTO dogs VALUES (
        '{name}', 
        '{breed}',
        '{note}',
        '{gender}',
        '{phone}',
        '{weight}'
        )
        """
        self.setter.execute(insert_query)
        self.db.commit()

    def mod_dog_info(self, name, breed, note):
        pass

    def del_dog_info(self, name):
        pass

    # timetable
    def add_table_dog_in(self, name, date, in_time):
        pass

    def add_table_dog_out(self, name, date, in_time, out_time):
        pass

    def mod_table_dog_in(self, name, date, in_time):
        pass

    # payment
    def add_purchase(self, name, date, hours):
        pass

    def mod_purchase(self, name, date, hours):
        pass

    def del_purchase(self, name, date):
        pass

    # 이용시간 - 이용내역
    def used_hitory(self, name):
        pass

    def mod_history(self, name, date, in_time, out_time):
        pass

































