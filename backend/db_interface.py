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

    def test(self):
        return {'message': 'CORS TEST SUCCESSFUL'}

    # dogs
    def add_dog_info(self, data):
        print(data)
        duplicate_check_query = f"select count(*) from dogs where name = '{data['name']}'"
        self.getter.execute(duplicate_check_query)
        # return False
        # print()
        print(duplicate_check_query)
        if self.getter.fetchone()[0] > 0:
            return False

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
        columns = [col[0] for col in self.getter.description]  # Get column names
        return [dict(zip(columns, row)) for row in self.getter.fetchall()]

    def mod_dog_info(self, name, breed, note):
        pass

    def del_dog_info(self, name):
        pass

    # timetable
    def get_table(self, date):
        select_query = f"SELECT * FROM timetable WHERE date = '{date}' and out_time is NULL ORDER BY in_time"
        print(select_query)
        self.getter.execute(select_query)
        columns = [col[0] for col in self.getter.description]  # Get column names
        data = [dict(zip(columns, row)) for row in self.getter.fetchall()]
        return [{'name': row['name'],
                 'in_time': row['in_time'].strftime('%H:%M'),
                 'out_time': row['out_time'].strftime('%H:%M') if row['out_time'] is not None else '',
                 'date': row['date'],
                 'belts': row['belts'],
                 'id': row['id']}
                for row in data]

        # return [dict(zip(columns, row)) for row in self.getter.fetchall()]

    # used_table
    def get_history(self, name):
        select_query = f"SELECT * FROM used_table WHERE name = '{name}' ORDER BY date DESC"
        # print(select_query)
        self.getter.execute(select_query)
        columns = [col[0] for col in self.getter.description]
        data = [dict(zip(columns, row)) for row in self.getter.fetchall()]
        # print(data)
        return data




    def check_in(self, data):
        name, date, in_time, row_id = data['name'], data['date'], data['in_time'], data['id']
        # in_time 15:55
        # date 2021-08-01
        in_time = date + ' ' + in_time
        insert_query = f"""
        insert into timetable (name, in_time, date, id, belts)
        values ('{name}',
        '{in_time}',
        STR_TO_DATE('{date.replace('-', '')}', '%Y%m%d'),
        {row_id},
        0
        );
        """
        print(insert_query)
        self.setter.execute(insert_query)
        self.db.commit()
        return True

    def check_out(self, data):
        name, date, in_time, out_time, belts, row_id = \
            data['name'], data['date'], data['in_time'], data['out_time'], data['belts'], data['id']
        # insert data into used
        insert_query = f"""
        insert into used_table (name, date, used_minutes, id, belts, checked, in_time, out_time)
        values (
        '{name}',
        STR_TO_DATE('{date.replace('-', '')}', '%Y%m%d'),
        {data['minutes']},
        {row_id},
        {belts},
        0,
        '{date + ' ' + in_time}',
        '{date + ' ' + out_time}'
        );
        """
        print(insert_query)
        self.setter.execute(insert_query)
        self.db.commit()

        # set timetable out_time, belts with id
        update_query = f"""
        update timetable
        set out_time = '{date + ' ' + out_time}'
        , belts = {belts}
        where id = {row_id};
        """
        print(update_query)
        self.setter.execute(update_query)
        self.db.commit()
        return True

    # change check-in time
    def change_check_in_time(self, data):
        name, date, in_time, row_id = data['name'], data['date'], data['in_time'], data['id']
        # in_time 15:55
        # date 2021-08-01
        in_time = date + ' ' + in_time
        update_query = f"""
        update timetable
        set in_time = '{in_time}'
        where id = {row_id};
        """
        print(update_query)
        self.setter.execute(update_query)
        self.db.commit()
        return True
    

    def add_table_dog_out(self, name, date, in_time, out_time, belts):
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
