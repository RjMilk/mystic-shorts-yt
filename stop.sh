#!/bin/bash

echo "🛑 Остановка Mystic Shorts YT..."
echo "================================"

# Останавливаем контейнеры
docker-compose down

echo "✅ Приложение остановлено"
echo ""
echo "💡 Для полной очистки (удаление данных) выполните:"
echo "   docker-compose down -v"
