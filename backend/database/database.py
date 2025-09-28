"""
Настройка базы данных
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config.settings import get_settings
import logging

logger = logging.getLogger(__name__)

settings = get_settings()

# Создание движка базы данных
if settings.database_url.startswith('sqlite'):
    engine = create_engine(
        settings.database_url,
        echo=False,
        connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(
        settings.database_url,
        pool_pre_ping=True,
        pool_recycle=300,
        echo=False
    )

# Создание фабрики сессий
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Базовый класс для моделей
Base = declarative_base()

def get_db():
    """Получение сессии базы данных"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def init_db():
    """Инициализация базы данных"""
    try:
        # Импорт всех моделей
        from database.models import Base
        
        # Создание таблиц
        Base.metadata.create_all(bind=engine)
        logger.info("База данных успешно инициализирована")
    except Exception as e:
        logger.error(f"Ошибка инициализации базы данных: {e}")
        raise
