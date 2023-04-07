import pymysql
import environ
import os
from pathlib import Path
from typing import *
from datetime import datetime, timedelta


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

    def keep_alive(self):
        self.getter.execute("SELECT 1")
        print('db connection keep alive')
        return self.getter.fetchone()

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
        # in_time form 15:55
        # date form 2021-08-01
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

    def cancel_checkin(self, row_id):
        delete_query = f"""
        delete from timetable
        where id = {row_id};
        """
        print(delete_query)
        self.setter.execute(delete_query)
        self.db.commit()
        return True

    def purchase(self, data):
        name, hours, date = data['name'], data['hours'], data['date']
        # date form 2021-08-01
        # hours form 1
        # name form 'test'
        insert_query = f"""
        insert into purchased (name, date, minutes)
        values (
        '{name}',
        STR_TO_DATE('{date.replace('-', '')}', '%Y%m%d'),
        {int(hours) * 60}
        );
        """
        print(insert_query)
        self.setter.execute(insert_query)
        self.db.commit()
        return True

    def set_belt(self, row_id, belt):
        update_query = f"""
        update timetable
        set belts = {belt}
        where id = {row_id};
        """
        print(update_query)
        self.setter.execute(update_query)
        self.db.commit()
        return True


    def get_used_belts(self, name):
        select_query = f"""
        select sum(belts) as belts from used_table
        where name = '{name}' and
        checked_belts is null
        """
        self.getter.execute(select_query)
        columns = [col[0] for col in self.getter.description]
        data = [dict(zip(columns, row)) for row in self.getter.fetchall()]
        belts = data[0]['belts']
        if not belts:
            return 0
        return belts

    def check_used_belts(self, name):
        update_query = f"""
        update used_table
        set checked_belts = 1
        where name = '{name}' and
        checked_belts is null
        """
        self.setter.execute(update_query)
        self.db.commit()
        return True

    def make_message(self, row_ids):
        today = datetime.today().strftime('%Y-%m-%d')
        update_query = f"""
        update used_table
        set checked = 1
        , checked_date = '{today}'
        where id in ({row_ids});
        """
        self.setter.execute(update_query)
        self.db.commit()

        # get date, in_time, out_time, used_minutes from used_table with row_ids
        # transform used_minutes to format 'HH:MM'
        # make a message with data form like
        # '안녕하세요~쏘스윗펫입니다😊\n'
        #         + '❤{name}❤놀이방 이용 내역 알려드립니다. \n'
        # there will be remaining minutes and show it like
        # + '놀이방 남은 시간:18시간45분 \n'
        # '2월17일 16:10-19:05(2:55) \n'
        #         + '2월19일 11:00-12:40(1:40) \n'
        #         + '2월22일 17:30-20:05(2:35) \n'
        # and footer message will be added in sum of used_minutes format like 'H시간 M분'.
        # like + '\n' + '총 사용시간:7시간10분 \n'
        # add message remaining minutes - sum of used_minutes will be shown as
        # + '차감 후 남은 시간:11시간35분입니다. \n'
        # if result is negative, add message
        # + '다음에 오시면 충전부탁드려요~ \n'

        select_query = f"""
        select name, date, in_time, out_time, used_minutes, belts from used_table
        where id in ({row_ids});
        """
        print(select_query)
        self.getter.execute(select_query)
        columns = [col[0] for col in self.getter.description]
        data = [dict(zip(columns, row)) for row in self.getter.fetchall()]
        name = data[0]['name']

        select_query = f"select minutes from remaining_time where name = '{name}';"
        print(select_query)
        self.getter.execute(select_query)
        remaining_minutes = self.getter.fetchone()[0]

        message = '안녕하세요~쏘스윗펫입니다😊\n'
        message += f'❤{data[0]["name"]}❤놀이방 이용 내역 알려드립니다. \n'
        # + '놀이방 남은 시간:18시간45분 \n' with remaining_minutes format like H시간 M분
        remaining_time = str(timedelta(minutes=remaining_minutes))
        message += f'놀이방 남은 시간:{remaining_time} \n'

        for row in data:
            date = row['date'].strftime('%m월%d일')
            in_time = row['in_time'].strftime('%H:%M')
            out_time = row['out_time'].strftime('%H:%M')
            used_minutes = row['used_minutes']
            belts = row['belts']
            used_time = str(timedelta(minutes=used_minutes))
            message += f'{date} {in_time}-{out_time}({used_time}) \n'

        total_used_minutes = sum([row['used_minutes'] for row in data])
        total_used_time = str(timedelta(minutes=total_used_minutes))
        remaining_minutes -= total_used_minutes
        remaining_time = str(timedelta(minutes=remaining_minutes))

        message += f'\n총 사용시간:{total_used_time} \n'
        message += f'차감 후 남은 시간:{remaining_time}입니다. \n'
        if remaining_minutes < 0:
            message += f'\n다음에 오시면 충전부탁드려요~ \n'

        return message



















