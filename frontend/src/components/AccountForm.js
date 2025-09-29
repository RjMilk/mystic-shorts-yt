import React, { useState, useEffect } from 'react';
import { Mail, Phone, Globe, User, Lock } from 'lucide-react';

const AccountForm = ({ initialData, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
    country: 'US',
    status: 'active',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};

    // Валидация email
    if (!formData.email) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный email';
    }

    // Валидация пароля
    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }

    // Валидация телефона
    if (!formData.phone) {
      newErrors.phone = 'Телефон обязателен';
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Некорректный формат телефона';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email */}
      <div>
        <label className="form-label flex items-center">
          <Mail className="h-4 w-4 mr-2" />
          Email адрес *
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`form-input ${errors.email ? 'border-red-500' : ''}`}
          placeholder="example@gmail.com"
          disabled={loading}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="form-label flex items-center">
          <Lock className="h-4 w-4 mr-2" />
          Пароль *
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={`form-input ${errors.password ? 'border-red-500' : ''}`}
          placeholder="Введите пароль"
          disabled={loading}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="form-label flex items-center">
          <Phone className="h-4 w-4 mr-2" />
          Номер телефона *
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={`form-input ${errors.phone ? 'border-red-500' : ''}`}
          placeholder="+1234567890"
          disabled={loading}
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
        )}
      </div>

      {/* Country */}
      <div>
        <label className="form-label flex items-center">
          <Globe className="h-4 w-4 mr-2" />
          Страна
        </label>
        <select
          name="country"
          value={formData.country}
          onChange={handleChange}
          className="form-input"
          disabled={loading}
        >
          <option value="US">США</option>
          <option value="GB">Великобритания</option>
          <option value="DE">Германия</option>
          <option value="FR">Франция</option>
          <option value="CA">Канада</option>
          <option value="AU">Австралия</option>
          <option value="RU">Россия</option>
          <option value="UA">Украина</option>
          <option value="BY">Беларусь</option>
        </select>
      </div>

      {/* Status */}
      <div>
        <label className="form-label flex items-center">
          <User className="h-4 w-4 mr-2" />
          Статус
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="form-input"
          disabled={loading}
        >
          <option value="active">Активный</option>
          <option value="warming_up">В прогреве</option>
          <option value="suspended">Заблокирован</option>
          <option value="banned">Забанен</option>
          <option value="pending_verification">Ожидает верификации</option>
        </select>
      </div>

      {/* Notes */}
      <div>
        <label className="form-label">Заметки</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="form-input"
          rows={3}
          placeholder="Дополнительная информация об аккаунте"
          disabled={loading}
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-outline"
          disabled={loading}
        >
          Отмена
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Сохранение...' : (initialData ? 'Обновить' : 'Создать')}
        </button>
      </div>
    </form>
  );
};

export default AccountForm;
