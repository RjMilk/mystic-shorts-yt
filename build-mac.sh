#!/bin/bash

echo "🍎 Сборка Mystic Shorts YT для macOS..."
echo "======================================"

# Проверяем, что мы на macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "❌ Этот скрипт предназначен для macOS"
    exit 1
fi

# Проверяем наличие Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не найден! Установите с https://nodejs.org/"
    exit 1
fi

# Проверяем наличие Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 не найден! Установите с https://www.python.org/"
    exit 1
fi

echo "✅ Node.js и Python найдены"

# Создаем папку для сборки
mkdir -p dist
cd dist

# Клонируем репозиторий
echo "📥 Клонирование репозитория..."
if [ -d "mystic-shorts-yt" ]; then
    echo "📁 Репозиторий уже существует, обновляем..."
    cd mystic-shorts-yt
    git pull origin main
else
    git clone https://github.com/RjMilk/mystic-shorts-yt.git
    cd mystic-shorts-yt
fi

# Настраиваем backend
echo "🐍 Настройка Python backend..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Создаем .env файл
if [ ! -f .env ]; then
    echo "📝 Создание файла настроек..."
    cat > .env << EOF
DATABASE_URL=sqlite:///./mystic_shorts_yt.db
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
YOUTUBE_API_KEY=
YOUTUBE_CLIENT_ID=
YOUTUBE_CLIENT_SECRET=
CAPTCHA_API_KEY=
CAPTCHA_SERVICE=2captcha
SECRET_KEY=mystic-secret-key-change-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=30
LOG_LEVEL=INFO
UPLOAD_FOLDER=uploads
TEMP_FOLDER=temp
EOF
fi

# Создаем необходимые папки
mkdir -p uploads temp logs

cd ..

# Настраиваем frontend
echo "⚛️ Настройка React frontend..."
cd frontend
npm install

# Собираем frontend для продакшена
echo "🔨 Сборка frontend..."
npm run build

cd ..

# Настраиваем Electron приложение
echo "⚡ Настройка Electron приложения..."
cd electron-app
npm install

# Собираем приложение
echo "📦 Сборка macOS приложения..."
npm run build-mac

echo ""
echo "🎉 Сборка завершена!"
echo "==================="
echo "📁 Приложение находится в: dist/mystic-shorts-yt/electron-app/dist/"
echo "💾 DMG файл: dist/mystic-shorts-yt/electron-app/dist/Mystic Shorts YT-1.0.0.dmg"
echo "📦 ZIP файл: dist/mystic-shorts-yt/electron-app/dist/Mystic Shorts YT-1.0.0-mac.zip"
echo ""
echo "🚀 Для установки просто откройте DMG файл и перетащите приложение в Applications"
