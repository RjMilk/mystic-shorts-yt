import React from 'react';
import { useQuery } from 'react-query';
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
import { StatsCard } from '../components/StatsCard';
import { RecentActivity } from '../components/RecentActivity';
import { UploadProgress } from '../components/UploadProgress';
import { QuickActions } from '../components/QuickActions';
import { api } from '../services/api';

export const Dashboard: React.FC = () => {
  const { data: stats, isLoading: statsLoading } = useQuery('dashboard-stats', api.getDashboardStats);
  const { data: recentActivity, isLoading: activityLoading } = useQuery('recent-activity', api.getRecentActivity);
  const { data: uploads, isLoading: uploadsLoading } = useQuery('active-uploads', api.getActiveUploads);

  const statsCards = [
    {
      title: 'Всего аккаунтов',
      value: stats?.totalAccounts || 0,
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Активные аккаунты',
      value: stats?.activeAccounts || 0,
      change: '+5%',
      changeType: 'positive' as const,
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'Видео загружено',
      value: stats?.totalVideos || 0,
      change: '+23%',
      changeType: 'positive' as const,
      icon: Video,
      color: 'purple'
    },
    {
      title: 'Рабочих прокси',
      value: stats?.workingProxies || 0,
      change: '-2%',
      changeType: 'negative' as const,
      icon: Globe,
      color: 'orange'
    },
    {
      title: 'Общие просмотры',
      value: stats?.totalViews || 0,
      change: '+45%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'indigo'
    },
    {
      title: 'Ошибки за сегодня',
      value: stats?.todayErrors || 0,
      change: '-15%',
      changeType: 'positive' as const,
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
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <QuickActions />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {statsCards.map((card, index) => (
          <StatsCard
            key={index}
            title={card.title}
            value={card.value}
            change={card.change}
            changeType={card.changeType}
            icon={card.icon}
            color={card.color}
            loading={statsLoading}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Последняя активность</h3>
          </div>
          <div className="card-body">
            <RecentActivity 
              activities={recentActivity || []} 
              loading={activityLoading} 
            />
          </div>
        </div>

        {/* Upload Progress */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Загрузка видео</h3>
          </div>
          <div className="card-body">
            <UploadProgress 
              uploads={uploads || []} 
              loading={uploadsLoading} 
            />
          </div>
        </div>
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
                  {stats?.activeAccounts || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="text-sm text-gray-600">В прогреве</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {stats?.warmingAccounts || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-sm text-gray-600">Заблокированы</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {stats?.bannedAccounts || 0}
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
                  {stats?.todayVideos || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">Новых аккаунтов</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {stats?.todayAccounts || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-purple-500 mr-2" />
                  <span className="text-sm text-gray-600">Просмотров</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {stats?.todayViews || 0}
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
