"""
Mystic Shorts YT - Backend API
Основной файл FastAPI приложения для управления YouTube аккаунтами
"""

from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import uvicorn
from contextlib import asynccontextmanager
import asyncio
import logging
import os

from database.database import init_db
from config.settings import get_settings

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Управление жизненным циклом приложения"""
    # Инициализация при запуске
    logger.info("Запуск Mystic Shorts YT Backend...")
    await init_db()
    
    yield
    
    # Очистка при остановке
    logger.info("Остановка Mystic Shorts YT Backend...")

# Создание FastAPI приложения
app = FastAPI(
    title="Mystic Shorts YT API",
    description="API для управления YouTube аккаунтами и загрузки видео",
    version="1.0.0",
    lifespan=lifespan
)

# Подключение статических файлов
app.mount("/static", StaticFiles(directory="static"), name="static")

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене указать конкретные домены
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключение роутов (пока отключены для простоты)
# app.include_router(accounts.router, prefix="/api/accounts", tags=["accounts"])
# app.include_router(videos.router, prefix="/api/videos", tags=["videos"])
# app.include_router(proxies.router, prefix="/api/proxies", tags=["proxies"])
# app.include_router(telegram.router, prefix="/api/telegram", tags=["telegram"])
# app.include_router(captcha.router, prefix="/api/captcha", tags=["captcha"])

@app.get("/")
async def root():
    """Корневой эндпоинт"""
    return {
        "message": "Mystic Shorts YT API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    """Проверка состояния API"""
    return {"status": "healthy"}

@app.get("/favicon.ico")
async def favicon():
    """Обработка favicon.ico для избежания proxy ошибок"""
    # Возвращаем пустой ответ с правильным content-type
    return FileResponse("static/favicon.ico" if os.path.exists("static/favicon.ico") else None, media_type="image/x-icon")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
