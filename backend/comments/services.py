from sqlalchemy.ext.asyncio import AsyncSession

from .dao import CommentDAO
from .schemas import (
    CreateCommentSchema,
    GetClientCommentSchema,
    GetUserCommentSchema,
    GetCommentSchema,
)


"""COMMENT SECTION"""


async def _create_comment(data: CreateCommentSchema, db: AsyncSession) -> int:
    comment_dao = CommentDAO(db_session=db)
    comment_id = await comment_dao.create_comment(data=data)
    return comment_id


async def _get_comments(db: AsyncSession) -> list[GetCommentSchema]:
    comment_dao = CommentDAO(db_session=db)
    comments = await comment_dao.get_comments()
    return comments


async def _get_comments_by_client(
    client_id: int, db: AsyncSession
) -> list[GetClientCommentSchema]:
    comment_dao = CommentDAO(db_session=db)
    comments = await comment_dao.get_comments_by_client(client_id=client_id)
    return comments


async def _get_comments_by_user(
    user_id: int, db: AsyncSession
) -> list[GetUserCommentSchema]:
    comment_dao = CommentDAO(db_session=db)
    comments = await comment_dao.get_comments_by_user(user_id=user_id)
    return comments


async def _upload_comment_image(comment_id: int, image: str, db: AsyncSession):
    comment_dao = CommentDAO(db_session=db)
    avatar = await comment_dao.upload_comment_image(comment_id, image)
    return avatar
