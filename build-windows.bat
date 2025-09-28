@echo off
echo 🪟 Сборка Mystic Shorts YT для Windows...
echo ========================================

REM Проверяем наличие Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js не найден! Установите с https://nodejs.org/
    pause
    exit /b 1
)

REM Проверяем наличие Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python не найден! Установите с https://www.python.org/
    pause
    exit /b 1
)

echo ✅ Node.js и Python найдены

REM Создаем папку для сборки
if not exist dist mkdir dist
cd dist

REM Клонируем репозиторий
echo 📥 Клонирование репозитория...
if exist mystic-shorts-yt (
    echo 📁 Репозиторий уже существует, обновляем...
    cd mystic-shorts-yt
    git pull origin main
) else (
    git clone https://github.com/RjMilk/mystic-shorts-yt.git
    cd mystic-shorts-yt
)

REM Настраиваем backend
echo 🐍 Настройка Python backend...
cd backend
python -m venv venv
call venv\Scripts\activate.bat
pip install -r requirements.txt

REM Создаем .env файл
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
)

REM Создаем необходимые папки
if not exist uploads mkdir uploads
if not exist temp mkdir temp
if not exist logs mkdir logs

cd ..

REM Настраиваем frontend
echo ⚛️ Настройка React frontend...
cd frontend
call npm install

REM Собираем frontend для продакшена
echo 🔨 Сборка frontend...
call npm run build

cd ..

REM Настраиваем Electron приложение
echo ⚡ Настройка Electron приложения...
cd electron-app
call npm install

REM Собираем приложение
echo 📦 Сборка Windows приложения...
call npm run build-win

echo.
echo 🎉 Сборка завершена!
echo ===================
echo 📁 Приложение находится в: dist\mystic-shorts-yt\electron-app\dist\
echo 💾 NSIS установщик: dist\mystic-shorts-yt\electron-app\dist\Mystic Shorts YT Setup 1.0.0.exe
echo 📦 Portable версия: dist\mystic-shorts-yt\electron-app\dist\Mystic Shorts YT 1.0.0.exe
echo.
echo 🚀 Для установки запустите NSIS установщик
pause
