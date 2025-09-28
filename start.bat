@echo off
echo 🚀 Запуск Mystic Shorts YT (Windows)...
echo ======================================

REM Проверяем Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python не найден!
    echo Пожалуйста, установите Python 3.8+ с https://www.python.org/downloads/
    pause
    exit /b 1
)

REM Проверяем Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js не найден!
    echo Пожалуйста, установите Node.js с https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Python и Node.js найдены

REM Создаем виртуальное окружение для backend
echo 🐍 Настройка Python окружения...
cd backend
python -m venv venv
call venv\Scripts\activate.bat
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

echo 🔧 Запуск Backend...
start "Backend" cmd /k "call venv\Scripts\activate.bat && python main.py"

REM Ждем немного, чтобы backend запустился
timeout /t 5 /nobreak >nul

REM Переходим в frontend
cd ..\frontend

echo 📦 Установка зависимостей Frontend...
call npm install

echo 🎨 Запуск Frontend...
start "Frontend" cmd /k "npm start"

echo.
echo 🎉 Приложение запущено!
echo ======================================
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:8000
echo.
echo 📝 Для остановки закройте окна терминалов
echo.
pause
