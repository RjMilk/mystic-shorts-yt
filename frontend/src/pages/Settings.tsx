import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Save,
  RefreshCw,
  Database,
  Globe,
  Shield,
  Bell
} from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    maxConcurrentUploads: 3,
    uploadDelay: 30,
    retryAttempts: 3,
    autoWarmup: true,
    notifications: true,
    logLevel: 'info'
  });

  const handleSave = () => {
    // Здесь будет логика сохранения настроек
    alert('Настройки сохранены!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Настройки приложения
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Общие настройки и конфигурация системы
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0 space-x-3">
          <Button className="btn btn-outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Сбросить
          </Button>
          <Button onClick={handleSave} className="btn btn-primary">
            <Save className="h-4 w-4 mr-2" />
            Сохранить
          </Button>
        </div>
      </div>

      {/* Upload Settings */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <SettingsIcon className="h-5 w-5 mr-2" />
          Настройки загрузки
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Максимум одновременных загрузок
            </label>
            <Input
              type="number"
              value={settings.maxConcurrentUploads}
              onChange={(e) => setSettings({...settings, maxConcurrentUploads: parseInt(e.target.value)})}
              className="mt-1"
              min="1"
              max="10"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Задержка между загрузками (сек)
            </label>
            <Input
              type="number"
              value={settings.uploadDelay}
              onChange={(e) => setSettings({...settings, uploadDelay: parseInt(e.target.value)})}
              className="mt-1"
              min="0"
              max="300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Количество попыток повтора
            </label>
            <Input
              type="number"
              value={settings.retryAttempts}
              onChange={(e) => setSettings({...settings, retryAttempts: parseInt(e.target.value)})}
              className="mt-1"
              min="0"
              max="10"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.autoWarmup}
              onChange={(e) => setSettings({...settings, autoWarmup: e.target.checked})}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Автоматический прогрев аккаунтов
            </label>
          </div>
        </div>
      </div>

      {/* System Settings */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Database className="h-5 w-5 mr-2" />
          Системные настройки
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Уровень логирования
            </label>
            <select
              value={settings.logLevel}
              onChange={(e) => setSettings({...settings, logLevel: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="debug">Debug</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => setSettings({...settings, notifications: e.target.checked})}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Включить уведомления
            </label>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Безопасность
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                Шифрование данных
              </h4>
              <p className="text-sm text-gray-500">
                Шифровать пароли и чувствительные данные
              </p>
            </div>
            <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                Автоматическое удаление логов
              </h4>
              <p className="text-sm text-gray-500">
                Удалять логи старше 30 дней
              </p>
            </div>
            <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                Проверка SSL сертификатов
              </h4>
              <p className="text-sm text-gray-500">
                Проверять SSL сертификаты при подключении к API
              </p>
            </div>
            <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" defaultChecked />
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Globe className="h-5 w-5 mr-2" />
          Дополнительные настройки
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              User Agent
            </label>
            <Input
              type="text"
              placeholder="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
              className="mt-1"
            />
            <p className="mt-1 text-sm text-gray-500">
              User Agent для браузерных запросов
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Таймаут запросов (сек)
            </label>
            <Input
              type="number"
              placeholder="30"
              className="mt-1"
              min="5"
              max="300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Максимальный размер файла (MB)
            </label>
            <Input
              type="number"
              placeholder="100"
              className="mt-1"
              min="1"
              max="1000"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
