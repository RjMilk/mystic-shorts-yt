import React, { useState } from 'react';
import { 
  Bot, 
  Settings,
  CheckCircle,
  AlertCircle,
  DollarSign,
  RefreshCw
} from 'lucide-react';

const Captcha = () => {
  const [apiKey, setApiKey] = useState('');
  const [balance, setBalance] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  const handleTestConnection = () => {
    // Здесь будет логика тестирования подключения
    setIsConnected(true);
    setBalance(15.50);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Настройки капчи
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Настройка сервиса для автоматического решения капчи
          </p>
        </div>
      </div>

      {/* Connection Status */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {isConnected ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : (
                <AlertCircle className="h-6 w-6 text-red-500" />
              )}
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                Статус подключения
              </h3>
              <p className="text-sm text-gray-500">
                {isConnected ? 'Сервис капчи подключен' : 'Сервис капчи не подключен'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsConnected(true);
              setBalance(15.50);
              alert('Сервис капчи подключен! (демо)');
            }}
            className="btn btn-outline"
          >
            <Bot className="h-4 w-4 mr-2" />
            Проверить подключение
          </button>
        </div>
      </div>

      {/* Balance */}
      {isConnected && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-6 w-6 text-green-500" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                Баланс аккаунта
              </h3>
              <p className="text-2xl font-bold text-green-600">
                ${balance.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Service Settings */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Настройки сервиса
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              API ключ
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Введите API ключ сервиса капчи"
              className="mt-1"
            />
            <p className="mt-1 text-sm text-gray-500">
              Получите API ключ у вашего провайдера капчи (2captcha, Anti-Captcha и т.д.)
            </p>
          </div>
            <div className="flex space-x-3">
              <button 
                className="btn btn-primary"
                onClick={() => alert('Настройки капчи сохранены! (демо)')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Сохранить настройки
              </button>
              <button 
                className="btn btn-outline"
                onClick={() => {
                  setBalance(15.50);
                  alert('Баланс обновлен! (демо)');
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Обновить баланс
              </button>
            </div>
        </div>
      </div>

      {/* Service Options */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Настройки решения
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                Автоматическое решение
              </h4>
              <p className="text-sm text-gray-500">
                Автоматически решать капчу при регистрации аккаунтов
              </p>
            </div>
            <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                Решение reCAPTCHA
              </h4>
              <p className="text-sm text-gray-500">
                Решать Google reCAPTCHA v2 и v3
              </p>
            </div>
            <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                Решение hCaptcha
              </h4>
              <p className="text-sm text-gray-500">
                Решать hCaptcha капчи
              </p>
            </div>
            <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                Решение FunCaptcha
              </h4>
              <p className="text-sm text-gray-500">
                Решать FunCaptcha (Arkose Labs)
              </p>
            </div>
            <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Статистика решения
        </h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">1,234</div>
            <div className="text-sm text-gray-500">Всего решено</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">98.5%</div>
            <div className="text-sm text-gray-500">Успешность</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">12.3s</div>
            <div className="text-sm text-gray-500">Среднее время</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Captcha;
