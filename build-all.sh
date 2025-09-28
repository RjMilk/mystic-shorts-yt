#!/bin/bash

echo "🚀 Сборка Mystic Shorts YT для всех платформ..."
echo "=============================================="

# Определяем операционную систему
case "$OSTYPE" in
  darwin*)  OS="macos" ;;
  linux*)   OS="linux" ;;
  msys*)    OS="windows" ;;
  *)        echo "❌ Неподдерживаемая операционная система: $OSTYPE"; exit 1 ;;
esac

echo "🖥️  Обнаружена ОС: $OS"

# Проверяем зависимости
echo "🔍 Проверка зависимостей..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js не найден! Установите с https://nodejs.org/"
    exit 1
fi

if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 не найден! Установите с https://www.python.org/"
    exit 1
fi

if ! command -v git &> /dev/null; then
    echo "❌ Git не найден! Установите с https://git-scm.com/"
    exit 1
fi

echo "✅ Все зависимости найдены"

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

# Собираем приложение в зависимости от ОС
echo "📦 Сборка приложения для $OS..."

case $OS in
  "macos")
    npm run build-mac
    ;;
  "linux")
    npm run build-linux
    ;;
  "windows")
    npm run build-win
    ;;
esac

echo ""
echo "🎉 Сборка завершена!"
echo "==================="
echo "📁 Приложение находится в: dist/mystic-shorts-yt/electron-app/dist/"
echo ""

# Показываем информацию о созданных файлах
case $OS in
  "macos")
    echo "🍎 macOS файлы:"
    echo "  💾 DMG: Mystic Shorts YT-1.0.0.dmg"
    echo "  📦 ZIP: Mystic Shorts YT-1.0.0-mac.zip"
    ;;
  "linux")
    echo "🐧 Linux файлы:"
    echo "  📦 AppImage: Mystic Shorts YT-1.0.0.AppImage"
    echo "  📦 DEB: Mystic Shorts YT-1.0.0.deb"
    ;;
  "windows")
    echo "🪟 Windows файлы:"
    echo "  💾 NSIS: Mystic Shorts YT Setup 1.0.0.exe"
    echo "  📦 Portable: Mystic Shorts YT 1.0.0.exe"
    ;;
esac

echo ""
echo "🚀 Для установки:"
case $OS in
  "macos")
    echo "  • Откройте DMG файл и перетащите приложение в Applications"
    ;;
  "linux")
    echo "  • Запустите AppImage файл или установите DEB пакет"
    ;;
  "windows")
    echo "  • Запустите NSIS установщик или portable версию"
    ;;
esac
