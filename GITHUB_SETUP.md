# 📤 Загрузка проекта на GitHub

## Шаг 1: Создайте репозиторий на GitHub

1. Перейдите на https://github.com
2. Нажмите кнопку **"New repository"** (зеленая кнопка)
3. Заполните поля:
   - **Repository name**: `mystic-shorts-yt`
   - **Description**: `YouTube account management tool with automated video uploads`
   - **Visibility**: Private (рекомендуется) или Public
4. **НЕ** ставьте галочки на "Add a README file", "Add .gitignore", "Choose a license"
5. Нажмите **"Create repository"**

## Шаг 2: Подключите локальный репозиторий к GitHub

Выполните команды в терминале (замените `YOUR_USERNAME` на ваш GitHub username):

```bash
# Добавляем удаленный репозиторий
git remote add origin https://github.com/YOUR_USERNAME/mystic-shorts-yt.git

# Переименовываем ветку в main (если нужно)
git branch -M main

# Загружаем код на GitHub
git push -u origin main
```

## Шаг 3: Проверьте загрузку

1. Обновите страницу репозитория на GitHub
2. Убедитесь, что все файлы загружены
3. Проверьте, что README.md отображается корректно

## Шаг 4: Настройте репозиторий

### Добавьте описание репозитория
В настройках репозитория добавьте:
- **Website**: `http://localhost:8000` (для локального запуска)
- **Topics**: `youtube`, `automation`, `python`, `react`, `fastapi`

### Создайте Issues и Projects (опционально)
- **Issues**: для отслеживания багов и предложений
- **Projects**: для планирования развития

## Шаг 5: Создайте релиз

1. Перейдите в **Releases**
2. Нажмите **"Create a new release"**
3. Заполните:
   - **Tag version**: `v1.0.0`
   - **Release title**: `Mystic Shorts YT v1.0.0`
   - **Description**: Скопируйте содержимое из README.md
4. Нажмите **"Publish release"**

## 🚀 Готово!

Теперь ваш проект доступен на GitHub и другие пользователи могут:

1. **Клонировать репозиторий**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/mystic-shorts-yt.git
   cd mystic-shorts-yt
   ```

2. **Запустить на Windows**:
   ```cmd
   start.bat
   ```

3. **Запустить на Linux/Mac**:
   ```bash
   ./start.sh
   ```

4. **Запустить только Backend**:
   ```bash
   # Linux/Mac
   ./start-backend.sh
   
   # Windows
   start-backend.bat
   ```

## 📋 Дополнительные настройки

### GitHub Actions (автоматические тесты)
Создайте файл `.github/workflows/ci.yml`:

```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Set up Python
      uses: actions/setup-python@v2
      with:
        python-version: 3.9
    - name: Install dependencies
      run: |
        cd backend
        pip install -r requirements.txt
    - name: Test
      run: |
        cd backend
        python -m pytest
```

### GitHub Pages (документация)
1. В настройках репозитория включите GitHub Pages
2. Выберите источник: "Deploy from a branch"
3. Выберите ветку: "main"
4. Папка: "/ (root)"

### Защита ветки main
1. Перейдите в Settings → Branches
2. Нажмите "Add rule"
3. Выберите "main"
4. Включите "Require pull request reviews before merging"

## 🔒 Безопасность

### Секреты (Secrets)
В Settings → Secrets добавьте:
- `TELEGRAM_BOT_TOKEN`
- `YOUTUBE_API_KEY`
- `CAPTCHA_API_KEY`
- `DATABASE_URL` (для продакшена)

### Игнорирование чувствительных данных
Убедитесь, что в `.gitignore` есть:
- `.env`
- `*.db`
- `logs/`
- `uploads/`
- `temp/`

## 📞 Поддержка

Если возникли проблемы:
1. Проверьте, что все файлы загружены
2. Убедитесь, что права на выполнение установлены для .sh файлов
3. Проверьте, что Python и Node.js установлены
4. Создайте Issue в репозитории с описанием проблемы
