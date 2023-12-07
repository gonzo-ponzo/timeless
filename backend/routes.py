from fastapi import APIRouter

from users.api_routes import users_api_router, clients_api_router
from records.api_routes import records_api_router
from services.api_routes import services_api_router
from comments.api_routes import comments_api_router


api_router = APIRouter(prefix="/api")

api_router.include_router(users_api_router, tags=["Users"])
api_router.include_router(clients_api_router, tags=["Clients"])
api_router.include_router(records_api_router, tags=["Records"])
api_router.include_router(services_api_router, tags=["Services"])
api_router.include_router(comments_api_router, tags=["Comments"])
