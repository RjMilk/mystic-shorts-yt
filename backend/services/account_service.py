"""
Сервис для управления аккаунтами
"""

from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import List, Optional
from datetime import datetime
import logging

from database.models import Account, AccountStatus, AccountLog
from services.gmail_service import GmailService
from services.telegram_service import TelegramService

logger = logging.getLogger(__name__)

class AccountService:
    """Сервис для работы с аккаунтами"""
    
    def __init__(self, db: Session):
        self.db = db
        self.gmail_service = GmailService()
        self.telegram_service = TelegramService()
    
    async def create_account(self, account_data) -> Account:
        """Создать новый аккаунт"""
        try:
            # Проверка на существование аккаунта
            existing_account = self.db.query(Account).filter(
                Account.email == account_data.email
            ).first()
            
            if existing_account:
                raise ValueError("Аккаунт с таким email уже существует")
            
            # Создание аккаунта
            account = Account(
                email=account_data.email,
                password=account_data.password,
                recovery_email=account_data.recovery_email,
                country=account_data.country,
                proxy_id=account_data.proxy_id,
                status=AccountStatus.PENDING_VERIFICATION
            )
            
            self.db.add(account)
            self.db.commit()
            self.db.refresh(account)
            
            # Логирование
            await self._log_account_action(
                account.id, "ACCOUNT_CREATED", 
                f"Создан новый аккаунт {account_data.email}"
            )
            
            return account
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Ошибка создания аккаунта: {e}")
            raise
    
    async def get_accounts(
        self, 
        skip: int = 0, 
        limit: int = 100,
        status: Optional[str] = None,
        country: Optional[str] = None
    ) -> List[Account]:
        """Получить список аккаунтов"""
        query = self.db.query(Account)
        
        if status:
            query = query.filter(Account.status == status)
        if country:
            query = query.filter(Account.country == country)
        
        return query.offset(skip).limit(limit).all()
    
    async def get_account(self, account_id: int) -> Optional[Account]:
        """Получить аккаунт по ID"""
        return self.db.query(Account).filter(Account.id == account_id).first()
    
    async def update_account(self, account_id: int, account_data) -> Optional[Account]:
        """Обновить аккаунт"""
        try:
            account = await self.get_account(account_id)
            if not account:
                return None
            
            # Обновление полей
            if account_data.password:
                account.password = account_data.password
            if account_data.recovery_email:
                account.recovery_email = account_data.recovery_email
            if account_data.phone_number:
                account.phone_number = account_data.phone_number
            if account_data.country:
                account.country = account_data.country
            if account_data.proxy_id:
                account.proxy_id = account_data.proxy_id
            
            account.updated_at = datetime.utcnow()
            
            self.db.commit()
            self.db.refresh(account)
            
            # Логирование
            await self._log_account_action(
                account.id, "ACCOUNT_UPDATED", 
                "Аккаунт обновлен"
            )
            
            return account
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Ошибка обновления аккаунта: {e}")
            raise
    
    async def delete_account(self, account_id: int) -> bool:
        """Удалить аккаунт"""
        try:
            account = await self.get_account(account_id)
            if not account:
                return False
            
            self.db.delete(account)
            self.db.commit()
            
            # Логирование
            await self._log_account_action(
                account_id, "ACCOUNT_DELETED", 
                f"Аккаунт {account.email} удален"
            )
            
            return True
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Ошибка удаления аккаунта: {e}")
            raise
    
    async def verify_account(self, account_id: int, phone_number: str) -> bool:
        """Верифицировать аккаунт по номеру телефона"""
        try:
            account = await self.get_account(account_id)
            if not account:
                return False
            
            # Здесь должна быть логика верификации через SMS
            # Пока просто обновляем статус
            account.phone_number = phone_number
            account.is_verified = True
            account.status = AccountStatus.ACTIVE
            account.updated_at = datetime.utcnow()
            
            self.db.commit()
            
            # Логирование
            await self._log_account_action(
                account_id, "ACCOUNT_VERIFIED", 
                f"Аккаунт верифицирован по номеру {phone_number}"
            )
            
            return True
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Ошибка верификации аккаунта: {e}")
            raise
    
    async def start_warming(self, account_id: int) -> bool:
        """Запустить прогрев аккаунта"""
        try:
            account = await self.get_account(account_id)
            if not account:
                return False
            
            account.status = AccountStatus.WARMING_UP
            account.warming_progress = 0
            account.updated_at = datetime.utcnow()
            
            self.db.commit()
            
            # Логирование
            await self._log_account_action(
                account_id, "WARMING_STARTED", 
                "Запущен прогрев аккаунта"
            )
            
            # Здесь должна быть логика прогрева
            # Пока просто симулируем прогресс
            await self._simulate_warming(account_id)
            
            return True
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Ошибка запуска прогрева: {e}")
            raise
    
    async def change_password(self, account_id: int, new_password: str) -> bool:
        """Сменить пароль аккаунта"""
        try:
            account = await self.get_account(account_id)
            if not account:
                return False
            
            # Здесь должна быть логика смены пароля через Gmail API
            account.password = new_password
            account.updated_at = datetime.utcnow()
            
            self.db.commit()
            
            # Логирование
            await self._log_account_action(
                account_id, "PASSWORD_CHANGED", 
                "Пароль аккаунта изменен"
            )
            
            return True
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Ошибка смены пароля: {e}")
            raise
    
    async def get_account_logs(
        self, 
        account_id: int, 
        skip: int = 0, 
        limit: int = 100
    ) -> List[AccountLog]:
        """Получить логи аккаунта"""
        return self.db.query(AccountLog).filter(
            AccountLog.account_id == account_id
        ).order_by(AccountLog.created_at.desc()).offset(skip).limit(limit).all()
    
    async def bulk_import_accounts(self, accounts_data: List) -> List:
        """Массовый импорт аккаунтов"""
        results = []
        
        for account_data in accounts_data:
            try:
                account = await self.create_account(account_data)
                results.append({"id": account.id, "email": account.email, "status": "success"})
            except Exception as e:
                results.append({"email": account_data.email, "status": "error", "error": str(e)})
        
        return results
    
    async def _simulate_warming(self, account_id: int):
        """Симуляция прогрева аккаунта"""
        # В реальном приложении здесь должна быть логика прогрева
        # Пока просто обновляем прогресс
        for progress in range(0, 101, 10):
            account = await self.get_account(account_id)
            if account:
                account.warming_progress = progress
                if progress == 100:
                    account.is_warmed_up = True
                    account.status = AccountStatus.ACTIVE
                self.db.commit()
            
            # Имитация задержки
            import asyncio
            await asyncio.sleep(1)
    
    async def _log_account_action(
        self, 
        account_id: int, 
        action: str, 
        message: str, 
        level: str = "INFO"
    ):
        """Логирование действий с аккаунтом"""
        try:
            log = AccountLog(
                account_id=account_id,
                action=action,
                message=message,
                level=level
            )
            
            self.db.add(log)
            self.db.commit()
            
        except Exception as e:
            logger.error(f"Ошибка логирования: {e}")
