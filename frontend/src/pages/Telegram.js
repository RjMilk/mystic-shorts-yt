import React, { useState } from 'react';
import { 
  Phone, 
  Send,
  CheckCircle,
  AlertCircle,
  Settings,
  MessageSquare,
  Bot
} from 'lucide-react';

const Telegram = () => {
  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [testMessage, setTestMessage] = useState('Тестовое сообщение от Mystic Shorts YT');
  const [isConnected, setIsConnected] = useState(false);

  const handleTestConnection = () => {
    // Здесь будет логика тестирования подключения
    setIsConnected(true);
  };

  const handleSendTestMessage = () => {
    // Здесь будет логика отправки тестового сообщения
    alert('Тестовое сообщение отправлено!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Telegram настройки
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Настройка бота для уведомлений и мониторинга
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
                {isConnected ? 'Telegram бот подключен' : 'Telegram бот не подключен'}
              </p>
            </div>
          </div>
          <button
            onClick={handleTestConnection}
            className="btn btn-outline"
          >
            <Phone className="h-4 w-4 mr-2" />
            Проверить подключение
          </button>
        </div>
      </div>

      {/* Bot Settings */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Настройки бота
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Токен бота
            </label>
            <input
              type="password"
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              placeholder="Введите токен вашего Telegram бота"
              className="mt-1"
            />
            <p className="mt-1 text-sm text-gray-500">
              Получите токен у @BotFather в Telegram
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Chat ID
            </label>
            <input
              type="text"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              placeholder="Введите ID чата для уведомлений"
              className="mt-1"
            />
            <p className="mt-1 text-sm text-gray-500">
              ID чата или канала для получения уведомлений
            </p>
          </div>
          <div className="flex space-x-3">
            <button className="btn btn-primary">
              <Settings className="h-4 w-4 mr-2" />
              Сохранить настройки
            </button>
          </div>
        </div>
      </div>

      {/* Test Message */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Тестовая отправка
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Тестовое сообщение
            </label>
            <textarea
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              rows={3}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Введите тестовое сообщение"
            />
          </div>
          <button
            onClick={handleSendTestMessage}
            className="btn btn-outline"
          >
            <Send className="h-4 w-4 mr-2" />
            Отправить тестовое сообщение
          </button>
        </div>
      </div>

      {/* Notifications Settings */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Настройки уведомлений
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                Уведомления о загрузке видео
              </h4>
              <p className="text-sm text-gray-500">
                Получать уведомления при успешной загрузке видео
              </p>
            </div>
            <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                Уведомления об ошибках
              </h4>
              <p className="text-sm text-gray-500">
                Получать уведомления при возникновении ошибок
              </p>
            </div>
            <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                Уведомления о статусе аккаунтов
              </h4>
              <p className="text-sm text-gray-500">
                Получать уведомления об изменении статуса аккаунтов
              </p>
            </div>
            <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Telegram;
