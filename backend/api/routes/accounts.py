"""
API роуты для управления аккаунтами
"""

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from database.database import get_db
from database.models import Account, AccountStatus, AccountLog
from services.account_service import AccountService
from services.telegram_service import TelegramService

router = APIRouter()

class AccountCreate(BaseModel):
    """Модель для создания аккаунта"""
    email: str
    password: str
    recovery_email: Optional[str] = None
    country: Optional[str] = None
    proxy_id: Optional[int] = None

class AccountUpdate(BaseModel):
    """Модель для обновления аккаунта"""
    password: Optional[str] = None
    recovery_email: Optional[str] = None
    phone_number: Optional[str] = None
    country: Optional[str] = None
    proxy_id: Optional[int] = None

class AccountResponse(BaseModel):
    """Модель ответа для аккаунта"""
    id: int
    email: str
    status: str
    is_verified: bool
    is_warmed_up: bool
    warming_progress: int
    country: Optional[str]
    videos_uploaded: int
    total_views: int
    last_activity: Optional[datetime]
    created_at: datetime
    
    class Config:
        from_attributes = True

@router.post("/", response_model=AccountResponse)
async def create_account(
    account_data: AccountCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Создать новый аккаунт"""
    try:
        account_service = AccountService(db)
        account = await account_service.create_account(account_data)
        
        # Запуск прогрева в фоне
        background_tasks.add_task(account_service.start_warming, account.id)
        
        return account
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[AccountResponse])
async def get_accounts(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    country: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Получить список аккаунтов"""
    account_service = AccountService(db)
    return await account_service.get_accounts(skip, limit, status, country)

@router.get("/{account_id}", response_model=AccountResponse)
async def get_account(account_id: int, db: Session = Depends(get_db)):
    """Получить аккаунт по ID"""
    account_service = AccountService(db)
    account = await account_service.get_account(account_id)
    if not account:
        raise HTTPException(status_code=404, detail="Аккаунт не найден")
    return account

@router.put("/{account_id}", response_model=AccountResponse)
async def update_account(
    account_id: int,
    account_data: AccountUpdate,
    db: Session = Depends(get_db)
):
    """Обновить аккаунт"""
    account_service = AccountService(db)
    account = await account_service.update_account(account_id, account_data)
    if not account:
        raise HTTPException(status_code=404, detail="Аккаунт не найден")
    return account

@router.delete("/{account_id}")
async def delete_account(account_id: int, db: Session = Depends(get_db)):
    """Удалить аккаунт"""
    account_service = AccountService(db)
    success = await account_service.delete_account(account_id)
    if not success:
        raise HTTPException(status_code=404, detail="Аккаунт не найден")
    return {"message": "Аккаунт успешно удален"}

@router.post("/{account_id}/verify")
async def verify_account(
    account_id: int,
    phone_number: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Верифицировать аккаунт по номеру телефона"""
    account_service = AccountService(db)
    success = await account_service.verify_account(account_id, phone_number)
    if not success:
        raise HTTPException(status_code=400, detail="Ошибка верификации")
    
    # Отправка уведомления в Telegram
    telegram_service = TelegramService()
    background_tasks.add_task(
        telegram_service.send_notification,
        f"Аккаунт {account_id} успешно верифицирован"
    )
    
    return {"message": "Аккаунт успешно верифицирован"}

@router.post("/{account_id}/warm-up")
async def start_warming(
    account_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Запустить прогрев аккаунта"""
    account_service = AccountService(db)
    success = await account_service.start_warming(account_id)
    if not success:
        raise HTTPException(status_code=400, detail="Ошибка запуска прогрева")
    
    return {"message": "Прогрев аккаунта запущен"}

@router.post("/{account_id}/change-password")
async def change_password(
    account_id: int,
    new_password: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Сменить пароль аккаунта"""
    account_service = AccountService(db)
    success = await account_service.change_password(account_id, new_password)
    if not success:
        raise HTTPException(status_code=400, detail="Ошибка смены пароля")
    
    # Отправка уведомления в Telegram
    telegram_service = TelegramService()
    background_tasks.add_task(
        telegram_service.send_notification,
        f"Пароль для аккаунта {account_id} успешно изменен"
    )
    
    return {"message": "Пароль успешно изменен"}

@router.get("/{account_id}/logs")
async def get_account_logs(
    account_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Получить логи аккаунта"""
    account_service = AccountService(db)
    logs = await account_service.get_account_logs(account_id, skip, limit)
    return logs

@router.post("/bulk-import")
async def bulk_import_accounts(
    accounts_data: List[AccountCreate],
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Массовый импорт аккаунтов"""
    account_service = AccountService(db)
    results = await account_service.bulk_import_accounts(accounts_data)
    
    # Отправка уведомления в Telegram
    telegram_service = TelegramService()
    background_tasks.add_task(
        telegram_service.send_notification,
        f"Импортировано {len(results)} аккаунтов"
    )
    
    return {"imported": len(results), "results": results}
