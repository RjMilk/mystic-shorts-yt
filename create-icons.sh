#!/bin/bash

echo "🎨 Создание иконок для приложения..."
echo "===================================="

# Проверяем наличие ImageMagick
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick не найден!"
    echo "Установите ImageMagick:"
    echo "  macOS: brew install imagemagick"
    echo "  Ubuntu: sudo apt-get install imagemagick"
    echo "  Windows: https://imagemagick.org/script/download.php#windows"
    exit 1
fi

# Создаем папку для иконок
mkdir -p electron-app/assets

# Создаем PNG иконки разных размеров
echo "📱 Создание PNG иконок..."

# 16x16
convert electron-app/assets/icon.svg -resize 16x16 electron-app/assets/icon-16.png

# 32x32
convert electron-app/assets/icon.svg -resize 32x32 electron-app/assets/icon-32.png

# 64x64
convert electron-app/assets/icon.svg -resize 64x64 electron-app/assets/icon-64.png

# 128x128
convert electron-app/assets/icon.svg -resize 128x128 electron-app/assets/icon-128.png

# 256x256
convert electron-app/assets/icon.svg -resize 256x256 electron-app/assets/icon-256.png

# 512x512
convert electron-app/assets/icon.svg -resize 512x512 electron-app/assets/icon-512.png

# Основная иконка
cp electron-app/assets/icon-512.png electron-app/assets/icon.png

# Создаем ICO файл для Windows
echo "🪟 Создание ICO файла..."
convert electron-app/assets/icon-16.png electron-app/assets/icon-32.png electron-app/assets/icon-64.png electron-app/assets/icon-128.png electron-app/assets/icon-256.png electron-app/assets/icon-512.png electron-app/assets/icon.ico

# Создаем ICNS файл для macOS
echo "🍎 Создание ICNS файла..."
if command -v iconutil &> /dev/null; then
    # Создаем iconset папку
    mkdir -p electron-app/assets/icon.iconset
    
    # Создаем все необходимые размеры для ICNS
    convert electron-app/assets/icon.svg -resize 16x16 electron-app/assets/icon.iconset/icon_16x16.png
    convert electron-app/assets/icon.svg -resize 32x32 electron-app/assets/icon.iconset/icon_16x16@2x.png
    convert electron-app/assets/icon.svg -resize 32x32 electron-app/assets/icon.iconset/icon_32x32.png
    convert electron-app/assets/icon.svg -resize 64x64 electron-app/assets/icon.iconset/icon_32x32@2x.png
    convert electron-app/assets/icon.svg -resize 128x128 electron-app/assets/icon.iconset/icon_128x128.png
    convert electron-app/assets/icon.svg -resize 256x256 electron-app/assets/icon.iconset/icon_128x128@2x.png
    convert electron-app/assets/icon.svg -resize 256x256 electron-app/assets/icon.iconset/icon_256x256.png
    convert electron-app/assets/icon.svg -resize 512x512 electron-app/assets/icon.iconset/icon_256x256@2x.png
    convert electron-app/assets/icon.svg -resize 512x512 electron-app/assets/icon.iconset/icon_512x512.png
    convert electron-app/assets/icon.svg -resize 1024x1024 electron-app/assets/icon.iconset/icon_512x512@2x.png
    
    # Создаем ICNS файл
    iconutil -c icns electron-app/assets/icon.iconset -o electron-app/assets/icon.icns
    
    # Удаляем временную папку
    rm -rf electron-app/assets/icon.iconset
else
    echo "⚠️  iconutil не найден, пропускаем создание ICNS файла"
fi

echo ""
echo "✅ Иконки созданы успешно!"
echo "========================="
echo "📁 Расположение: electron-app/assets/"
echo "📱 PNG файлы: icon-16.png до icon-512.png"
echo "🪟 Windows ICO: icon.ico"
echo "🍎 macOS ICNS: icon.icns"
echo ""
echo "🎉 Готово к сборке приложения!"
