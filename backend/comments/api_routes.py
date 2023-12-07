from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
import smtplib

from db.session import get_async_session
from .schemas import (
    CreateCommentSchema,
    GetCommentSchema,
    CreateFeedbackSchema,
    GetClientCommentSchema,
    GetUserCommentSchema,
)
from .services import (
    _create_comment,
    _get_comments_by_client,
    _get_comments_by_user,
    _upload_comment_image,
    _get_comments,
)
from config import EMAIL_LOGIN, EMAIL_PASSWORD


comments_api_router = APIRouter(prefix="/comments")


"""COMMENT API SECTION"""


@comments_api_router.post("/")
async def create_comment(
    data: CreateCommentSchema,
    db: AsyncSession = Depends(get_async_session),
) -> int:
    """Create new comment"""
    comment_id = await _create_comment(data=data, db=db)
    return {"commentId": comment_id}


@comments_api_router.get("/")
async def get_all_comments(
    db: AsyncSession = Depends(get_async_session),
) -> list[GetCommentSchema]:
    """Get all existing comments"""
    comments = await _get_comments(db=db)
    return comments


@comments_api_router.post("/feedback")
def send_feedback(data: CreateFeedbackSchema) -> None:
    """Send email from feedback"""
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


@comments_api_router.get("/comments-by-client/{clientId}")
async def get_comments_by_client(
    clientId: int, db: AsyncSession = Depends(get_async_session)
) -> list[GetClientCommentSchema]:
    """Get all comments by client id"""
    comments = await _get_comments_by_client(client_id=clientId, db=db)
    return comments


@comments_api_router.get("/comments-by-user/{userId}")
async def get_comments_by_user(
    userId: int, db: AsyncSession = Depends(get_async_session)
) -> list[GetUserCommentSchema]:
    """get all comments by user id"""
    comments = await _get_comments_by_user(user_id=userId, db=db)
    return comments


@comments_api_router.patch("/image/{commentId}/")
async def update_comment_image(
    commentId: int,
    image: UploadFile = File(...),
    db: AsyncSession = Depends(get_async_session),
):
    """Upload image to comment by id"""
    file_path = f"public/comment-{commentId}.jpeg"
    avatar = await image.read()
    with open(file_path, "wb") as f:
        f.write(avatar)

    await _upload_comment_image(comment_id=commentId, image=file_path, db=db)
