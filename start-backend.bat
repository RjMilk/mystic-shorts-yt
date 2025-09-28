@echo off
echo 🚀 Запуск Mystic Shorts YT Backend (Windows)...
echo ==============================================

REM Проверяем Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python не найден!
    echo Пожалуйста, установите Python 3.8+ с https://www.python.org/downloads/
    pause
    exit /b 1
)

echo ✅ Python найден

REM Переходим в backend
cd backend

REM Создаем виртуальное окружение
echo 🐍 Создание виртуального окружения...
python -m venv venv
call venv\Scripts\activate.bat

REM Устанавливаем зависимости
echo 📦 Установка зависимостей...
pip install -r requirements.txt

REM Создаем .env файл с базовыми настройками
if not exist .env (
    echo 📝 Создание файла настроек...
    (
        echo DATABASE_URL=sqlite:///./mystic_shorts_yt.db
        echo TELEGRAM_BOT_TOKEN=
        echo TELEGRAM_CHAT_ID=
        echo YOUTUBE_API_KEY=
        echo YOUTUBE_CLIENT_ID=
        echo YOUTUBE_CLIENT_SECRET=
        echo CAPTCHA_API_KEY=
        echo CAPTCHA_SERVICE=2captcha
        echo SECRET_KEY=mystic-secret-key-change-in-production
        echo ACCESS_TOKEN_EXPIRE_MINUTES=30
        echo LOG_LEVEL=INFO
        echo UPLOAD_FOLDER=uploads
        echo TEMP_FOLDER=temp
    ) > .env
    echo ✅ Файл .env создан
)

REM Создаем необходимые папки
if not exist uploads mkdir uploads
if not exist temp mkdir temp
if not exist logs mkdir logs

echo 🔧 Запуск Backend API...
echo.
echo 🎉 Backend запущен!
echo ==============================================
echo 🔧 API доступен по адресу: http://localhost:8000
echo 📚 Документация API: http://localhost:8000/docs
echo ❤️  Проверка здоровья: http://localhost:8000/health
echo.
echo 📝 Для остановки нажмите Ctrl+C
echo.

REM Запускаем сервер
python main.py
