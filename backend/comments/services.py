import smtplib

from utils.abstract.service import Service
from .dao import CommentDAO
from .schemas import (
    CreateCommentSchema,
    GetClientCommentSchema,
    GetUserCommentSchema,
    GetCommentSchema,
    CreateFeedbackSchema,
)
from config import EMAIL_LOGIN, EMAIL_PASSWORD


class CommentService(Service):
    async def create_comment(self, body: CreateCommentSchema) -> int:
        comment_dao = CommentDAO(db_session=self.db)
        comment_id = await comment_dao.create_comment(body=body)
        return comment_id

    async def get_comments(self) -> list[GetCommentSchema]:
        comment_dao = CommentDAO(db_session=self.db)
        comments = await comment_dao.get_comments()
        return comments

    async def get_comments_by_client(
        self, client_id: int
    ) -> list[GetClientCommentSchema]:
        comment_dao = CommentDAO(db_session=self.db)
        comments = await comment_dao.get_comments_by_client(client_id=client_id)
        return comments

    async def get_comments_by_user(self, user_id: int) -> list[GetUserCommentSchema]:
        comment_dao = CommentDAO(db_session=self.db)
        comments = await comment_dao.get_comments_by_user(user_id=user_id)
        return comments

    async def upload_comment_image(self, comment_id: int, image: str):
        comment_dao = CommentDAO(db_session=self.db)
        avatar = await comment_dao.upload_comment_image(comment_id, image)
        return avatar

    def send_feedback(self, data: CreateFeedbackSchema) -> None:
        msg = f"""
        {data.name}
        {data.email}\n
        
        {data.content}
        """

        server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
        server.ehlo()
        server.login(EMAIL_LOGIN, EMAIL_PASSWORD)
        server.sendmail(EMAIL_LOGIN, EMAIL_LOGIN, msg)
        server.close()
