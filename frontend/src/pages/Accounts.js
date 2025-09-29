import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Play, 
  Pause,
  CheckCircle,
  AlertCircle,
  Clock,
  Globe,
  Phone,
  Mail
} from 'lucide-react';

const Accounts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');

  // Mock data for demonstration
  const accounts = [
    {
      id: 1,
      email: 'account1@gmail.com',
      status: 'active',
      country: 'US',
      phone: '+1234567890',
      lastActivity: '2024-01-15',
      videos: 5,
      views: 1250
    },
    {
      id: 2,
      email: 'account2@gmail.com',
      status: 'warming_up',
      country: 'GB',
      phone: '+44123456789',
      lastActivity: '2024-01-14',
      videos: 2,
      views: 450
    },
    {
      id: 3,
      email: 'account3@gmail.com',
      status: 'suspended',
      country: 'DE',
      phone: '+49123456789',
      lastActivity: '2024-01-10',
      videos: 0,
      views: 0
    }
  ];

  const handleCreateAccount = () => {
    alert('Функция создания аккаунта будет добавлена в следующей версии');
  };

  const handleEditAccount = (account: any) => {
    alert(`Редактирование аккаунта ${account.email} будет добавлено в следующей версии`);
  };

  const handleDeleteAccount = (accountId: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этот аккаунт?')) {
      alert('Функция удаления аккаунта будет добавлена в следующей версии');
    }
  };

  const handleVerifyAccount = (accountId: number, phoneNumber: string) => {
    alert(`Верификация аккаунта ${accountId} с номером ${phoneNumber} будет добавлена в следующей версии`);
  };

  const handleStartWarming = (accountId: number) => {
    alert(`Прогрев аккаунта ${accountId} будет добавлен в следующей версии`);
  };

  const handleChangePassword = (accountId: number, newPassword: string) => {
    alert(`Смена пароля для аккаунта ${accountId} будет добавлена в следующей версии`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'suspended':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warming_up':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Активный';
      case 'suspended':
        return 'Заблокирован';
      case 'banned':
        return 'Забанен';
      case 'pending_verification':
        return 'Ожидает верификации';
      case 'warming_up':
        return 'В прогреве';
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
            Управление аккаунтами
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Создание, настройка и мониторинг Gmail/YouTube аккаунтов
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <button
            onClick={handleCreateAccount}
            className="btn btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Добавить аккаунт
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label className="form-label">Поиск</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск по email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-10"
                />
              </div>
            </div>
            <div>
              <label className="form-label">Статус</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-input"
              >
                <option value="all">Все статусы</option>
                <option value="active">Активные</option>
                <option value="suspended">Заблокированные</option>
                <option value="banned">Забаненные</option>
                <option value="pending_verification">Ожидают верификации</option>
                <option value="warming_up">В прогреве</option>
              </select>
            </div>
            <div>
              <label className="form-label">Страна</label>
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="form-input"
              >
                <option value="all">Все страны</option>
                <option value="US">США</option>
                <option value="GB">Великобритания</option>
                <option value="DE">Германия</option>
                <option value="FR">Франция</option>
                <option value="CA">Канада</option>
                <option value="AU">Австралия</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setCountryFilter('all');
                }}
                className="btn btn-outline w-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                Сбросить
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">
            Аккаунты ({accounts.length})
          </h3>
        </div>
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Страна
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Телефон
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Видео
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Просмотры
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {accounts.map((account) => (
                  <tr key={account.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm font-medium text-gray-900">
                          {account.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(account.status)}
                        <span className="ml-2 text-sm text-gray-900">
                          {getStatusText(account.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {account.country}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {account.phone}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {account.videos}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {account.views.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditAccount(account)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleStartWarming(account.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Play className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAccount(account.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accounts;
