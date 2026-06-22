import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.upload_router import router as upload_router
from routers.chat_router import router as chat_router

app=FastAPI()

frontend_origins = os.getenv(
    "FRONTEND_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in frontend_origins if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router)
app.include_router(chat_router)
