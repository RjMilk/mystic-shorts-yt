import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
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
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { AccountForm } from '../components/AccountForm';
import { AccountTable } from '../components/AccountTable';
import { StatusBadge } from '../components/StatusBadge';
import { api } from '../services/api';
import toast from 'react-hot-toast';

export const Accounts: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');

  const queryClient = useQueryClient();

  const { data: accounts, isLoading } = useQuery(
    ['accounts', searchTerm, statusFilter, countryFilter],
    () => api.getAccounts({ search: searchTerm, status: statusFilter, country: countryFilter })
  );

  const createAccountMutation = useMutation(api.createAccount, {
    onSuccess: () => {
      queryClient.invalidateQueries('accounts');
      setIsCreateModalOpen(false);
      toast.success('Аккаунт успешно создан');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Ошибка создания аккаунта');
    }
  });

  const updateAccountMutation = useMutation(api.updateAccount, {
    onSuccess: () => {
      queryClient.invalidateQueries('accounts');
      setIsEditModalOpen(false);
      setSelectedAccount(null);
      toast.success('Аккаунт успешно обновлен');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Ошибка обновления аккаунта');
    }
  });

  const deleteAccountMutation = useMutation(api.deleteAccount, {
    onSuccess: () => {
      queryClient.invalidateQueries('accounts');
      toast.success('Аккаунт успешно удален');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Ошибка удаления аккаунта');
    }
  });

  const verifyAccountMutation = useMutation(api.verifyAccount, {
    onSuccess: () => {
      queryClient.invalidateQueries('accounts');
      toast.success('Аккаунт успешно верифицирован');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Ошибка верификации аккаунта');
    }
  });

  const startWarmingMutation = useMutation(api.startWarming, {
    onSuccess: () => {
      queryClient.invalidateQueries('accounts');
      toast.success('Прогрев аккаунта запущен');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Ошибка запуска прогрева');
    }
  });

  const changePasswordMutation = useMutation(api.changePassword, {
    onSuccess: () => {
      queryClient.invalidateQueries('accounts');
      toast.success('Пароль успешно изменен');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Ошибка смены пароля');
    }
  });

  const handleCreateAccount = (data: any) => {
    createAccountMutation.mutate(data);
  };

  const handleEditAccount = (account: any) => {
    setSelectedAccount(account);
    setIsEditModalOpen(true);
  };

  const handleUpdateAccount = (data: any) => {
    updateAccountMutation.mutate({ id: selectedAccount.id, ...data });
  };

  const handleDeleteAccount = (accountId: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этот аккаунт?')) {
      deleteAccountMutation.mutate(accountId);
    }
  };

  const handleVerifyAccount = (accountId: number, phoneNumber: string) => {
    verifyAccountMutation.mutate({ accountId, phoneNumber });
  };

  const handleStartWarming = (accountId: number) => {
    startWarmingMutation.mutate(accountId);
  };

  const handleChangePassword = (accountId: number, newPassword: string) => {
    changePasswordMutation.mutate({ accountId, newPassword });
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
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Добавить аккаунт
          </Button>
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
                <Input
                  type="text"
                  placeholder="Поиск по email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
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
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setCountryFilter('all');
                }}
                className="btn btn-outline w-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                Сбросить
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">
            Аккаунты ({accounts?.length || 0})
          </h3>
        </div>
        <div className="card-body p-0">
          <AccountTable
            accounts={accounts || []}
            loading={isLoading}
            onEdit={handleEditAccount}
            onDelete={handleDeleteAccount}
            onVerify={handleVerifyAccount}
            onStartWarming={handleStartWarming}
            onChangePassword={handleChangePassword}
          />
        </div>
      </div>

      {/* Create Account Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Создать новый аккаунт"
      >
        <AccountForm
          onSubmit={handleCreateAccount}
          loading={createAccountMutation.isLoading}
        />
      </Modal>

      {/* Edit Account Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedAccount(null);
        }}
        title="Редактировать аккаунт"
      >
        {selectedAccount && (
          <AccountForm
            initialData={selectedAccount}
            onSubmit={handleUpdateAccount}
            loading={updateAccountMutation.isLoading}
          />
        )}
      </Modal>
    </div>
  );
};
