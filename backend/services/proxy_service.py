"""
Сервис для работы с прокси
"""

import httpx
import asyncio
import logging
from typing import List, Optional, Dict, Any
from datetime import datetime
import random

from database.models import Proxy
from config.settings import get_settings

logger = logging.getLogger(__name__)

class ProxyService:
    """Сервис для работы с прокси"""
    
    def __init__(self):
        self.settings = get_settings()
        self.working_proxies = []
        self.failed_proxies = []
    
    async def test_proxy(self, proxy: Proxy) -> bool:
        """Тестировать прокси"""
        try:
            proxy_url = self._build_proxy_url(proxy)
            
            async with httpx.AsyncClient(
                proxies=proxy_url,
                timeout=self.settings.proxy_timeout
            ) as client:
                start_time = datetime.now()
                response = await client.get("https://httpbin.org/ip")
                end_time = datetime.now()
                
                if response.status_code == 200:
                    response_time = (end_time - start_time).total_seconds()
                    proxy.is_working = True
                    proxy.response_time = response_time
                    proxy.last_checked = datetime.now()
                    
                    logger.info(f"Прокси {proxy.host}:{proxy.port} работает (время ответа: {response_time:.2f}s)")
                    return True
                else:
                    proxy.is_working = False
                    proxy.last_checked = datetime.now()
                    return False
                    
        except Exception as e:
            logger.error(f"Ошибка тестирования прокси {proxy.host}:{proxy.port}: {e}")
            proxy.is_working = False
            proxy.last_checked = datetime.now()
            return False
    
    async def get_working_proxy(self, country: Optional[str] = None) -> Optional[Proxy]:
        """Получить рабочий прокси"""
        try:
            # Здесь должна быть логика получения прокси из БД
            # Пока возвращаем None
            return None
        except Exception as e:
            logger.error(f"Ошибка получения прокси: {e}")
            return None
    
    async def get_proxy_for_country(self, country: str) -> Optional[Proxy]:
        """Получить прокси для конкретной страны"""
        try:
            # Здесь должна быть логика получения прокси для страны
            # Пока возвращаем None
            return None
        except Exception as e:
            logger.error(f"Ошибка получения прокси для страны {country}: {e}")
            return None
    
    async def rotate_proxy(self, current_proxy: Optional[Proxy] = None) -> Optional[Proxy]:
        """Ротация прокси"""
        try:
            # Здесь должна быть логика ротации прокси
            # Пока возвращаем None
            return None
        except Exception as e:
            logger.error(f"Ошибка ротации прокси: {e}")
            return None
    
    async def test_all_proxies(self, proxies: List[Proxy]) -> List[Proxy]:
        """Тестировать все прокси"""
        try:
            tasks = [self.test_proxy(proxy) for proxy in proxies]
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            working_proxies = []
            for i, result in enumerate(results):
                if result is True:
                    working_proxies.append(proxies[i])
            
            return working_proxies
            
        except Exception as e:
            logger.error(f"Ошибка тестирования прокси: {e}")
            return []
    
    def _build_proxy_url(self, proxy: Proxy) -> str:
        """Построить URL прокси"""
        if proxy.proxy_type.lower() == 'socks5':
            if proxy.username and proxy.password:
                return f"socks5://{proxy.username}:{proxy.password}@{proxy.host}:{proxy.port}"
            else:
                return f"socks5://{proxy.host}:{proxy.port}"
        else:  # HTTP
            if proxy.username and proxy.password:
                return f"http://{proxy.username}:{proxy.password}@{proxy.host}:{proxy.port}"
            else:
                return f"http://{proxy.host}:{proxy.port}"
    
    async def get_proxy_stats(self) -> Dict[str, Any]:
        """Получить статистику прокси"""
        try:
            # Здесь должна быть логика получения статистики из БД
            # Пока возвращаем пустой словарь
            return {
                "total": 0,
                "working": 0,
                "failed": 0,
                "average_response_time": 0
            }
        except Exception as e:
            logger.error(f"Ошибка получения статистики прокси: {e}")
            return {}
    
    async def add_proxy(
        self, 
        host: str, 
        port: int, 
        proxy_type: str,
        username: Optional[str] = None,
        password: Optional[str] = None,
        country: Optional[str] = None
    ) -> bool:
        """Добавить новый прокси"""
        try:
            # Здесь должна быть логика добавления прокси в БД
            # Пока просто возвращаем True
            return True
        except Exception as e:
            logger.error(f"Ошибка добавления прокси: {e}")
            return False
    
    async def remove_proxy(self, proxy_id: int) -> bool:
        """Удалить прокси"""
        try:
            # Здесь должна быть логика удаления прокси из БД
            # Пока просто возвращаем True
            return True
        except Exception as e:
            logger.error(f"Ошибка удаления прокси: {e}")
            return False
