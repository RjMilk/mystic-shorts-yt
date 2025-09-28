"""
Настройки приложения
"""

from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    """Настройки приложения"""
    
    # База данных
    database_url: str = "postgresql://user:password@localhost/mystic_shorts_yt"
    
    # Telegram
    telegram_bot_token: Optional[str] = None
    telegram_chat_id: Optional[str] = None
    
    # YouTube API
    youtube_api_key: Optional[str] = None
    youtube_client_id: Optional[str] = None
    youtube_client_secret: Optional[str] = None
    
    # Прокси настройки
    proxy_timeout: int = 30
    max_concurrent_uploads: int = 5
    
    # Капча
    captcha_api_key: Optional[str] = None
    captcha_service: str = "2captcha"  # 2captcha, anticaptcha, etc.
    
    # Безопасность
    secret_key: str = "your-secret-key-here"
    access_token_expire_minutes: int = 30
    
    # Логирование
    log_level: str = "INFO"
    log_file: str = "logs/mystic_shorts_yt.log"
    
    # Файлы
    upload_folder: str = "uploads"
    temp_folder: str = "temp"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

def get_settings() -> Settings:
    """Получить настройки приложения"""
    return Settings()
