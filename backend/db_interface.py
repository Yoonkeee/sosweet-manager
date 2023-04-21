import pymysql
import environ
import os
import csv
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
        self.db.autocommit(True)
        self.setter = self.db.cursor()
        self.getter = self.db.cursor()

    def test(self):
        return {'message': 'CORS TEST SUCCESSFUL'}

    def keep_alive(self):
        self.getter.execute("SHOW TABLES")
        print('db connection keep alive')
        return self.getter.fetchall()

    def set_backup(self):
        now = datetime.now()
        timestamp = now.strftime("%Y-%m-%d %H시%M분%S초")
        print(timestamp)
        backup_dir = os.path.join(os.getcwd(), '../backup/'+timestamp)
        os.makedirs(backup_dir)
        self.getter.execute("SHOW TABLES")
        tables = self.getter.fetchall()
        for table in tables:
            table_name = table[0]
            backup_file = os.path.join(backup_dir, f"{table_name}.csv")

            # Execute the SQL query to select data from the table
            self.getter.execute(f"SELECT * FROM {table_name}")

            # Fetch all the rows in a list of lists
            data = self.getter.fetchall()
            # Open the file in write mode
            with open(backup_file, 'w', newline='') as csvfile:
                writer = csv.writer(csvfile)
                for row in data:
                    writer.writerow(row)
        return f'backup done at {backup_dir}, tables : {tables}'

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
        target_table = ['used_table', 'timetable']
        for target in target_table:
            update_query = f"""
            UPDATE {target}
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
        if self.reset_used_minutes(data['id']):
            return True

    def get_dogs_list(self):
        query = f"""
        SELECT d.*, ifnull(SUM(p.minutes), 0) - ifnull(SUM(u.used_minutes), 0) AS remaining_minutes
        FROM dogs d
        LEFT JOIN (select name, sum(minutes) as minutes from paid where valid = 'Y' group by name) p ON d.name = p.name
        LEFT JOIN (select name, sum(used_minutes) as used_minutes
        from used_table
        where valid = 'Y'
#         AND checked = 0
        group by name) u ON d.name = u.name
        GROUP BY d.name;
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
        query = f"select * from dogs where name = '{name}' AND valid='Y' "
        self.getter.execute(query)
        columns = [col[0] for col in self.getter.description]
        data = [dict(zip(columns, row)) for row in self.getter.fetchall()]
        converted_data = []
        for row in data:
            converted_row = {}
            for key, value in row.items():
                converted_row[key] = value
                converted_row['remaining_minutes'] = self.get_remaining_minutes(converted_row['name'])
                converted_row['used_belts'] = self.get_used_belts(converted_row['name'])
            converted_data.append(converted_row)
        return converted_data[0]

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
        select_query = f"SELECT * FROM timetable WHERE date = '{date}' and out_time is NULL AND valid='Y' ORDER BY in_time"
        print(select_query)
        self.getter.execute(select_query)
        columns = [col[0] for col in self.getter.description]  # Get column names
        data = [dict(zip(columns, row)) for row in self.getter.fetchall()]
        converted_data = []
        for row in data:
            converted_row = {}
            for key, value in row.items():
                if key == 'in_time' or key == 'out_time':
                    if value is not None:
                        converted_row[key] = value.strftime('%H:%M')
                    else:
                        converted_row[key] = ''
                else:
                    converted_row[key] = value
            converted_row['remaining_minutes'] = self.get_remaining_minutes(converted_row['name'])
            converted_data.append(converted_row)
        return converted_data

    # timetable
    def get_checkout_timetable(self, date):
        select_query = f"SELECT * FROM timetable WHERE date = '{date}' AND out_time is not NULL AND valid='Y' ORDER BY in_time"
        print(select_query)
        self.getter.execute(select_query)
        columns = [col[0] for col in self.getter.description]  # Get column names
        data = [dict(zip(columns, row)) for row in self.getter.fetchall()]
        print(data)
        converted_data = []
        for row in data:
            converted_row = {}
            for key, value in row.items():
                if key == 'in_time' or key == 'out_time':
                    converted_row[key] = value.strftime('%H:%M')
                else:
                    converted_row[key] = value
            converted_row['remaining_minutes'] = self.get_remaining_minutes(converted_row['name'])
            converted_data.append(converted_row)
        return converted_data

        # return [dict(zip(columns, row)) for row in self.getter.fetchall()]

    # used_table
    def get_history_nonchecked(self):
        select_query = f"SELECT * FROM used_table WHERE checked != 1 AND valid='Y' ORDER BY name, date"
        print(select_query)
        self.getter.execute(select_query)
        columns = [col[0] for col in self.getter.description]
        data = [dict(zip(columns, row)) for row in self.getter.fetchall()]
        # print(data)
        return data

    def get_unchecked_used_list(self):
        query = f"""
        SELECT name FROM used_table WHERE checked != 1 AND valid='Y' GROUP BY name ORDER BY name
        """
        self.getter.execute(query)
        columns = [col[0] for col in self.getter.description]  # Get column names
        data = [dict(zip(columns, row)) for row in self.getter.fetchall()]
        return data

    # used_table
    def get_history(self, name, get_message=False):
        if get_message:
            select_query = f"SELECT * FROM used_table WHERE name = '{name}' and checked != 1 AND valid='Y' ORDER BY date DESC"
        else:
            select_query = f"SELECT * FROM used_table WHERE name = '{name}' AND valid='Y' ORDER BY date DESC"
        print(select_query)
        self.getter.execute(select_query)
        columns = [col[0] for col in self.getter.description]
        data = [dict(zip(columns, row)) for row in self.getter.fetchall()]
        # print(data)
        return data

    def get_pay_history(self):
        select_query = f"SELECT * FROM paid WHERE valid='Y' ORDER BY date DESC"
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
        used_minutes = 0 if check_today else data['minutes']
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
        if check_today:
            update_query = f"""
            update used_table
            set checked = 1,
            checked_date = STR_TO_DATE('{date.replace('-', '')}', '%Y%m%d'),
            checked_belts = 1
            where id = {row_id};
            """
            # 당일결제시 매너벨트도 같이 결제됨
            print(update_query)
            self.setter.execute(update_query)
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
        AND valid='Y' 
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
        AND valid='Y' 
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

    def reset_used_minutes(self, row_id):
        timeset_query = f"""
        UPDATE used_table
        SET used_minutes = TIMESTAMPDIFF(MINUTE, in_time, out_time)
        WHERE id = {row_id};
        ;
        """
        print(timeset_query)
        self.setter.execute(timeset_query)
        self.db.commit()

        return True

    # change check-in time
    def change_check_in_time(self, data):
        name, date, in_time, row_id, in_or_out = data['name'], data['date'], data['in_time'], data['id'], data['in_or_out']
        # in_time form 15:55
        # date form 2021-08-01
        in_time = date + ' ' + in_time
        target_tables = ['timetable', 'used_table']
        for target in target_tables:
            update_query = f"""
            update {target}
            set {in_or_out}_time = '{in_time}'
            where id = {row_id};
            """
            print(update_query)
            self.setter.execute(update_query)
            self.db.commit()

        if self.reset_used_minutes(row_id):
            return True

    def cancel_checkin(self, row_id):
        delete_query = f"""
        update timetable
        set valid='N' 
        where id = {row_id};
        """
        print(delete_query)
        self.setter.execute(delete_query)
        self.db.commit()
        return True

    def cancel_history(self, row_id):
        target_table = ['used_table', 'timetable']
        for target in target_table:
            delete_query = f"""
            update {target}
            set valid='N' 
            where id = {row_id};
            """
            print(delete_query)
            self.setter.execute(delete_query)
            self.db.commit()
        return True

    def cancel_pay(self, row_id):
        delete_query = f"""
        update paid
        set valid='N' 
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
        AND valid='Y' 
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
        AND valid='Y' 
        """
        self.setter.execute(update_query)
        self.db.commit()
        return True

    def get_official_name(self, name):
        select_query = f"select official_name from dogs where name = '{name}';"
        self.getter.execute(select_query)
        official_name = self.getter.fetchone()[0]
        return official_name

    def get_remaining_minutes(self, name, message=False):
        condition = ' AND checked = 1' if message else ''
        query = f"""
        SELECT ifnull(SUM(p.minutes), 0) - ifnull(SUM(u.used_minutes), 0) AS remaining_minutes
        FROM dogs d
        LEFT JOIN (select name, sum(minutes) as minutes from paid where valid = 'Y' group by name) p ON d.name = p.name
        LEFT JOIN (select name, sum(used_minutes) as used_minutes
        from used_table
        where valid = 'Y'
        {condition}
        group by name) u ON d.name = u.name
        WHERE d.name = '{name}'
        GROUP BY d.name;
        """
        # query = f"""
        # select paid.remaining_minutes - used_table.used_minutes from
        # (select sum(minutes) as remaining_minutes from paid where name = '{name}' and valid = 'Y') as paid,
        # (select sum(used_minutes) as used_minutes from used_table where name = '{name}' and valid = 'Y' and checked = 0) as used_table;
        # """
        self.getter.execute(query)
        remaining_minutes = self.getter.fetchone()[0]
        if not remaining_minutes:
            return 0
        return remaining_minutes

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

        # select_query = f"""SELECT SUM(minutes) as minutes
        # FROM paid
        # WHERE name = '{name}'
        # """
        #
        # print(select_query)
        # self.getter.execute(select_query)
        # remaining_minutes = self.getter.fetchall()[0][0]
        # print(remaining_minutes)
        remaining_minutes = self.get_remaining_minutes(name, message=True)
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
        data = sorted(data, key=lambda x: x['date'])
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

    def not_out_timetable(self):
        today = datetime.today().strftime('%Y-%m-%d')
        select_query = f"""
        select name, date
        from timetable
        where out_time is null
        and
        date != '{today}'
        and valid='Y'
        """
        print(select_query)
        self.getter.execute(select_query)
        columns = [col[0] for col in self.getter.description]
        data = [dict(zip(columns, row)) for row in self.getter.fetchall()]
        return data

