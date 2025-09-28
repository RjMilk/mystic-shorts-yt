#!/bin/bash

echo "🚀 Запуск Mystic Shorts YT (локальный режим)..."
echo "=============================================="

# Проверяем Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 не найден!"
    echo "Пожалуйста, установите Python 3.8+ с https://www.python.org/downloads/"
    exit 1
fi

# Проверяем Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не найден!"
    echo "Пожалуйста, установите Node.js с https://nodejs.org/"
    exit 1
fi

echo "✅ Python и Node.js найдены"

# Создаем виртуальное окружение для backend
echo "🐍 Настройка Python окружения..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Создаем .env файл с базовыми настройками
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
    echo "✅ Файл .env создан"
fi

# Создаем необходимые папки
mkdir -p uploads temp logs

echo "🔧 Запуск Backend..."
python main.py &
BACKEND_PID=$!

# Ждем немного, чтобы backend запустился
sleep 5

# Переходим в frontend
cd ../frontend

echo "📦 Установка зависимостей Frontend..."
npm install

echo "🎨 Запуск Frontend..."
npm start &
FRONTEND_PID=$!

echo ""
echo "🎉 Приложение запущено!"
echo "=============================================="
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo ""
echo "📝 Для остановки нажмите Ctrl+C"
echo ""

# Функция для остановки процессов при Ctrl+C
cleanup() {
    echo ""
    echo "🛑 Остановка приложения..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Приложение остановлено"
    exit 0
}

# Перехватываем Ctrl+C
trap cleanup SIGINT

# Ждем завершения
wait
