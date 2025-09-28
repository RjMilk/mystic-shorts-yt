# 🚀 БЫСТРЫЙ СТАРТ Mystic Shorts YT

## ✅ Что уже готово

- ✅ **Backend API** работает на http://localhost:8000
- ✅ **Документация API** доступна на http://localhost:8000/docs
- ✅ **База данных** SQLite настроена
- ✅ **Все скрипты** для запуска на Windows, Mac, Linux
- ✅ **Docker** конфигурация готова

## 🎯 Запуск за 30 секунд

### Windows:
```cmd
start-backend.bat
```

### Mac/Linux:
```bash
./start-backend.sh
```

### С Docker:
```bash
docker-compose up -d
```

## 🌐 Что доступно после запуска

- **API**: http://localhost:8000
- **Документация**: http://localhost:8000/docs
- **Проверка здоровья**: http://localhost:8000/health

## 📱 Frontend (опционально)

Если хотите красивый интерфейс:

1. **Установите Node.js**: https://nodejs.org/
2. **Запустите полное приложение**:
   - Windows: `start.bat`
   - Mac/Linux: `./start.sh`

## 🔧 Настройка (опционально)

Отредактируйте файл `backend/.env`:

```env
# Telegram уведомления
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id

# YouTube API
YOUTUBE_API_KEY=your_api_key
YOUTUBE_CLIENT_ID=your_client_id
YOUTUBE_CLIENT_SECRET=your_client_secret

# Капча сервис
CAPTCHA_API_KEY=your_captcha_key
CAPTCHA_SERVICE=2captcha
```

## 📤 Загрузка на GitHub

1. Следуйте инструкциям в `GITHUB_SETUP.md`
2. Или просто выполните:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/mystic-shorts-yt.git
   git push -u origin main
   ```

## 🎉 Готово!

Теперь у вас есть полнофункциональный инструмент для управления YouTube аккаунтами!

### Следующие шаги:
1. Изучите API документацию
2. Настройте Telegram бот
3. Добавьте YouTube API ключи
4. Начните использовать систему!

### Поддержка:
- 📚 Документация: http://localhost:8000/docs
- 🐛 Проблемы: создайте Issue в GitHub
- 💬 Вопросы: используйте Discussions в GitHub
