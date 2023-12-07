import uvicorn
from fastapi import FastAPI
from fastapi.routing import APIRouter
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqladmin import Admin

from config import APP_PORT, SECRET, IP_SERVER
from db.session import engine

from admin_panel.models import (
    UserAdmin,
    ClientAdmin,
    ServiceAdmin,
    RecordAdmin,
    CommentAdmin,
)
from auth.admin import AdminAuth
from routes import api_router


# create instance of the app
app = FastAPI(title="nails")
app.mount("/static", StaticFiles(directory="public"))

origins = [
    "http://localhost:3000",
    "https://127.0.0.1:3000",
    "http://127.0.0.1:3000",
    f"{IP_SERVER}",
    f"https://{IP_SERVER}",
    f"http://{IP_SERVER}",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


# add django-like admin panel to the app
authentication_backend = AdminAuth(secret_key=SECRET)
admin = Admin(app=app, authentication_backend=authentication_backend, engine=engine)
admin.add_view(UserAdmin)
admin.add_view(ClientAdmin)
admin.add_view(ServiceAdmin)
admin.add_view(RecordAdmin)
admin.add_view(CommentAdmin)


# create the instance for the routes
main_api_router = APIRouter()
main_router = APIRouter()

# set routes to the app and api routers
main_api_router.include_router(api_router)


# set app and api routers to the app
app.include_router(main_api_router)


if __name__ == "__main__":
    # run app on the host and port
    uvicorn.run(app, host="0.0.0.0", port=APP_PORT)
