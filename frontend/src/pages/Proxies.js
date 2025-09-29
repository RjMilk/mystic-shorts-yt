import React, { useState } from 'react';
import { 
  Plus, 
  Globe, 
  CheckCircle,
  AlertCircle,
  Clock,
  Edit,
  Trash2,
  RefreshCw
} from 'lucide-react';

const Proxies = () => {
  const [proxies] = useState([
    {
      id: 1,
      host: '192.168.1.100',
      port: 8080,
      type: 'HTTP',
      status: 'working',
      country: 'US',
      speed: 150
    },
    {
      id: 2,
      host: '192.168.1.101',
      port: 1080,
      type: 'SOCKS5',
      status: 'working',
      country: 'GB',
      speed: 200
    },
    {
      id: 3,
      host: '192.168.1.102',
      port: 8080,
      type: 'HTTP',
      status: 'failed',
      country: 'DE',
      speed: 0
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'working':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'testing':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'working':
        return 'Работает';
      case 'failed':
        return 'Не работает';
      case 'testing':
        return 'Тестируется';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Управление прокси
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Настройка и мониторинг HTTP и SOCKS5 прокси серверов
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0 space-x-3">
          <button 
            className="btn btn-outline"
            onClick={() => alert('Функция тестирования прокси будет добавлена в следующей версии')}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Тестировать все
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => alert('Функция добавления прокси будет добавлена в следующей версии')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Добавить прокси
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Globe className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Всего прокси
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {proxies.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Работающих
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {proxies.filter(p => p.status === 'working').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Не работающих
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {proxies.filter(p => p.status === 'failed').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Средняя скорость
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {Math.round(proxies.filter(p => p.status === 'working').reduce((sum, p) => sum + p.speed, 0) / proxies.filter(p => p.status === 'working').length) || 0}ms
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Proxies Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Список прокси
          </h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {proxies.map((proxy) => (
            <li key={proxy.id} className="px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {getStatusIcon(proxy.status)}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {proxy.host}:{proxy.port}
                    </div>
                    <div className="text-sm text-gray-500">
                      {proxy.type} • {proxy.country} • {proxy.speed}ms
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    proxy.status === 'working' 
                      ? 'bg-green-100 text-green-800'
                      : proxy.status === 'testing'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {getStatusText(proxy.status)}
                  </span>
                  <div className="flex space-x-1">
                    <button 
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() => alert(`Тестирование прокси ${proxy.host}:${proxy.port} (демо)`)}
                      title="Тестировать прокси"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                    <button 
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() => alert(`Редактирование прокси ${proxy.host}:${proxy.port} (демо)`)}
                      title="Редактировать прокси"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      className="text-gray-400 hover:text-red-600"
                      onClick={() => {
                        if (window.confirm(`Удалить прокси ${proxy.host}:${proxy.port}?`)) {
                          alert('Прокси удален! (демо)');
                        }
                      }}
                      title="Удалить прокси"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Proxies;
