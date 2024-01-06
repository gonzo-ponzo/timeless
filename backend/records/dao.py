from sqlalchemy import select, update
import datetime
from typing import Optional
import pytz

from db.models import Record, Service, Client, User
from services.schemas import GetServiceSchema
from users.schemas import GetUserSchema, GetClientSchema
from .schemas import (
    GetRecordSchema,
    UpdateRecordSchema,
    AvailableRecordSchema,
    AvailableCrmRecordSchema,
    NewRecordSchema,
    NewRecordWithRegisterSchema,
    NewComplexWithRegisterSchema,
    NewComplexSchema,
    GetRecordByTelegramSchema,
)
from config import IP_SERVER, DOMAIN
from tasks.tasks import send_sms
from utils.abstract.dao import DAO


tz = pytz.timezone("Europe/Belgrade")


class RecordDAO(DAO):
    """Data Access Object for operating record info"""

    async def get_client_records(self) -> list[GetRecordSchema]:
        query = select(Record).order_by(Record.date.desc(), Record.time.desc())
        async with self.db.begin():
            data = await self.db.scalars(query)
            records = [
                GetRecordSchema(
                    id=object.id,
                    date=object.date,
                    time=object.time,
                    status=object.status,
                    clientId=object.client_id,
                    price=object.price,
                    ru=object.service.name,
                    en=object.service.en_name,
                    sr=object.service.sr_name,
                    serviceId=object.service_id,
                    history=object.history,
                    service=GetServiceSchema(
                        id=object.service.id,
                        ru=object.service.name,
                        en=object.service.en_name,
                        sr=object.service.sr_name,
                        price=object.service.price,
                        duration=object.service.duration,
                        active=object.service.active,
                    ),
                    userId=object.user_id,
                    user=GetUserSchema(
                        id=object.user.id,
                        phone=object.user.phone,
                        name=object.user.name,
                        telegram=object.user.telegram,
                        birthday=object.user.birthday,
                        registered_at=object.user.registered_at,
                        experience=object.user.experience,
                        rating=5,
                        position=object.user.position,
                        image=object.user.image,
                        services=[service.id for service in object.user.services],
                        isAdmin=object.user.is_admin,
                        isStaff=object.user.is_staff,
                    ),
                    image=object.image,
                    author=object.author,
                )
                for object in data
            ]
            return records

    async def upload_record_image(self, record_id: int, image: str):
        async with self.db.begin():
            image_path = f"https://{DOMAIN}:8000/static{image[6:]}"
            query = (
                update(Record).where(Record.id == record_id).values(image=image_path)
            )
            await self.db.execute(query)
            await self.db.commit()

    async def create_new_record(self, body: NewRecordSchema) -> Optional[str]:
        now = datetime.datetime.now(tz)
        formatted_time = now.strftime("%Y-%m-%d %H:%M:%S")
        async with self.db.begin():
            client_id = body.clientId
            date, time = self.get_datetime_values_from_schema(schema=body)

            service_query = select(Service).where(Service.id == body.serviceId)
            service = await self.db.scalar(service_query)
            if service.en_name.lower() in [
                "day off",
                "odmar 1",
                "odmar 2",
                "odmar 4",
                "odmar 0.5",
            ]:
                client_id = 1

            client_query = select(Client).where(Client.id == body.clientId)
            client = await self.db.scalar(client_query)

            master_records_query = (
                select(Record)
                .where(Record.user_id == body.userId)
                .where(Record.date == datetime.datetime.strptime(body.date, "%Y-%m-%d"))
                .where(Record.status != "canceled")
            )
            master_records = await self.db.scalars(master_records_query)
            master_records = master_records.all()

            new_record_start = body.time
            new_record_end = new_record_start + service.duration
            success = self.check_record_for_datetime_conflict(
                records=master_records,
                new_record_start=new_record_start,
                new_record_end=new_record_end,
            )
            if not success:
                return "Error"

            new_record = Record(
                date=date,
                time=time,
                status="created",
                client_id=client_id,
                author=body.author,
                service_id=service.id,
                user_id=body.userId,
                history={formatted_time: "Record created"},
            )
            self.db.add(new_record)
            await self.db.flush()

            # record_id = new_record.id
            # phone = client.phone
            # date = f"{new_record.date}"
            # time = f"{new_record.time}"
            # seconds_before_sms = self.get_seconds_before_sms(
            #     date_string=date, time_string=time
            # )
            # if (
            #     seconds_before_sms > 0
            #     and client.name != "SERVICE"
            #     and client.communication
            # ):
            #     send_sms.apply_async(
            #         args=[time, phone, record_id], countdown=seconds_before_sms
            #     )
            return "Success"

    async def create_new_record_with_register(
        self, body: NewRecordWithRegisterSchema
    ) -> Optional[str]:
        now = datetime.datetime.now(tz)
        formatted_time = now.strftime("%Y-%m-%d %H:%M:%S")
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

            date, time = self.get_datetime_values_from_schema(schema=body)

            service_query = select(Service).where(Service.id == body.serviceId)
            service = await self.db.scalar(service_query)

            master_records_query = (
                select(Record)
                .where(Record.user_id == body.userId)
                .where(Record.date == datetime.datetime.strptime(body.date, "%Y-%m-%d"))
                .where(Record.status != "canceled")
            )
            master_records = await self.db.scalars(master_records_query)
            master_records = master_records.all()

            new_record_start = body.time
            new_record_end = new_record_start + service.duration
            success = self.check_record_for_datetime_conflict(
                records=master_records,
                new_record_start=new_record_start,
                new_record_end=new_record_end,
            )
            if not success:
                return "Error"

            new_record = Record(
                date=date,
                time=time,
                status="created",
                client_id=client.id,
                author=body.author,
                service_id=service.id,
                user_id=body.userId,
                history={formatted_time: "Record created"},
            )
            self.db.add(new_record)
            await self.db.flush()

            # record_id = new_record.id
            # phone = client.phone
            # date = f"{new_record.date}"
            # time = f"{new_record.time}"
            # seconds_before_sms = self.get_seconds_before_sms(
            #     date_string=date, time_string=time
            # )
            # if (
            #     seconds_before_sms > 0
            #     and client.name != "SERVICE"
            #     and client.communication
            # ):
            #     send_sms.apply_async(
            #         args=[time, phone, record_id], countdown=seconds_before_sms
            #     )
            return "Success"

    async def create_new_complex(self, body: NewComplexSchema) -> Optional[str]:
        now = datetime.datetime.now(tz)
        formatted_time = now.strftime("%Y-%m-%d %H:%M:%S")
        async with self.db.begin():
            client_query = select(Client).where(Client.id == body.clientId)
            client = await self.db.scalar(client_query)
            phone = client.phone
            new_records = []

            for slot in body.records:
                date, time = self.get_datetime_values_from_schema(schema=slot)

                service_query = select(Service).where(Service.id == slot.serviceId)
                service = await self.db.scalar(service_query)

                master_records_query = (
                    select(Record)
                    .where(Record.user_id == slot.userId)
                    .where(
                        Record.date == datetime.datetime.strptime(slot.date, "%Y-%m-%d")
                    )
                    .where(Record.status != "canceled")
                )
                master_records = await self.db.scalars(master_records_query)
                master_records = master_records.all()

                new_record_start = slot.time
                new_record_end = new_record_start + service.duration
                success = self.check_record_for_datetime_conflict(
                    records=master_records,
                    new_record_start=new_record_start,
                    new_record_end=new_record_end,
                )
                if not success:
                    return "Error"

                new_record = Record(
                    date=date,
                    time=time,
                    status="created",
                    client_id=body.clientId,
                    author=body.author,
                    service_id=service.id,
                    user_id=slot.userId,
                    history={formatted_time: "Record created"},
                )
                new_records.append(new_record)

            for new_record in new_records:
                self.db.add(new_record)
            await self.db.flush()

            # for new_record in new_records:
            #     record_id = new_record.id
            #     date = f"{new_record.date}"
            #     time = f"{new_record.time}"
            #     seconds_before_sms = self.get_seconds_before_sms(
            #         date_string=date, time_string=time
            #     )
            #     if seconds_before_sms > 0 and client.communication:
            #         send_sms.apply_async(
            #             args=[time, phone, record_id], countdown=seconds_before_sms
            #         )
            return "Success"

    async def create_new_complex_with_register(
        self, body: NewComplexWithRegisterSchema
    ) -> Optional[str]:
        now = datetime.datetime.now(tz)
        formatted_time = now.strftime("%Y-%m-%d %H:%M:%S")
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

            date, time = self.get_datetime_values_from_schema(schema=body)

            service_query = select(Service).where(Service.id == body.serviceId)
            service = await self.db.scalar(service_query)

            master_records_query = (
                select(Record)
                .where(Record.user_id == body.userId)
                .where(Record.date == datetime.datetime.strptime(body.date, "%Y-%m-%d"))
                .where(Record.status != "canceled")
            )
            master_records = await self.db.scalars(master_records_query)
            master_records = master_records.all()

            new_record_start = body.time
            new_record_end = new_record_start + service.duration
            success = self.check_record_for_datetime_conflict(
                records=master_records,
                new_record_start=new_record_start,
                new_record_end=new_record_end,
            )
            if not success:
                return "Error"

            new_record = Record(
                date=date,
                time=time,
                status="created",
                client_id=client.id,
                author=body.author,
                service_id=service.id,
                user_id=body.userId,
                history={formatted_time: "Record created"},
            )
            self.db.add(new_record)
            await self.db.flush()

            # record_id = new_record.id
            # phone = client.phone
            # date = f"{new_record.date}"
            # time = f"{new_record.time}"
            # seconds_before_sms = self.get_seconds_before_sms(
            #     date_string=date, time_string=time
            # )
            # if (
            #     seconds_before_sms > 0
            #     and client.name != "SERVICE"
            #     and client.communication
            # ):
            #     send_sms.apply_async(
            #         args=[time, phone, record_id], countdown=seconds_before_sms
            #     )
            return "Success"

    async def update_record_by_id(
        self, record_id: int, body: UpdateRecordSchema
    ) -> Optional[str]:
        async with self.db.begin():
            now = datetime.datetime.now(tz)
            formatted_time = now.strftime("%Y-%m-%d %H:%M:%S")
            user_query = select(User).where(User.id == body.userId)
            user = await self.db.scalar(user_query)
            history = [
                f"Updated by: {user.name}",
            ]
            record_for_update_query = select(Record).where(Record.id == record_id)
            record = await self.db.scalar(record_for_update_query)
            if body.date and body.time:
                new_record_start, new_record_end = self.get_timing(
                    record=record, body=body
                )
                if record.date != body.date:
                    history.append(f"Date changed: {record.date} > {body.date}")
                if record.time != body.time:
                    history.append(
                        f"Time changed: {str(record.time)[:5]} > {str(body.time)[:5]}"
                    )

                target_master = body.masterId
                if body.masterId != record.user_id:
                    target_master = body.masterId

                target_master_records_query = (
                    select(Record)
                    .where(Record.user_id == target_master)
                    .where(Record.date == body.date)
                    .where(Record.id != record_id)
                    .where(Record.status != "canceled")
                )
                target_master_records = await self.db.scalars(
                    target_master_records_query
                )
                target_master_records = target_master_records.all()

                if body.status != "canceled":
                    success = self.check_record_for_datetime_conflict(
                        records=target_master_records,
                        new_record_start=new_record_start,
                        new_record_end=new_record_end,
                    )
                    if not success:
                        return "Error"

                if body.masterId != record.user_id:
                    history.append(
                        f"Master changed: {record.user_id} > {body.masterId}"
                    )
                    update_record_master_query = (
                        update(Record)
                        .where(Record.id == record_id)
                        .values(user_id=body.masterId)
                    )
                    await self.db.execute(update_record_master_query)
                if record.status != body.status and body.status:
                    history.append(f"Status changed: {record.status} > {body.status}")
                if record.price != body.price and body.price:
                    history.append(f"Price changed: {record.price} > {body.price}")
                if record.comment != body.comment and body.comment:
                    history.append(
                        f"Comment changed: {record.comment} > {body.comment}"
                    )
                history = {formatted_time: ", ".join(history)}
                update_record_query = (
                    update(Record)
                    .where(Record.id == record_id)
                    .values(
                        status=body.status,
                        price=body.price,
                        comment=body.comment,
                        date=body.date,
                        time=body.time,
                        history={**record.history, **history},
                    )
                )
            else:
                if record.status != body.status and body.status:
                    history.append(f"Status changed: {record.status} > {body.status}")
                if record.price != body.price and body.price:
                    history.append(f"Price changed: {record.price} > {body.price}")
                if record.comment != body.comment and body.comment:
                    history.append(
                        f"Comment changed: {record.comment} > {body.comment}"
                    )
                history = {formatted_time: ", ".join(history)}
                update_record_query = (
                    update(Record)
                    .where(Record.id == record_id)
                    .values(
                        status=body.status,
                        price=body.price,
                        comment=body.comment,
                        history={**record.history, **history},
                    )
                )
            await self.db.execute(update_record_query)
            if body.cameFrom:
                record_query = select(Record).where(Record.id == record_id)
                record = await self.db.scalar(record_query)
                update_client_came_from_query = (
                    update(Client)
                    .where(Client.id == record.client_id)
                    .values(came_from=body.cameFrom)
                )
                await self.db.execute(update_client_came_from_query)
            await self.db.commit()
            return "Success"

    async def get_available_records(
        self,
        user_id: int,
        date: datetime.time,
    ) -> list[AvailableRecordSchema]:
        async with self.db.begin():
            existing_records_query = (
                select(Record)
                .where(Record.user_id == user_id)
                .where(Record.date == date)
                .where(Record.status != "canceled")
            )
            existing_records = await self.db.scalars(existing_records_query)
            records_data = []
            for record in existing_records:
                start = int(record.time.strftime("%H:%M:%S")[:2]) * 60 + int(
                    record.time.strftime("%H:%M:%S")[3:5]
                )
                records_data.append(
                    AvailableRecordSchema(
                        start=start,
                        end=start + record.service.duration,
                        duration=record.service.duration,
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
                .where(Record.user_id == master_id)
                .where(Record.date == date)
                .where(Record.status != "canceled")
            )

            existing_records = await self.db.scalars(query)
            query = select(User).where(User.id == user_id)
            user = await self.db.scalar(query)

            records_data = []
            for record in existing_records:
                record_type = "pink"
                if user_id == master_id:
                    record_type = "blue"
                if record.status == "completed" and (
                    user_id == master_id or user.is_admin == True
                ):
                    record_type = "yellow"
                if record.service.en_name.lower() in [
                    "day off",
                    "odmar 1",
                    "odmar 2",
                    "odmar 4",
                    "odmar 0.5",
                ]:
                    record_type = "gray"

                start = int(record.time.strftime("%H:%M:%S")[:2]) * 60 + int(
                    record.time.strftime("%H:%M:%S")[3:5]
                )
                records_data.append(
                    AvailableCrmRecordSchema(
                        start=start,
                        end=start + record.service.duration,
                        duration=record.service.duration,
                        type=record_type,
                        serviceId=record.service_id,
                        ru=record.service.name,
                        en=record.service.en_name,
                        sr=record.service.sr_name,
                        clientId=record.client_id,
                        recordId=record.id,
                        userId=record.user_id,
                    )
                )

            return records_data

    async def get_record_time(self, record_id: int) -> str:
        async with self.db.begin():
            query = select(Record).where(Record.id == int(record_id))
            record = await self.db.scalar(query)
            if record and record.status == "created":
                result = f"{record.date} {record.time}"
                return result
            else:
                return "null"

    def get_timing(self, record: Record, body: UpdateRecordSchema) -> list:
        new_start = body.time.hour * 60 + body.time.minute
        new_end = new_start + record.service.duration
        return [new_start, new_end]

    def get_seconds_before_sms(self, date_string: str, time_string: str) -> int:
        year = int(date_string.split("-")[0])
        month = int(date_string.split("-")[1])
        day = int(date_string.split("-")[2])
        hour = int(time_string.split(":")[0])
        minute = int(time_string.split(":")[1])

        now = datetime.datetime.now() + datetime.timedelta(hours=1)
        planned_date = datetime.datetime(
            year=year, month=month, day=day, hour=hour, minute=minute
        ) - datetime.timedelta(hours=1)

        seconds = (planned_date - now).total_seconds()
        return seconds

    def get_datetime_values_from_schema(self, schema: NewRecordSchema) -> list:
        hours = schema.time // 60
        minutes = schema.time % 60
        time = datetime.time(hour=hours, minute=minutes)
        year, month, day = schema.date.split("-")
        date = datetime.date(year=int(year), month=int(month), day=int(day))
        return [date, time]

    def check_record_for_datetime_conflict(
        self, records: list[Record], new_record_start: int, new_record_end: int
    ) -> bool:
        success = True
        for record in records:
            start_in_minutes = record.time.hour * 60 + record.time.minute
            end_in_minutes = start_in_minutes + record.service.duration
            if (
                start_in_minutes <= new_record_start < end_in_minutes
                or start_in_minutes < new_record_end <= end_in_minutes
            ):
                success = False
        return success

    async def get_records_by_telegram(
        self, user_telegram: str
    ) -> list[GetRecordByTelegramSchema]:
        user_query = select(User).where(User.telegram == user_telegram)
        date = datetime.date.today()
        user_records = []

        async with self.db.begin():
            user = await self.db.scalar(user_query)
            if not user:
                return {"Error": "User not found"}

            records_query = (
                select(Record)
                .where(Record.date == date)
                .where(Record.user == user)
                .order_by(Record.time)
            )
            records = await self.db.scalars(records_query)
            all_records = records.all()
            for record in all_records:
                user_records.append(
                    GetRecordByTelegramSchema(
                        id=record.id + 100,
                        date=record.date,
                        time=record.time,
                        client=GetClientSchema(
                            id=record.client.id,
                            phone=record.client.phone,
                            name=record.client.name,
                            registered_at=record.client.registered_at,
                            communication=record.client.communication,
                        ),
                        service=GetServiceSchema(
                            id=record.service.id,
                            en=record.service.en_name,
                            duration=record.service.duration,
                            price=record.service.price,
                            active=record.service.active,
                        ),
                    )
                )

            return user_records
