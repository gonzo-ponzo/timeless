from sqlalchemy import select, update

from db.models import Comment, Record
from .schemas import (
    CreateCommentSchema,
    GetClientCommentSchema,
    GetUserCommentSchema,
    GetCommentSchema,
)
from config import IP_SERVER, DOMAIN
from utils.abstract.dao import DAO


class CommentDAO(DAO):
    """Data Access Object for operating comment info"""

    async def get_comments(self) -> list[GetCommentSchema]:
        async with self.db.begin():
            query = select(Comment)
            comments = await self.db.scalars(query)
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

    async def create_comment(self, data: CreateCommentSchema) -> int:
        comment = Comment(
            content=data.content,
            record_id=data.recordId,
            client_id=data.clientId,
            user_id=data.userId,
            rating=data.rating,
        )
        async with self.db.begin():
            self.db.add(comment)
            await self.db.flush()
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
