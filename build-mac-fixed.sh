#!/usr/bin/env bash
set -euo pipefail

# ---------- helpers ----------
fail() { echo "❌ $*" >&2; exit 1; }
note() { echo "👉 $*"; }

# Определяем каталог, где лежит сам скрипт (работает и из Xcode, и из Terminal)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR" || fail "Не могу перейти в каталог скрипта: $SCRIPT_DIR"

echo "🍎 Сборка Mystic Shorts YT для macOS..."
echo "======================================"
echo "📁 Рабочая директория: $SCRIPT_DIR"

# ---------- базовые проверки ----------
[[ "$OSTYPE" == darwin* ]] || fail "Этот скрипт предназначен для macOS"

command -v node >/dev/null 2>&1 || fail "Node.js не найден! Установи с https://nodejs.org/"
command -v python3 >/dev/null 2>&1 || fail "Python3 не найден! Установи с https://www.python.org/"

echo "✅ Node.js и Python найдены: node=$(node -v), npm=$(npm -v), python=$(python3 --version)"

# ---------- проверяем структуру проекта ----------
[[ -d backend ]]      || fail "Папка backend не найдена в $SCRIPT_DIR"
[[ -d frontend ]]     || fail "Папка frontend не найдена в $SCRIPT_DIR"
[[ -d electron-app ]] || fail "Папка electron-app не найдена в $SCRIPT_DIR"

# ---------- BACKEND ----------
echo "🐍 Настройка Python backend..."
pushd backend >/dev/null

# venv
if [[ ! -d .venv ]]; then
  echo "📦 Создание виртуального окружения (.venv)..."
  python3 -m venv .venv
fi
# shellcheck disable=SC1091
source .venv/bin/activate

echo "⬆️  Обновление pip..."
python -m pip install -U pip

if [[ -f requirements.txt ]]; then
  echo "📥 Установка зависимостей backend из requirements.txt..."
  pip install -r requirements.txt
else
  note "requirements.txt не найден — пропускаю установку зависимостей backend"
fi

# .env
if [[ ! -f .env ]]; then
  echo "📝 Создание backend/.env..."
  cat > .env << 'EOF'
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

mkdir -p uploads temp logs
deactivate
popd >/dev/null

# ---------- FRONTEND ----------
echo "⚛️ Настройка React frontend..."
pushd frontend >/dev/null

[[ -f package.json ]] || fail "frontend/package.json не найден — проверь, что фронтенд корректно склонирован"

# если есть lock — используем npm ci, иначе npm install
if [[ -f package-lock.json ]]; then
  echo "📥 npm ci (frontend)..."
  npm ci
else
  echo "📥 npm install (frontend)..."
  npm install
fi

echo "🔨 Сборка frontend..."
npm run build
popd >/dev/null

# ---------- ELECTRON ----------
echo "⚡ Настройка Electron приложения..."
pushd electron-app >/dev/null

[[ -f package.json ]] || fail "electron-app/package.json не найден — проверь, что electron-приложение на месте"

if [[ -f package-lock.json ]]; then
  echo "📥 npm ci (electron)..."
  npm ci
else
  echo "📥 npm install (electron)..."
  npm install
fi

# если есть отдельный скрипт build:mac — используем его, иначе обычный build
if npm run | grep -q "build:mac"; then
  echo "📦 Сборка macOS приложения (npm run build:mac)..."
  npm run build:mac
else
  echo "📦 Сборка приложения (npm run build)..."
  npm run build
fi
popd >/dev/null

echo ""
echo "🎉 Сборка завершена!"
echo "==================="
echo "📁 Артефакты смотри в electron-app/dist/"
echo "ℹ️  Имя DMG/ZIP зависит от конфигурации package.json"
