#!/bin/bash

echo "🚀 Запуск Mystic Shorts YT Backend (Linux/Mac)..."
echo "================================================="

# Проверяем Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 не найден!"
    echo "Пожалуйста, установите Python 3.8+ с https://www.python.org/downloads/"
    exit 1
fi

echo "✅ Python найден"

# Переходим в backend
cd backend

# Создаем виртуальное окружение
echo "🐍 Создание виртуального окружения..."
python3 -m venv venv
source venv/bin/activate

# Устанавливаем зависимости
echo "📦 Установка зависимостей..."
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

echo "🔧 Запуск Backend API..."
echo ""
echo "🎉 Backend запущен!"
echo "================================================="
echo "🔧 API доступен по адресу: http://localhost:8000"
echo "📚 Документация API: http://localhost:8000/docs"
echo "❤️  Проверка здоровья: http://localhost:8000/health"
echo ""
echo "📝 Для остановки нажмите Ctrl+C"
echo ""

# Запускаем сервер
python main.py
