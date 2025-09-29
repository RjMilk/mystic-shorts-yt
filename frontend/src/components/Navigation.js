import React from 'react';
import { 
  Home, 
  Users, 
  Video, 
  Settings, 
  BarChart3,
  Globe,
  Phone,
  Bot
} from 'lucide-react';

const Navigation = ({ currentPage, onPageChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'accounts', label: 'Аккаунты', icon: Users },
    { id: 'videos', label: 'Видео', icon: Video },
    { id: 'proxies', label: 'Прокси', icon: Globe },
    { id: 'telegram', label: 'Telegram', icon: Phone },
    { id: 'captcha', label: 'Капча', icon: Bot },
    { id: 'settings', label: 'Настройки', icon: Settings },
  ];

  return (
    <nav className="navigation">
      <div className="nav-buttons">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`nav-button ${isActive ? 'active' : ''}`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
