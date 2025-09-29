// Утилиты для работы с локальным хранилищем

const STORAGE_KEYS = {
  ACCOUNTS: 'mystic_shorts_accounts',
  VIDEOS: 'mystic_shorts_videos',
  PROXIES: 'mystic_shorts_proxies',
  SETTINGS: 'mystic_shorts_settings'
};

// Функции для работы с аккаунтами
export const accountStorage = {
  // Получить все аккаунты
  getAll: () => {
    try {
      const accounts = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      return accounts ? JSON.parse(accounts) : [];
    } catch (error) {
      console.error('Ошибка при получении аккаунтов:', error);
      return [];
    }
  },

  // Сохранить аккаунт
  save: (account) => {
    try {
      const accounts = accountStorage.getAll();
      const existingIndex = accounts.findIndex(acc => acc.id === account.id);
      let savedAccount;
      
      if (existingIndex >= 0) {
        savedAccount = { ...account, updatedAt: new Date().toISOString() };
        accounts[existingIndex] = savedAccount;
      } else {
        savedAccount = {
          ...account,
          id: account.id || Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        accounts.push(savedAccount);
      }
      
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
      return savedAccount;
    } catch (error) {
      console.error('Ошибка при сохранении аккаунта:', error);
      throw error;
    }
  },

  // Удалить аккаунт
  delete: (accountId) => {
    try {
      const accounts = accountStorage.getAll();
      const filteredAccounts = accounts.filter(acc => acc.id !== accountId);
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(filteredAccounts));
      return true;
    } catch (error) {
      console.error('Ошибка при удалении аккаунта:', error);
      throw error;
    }
  },

  // Получить аккаунт по ID
  getById: (accountId) => {
    const accounts = accountStorage.getAll();
    return accounts.find(acc => acc.id === accountId);
  }
};

// Функции для работы с видео
export const videoStorage = {
  getAll: () => {
    try {
      const videos = localStorage.getItem(STORAGE_KEYS.VIDEOS);
      return videos ? JSON.parse(videos) : [];
    } catch (error) {
      console.error('Ошибка при получении видео:', error);
      return [];
    }
  },

  save: (video) => {
    try {
      const videos = videoStorage.getAll();
      const existingIndex = videos.findIndex(v => v.id === video.id);
      let savedVideo;
      
      if (existingIndex >= 0) {
        savedVideo = { ...video, updatedAt: new Date().toISOString() };
        videos[existingIndex] = savedVideo;
      } else {
        savedVideo = {
          ...video,
          id: video.id || Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        videos.push(savedVideo);
      }
      
      localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(videos));
      return savedVideo;
    } catch (error) {
      console.error('Ошибка при сохранении видео:', error);
      throw error;
    }
  },

  delete: (videoId) => {
    try {
      const videos = videoStorage.getAll();
      const filteredVideos = videos.filter(v => v.id !== videoId);
      localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(filteredVideos));
      return true;
    } catch (error) {
      console.error('Ошибка при удалении видео:', error);
      throw error;
    }
  }
};

// Функции для работы с прокси
export const proxyStorage = {
  getAll: () => {
    try {
      const proxies = localStorage.getItem(STORAGE_KEYS.PROXIES);
      return proxies ? JSON.parse(proxies) : [];
    } catch (error) {
      console.error('Ошибка при получении прокси:', error);
      return [];
    }
  },

  save: (proxy) => {
    try {
      const proxies = proxyStorage.getAll();
      const existingIndex = proxies.findIndex(p => p.id === proxy.id);
      let savedProxy;
      
      if (existingIndex >= 0) {
        savedProxy = { ...proxy, updatedAt: new Date().toISOString() };
        proxies[existingIndex] = savedProxy;
      } else {
        savedProxy = {
          ...proxy,
          id: proxy.id || Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        proxies.push(savedProxy);
      }
      
      localStorage.setItem(STORAGE_KEYS.PROXIES, JSON.stringify(proxies));
      return savedProxy;
    } catch (error) {
      console.error('Ошибка при сохранении прокси:', error);
      throw error;
    }
  },

  delete: (proxyId) => {
    try {
      const proxies = proxyStorage.getAll();
      const filteredProxies = proxies.filter(p => p.id !== proxyId);
      localStorage.setItem(STORAGE_KEYS.PROXIES, JSON.stringify(filteredProxies));
      return true;
    } catch (error) {
      console.error('Ошибка при удалении прокси:', error);
      throw error;
    }
  }
};

// Функции для работы с настройками
export const settingsStorage = {
  get: () => {
    try {
      const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return settings ? JSON.parse(settings) : {
        maxConcurrentUploads: 3,
        uploadDelay: 30,
        retryAttempts: 3,
        autoWarmup: true,
        notifications: true,
        logLevel: 'info'
      };
    } catch (error) {
      console.error('Ошибка при получении настроек:', error);
      return {};
    }
  },

  save: (settings) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      return settings;
    } catch (error) {
      console.error('Ошибка при сохранении настроек:', error);
      throw error;
    }
  }
};

// Функция для получения статистики
export const getStats = () => {
  const accounts = accountStorage.getAll();
  const videos = videoStorage.getAll();
  const proxies = proxyStorage.getAll();

  return {
    totalAccounts: accounts.length,
    activeAccounts: accounts.filter(acc => acc.status === 'active').length,
    warmingAccounts: accounts.filter(acc => acc.status === 'warming_up').length,
    bannedAccounts: accounts.filter(acc => acc.status === 'banned' || acc.status === 'suspended').length,
    totalVideos: videos.length,
    uploadedVideos: videos.filter(v => v.status === 'uploaded').length,
    processingVideos: videos.filter(v => v.status === 'processing').length,
    failedVideos: videos.filter(v => v.status === 'failed').length,
    workingProxies: proxies.filter(p => p.status === 'working').length,
    totalViews: videos.reduce((sum, v) => sum + (v.views || 0), 0),
    todayVideos: videos.filter(v => {
      const today = new Date().toDateString();
      return new Date(v.createdAt).toDateString() === today;
    }).length,
    todayAccounts: accounts.filter(acc => {
      const today = new Date().toDateString();
      return new Date(acc.createdAt).toDateString() === today;
    }).length,
    todayViews: videos.filter(v => {
      const today = new Date().toDateString();
      return new Date(v.createdAt).toDateString() === today;
    }).reduce((sum, v) => sum + (v.views || 0), 0)
  };
};
