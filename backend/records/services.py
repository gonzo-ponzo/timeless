import datetime
from fastapi import BackgroundTasks
from typing import Optional

from utils.abstract.service import Service
from .dao import RecordDAO
from .schemas import (
    GetRecordSchema,
    UpdateRecordSchema,
    AvailableRecordSchema,
    AvailableCrmRecordSchema,
    NewRecordSchema,
    NewRecordWithRegisterSchema,
    NewComplexSchema,
    NewComplexWithRegisterSchema,
    GetRecordByTelegramSchema,
    SmsSchema,
)


class RecordService(Service):
    async def get_client_records(self) -> list[GetRecordSchema]:
        record_dao = RecordDAO(db_session=self.db)
        records = await record_dao.get_client_records()
        return records

    async def get_client_records_by_date(
        self, date: datetime.date
    ) -> list[GetRecordSchema]:
        record_dao = RecordDAO(db_session=self.db)
        records = await record_dao.get_client_records_by_date(date=date)
        return records
    
    async def delete_break(
        self, record_id: int
    ) -> None:
        record_dao = RecordDAO(db_session=self.db)
        await record_dao.delete_break(record_id=record_id)

    async def update_record_by_id(
        self, record_id: int, body: UpdateRecordSchema
    ) -> Optional[str]:
        record_dao = RecordDAO(db_session=self.db)
        return await record_dao.update_record_by_id(record_id=record_id, body=body)

    async def upload_record_image(self, record_id: int, image: str):
        record_dao = RecordDAO(db_session=self.db)
        avatar = await record_dao.upload_record_image(record_id=record_id, image=image)
        return avatar

    async def get_available_records(
        self, user_id: int, date: datetime.time
    ) -> list[AvailableRecordSchema]:
        record_dao = RecordDAO(db_session=self.db)
        records = await record_dao.get_available_records(user_id=user_id, date=date)
        return records

    async def get_available_crm_records(
        self, user_id: int, master_id: int, date: datetime.time
    ) -> list[AvailableCrmRecordSchema]:
        record_dao = RecordDAO(db_session=self.db)
        records = await record_dao.get_available_crm_records(
            user_id=user_id, master_id=master_id, date=date
        )
        return records

    async def create_new_record(self, body: NewRecordSchema) -> Optional[str]:
        record_dao = RecordDAO(db_session=self.db)
        return await record_dao.create_new_record(body=body)

    async def create_new_record_with_register(
        self, body: NewRecordWithRegisterSchema
    ) -> Optional[str]:
        record_dao = RecordDAO(db_session=self.db)
        return await record_dao.create_new_record_with_register(body=body)

    async def create_new_complex(self, body: NewComplexSchema) -> Optional[str]:
        record_dao = RecordDAO(db_session=self.db)
        return await record_dao.create_new_complex(body=body)

    async def create_new_complex_with_register(
        self, body: NewComplexWithRegisterSchema
    ) -> Optional[str]:
        record_dao = RecordDAO(db_session=self.db)
        return await record_dao.create_new_complex_with_register(body=body)

    async def get_record_datetime(self, record_id: int) -> str:
        record_dao = RecordDAO(db_session=self.db)
        result = await record_dao.get_record_time(record_id=record_id)
        return result

    async def get_records_by_telegram(
        self, user_telegram: int
    ) -> list[GetRecordByTelegramSchema]:
        record_dao = RecordDAO(db_session=self.db)
        records: list[GetRecordByTelegramSchema] = (
            await record_dao.get_records_by_telegram(user_telegram=user_telegram)
        )
        return records

    async def get_next_records(self) -> list[SmsSchema]:
        record_dao = RecordDAO(db_session=self.db)
        records = await record_dao.get_next_records()
        return records
