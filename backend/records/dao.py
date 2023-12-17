from sqlalchemy import select, update
import datetime
from typing import Optional

from db.models import Record, RecordsServices, RecordsUsers, Service, Client, User
from .schemas import (
    GetRecordSchema,
    UpdateRecordSchema,
    AvailableRecordSchema,
    AvailableCrmRecordSchema,
    NewRecordSchema,
    NewRecordWithRegisterSchema,
)
from config import IP_SERVER
from tasks.tasks import send_sms
from utils.abstract.dao import DAO


class RecordDAO(DAO):
    """Data Access Object for operating record info"""

    async def get_client_records(self) -> list[GetRecordSchema]:
        query = select(Record).order_by(Record.date.desc(), Record.time.desc())
        async with self.db.begin():
            data = await self.db.scalars(query)
            records = [
                GetRecordSchema(
                    id=object.id,
                    name=object.name,
                    date=object.date,
                    time=object.time,
                    status=object.status,
                    clientId=object.client_id,
                    price=object.price,
                    services=[i.id for i in object.services],
                    users=[i.id for i in object.users],
                    image=object.image,
                    author=object.author,
                )
                for object in data
            ]
            return records

    async def upload_record_image(self, record_id: int, image: str):
        async with self.db.begin():
            image_path = f"http://{IP_SERVER}:8000/static{image[6:]}"
            query = (
                update(Record).where(Record.id == record_id).values(image=image_path)
            )
            await self.db.execute(query)
            await self.db.commit()

    async def create_new_record(self, body: NewRecordSchema) -> Optional[str]:
        async with self.db.begin():
            hours = body.time // 60
            minutes = body.time % 60
            time = datetime.time(hour=hours, minute=minutes)
            year, month, day = body.date.split("-")
            date = datetime.date(year=int(year), month=int(month), day=int(day))

            query = select(Service).where(Service.id == body.serviceId)
            service = await self.db.scalar(query)
            client_id = body.clientId
            if service.name.lower() in ["day off", "odmar 1", "odmar 2", "odmar 4"]:
                client_id = 1

            master_records_query = (
                select(Record)
                .join(RecordsUsers)
                .where(RecordsUsers.user_id == body.userId)
                .where(Record.date == datetime.datetime.strptime(body.date, "%Y-%m-%d"))
                .where(Record.status != "canceled")
            )
            res = await self.db.scalars(master_records_query)
            all_records = res.all()

            new_start = body.time
            new_end = new_start + service.duration
            flag = True
            for record in all_records:
                record_duration = sum([service.duration for service in record.services])
                start = record.time.hour * 60 + record.time.minute
                end = start + record_duration
                if start <= new_start < end or start < new_end <= end:
                    flag = False
            if not flag:
                return "Error"

            new_record = Record(
                name=service.name,
                date=date,
                time=time,
                status="created",
                client_id=client_id,
                author=body.author,
            )
            self.db.add(new_record)
            await self.db.flush()
            new_record_service = RecordsServices(
                record_id=new_record.id, service_id=service.id
            )
            self.db.add(new_record_service)
            await self.db.flush()
            new_record_user = RecordsUsers(record_id=new_record.id, user_id=body.userId)
            self.db.add(new_record_user)
            await self.db.flush()
            query = select(Client).where(Client.id == client_id)
            client = await self.db.scalar(query)
            phone = client.phone
            record_id = new_record.id

            record_datetime = f"{new_record.date} {new_record.time}"
            date = record_datetime.split(" ")[0]
            time = record_datetime.split(" ")[1]

            year = int(date.split("-")[0])
            month = int(date.split("-")[1])
            day = int(date.split("-")[2])
            hour = int(time.split(":")[0])
            minute = int(time.split(":")[1])
            now = datetime.datetime.now() + datetime.timedelta(hours=1)
            planned_date = datetime.datetime(
                year=year, month=month, day=day, hour=hour, minute=minute
            ) - datetime.timedelta(hours=1)

            seconds = (planned_date - now).total_seconds()
            if seconds > 0 and phone != "0000":
                send_sms.apply_async(args=[time, phone, record_id], countdown=seconds)
            return "Success"

    async def create_new_record_with_register(
        self, body: NewRecordWithRegisterSchema
    ) -> Optional[str]:
        async with self.db.begin():
            client_query = select(Client).where(Client.phone == body.phone)
            client = await self.db.scalar(client_query)
            if not client:
                client = Client(
                    phone=body.phone,
                    auth_code="00000",
                    user_id=body.authorId,
                    name=body.name,
                    telegram=body.telegram,
                    instagram=body.instagram,
                )
                self.db.add(client)
                await self.db.flush()

            hours = body.time // 60
            minutes = body.time % 60
            time = datetime.time(hour=hours, minute=minutes)
            year, month, day = body.date.split("-")
            date = datetime.date(year=int(year), month=int(month), day=int(day))

            service_query = select(Service).where(Service.id == body.serviceId)
            service = await self.db.scalar(service_query)

            master_records_query = (
                select(Record)
                .join(RecordsUsers)
                .where(RecordsUsers.user_id == body.userId)
                .where(Record.date == datetime.datetime.strptime(body.date, "%Y-%m-%d"))
                .where(Record.status != "canceled")
            )
            res = await self.db.scalars(master_records_query)
            all_records = res.all()

            new_start = body.time
            new_end = new_start + service.duration
            flag = True
            for record in all_records:
                record_duration = sum([service.duration for service in record.services])
                start = record.time.hour * 60 + record.time.minute
                end = start + record_duration
                if start <= new_start < end or start < new_end <= end:
                    flag = False
            if not flag:
                return "Error"

            new_record = Record(
                name=service.name,
                date=date,
                time=time,
                status="created",
                client_id=client.id,
                author=body.author,
            )
            self.db.add(new_record)
            await self.db.flush()

            new_record_service = RecordsServices(
                record_id=new_record.id, service_id=service.id
            )
            self.db.add(new_record_service)
            await self.db.flush()

            new_record_user = RecordsUsers(record_id=new_record.id, user_id=body.userId)
            self.db.add(new_record_user)
            await self.db.flush()

            phone = client.phone
            record_id = new_record.id
            record_datetime = f"{new_record.date} {new_record.time}"
            date = record_datetime.split(" ")[0]
            time = record_datetime.split(" ")[1]
            year = int(date.split("-")[0])
            month = int(date.split("-")[1])
            day = int(date.split("-")[2])
            hour = int(time.split(":")[0])
            minute = int(time.split(":")[1])
            now = datetime.datetime.now() + datetime.timedelta(hours=1)
            planned_date = datetime.datetime(
                year=year, month=month, day=day, hour=hour, minute=minute
            ) - datetime.timedelta(hours=1)

            seconds = (planned_date - now).total_seconds()
            if seconds > 0 and phone != "0000":
                send_sms.apply_async(args=[time, phone, record_id], countdown=seconds)
            return "Success"

    async def update_record_by_id(
        self, record_id: int, body: UpdateRecordSchema
    ) -> Optional[str]:
        async with self.db.begin():
            if body.date and body.time:
                record_for_update_query = select(Record).where(Record.id == record_id)
                record = await self.db.scalar(record_for_update_query)
                new_start, new_end = self.get_timing(record=record, body=body)

                target_master = body.masterId
                if body.masterId != record.users[0]:
                    target_master = body.masterId

                target_master_records_query = (
                    select(Record)
                    .join(RecordsUsers)
                    .where(RecordsUsers.user_id == target_master)
                    .where(Record.date == body.date)
                    .where(Record.id != record_id)
                    .where(Record.status != "canceled")
                )
                res = await self.db.scalars(target_master_records_query)
                all_records = res.all()

                flag = True
                if body.status != "canceled":
                    for record in all_records:
                        record_duration = sum(
                            [service.duration for service in record.services]
                        )
                        start = record.time.hour * 60 + record.time.minute
                        end = start + record_duration
                        if start <= new_start < end or start < new_end <= end:
                            flag = False
                    if not flag:
                        return "Error"

                if body.masterId != record.users[0]:
                    update_record_master_query = (
                        update(RecordsUsers)
                        .where(RecordsUsers.record_id == record_id)
                        .values(user_id=body.masterId)
                    )
                    await self.db.execute(update_record_master_query)

                update_record_query = (
                    update(Record)
                    .where(Record.id == record_id)
                    .values(
                        status=body.status,
                        price=body.price,
                        comment=body.comment,
                        date=body.date,
                        time=body.time,
                    )
                )
            else:
                update_record_query = (
                    update(Record)
                    .where(Record.id == record_id)
                    .values(
                        status=body.status,
                        price=body.price,
                        comment=body.comment,
                    )
                )
            await self.db.execute(update_record_query)
            await self.db.commit()
            return "Success"

    async def get_available_records(
        self,
        user_id: int,
        date: datetime.time,
    ) -> list[AvailableRecordSchema]:
        async with self.db.begin():
            query = (
                select(Record)
                .join(RecordsUsers)
                .where(RecordsUsers.user_id == user_id)
                .where(Record.date == date)
                .where(Record.status != "canceled")
            )
            existing_records = await self.db.scalars(query)
            records_data = []
            for record in existing_records:
                record_duration = [service.duration for service in record.services]
                start = int(record.time.strftime("%H:%M:%S")[:2]) * 60 + int(
                    record.time.strftime("%H:%M:%S")[3:5]
                )
                records_data.append(
                    AvailableRecordSchema(
                        start=start,
                        end=start + sum(record_duration),
                        duration=sum(record_duration),
                        type="pink",
                    )
                )

            return records_data

    async def get_available_crm_records(
        self,
        user_id: int,
        master_id: int,
        date: datetime.time,
    ) -> list[AvailableCrmRecordSchema]:
        async with self.db.begin():
            query = (
                select(Record)
                .join(RecordsUsers)
                .where(RecordsUsers.user_id == master_id)
                .where(Record.date == date)
                .where(Record.status != "canceled")
            )

            existing_records = await self.db.scalars(query)
            query = select(User).where(User.id == user_id)
            user = await self.db.scalar(query)

            records_data = []
            for record in existing_records:
                record_duration = [service.duration for service in record.services]
                record_name = "/".join([service.name for service in record.services])

                record_type = "pink"
                if user_id == master_id:
                    record_type = "blue"
                if record.status == "completed" and (
                    user_id == master_id or user.is_admin == True
                ):
                    record_type = "yellow"
                if record_name.lower() in ["day off", "odmar 1", "odmar 2", "odmar 4"]:
                    record_type = "gray"

                start = int(record.time.strftime("%H:%M:%S")[:2]) * 60 + int(
                    record.time.strftime("%H:%M:%S")[3:5]
                )
                records_data.append(
                    AvailableCrmRecordSchema(
                        start=start,
                        end=start + sum(record_duration),
                        duration=sum(record_duration),
                        type=record_type,
                        name=record_name,
                        clientId=record.client_id,
                        recordId=record.id,
                        userId=record.users[0].id,
                    )
                )

            return records_data

    async def cancel_record(self, record_id: int) -> None:
        async with self.db.begin():
            query_update = (
                update(Record)
                .where(Record.id == record_id)
                .values(
                    status="canceled",
                )
            )
            await self.db.execute(query_update)
            await self.db.commit()

    async def get_record_time(self, record_id: int) -> str:
        async with self.db.begin():
            query = select(Record).where(Record.id == int(record_id))
            record = await self.db.scalar(query)
            if record.status == "created":
                result = f"{record.date} {record.time}"
                return result
            else:
                return "null"

    def get_timing(self, record: Record, body: UpdateRecordSchema) -> list:
        duration = sum([service.duration for service in record.services])
        new_start = body.time.hour * 60 + body.time.minute
        new_end = new_start + duration
        return [new_start, new_end]
