"""
Модели базы данных
"""

from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, Float, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
from enum import Enum

Base = declarative_base()

class AccountStatus(str, Enum):
    """Статусы аккаунтов"""
    ACTIVE = "active"
    SUSPENDED = "suspended"
    BANNED = "banned"
    PENDING_VERIFICATION = "pending_verification"
    WARMING_UP = "warming_up"

class VideoType(str, Enum):
    """Типы видео"""
    SHORT = "short"
    LONG = "long"

class UploadStatus(str, Enum):
    """Статусы загрузки"""
    PENDING = "pending"
    UPLOADING = "uploading"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class Account(Base):
    """Модель аккаунта Gmail/YouTube"""
    __tablename__ = "accounts"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    recovery_email = Column(String(255), nullable=True)
    phone_number = Column(String(20), nullable=True)
    
    # Статус и настройки
    status = Column(String(50), default=AccountStatus.PENDING_VERIFICATION)
    is_verified = Column(Boolean, default=False)
    is_warmed_up = Column(Boolean, default=False)
    warming_progress = Column(Integer, default=0)  # 0-100%
    
    # Геолокация и прокси
    country = Column(String(100), nullable=True)
    proxy_id = Column(Integer, ForeignKey("proxies.id"), nullable=True)
    
    # Статистика
    videos_uploaded = Column(Integer, default=0)
    total_views = Column(Integer, default=0)
    last_activity = Column(DateTime, nullable=True)
    
    # Метаданные
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Связи
    proxy = relationship("Proxy", back_populates="accounts")
    videos = relationship("Video", back_populates="account")
    logs = relationship("AccountLog", back_populates="account")

class Proxy(Base):
    """Модель прокси"""
    __tablename__ = "proxies"
    
    id = Column(Integer, primary_key=True, index=True)
    host = Column(String(255), nullable=False)
    port = Column(Integer, nullable=False)
    username = Column(String(255), nullable=True)
    password = Column(String(255), nullable=True)
    proxy_type = Column(String(20), nullable=False)  # http, socks5
    country = Column(String(100), nullable=True)
    
    # Статус
    is_active = Column(Boolean, default=True)
    is_working = Column(Boolean, default=True)
    last_checked = Column(DateTime, nullable=True)
    response_time = Column(Float, nullable=True)
    
    # Метаданные
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Связи
    accounts = relationship("Account", back_populates="proxy")

class Video(Base):
    """Модель видео"""
    __tablename__ = "videos"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    file_path = Column(String(500), nullable=False)
    video_type = Column(String(20), default=VideoType.SHORT)
    duration = Column(Integer, nullable=True)  # в секундах
    
    # Загрузка
    status = Column(String(50), default=UploadStatus.PENDING)
    youtube_video_id = Column(String(100), nullable=True)
    youtube_url = Column(String(500), nullable=True)
    upload_progress = Column(Integer, default=0)  # 0-100%
    
    # Метаданные
    tags = Column(JSON, nullable=True)
    category = Column(String(100), nullable=True)
    privacy_status = Column(String(20), default="private")
    
    # Связи
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)
    account = relationship("Account", back_populates="videos")
    
    # Временные метки
    created_at = Column(DateTime, default=func.now())
    uploaded_at = Column(DateTime, nullable=True)

class AccountLog(Base):
    """Логи аккаунтов"""
    __tablename__ = "account_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)
    action = Column(String(100), nullable=False)
    message = Column(Text, nullable=False)
    level = Column(String(20), default="INFO")  # INFO, WARNING, ERROR
    meta_data = Column(JSON, nullable=True)
    
    created_at = Column(DateTime, default=func.now())
    
    # Связи
    account = relationship("Account", back_populates="logs")

class TelegramNotification(Base):
    """Уведомления Telegram"""
    __tablename__ = "telegram_notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    chat_id = Column(String(100), nullable=False)
    message = Column(Text, nullable=False)
    message_type = Column(String(50), nullable=False)  # info, warning, error, success
    is_sent = Column(Boolean, default=False)
    sent_at = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=func.now())

class CaptchaTask(Base):
    """Задачи решения капч"""
    __tablename__ = "captcha_tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(String(100), unique=True, nullable=False)
    captcha_type = Column(String(50), nullable=False)
    image_data = Column(Text, nullable=True)  # base64
    solution = Column(String(500), nullable=True)
    status = Column(String(50), default="pending")  # pending, solved, failed
    cost = Column(Float, nullable=True)
    
    created_at = Column(DateTime, default=func.now())
    solved_at = Column(DateTime, nullable=True)
