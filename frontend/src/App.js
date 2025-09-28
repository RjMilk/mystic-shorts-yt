import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [backendStatus, setBackendStatus] = useState('Проверка...');
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    // Проверяем статус backend
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      const response = await fetch('http://localhost:8000/health');
      if (response.ok) {
        setBackendStatus('✅ Backend работает');
      } else {
        setBackendStatus('❌ Backend недоступен');
      }
    } catch (error) {
      setBackendStatus('❌ Backend недоступен');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎬 Mystic Shorts YT</h1>
        <p>YouTube Automation Tool</p>
        
        <div className="status-section">
          <h2>Статус системы</h2>
          <div className="status-item">
            <span>Backend API:</span>
            <span className={backendStatus.includes('✅') ? 'status-ok' : 'status-error'}>
              {backendStatus}
            </span>
          </div>
        </div>

        <div className="features-section">
          <h2>🚀 Возможности</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>📧 Gmail аккаунты</h3>
              <p>Регистрация и прогрев аккаунтов</p>
            </div>
            <div className="feature-card">
              <h3>📱 Telegram уведомления</h3>
              <p>Логирование и уведомления</p>
            </div>
            <div className="feature-card">
              <h3>🌐 Прокси поддержка</h3>
              <p>HTTP и SOCKS5 прокси</p>
            </div>
            <div className="feature-card">
              <h3>🎥 Загрузка видео</h3>
              <p>Shorts и длинные видео</p>
            </div>
            <div className="feature-card">
              <h3>📞 Верификация</h3>
              <p>Привязка и верификация номеров</p>
            </div>
            <div className="feature-card">
              <h3>🤖 Капча решение</h3>
              <p>Автоматическое прохождение капчи</p>
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <h2>⚡ Быстрые действия</h2>
          <div className="action-buttons">
            <button className="btn btn-primary" onClick={checkBackendStatus}>
              🔄 Проверить статус
            </button>
            <button className="btn btn-secondary">
              📊 Статистика
            </button>
            <button className="btn btn-secondary">
              ⚙️ Настройки
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
