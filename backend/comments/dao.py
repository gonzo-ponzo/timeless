from sqlalchemy import select, update
import datetime
import pytz

from db.models import Comment, Record, Client, ClientsHistory
from .schemas import (
    CreateCommentSchema,
    GetClientCommentSchema,
    GetUserCommentSchema,
    GetCommentSchema,
)
from config import IP_SERVER, DOMAIN
from utils.abstract.dao import DAO


tz = pytz.timezone("Europe/Belgrade")


class CommentDAO(DAO):
    """Data Access Object for operating comment info"""

    async def get_comments(self) -> list[GetCommentSchema]:
        async with self.db.begin():
            new_comment_query = select(Comment)
            comments = await self.db.scalars(new_comment_query)
            result = []
            for comment in comments:
                result.append(
                    GetCommentSchema(
                        id=comment.id,
                        content=comment.content,
                        createdAt=comment.created_at,
                        rating=comment.rating,
                        clientId=comment.client_id,
                        userId=comment.user_id,
                        recordId=comment.record_id,
                        image=comment.image,
                    )
                )
            return result

    async def create_comment(self, body: CreateCommentSchema) -> int:
        now = datetime.datetime.now(tz)
        formatted_date = now.strftime("%Y-%m-%d %H:%M:%S")
        comment = Comment(
            content=body.content,
            record_id=body.recordId,
            client_id=body.clientId,
            user_id=body.userId,
            rating=body.rating,
        )
        async with self.db.begin():
            self.db.add(comment)
            await self.db.flush()
            if body.clientId:
                client_query = select(Client).where(Client.id == body.clientId)
                client = await self.db.scalar(client_query)
                client_history = {}
                (
                    new_history_year,
                    new_history_month,
                    new_history_day,
                ) = formatted_date.split(" ")[0].split("-")
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
                            **{formatted_date: f"New comment #{comment.id} created"},
                        }
                    )
                )
                await self.db.execute(update_client_query)

                clients_history_query = (
                    select(ClientsHistory)
                    .where(ClientsHistory.client_id == body.clientId)
                    .where(ClientsHistory.name == f"{now.month}.{now.year}")
                )
                clients_history = await self.db.scalar(clients_history_query)
                if not clients_history:
                    clients_history = ClientsHistory(
                        name=f"{now.month}.{now.year}",
                        client_id=client.id,
                        history={formatted_date: f"New comment #{comment.id} created"},
                    )
                    self.db.add(clients_history)
                    await self.db.flush()
                else:
                    update_clients_history_query = (
                        update(ClientsHistory)
                        .where(ClientsHistory.client_id == body.clientId)
                        .where(ClientsHistory.name == f"{now.month}.{now.year}")
                        .values(
                            history={
                                **clients_history.history,
                                **{
                                    formatted_date: f"New comment #{comment.id} created"
                                },
                            }
                        )
                    )
                    await self.db.execute(update_clients_history_query)

            return comment.id

    async def get_comments_by_client(
        self, client_id: int
    ) -> list[GetClientCommentSchema]:
        comments_query = (
            select(Comment)
            .join(Record)
            .where(Record.client_id == client_id)
            .order_by(Comment.created_at.desc())
        )
        result = []
        async with self.db.begin():
            all_comments = await self.db.scalars(comments_query)
            for comment in all_comments:
                if comment.client_id:
                    author_id = comment.client_id
                    author_name = comment.client.name
                    author_type = "client"
                    author_image = comment.client.image
                else:
                    author_id = comment.user_id
                    author_name = comment.user.name
                    author_type = "user"
                    author_image = comment.user.image
                if len(result) >= 5:
                    return result
                result_comment = GetClientCommentSchema(
                    id=comment.id,
                    content=comment.content,
                    authorId=author_id,
                    authorName=author_name,
                    authorType=author_type,
                    authorImage=author_image,
                    rating=comment.rating,
                    image=comment.image,
                    recordId=comment.record.id,
                    createdAt=comment.created_at.date(),
                )
                result.append(result_comment)
            return result

    async def get_comments_by_user(self, user_id: int) -> list[GetUserCommentSchema]:
        record_query = select(Record).where(Record.user_id == user_id)

        result = []
        async with self.db.begin():
            user_records = await self.db.scalars(record_query)
            record_idx = [record.id for record in user_records]
            comments_query = select(Comment).order_by(Comment.created_at.desc())
            all_comments = await self.db.scalars(comments_query)
            user_comments = [
                comment for comment in all_comments if comment.record_id in record_idx
            ]
            for comment in user_comments:
                if comment.client_id:
                    author_id = comment.client_id
                    author_name = comment.client.name
                    author_type = "client"
                    author_image = comment.client.image
                else:
                    author_id = comment.user_id
                    author_name = comment.user.name
                    author_type = "user"
                    author_image = comment.user.image
                if len(result) >= 5:
                    return result
                result_comment = GetClientCommentSchema(
                    id=comment.id,
                    content=comment.content,
                    authorId=author_id,
                    authorName=author_name,
                    authorType=author_type,
                    authorImage=author_image,
                    rating=comment.rating,
                    image=comment.image,
                    recordId=comment.record.id,
                    createdAt=comment.created_at.date(),
                )
                result.append(result_comment)
            return result

    async def upload_comment_image(self, comment_id: int, image: str):
        async with self.db.begin():
            image_path = f"https://{DOMAIN}:8000/static{image[6:]}"
            query = (
                update(Comment).where(Comment.id == comment_id).values(image=image_path)
            )
            await self.db.execute(query)
            await self.db.commit()
