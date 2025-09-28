# 🚀 Руководство по созданию релиза

## 📋 Подготовка к релизу

### 1. Создание иконок
```bash
./create-icons.sh
```

### 2. Сборка приложения

#### Для macOS:
```bash
./build-mac.sh
```

#### Для Windows:
```bash
# На Windows
build-windows.bat

# На Mac/Linux (кроссплатформенная сборка)
npm run build-win
```

#### Для всех платформ:
```bash
./build-all.sh
```

## 🎯 Создание релиза на GitHub

### 1. Подготовка файлов

После сборки у вас будут файлы:
- **macOS**: `Mystic Shorts YT-1.0.0.dmg`, `Mystic Shorts YT-1.0.0-mac.zip`
- **Windows**: `Mystic Shorts YT Setup 1.0.0.exe`, `Mystic Shorts YT 1.0.0.exe`
- **Linux**: `Mystic Shorts YT-1.0.0.AppImage`, `Mystic Shorts YT-1.0.0.deb`

### 2. Создание релиза

1. Перейдите на https://github.com/RjMilk/mystic-shorts-yt/releases
2. Нажмите **"Create a new release"**
3. Заполните:
   - **Tag version**: `v1.0.0`
   - **Release title**: `Mystic Shorts YT v1.0.0 - Desktop Application`
   - **Description**:

```markdown
# 🎉 Mystic Shorts YT v1.0.0 - Desktop Application

## ✨ Что нового
- 🖥️ **Нативное приложение** для macOS, Windows и Linux
- 🚀 **Простая установка** - один клик для запуска
- 🎨 **Красивый интерфейс** с современным дизайном
- ⚡ **Быстрый старт** - все настройки автоматические

## 🚀 Возможности
- ✅ Регистрация Gmail-аккаунтов под любое GEO
- ✅ Прогрев аккаунтов (новых и покупных)
- ✅ Уведомления и логирование в Telegram
- ✅ Поддержка HTTP и SOCKS5 прокси
- ✅ Залив Shorts и длинных видео
- ✅ Верификация аккаунтов по номеру
- ✅ Полное прохождение капч
- ✅ Автоматическая подача апелляций
- ✅ Ручной режим управления
- ✅ Удобная база данных и статистика
- ✅ Смена паролей в один клик

## 📥 Скачать

### macOS
- **DMG** (рекомендуется): `Mystic Shorts YT-1.0.0.dmg`
- **ZIP**: `Mystic Shorts YT-1.0.0-mac.zip`

### Windows
- **Установщик** (рекомендуется): `Mystic Shorts YT Setup 1.0.0.exe`
- **Portable**: `Mystic Shorts YT 1.0.0.exe`

### Linux
- **AppImage** (рекомендуется): `Mystic Shorts YT-1.0.0.AppImage`
- **DEB**: `Mystic Shorts YT-1.0.0.deb`

## 🛠️ Установка

### macOS
1. Скачайте DMG файл
2. Откройте DMG и перетащите приложение в Applications
3. Запустите из Applications или Launchpad

### Windows
1. Скачайте установщик EXE
2. Запустите установщик и следуйте инструкциям
3. Запустите из меню Пуск или с рабочего стола

### Linux
1. Скачайте AppImage файл
2. Сделайте исполняемым: `chmod +x Mystic\ Shorts\ YT-1.0.0.AppImage`
3. Запустите: `./Mystic\ Shorts\ YT-1.0.0.AppImage`

## 🔧 Системные требования

- **macOS**: 10.14+ (Mojave или новее)
- **Windows**: Windows 10+ (64-bit)
- **Linux**: Ubuntu 18.04+ или аналогичные дистрибутивы
- **RAM**: 4GB+ (рекомендуется 8GB)
- **Диск**: 500MB свободного места

## 📚 Документация

- 📖 [Полная документация](https://github.com/RjMilk/mystic-shorts-yt#readme)
- 🚀 [Быстрый старт](https://github.com/RjMilk/mystic-shorts-yt/blob/main/QUICK_START.md)
- 🛠️ [Ручная установка](https://github.com/RjMilk/mystic-shorts-yt#ручная-установка)

## 🐛 Сообщить о проблеме

Если у вас возникли проблемы:
1. Проверьте [Issues](https://github.com/RjMilk/mystic-shorts-yt/issues)
2. Создайте новый Issue с описанием проблемы
3. Приложите скриншоты и логи

## 📞 Поддержка

- 💬 [Discussions](https://github.com/RjMilk/mystic-shorts-yt/discussions)
- 🐛 [Issues](https://github.com/RjMilk/mystic-shorts-yt/issues)
- 📧 Email: support@mysticshorts.com

---

**⚠️ Отказ от ответственности**: Используйте на свой страх и риск. Соблюдайте правила YouTube и других сервисов.
```

4. Загрузите файлы приложения в раздел "Attach binaries"
5. Нажмите **"Publish release"**

## 🎯 Автоматизация сборки

### GitHub Actions

Создайте файл `.github/workflows/build.yml`:

```yaml
name: Build Desktop App

on:
  push:
    tags:
      - 'v*'
  workflow_dispatch:

jobs:
  build:
    runs-on: ${{ matrix.os }}
    
    strategy:
      matrix:
        os: [macos-latest, windows-latest, ubuntu-latest]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Setup Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.9'
    
    - name: Install dependencies
      run: |
        cd electron-app
        npm install
    
    - name: Build app
      run: |
        cd electron-app
        npm run build-${{ matrix.os }}
    
    - name: Upload artifacts
      uses: actions/upload-artifact@v3
      with:
        name: Mystic-Shorts-YT-${{ matrix.os }}
        path: electron-app/dist/
```

## 📊 Статистика релиза

После создания релиза отслеживайте:
- 📥 Количество скачиваний
- ⭐ Звезды репозитория
- 🍴 Форки
- 🐛 Issues и их решение
- 💬 Обсуждения в Discussions

## 🎉 Готово!

Теперь у вас есть профессиональный релиз с нативными приложениями для всех платформ!
