from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession

from db.session import get_async_session
from .schemas import (
    CreateCommentSchema,
    GetCommentSchema,
    CreateFeedbackSchema,
    GetClientCommentSchema,
    GetUserCommentSchema,
)
from .services import CommentService


comments_api_router = APIRouter(prefix="/comments")


"""COMMENT API SECTION"""


@comments_api_router.post("/")
async def create_comment(
    body: CreateCommentSchema,
    db: AsyncSession = Depends(get_async_session),
) -> int:
    """Create new comment"""
    comment_service = CommentService(db=db)
    comment_id = await comment_service.create_comment(body=body)
    return {"commentId": comment_id}


@comments_api_router.get("/")
async def get_all_comments(
    db: AsyncSession = Depends(get_async_session),
) -> list[GetCommentSchema]:
    """Get all existing comments"""
    comment_service = CommentService(db=db)
    comments = await comment_service.get_comments()
    return comments


@comments_api_router.post("/feedback")
def send_feedback(data: CreateFeedbackSchema) -> None:
    """Send email from feedback"""
    comment_service = CommentService()
    comment_service.send_feedback(data=data)


@comments_api_router.get("/comments-by-client/{clientId}")
async def get_comments_by_client(
    clientId: int, db: AsyncSession = Depends(get_async_session)
) -> list[GetClientCommentSchema]:
    """Get all comments by client id"""
    comment_service = CommentService(db=db)
    comments = await comment_service.get_comments_by_client(client_id=clientId)
    return comments


@comments_api_router.get("/comments-by-user/{userId}")
async def get_comments_by_user(
    userId: int, db: AsyncSession = Depends(get_async_session)
) -> list[GetUserCommentSchema]:
    """get all comments by user id"""
    comment_service = CommentService(db=db)
    comments = await comment_service.get_comments_by_user(user_id=userId)
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
    comment_service = CommentService(db=db)
    await comment_service.upload_comment_image(comment_id=commentId, image=file_path)
