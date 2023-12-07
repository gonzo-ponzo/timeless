from typing import Optional
from fastapi import Request, Depends
from fastapi.responses import RedirectResponse
from sqladmin.authentication import AuthenticationBackend
from sqlalchemy.ext.asyncio import AsyncSession

from config import ADMIN_AUTH
from db.session import get_async_session


class AdminAuth(AuthenticationBackend):
    async def login(
        self, request: Request, db: AsyncSession = Depends(get_async_session)
    ) -> bool:
        form = await request.form()
        username, password = form["username"], form["password"]
        if username == "admin" and password == ADMIN_AUTH:
            request.session.update({"token": "..."})

            return True

    async def logout(self, request: Request) -> bool:
        request.session.clear()
        return True

    async def authenticate(self, request: Request) -> Optional[RedirectResponse]:
        token = request.session.get("token")

        if not token:
            return RedirectResponse(request.url_for("admin:login"), status_code=302)
