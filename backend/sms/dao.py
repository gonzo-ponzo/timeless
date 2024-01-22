from sqlalchemy import select, update
import datetime
import pytz

from db.models import Client, ClientsHistory
from .schemas import SmsSchema
from utils.abstract.dao import DAO


tz = pytz.timezone("Europe/Belgrade")


class SmsDAO(DAO):
    """Data Access Object for operating client's history"""

    async def update_client_history(self, body: SmsSchema) -> None:
        now = datetime.datetime.now(tz)
        formatted_date = now.strftime("%Y-%m-%d %H:%M:%S")
        new_history_year, new_history_month, new_history_day = formatted_date.split(
            " "
        )[0].split("-")
        client_history = {}

        async with self.db.begin():
            client_query = select(Client).where(Client.phone == body.client_id)
            client = await self.db.scalar(client_query)
            clients_history_query = (
                select(ClientsHistory)
                .where(ClientsHistory.client_id == client.id)
                .where(ClientsHistory.name == f"{now.month}.{now.year}")
            )
            clients_history = await self.db.scalar(clients_history_query)

            for key, value in client.history.items():
                if key:
                    year, month, day = key.split(" ")[0].split("-")
                    if (
                        new_history_month == month
                        or abs(int(new_history_month) - int(month)) in [1, 11]
                        and int(new_history_day) > int(day)
                    ):
                        client_history[key] = value

            update_client_query = (
                update(Client)
                .where(Client.id == client.id)
                .values(
                    history={
                        **client_history,
                        **{formatted_date: body.text},
                    }
                )
            )
            await self.db.execute(update_client_query)

            if not clients_history:
                clients_history = ClientsHistory(
                    name=f"{now.month}.{now.year}",
                    client_id=client.id,
                    history={formatted_date: body.text},
                )
                self.db.add(clients_history)
                await self.db.flush()
            else:
                update_clients_history_query = (
                    update(ClientsHistory)
                    .where(ClientsHistory.client_id == client.id)
                    .where(ClientsHistory.name == f"{now.month}.{now.year}")
                    .values(
                        history={
                            **clients_history.history,
                            **{formatted_date: body.text},
                        }
                    )
                )
                await self.db.execute(update_clients_history_query)
                await self.db.commit()
