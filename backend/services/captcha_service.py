"""
Сервис для решения капч
"""

import httpx
import asyncio
import logging
import base64
from typing import Optional, Dict, Any, List
from datetime import datetime
import json

from config.settings import get_settings
from database.models import CaptchaTask

logger = logging.getLogger(__name__)

class CaptchaService:
    """Сервис для решения капч"""
    
    def __init__(self):
        self.settings = get_settings()
        self.api_key = self.settings.captcha_api_key
        self.service = self.settings.captcha_service
        
        # URL для разных сервисов
        self.service_urls = {
            "2captcha": "http://2captcha.com",
            "anticaptcha": "https://api.anti-captcha.com",
            "capmonster": "https://api.capmonster.cloud"
        }
    
    async def solve_image_captcha(
        self, 
        image_data: str, 
        captcha_type: str = "image"
    ) -> Optional[str]:
        """Решить капчу по изображению"""
        try:
            if not self.api_key:
                logger.warning("API ключ для капчи не настроен")
                return None
            
            # Создание задачи
            task_id = await self._create_captcha_task(image_data, captcha_type)
            if not task_id:
                return None
            
            # Ожидание решения
            solution = await self._wait_for_solution(task_id)
            return solution
            
        except Exception as e:
            logger.error(f"Ошибка решения капчи: {e}")
            return None
    
    async def solve_recaptcha_v2(
        self, 
        site_key: str, 
        page_url: str
    ) -> Optional[str]:
        """Решить reCAPTCHA v2"""
        try:
            if not self.api_key:
                logger.warning("API ключ для капчи не настроен")
                return None
            
            # Создание задачи для reCAPTCHA v2
            task_data = {
                "clientKey": self.api_key,
                "task": {
                    "type": "NoCaptchaTaskProxyless",
                    "websiteURL": page_url,
                    "websiteKey": site_key
                }
            }
            
            task_id = await self._create_recaptcha_task(task_data)
            if not task_id:
                return None
            
            # Ожидание решения
            solution = await self._wait_for_solution(task_id)
            return solution
            
        except Exception as e:
            logger.error(f"Ошибка решения reCAPTCHA v2: {e}")
            return None
    
    async def solve_recaptcha_v3(
        self, 
        site_key: str, 
        page_url: str,
        min_score: float = 0.3
    ) -> Optional[str]:
        """Решить reCAPTCHA v3"""
        try:
            if not self.api_key:
                logger.warning("API ключ для капчи не настроен")
                return None
            
            # Создание задачи для reCAPTCHA v3
            task_data = {
                "clientKey": self.api_key,
                "task": {
                    "type": "RecaptchaV3TaskProxyless",
                    "websiteURL": page_url,
                    "websiteKey": site_key,
                    "minScore": min_score
                }
            }
            
            task_id = await self._create_recaptcha_task(task_data)
            if not task_id:
                return None
            
            # Ожидание решения
            solution = await self._wait_for_solution(task_id)
            return solution
            
        except Exception as e:
            logger.error(f"Ошибка решения reCAPTCHA v3: {e}")
            return None
    
    async def solve_hcaptcha(
        self, 
        site_key: str, 
        page_url: str
    ) -> Optional[str]:
        """Решить hCaptcha"""
        try:
            if not self.api_key:
                logger.warning("API ключ для капчи не настроен")
                return None
            
            # Создание задачи для hCaptcha
            task_data = {
                "clientKey": self.api_key,
                "task": {
                    "type": "HCaptchaTaskProxyless",
                    "websiteURL": page_url,
                    "websiteKey": site_key
                }
            }
            
            task_id = await self._create_recaptcha_task(task_data)
            if not task_id:
                return None
            
            # Ожидание решения
            solution = await self._wait_for_solution(task_id)
            return solution
            
        except Exception as e:
            logger.error(f"Ошибка решения hCaptcha: {e}")
            return None
    
    async def _create_captcha_task(
        self, 
        image_data: str, 
        captcha_type: str
    ) -> Optional[str]:
        """Создать задачу для решения капчи"""
        try:
            if self.service == "2captcha":
                return await self._create_2captcha_task(image_data, captcha_type)
            elif self.service == "anticaptcha":
                return await self._create_anticaptcha_task(image_data, captcha_type)
            else:
                logger.error(f"Неподдерживаемый сервис капчи: {self.service}")
                return None
                
        except Exception as e:
            logger.error(f"Ошибка создания задачи капчи: {e}")
            return None
    
    async def _create_2captcha_task(
        self, 
        image_data: str, 
        captcha_type: str
    ) -> Optional[str]:
        """Создать задачу в 2captcha"""
        try:
            url = f"{self.service_urls['2captcha']}/in.php"
            data = {
                "key": self.api_key,
                "method": "base64",
                "body": image_data,
                "type": "1" if captcha_type == "image" else "2"
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.post(url, data=data)
                
                if response.text.startswith("OK|"):
                    task_id = response.text.split("|")[1]
                    logger.info(f"Задача 2captcha создана: {task_id}")
                    return task_id
                else:
                    logger.error(f"Ошибка создания задачи 2captcha: {response.text}")
                    return None
                    
        except Exception as e:
            logger.error(f"Ошибка создания задачи 2captcha: {e}")
            return None
    
    async def _create_anticaptcha_task(
        self, 
        image_data: str, 
        captcha_type: str
    ) -> Optional[str]:
        """Создать задачу в AntiCaptcha"""
        try:
            url = f"{self.service_urls['anticaptcha']}/createTask"
            data = {
                "clientKey": self.api_key,
                "task": {
                    "type": "ImageToTextTask",
                    "body": image_data
                }
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.post(url, json=data)
                result = response.json()
                
                if result.get("errorId") == 0:
                    task_id = result.get("taskId")
                    logger.info(f"Задача AntiCaptcha создана: {task_id}")
                    return str(task_id)
                else:
                    logger.error(f"Ошибка создания задачи AntiCaptcha: {result.get('errorDescription')}")
                    return None
                    
        except Exception as e:
            logger.error(f"Ошибка создания задачи AntiCaptcha: {e}")
            return None
    
    async def _create_recaptcha_task(self, task_data: Dict[str, Any]) -> Optional[str]:
        """Создать задачу для reCAPTCHA"""
        try:
            url = f"{self.service_urls['anticaptcha']}/createTask"
            
            async with httpx.AsyncClient() as client:
                response = await client.post(url, json=task_data)
                result = response.json()
                
                if result.get("errorId") == 0:
                    task_id = result.get("taskId")
                    logger.info(f"Задача reCAPTCHA создана: {task_id}")
                    return str(task_id)
                else:
                    logger.error(f"Ошибка создания задачи reCAPTCHA: {result.get('errorDescription')}")
                    return None
                    
        except Exception as e:
            logger.error(f"Ошибка создания задачи reCAPTCHA: {e}")
            return None
    
    async def _wait_for_solution(self, task_id: str) -> Optional[str]:
        """Ожидать решения капчи"""
        try:
            max_attempts = 60  # 5 минут максимум
            attempt = 0
            
            while attempt < max_attempts:
                await asyncio.sleep(5)  # Ждем 5 секунд
                
                if self.service == "2captcha":
                    solution = await self._check_2captcha_solution(task_id)
                elif self.service == "anticaptcha":
                    solution = await self._check_anticaptcha_solution(task_id)
                else:
                    return None
                
                if solution:
                    logger.info(f"Капча решена: {solution}")
                    return solution
                
                attempt += 1
                logger.info(f"Ожидание решения капчи... попытка {attempt}/{max_attempts}")
            
            logger.error("Время ожидания решения капчи истекло")
            return None
            
        except Exception as e:
            logger.error(f"Ошибка ожидания решения капчи: {e}")
            return None
    
    async def _check_2captcha_solution(self, task_id: str) -> Optional[str]:
        """Проверить решение в 2captcha"""
        try:
            url = f"{self.service_urls['2captcha']}/res.php"
            params = {
                "key": self.api_key,
                "action": "get",
                "id": task_id
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.get(url, params=params)
                
                if response.text.startswith("OK|"):
                    return response.text.split("|")[1]
                elif response.text == "CAPCHA_NOT_READY":
                    return None
                else:
                    logger.error(f"Ошибка получения решения 2captcha: {response.text}")
                    return None
                    
        except Exception as e:
            logger.error(f"Ошибка проверки решения 2captcha: {e}")
            return None
    
    async def _check_anticaptcha_solution(self, task_id: str) -> Optional[str]:
        """Проверить решение в AntiCaptcha"""
        try:
            url = f"{self.service_urls['anticaptcha']}/getTaskResult"
            data = {
                "clientKey": self.api_key,
                "taskId": int(task_id)
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.post(url, json=data)
                result = response.json()
                
                if result.get("errorId") == 0:
                    if result.get("status") == "ready":
                        return result.get("solution", {}).get("gRecaptchaResponse")
                    else:
                        return None
                else:
                    logger.error(f"Ошибка получения решения AntiCaptcha: {result.get('errorDescription')}")
                    return None
                    
        except Exception as e:
            logger.error(f"Ошибка проверки решения AntiCaptcha: {e}")
            return None
    
    async def get_balance(self) -> Optional[float]:
        """Получить баланс аккаунта"""
        try:
            if not self.api_key:
                return None
            
            if self.service == "2captcha":
                return await self._get_2captcha_balance()
            elif self.service == "anticaptcha":
                return await self._get_anticaptcha_balance()
            else:
                return None
                
        except Exception as e:
            logger.error(f"Ошибка получения баланса: {e}")
            return None
    
    async def _get_2captcha_balance(self) -> Optional[float]:
        """Получить баланс 2captcha"""
        try:
            url = f"{self.service_urls['2captcha']}/res.php"
            params = {
                "key": self.api_key,
                "action": "getbalance"
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.get(url, params=params)
                
                if response.text.startswith("OK|"):
                    return float(response.text.split("|")[1])
                else:
                    logger.error(f"Ошибка получения баланса 2captcha: {response.text}")
                    return None
                    
        except Exception as e:
            logger.error(f"Ошибка получения баланса 2captcha: {e}")
            return None
    
    async def _get_anticaptcha_balance(self) -> Optional[float]:
        """Получить баланс AntiCaptcha"""
        try:
            url = f"{self.service_urls['anticaptcha']}/getBalance"
            data = {"clientKey": self.api_key}
            
            async with httpx.AsyncClient() as client:
                response = await client.post(url, json=data)
                result = response.json()
                
                if result.get("errorId") == 0:
                    return result.get("balance")
                else:
                    logger.error(f"Ошибка получения баланса AntiCaptcha: {result.get('errorDescription')}")
                    return None
                    
        except Exception as e:
            logger.error(f"Ошибка получения баланса AntiCaptcha: {e}")
            return None
