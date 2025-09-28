"""
Сервис для работы с Telegram
"""

import httpx
import asyncio
import logging
from typing import Optional, Dict, Any, List
from datetime import datetime
import json

from config.settings import get_settings

logger = logging.getLogger(__name__)

class TelegramService:
    """Сервис для работы с Telegram Bot API"""
    
    def __init__(self):
        self.settings = get_settings()
        self.bot_token = self.settings.telegram_bot_token
        self.chat_id = self.settings.telegram_chat_id
        self.base_url = f"https://api.telegram.org/bot{self.bot_token}"
    
    async def send_message(
        self, 
        message: str, 
        chat_id: Optional[str] = None,
        parse_mode: str = "HTML"
    ) -> bool:
        """Отправить сообщение в Telegram"""
        try:
            if not self.bot_token:
                logger.warning("Telegram bot token не настроен")
                return False
            
            target_chat_id = chat_id or self.chat_id
            if not target_chat_id:
                logger.warning("Chat ID не настроен")
                return False
            
            url = f"{self.base_url}/sendMessage"
            data = {
                "chat_id": target_chat_id,
                "text": message,
                "parse_mode": parse_mode
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.post(url, json=data)
                
                if response.status_code == 200:
                    logger.info(f"Сообщение отправлено в Telegram: {message[:50]}...")
                    return True
                else:
                    logger.error(f"Ошибка отправки сообщения: {response.text}")
                    return False
                    
        except Exception as e:
            logger.error(f"Ошибка отправки сообщения в Telegram: {e}")
            return False
    
    async def send_notification(
        self, 
        message: str, 
        notification_type: str = "info",
        chat_id: Optional[str] = None
    ) -> bool:
        """Отправить уведомление с типом"""
        try:
            # Добавляем эмодзи в зависимости от типа уведомления
            emoji_map = {
                "info": "ℹ️",
                "success": "✅",
                "warning": "⚠️",
                "error": "❌",
                "upload": "📤",
                "account": "👤",
                "proxy": "🌐"
            }
            
            emoji = emoji_map.get(notification_type, "ℹ️")
            formatted_message = f"{emoji} {message}"
            
            return await self.send_message(formatted_message, chat_id)
            
        except Exception as e:
            logger.error(f"Ошибка отправки уведомления: {e}")
            return False
    
    async def send_upload_notification(
        self, 
        video_title: str, 
        account_email: str,
        youtube_url: str,
        chat_id: Optional[str] = None
    ) -> bool:
        """Отправить уведомление о загрузке видео"""
        try:
            message = f"""
📤 <b>Видео загружено!</b>

🎬 <b>Название:</b> {video_title}
👤 <b>Аккаунт:</b> {account_email}
🔗 <b>Ссылка:</b> {youtube_url}
⏰ <b>Время:</b> {datetime.now().strftime('%d.%m.%Y %H:%M')}
            """
            
            return await self.send_message(message, chat_id)
            
        except Exception as e:
            logger.error(f"Ошибка отправки уведомления о загрузке: {e}")
            return False
    
    async def send_account_notification(
        self, 
        account_email: str, 
        action: str,
        status: str,
        chat_id: Optional[str] = None
    ) -> bool:
        """Отправить уведомление об аккаунте"""
        try:
            action_map = {
                "created": "создан",
                "verified": "верифицирован",
                "warmed_up": "прогрет",
                "suspended": "заблокирован",
                "banned": "забанен"
            }
            
            action_text = action_map.get(action, action)
            
            message = f"""
👤 <b>Аккаунт {action_text}</b>

📧 <b>Email:</b> {account_email}
📊 <b>Статус:</b> {status}
⏰ <b>Время:</b> {datetime.now().strftime('%d.%m.%Y %H:%M')}
            """
            
            return await self.send_message(message, chat_id)
            
        except Exception as e:
            logger.error(f"Ошибка отправки уведомления об аккаунте: {e}")
            return False
    
    async def send_error_notification(
        self, 
        error_message: str, 
        context: str = "",
        chat_id: Optional[str] = None
    ) -> bool:
        """Отправить уведомление об ошибке"""
        try:
            message = f"""
❌ <b>Ошибка в системе</b>

🔍 <b>Контекст:</b> {context}
📝 <b>Ошибка:</b> {error_message}
⏰ <b>Время:</b> {datetime.now().strftime('%d.%m.%Y %H:%M')}
            """
            
            return await self.send_message(message, chat_id)
            
        except Exception as e:
            logger.error(f"Ошибка отправки уведомления об ошибке: {e}")
            return False
    
    async def send_daily_report(
        self, 
        stats: Dict[str, Any],
        chat_id: Optional[str] = None
    ) -> bool:
        """Отправить ежедневный отчет"""
        try:
            message = f"""
📊 <b>Ежедневный отчет</b>

📤 <b>Видео загружено:</b> {stats.get('videos_uploaded', 0)}
👤 <b>Аккаунтов активно:</b> {stats.get('active_accounts', 0)}
🌐 <b>Прокси работает:</b> {stats.get('working_proxies', 0)}
❌ <b>Ошибок:</b> {stats.get('errors', 0)}
⏰ <b>Дата:</b> {datetime.now().strftime('%d.%m.%Y')}
            """
            
            return await self.send_message(message, chat_id)
            
        except Exception as e:
            logger.error(f"Ошибка отправки ежедневного отчета: {e}")
            return False
    
    async def send_custom_message(
        self, 
        message: str, 
        chat_id: Optional[str] = None,
        reply_markup: Optional[Dict] = None
    ) -> bool:
        """Отправить кастомное сообщение"""
        try:
            if not self.bot_token:
                return False
            
            target_chat_id = chat_id or self.chat_id
            if not target_chat_id:
                return False
            
            url = f"{self.base_url}/sendMessage"
            data = {
                "chat_id": target_chat_id,
                "text": message,
                "parse_mode": "HTML"
            }
            
            if reply_markup:
                data["reply_markup"] = json.dumps(reply_markup)
            
            async with httpx.AsyncClient() as client:
                response = await client.post(url, json=data)
                return response.status_code == 200
                
        except Exception as e:
            logger.error(f"Ошибка отправки кастомного сообщения: {e}")
            return False
