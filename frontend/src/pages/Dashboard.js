import React from 'react';
import { 
  Users, 
  Video, 
  Globe, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Upload
} from 'lucide-react';

const Dashboard = () => {
  // Mock data for demonstration
  const stats = {
    totalAccounts: 12,
    activeAccounts: 8,
    totalVideos: 45,
    workingProxies: 5,
    totalViews: 12500,
    todayErrors: 2,
    warmingAccounts: 3,
    bannedAccounts: 1,
    todayVideos: 3,
    todayAccounts: 1,
    todayViews: 450
  };

  const statsCards = [
    {
      title: 'Всего аккаунтов',
      value: stats.totalAccounts,
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Активные аккаунты',
      value: stats.activeAccounts,
      change: '+5%',
      changeType: 'positive',
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'Видео загружено',
      value: stats.totalVideos,
      change: '+23%',
      changeType: 'positive',
      icon: Video,
      color: 'purple'
    },
    {
      title: 'Рабочих прокси',
      value: stats.workingProxies,
      change: '-2%',
      changeType: 'negative',
      icon: Globe,
      color: 'orange'
    },
    {
      title: 'Общие просмотры',
      value: stats.totalViews,
      change: '+45%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'indigo'
    },
    {
      title: 'Ошибки за сегодня',
      value: stats.todayErrors,
      change: '-15%',
      changeType: 'positive',
      icon: AlertCircle,
      color: 'red'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Обзор активности и статистика ваших YouTube аккаунтов
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="card">
              <div className="card-body">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {card.title}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {card.value.toLocaleString()}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Account Status */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Статус аккаунтов</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">Активные</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {stats.activeAccounts}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="text-sm text-gray-600">В прогреве</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {stats.warmingAccounts}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-sm text-gray-600">Заблокированы</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {stats.bannedAccounts}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Activity */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Сегодня</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Upload className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-sm text-gray-600">Загружено видео</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {stats.todayVideos}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">Новых аккаунтов</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {stats.todayAccounts}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-purple-500 mr-2" />
                  <span className="text-sm text-gray-600">Просмотров</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {stats.todayViews}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Состояние системы</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API статус</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Онлайн
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">База данных</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Работает
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Telegram бот</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Активен
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Прокси сервис</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Частично
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
