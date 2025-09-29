import React, { useState } from 'react';
import { 
  Plus, 
  Upload, 
  Play, 
  Pause,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Video
} from 'lucide-react';

const Videos = () => {
  const [videos] = useState([
    {
      id: 1,
      title: 'Мой первый Short',
      status: 'uploaded',
      views: 1250,
      uploadDate: '2024-01-15',
      duration: '0:15'
    },
    {
      id: 2,
      title: 'Обзор нового продукта',
      status: 'processing',
      views: 0,
      uploadDate: '2024-01-14',
      duration: '2:30'
    },
    {
      id: 3,
      title: 'Туториал по настройке',
      status: 'failed',
      views: 0,
      uploadDate: '2024-01-13',
      duration: '5:45'
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploaded':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'uploaded':
        return 'Загружено';
      case 'processing':
        return 'Обрабатывается';
      case 'failed':
        return 'Ошибка';
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
            Управление видео
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Загрузка, мониторинг и управление YouTube видео
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0 space-x-3">
          <button className="btn btn-outline">
            <Upload className="h-4 w-4 mr-2" />
            Загрузить видео
          </button>
          <button className="btn btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Создать Short
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Video className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Всего видео
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {videos.length}
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
                <Eye className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Общие просмотры
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {videos.reduce((sum, video) => sum + video.views, 0).toLocaleString()}
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
                    Успешно загружено
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {videos.filter(v => v.status === 'uploaded').length}
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
                    С ошибками
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {videos.filter(v => v.status === 'failed').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Videos Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Список видео
          </h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {videos.map((video) => (
            <li key={video.id} className="px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {getStatusIcon(video.status)}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {video.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {video.duration} • {video.views.toLocaleString()} просмотров
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    video.status === 'uploaded' 
                      ? 'bg-green-100 text-green-800'
                      : video.status === 'processing'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {getStatusText(video.status)}
                  </span>
                  <div className="flex space-x-1">
                    <button className="text-gray-400 hover:text-gray-600">
                      <Play className="h-4 w-4" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-gray-400 hover:text-red-600">
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

export default Videos;
