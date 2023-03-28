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
    def add_dog_info(self, data):
    # data={'dogName': 'dsa', 'dogInfo': '', 'dogBreed': '', 'dogGender': '', 'phone': '', 'dogWeight': ''}
        print(data)
        duplicate_check_query = f"select count(*) from dogs where name = '{data['dogName']}'"
        self.getter.execute(duplicate_check_query)
        # return False
        # print()
        print(duplicate_check_query)
        if self.getter.fetchone()[0] > 0:
            return False

        # print(f"""'{data['name']}',
        # {data['breed']},
        # {data['note']},
        # {data['gender']},
        # {data['phone']},
        # {data['weight']}""")
        # return
        insert_query = f"""
        INSERT INTO dogs VALUES (
        '{data['dogName']}',
        '{data['dogBreed']}',
        '{data['dogInfo']}',
        '{data['dogGender']}',
        '{data['phone']}',
        '{data['dogWeight']}'
        )
        """
        self.setter.execute(insert_query)
        self.db.commit()
        return True

    def get_dogs_list(self):
        query = f"select * from dogs"
        self.getter.execute(query)
        return self.getter.fetchall()

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

































