import React, { useState, useEffect } from 'react';
import './App.css';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import Videos from './pages/Videos';
import Proxies from './pages/Proxies';
import Telegram from './pages/Telegram';
import Captcha from './pages/Captcha';
import Settings from './pages/Settings';

function App() {
  const [backendStatus, setBackendStatus] = useState('Проверка...');
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    // Проверяем статус backend
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      const response = await fetch('/api/health');
      if (response.ok) {
        setBackendStatus('✅ Backend работает');
      } else {
        setBackendStatus('❌ Backend недоступен');
      }
    } catch (error) {
      setBackendStatus('❌ Backend недоступен');
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'accounts':
        return <Accounts />;
      case 'videos':
        return <Videos />;
      case 'proxies':
        return <Proxies />;
      case 'telegram':
        return <Telegram />;
      case 'captcha':
        return <Captcha />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
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

        {/* Navigation */}
        <Navigation 
          currentPage={currentPage} 
          onPageChange={setCurrentPage} 
        />

        {/* Page Content */}
        <div className="page-content">
          {renderPage()}
        </div>

        <div className="quick-actions">
          <h2>⚡ Быстрые действия</h2>
          <div className="action-buttons">
            <button className="btn btn-primary" onClick={checkBackendStatus}>
              🔄 Проверить статус
            </button>
            <button className="btn btn-secondary" onClick={() => setCurrentPage('accounts')}>
              👥 Аккаунты
            </button>
            <button className="btn btn-secondary" onClick={() => setCurrentPage('videos')}>
              🎥 Видео
            </button>
            <button className="btn btn-secondary" onClick={() => setCurrentPage('settings')}>
              ⚙️ Настройки
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
