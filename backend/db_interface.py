import pymysql
import environ
import os
from pathlib import Path
from typing import *
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta


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
        duplicate_check_query = f"select count(*) from dogs where name = '{data['dogName']}'"
        self.getter.execute(duplicate_check_query)
        # return False
        # print()
        print(duplicate_check_query)
        if self.getter.fetchone()[0] > 0:
            return False

        insert_query = f"""
        INSERT INTO dogs (name, breed, note, gender, phone, weight, official_name)
        VALUES (
        '{data['dogName']}',
        '{data['dogBreed']}',
        '{data['dogInfo']}',
        '{data['dogGender']}',
        '{data['phone']}',
        '{data['dogWeight']}',
        '{data['officialName']}'
        )
        """
        self.setter.execute(insert_query)
        self.db.commit()
        return True

    def mod_history(self, data):
        # data will be like
        # id
        # name
        # in_time
        # out_time
        # belts
        # date
        # minutes
        # check_today
        # update data from used_table where id=id
        in_time = data['date'] + ' ' + data['in_time']
        out_time = data['date'] + ' ' + data['out_time']
        update_query = f"""
        UPDATE used_table
        SET
        in_time = '{in_time}',
        out_time = '{out_time}',
        belts = {data['belts']},
        date = STR_TO_DATE('{data['date'].replace('-', '')}', '%Y%m%d') 
        WHERE id = {data['id']}
        """
        print(update_query)
        self.setter.execute(update_query)
        self.db.commit()
        return True

    def get_dogs_list(self):
        query = f"""
            SELECT dogs.*, IFNULL(SUM(paid.minutes), 0) as remaining_minutes
            FROM dogs 
            LEFT JOIN paid ON dogs.name = paid.name 
            GROUP BY dogs.name 
            ORDER BY dogs.name;
        """

        # query = f"select dogs.*, remaining_time.minutes " \
        #         f"from dogs inner join remaining_time " \
        #         f"on dogs.name = remaining_time.name " \
        #         f"order by name;"
        self.getter.execute(query)
        columns = [col[0] for col in self.getter.description]  # Get column names
        data = [dict(zip(columns, row)) for row in self.getter.fetchall()]
        return data

    def get_dog_info(self, name):
        query = f"select * from dogs where name = '{name}'"
        self.getter.execute(query)
        columns = [col[0] for col in self.getter.description]
        return [dict(zip(columns, row)) for row in self.getter.fetchall()]

    def mod_dog_info(self, data):
        # update table
        update_query = f"""
        UPDATE dogs
        SET
        breed = '{data['dogBreed']}',
        note = '{data['dogInfo']}',
        gender = '{data['dogGender']}',
        phone = '{data['phone']}',
        weight = '{data['dogWeight']}',
        official_name = '{data['officialName']}'
        WHERE name='{data['name']}'
        """
        print(update_query)
        self.setter.execute(update_query)
        self.db.commit()
        return True

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
    def get_history_nonchecked(self):
        select_query = f"SELECT * FROM used_table WHERE checked != 1 ORDER BY name, date"
        print(select_query)
        self.getter.execute(select_query)
        columns = [col[0] for col in self.getter.description]
        data = [dict(zip(columns, row)) for row in self.getter.fetchall()]
        # print(data)
        return data

    # used_table
    def get_history(self, name, get_message=False):
        if get_message:
            select_query = f"SELECT * FROM used_table WHERE name = '{name}' and checked != 1 ORDER BY date DESC"
        else:
            select_query = f"SELECT * FROM used_table WHERE name = '{name}' ORDER BY date DESC"
        print(select_query)
        self.getter.execute(select_query)
        columns = [col[0] for col in self.getter.description]
        data = [dict(zip(columns, row)) for row in self.getter.fetchall()]
        # print(data)
        return data

    def get_pay_history(self):
        select_query = f"SELECT * FROM paid ORDER BY date DESC"
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
        name, date, in_time, out_time, belts, row_id, check_today = \
            data['name'], data['date'], data['in_time'], data['out_time'], data['belts'], data['id'], data['payToday']
        # insert data into used
        used_minutes = data['minutes']
        insert_query = f"""
        insert into used_table (name, date, used_minutes, id, belts, checked, in_time, out_time)
        values (
        '{name}',
        STR_TO_DATE('{date.replace('-', '')}', '%Y%m%d'),
        {used_minutes},
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

        if belts:
            self.set_belt(row_id, belts)

        # self.get_remaining_time(name)
        # self.subtract_time(name, used_minutes)

        return True

    def sum_paid_time(self, name):
        select_query = f"""
        select sum(minutes) as minutes
        from paid
        where name = '{name}'
        """
        print(select_query)
        self.getter.execute(select_query)
        columns = [col[0] for col in self.getter.description]
        data = [dict(zip(columns, row)) for row in self.getter.fetchall()]
        return data[0]['minutes']

    def sum_used_time(self, name):
        select_query = f"""
        select sum(used_minutes) as minutes
        from used_table
        where name = '{name}'
        """
        print(select_query)
        self.getter.execute(select_query)
        columns = [col[0] for col in self.getter.description]
        data = [dict(zip(columns, row)) for row in self.getter.fetchall()]
        return data[0]['minutes']

    def get_remaining_time(self, name):
        paid = self.sum_paid_time(name)
        used = self.sum_used_time(name)
        if paid is None:
            paid = 0
        if used is None:
            used = 0
        return paid - used

    # def subtract_time(self, name, minutes):
    #     update_query = f"""
    #     update remaining_time
    #     set minutes = minutes - {minutes}
    #     where name = '{name}';
    #     """
    #     print(update_query)
    #     self.setter.execute(update_query)
    #     self.db.commit()
    #     return True

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

    def cancel_history(self, row_id):
        delete_query = f"""
        delete from used_table
        where id = {row_id};
        """
        print(delete_query)
        self.setter.execute(delete_query)
        self.db.commit()
        return True

    def cancel_pay(self, row_id):
        delete_query = f"""
        delete from paid
        where id = {row_id};
        """
        print(delete_query)
        self.setter.execute(delete_query)
        self.db.commit()
        return True

    def pay(self, data):
        name, hours, date = data['name'], data['hours'], data['date']
        # date form 2021-08-01
        # hours form 1
        # name form 'test'
        insert_query = f"""
        insert into paid (name, date, minutes)
        values (
        '{name}',
        STR_TO_DATE('{date.replace('-', '')}', '%Y%m%d'),
        {int(hours) * 60}
        );
        """
        print(insert_query)
        self.setter.execute(insert_query)
        if self.add_remaining_time(data):
            self.db.commit()
        if data['isSwitchOn']:
            self.check_used_belts(name)
        return True

    def mod_pay(self, data):
        update_query = f"""
        update paid
        set minutes = {data['minutes']},
        date = STR_TO_DATE('{data['date'].replace('-', '')}', '%Y%m%d')
        where id = {data['id']};
        """
        print(update_query)
        self.setter.execute(update_query)
        self.db.commit()
        return True

    def add_remaining_time(self, data):
        # there are name and minutes in data. update it to remaining_time. sum it.
        name, minutes = data['name'], int(data['hours']) * 60
        update_query = f"""
        update remaining_time
        set minutes = minutes + {minutes}
        where name = '{name}';
        """
        print(update_query)
        self.setter.execute(update_query)
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

    def get_official_name(self, name):
        select_query = f"select official_name from dogs where name = '{name}';"
        self.getter.execute(select_query)
        official_name = self.getter.fetchone()[0]
        return official_name

    def make_message(self, row_ids):
        select_query = f"""
        select name, date, in_time, out_time, used_minutes, belts from used_table
        where id in ({', '.join([str(row_id) for row_id in row_ids])});
        """
        print(select_query)
        self.getter.execute(select_query)
        columns = [col[0] for col in self.getter.description]
        data = [dict(zip(columns, row)) for row in self.getter.fetchall()]
        name = data[0]['name']
        all_names = [row['name'] for row in data]
        for compare in all_names:
            if name != compare:
                return '다른 강아지의 이용 내역이 포함되어 있습니다.'

        official_name = self.get_official_name(name)
        # select_query = f"select minutes from remaining_time where name = '{name}';"
        select_query = f"""SELECT SUM(minutes) as minutes
        FROM paid
        WHERE name = '{name}'
        """

        print(select_query)
        self.getter.execute(select_query)
        remaining_minutes = self.getter.fetchall()[0][0]
        print(remaining_minutes)

        message = '안녕하세요~쏘스윗펫입니다😊\n'
        message += f'❤{official_name}❤놀이방 이용 내역 알려드립니다. \n'
        duration = relativedelta(minutes=remaining_minutes)
        print(duration)
        # message += f'놀이방 남은 시간 : {abs(duration.days) * 24 + duration.hours}시간 {duration.minutes}분 \n\n'
        message += f'놀이방 남은 시간 : {"-" if remaining_minutes < 0 else ""}{abs(duration.days * 24 + duration.hours)}시간 {abs(duration.minutes)}분 \n\n'

        # 안녕하세요~쏘스윗펫입니다😊
        # ❤프로❤놀이방 이용 내역 알려드립니다.
        # 놀이방 남은 시간:19시간20분
        #
        # 3월25일 14:15-18:05(3:50)
        # 3월26일 15:00-19:00(4:00)
        # 4월1일 12:40-17:10(4:30)
        # 4월2일 14:00-16:10(2:10)
        #
        # 총 사용시간:14시간30분
        # 차감 후 남은 시간:4시간50분입니다.
        # 감사합니다🐶❤
        for row in data:
            date = row['date'].strftime('%-m월%-d일')
            in_time = row['in_time'].strftime('%H:%M')
            out_time = row['out_time'].strftime('%H:%M')
            used_minutes = row['used_minutes']
            belts = row['belts']
            used_time = str(timedelta(minutes=used_minutes))
            used_time = used_time[:-3]
            message += f'{date} {in_time}-{out_time} ({used_time}) \n'

        total_used_minutes = sum([row['used_minutes'] for row in data])
        print(total_used_minutes)
        duration = relativedelta(minutes=total_used_minutes)
        print(duration)
        message += f'\n총 사용시간 : {duration.days * 24 + duration.hours}시간 {duration.minutes}분 \n'

        remaining_minutes -= total_used_minutes
        duration = relativedelta(minutes=remaining_minutes)
        print(duration)

        # message += f'놀이방 남은 시간 : {"-" if remaining_minutes < 0 else ""}{abs(duration.days * 24 + duration.hours)}시간 {abs(duration.minutes)}분 \n\n'
        message += f'차감 후 남은 시간 : {"-" if remaining_minutes < 0 else ""}{abs(duration.days * 24 + duration.hours)}시간 {abs(duration.minutes)}분 입니다. \n'
        if remaining_minutes < 0:
            message += f'다음에 오시면 충전부탁드려요~ \n'
        message += f'감사합니다🐶❤ \n'
        print(message)

        return message

    def check_used_date(self, row_ids):
        today = datetime.today().strftime('%Y-%m-%d')
        if not row_ids:
            return None
        update_query = f"""
        update used_table
        set checked = 1
        , checked_date = '{today}'
        where id in ({', '.join([str(row_id) for row_id in row_ids])});
        """
        print(update_query)
        self.setter.execute(update_query)
        self.db.commit()
        return True
