const { app, BrowserWindow, Menu, shell, dialog, ipcMain } = require('electron');
const path = require('path');
const express = require('express');
const cors = require('cors');
const net = require('net');

// Keep a global reference of the window object
let mainWindow;
let expressServer;

// Backend and Frontend ports
const BACKEND_PORT = 8000;
const FRONTEND_PORT = 3000;
let EXPRESS_PORT = 9000;

// Function to find a free port
function findFreePort(startPort = 9000) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        findFreePort(startPort + 1).then(resolve).catch(reject);
      } else {
        reject(err);
      }
    });
  });
}

async function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets/icon.png'),
    titleBarStyle: 'hiddenInset',
    show: false
  });

  // Create application menu
  createMenu();

  // Start backend and frontend
  await startServices();

  // Load the app
  const appUrl = `http://localhost:${EXPRESS_PORT}`;
  console.log('🌐 Loading app from:', appUrl);
  mainWindow.loadURL(appUrl);

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    console.log('✅ Window ready to show');
    mainWindow.show();
    
    // Always open DevTools for debugging
    mainWindow.webContents.openDevTools();
  });

  // Handle page load events
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('✅ Page finished loading');
  });

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('❌ Page failed to load:', errorCode, errorDescription);
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

function createMenu() {
  const template = [
    {
      label: 'Mystic Shorts YT',
      submenu: [
        {
          label: 'About Mystic Shorts YT',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About Mystic Shorts YT',
              message: 'Mystic Shorts YT v1.0.0',
              detail: 'YouTube Account Management Tool\n\nFeatures:\n• Gmail account registration\n• Account warming\n• Video uploads\n• Proxy support\n• Telegram notifications\n• Captcha solving'
            });
          }
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Cmd+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'Cmd+Z', role: 'undo' },
        { label: 'Redo', accelerator: 'Shift+Cmd+Z', role: 'redo' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'Cmd+X', role: 'cut' },
        { label: 'Copy', accelerator: 'Cmd+C', role: 'copy' },
        { label: 'Paste', accelerator: 'Cmd+V', role: 'paste' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { label: 'Reload', accelerator: 'Cmd+R', role: 'reload' },
        { label: 'Force Reload', accelerator: 'Cmd+Shift+R', role: 'forceReload' },
        { label: 'Toggle Developer Tools', accelerator: 'F12', role: 'toggleDevTools' },
        { type: 'separator' },
        { label: 'Actual Size', accelerator: 'Cmd+0', role: 'resetZoom' },
        { label: 'Zoom In', accelerator: 'Cmd+Plus', role: 'zoomIn' },
        { label: 'Zoom Out', accelerator: 'Cmd+-', role: 'zoomOut' },
        { type: 'separator' },
        { label: 'Toggle Fullscreen', accelerator: 'Ctrl+Cmd+F', role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { label: 'Minimize', accelerator: 'Cmd+M', role: 'minimize' },
        { label: 'Close', accelerator: 'Cmd+W', role: 'close' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Documentation',
          click: () => {
            shell.openExternal('https://github.com/RjMilk/mystic-shorts-yt');
          }
        },
        {
          label: 'Report Issue',
          click: () => {
            shell.openExternal('https://github.com/RjMilk/mystic-shorts-yt/issues');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

async function startServices() {
  console.log('🚀 Starting Mystic Shorts YT services...');

  try {
    // Find a free port for Express server
    EXPRESS_PORT = await findFreePort(9000);
    console.log(`📡 Using port ${EXPRESS_PORT} for Express server`);

    // Start Express server to serve the frontend
    startExpressServer();

    // Note: Backend and Frontend are now built-in, no external processes needed
    console.log('✅ All services are built-in and ready!');
  } catch (error) {
    console.error('❌ Error starting services:', error);
    dialog.showErrorBox('Startup Error', `Failed to start services: ${error.message}`);
  }
}

function startExpressServer() {
  const expressApp = express();
  
  expressApp.use(cors());
  expressApp.use(express.json());
  
  // Serve static files from frontend-build
  const frontendPath = path.join(__dirname, 'frontend-build');
  console.log('📁 Frontend path:', frontendPath);
  expressApp.use(express.static(frontendPath));
  
  // Fallback to index.html for SPA routing
  expressApp.get('*', (req, res) => {
    console.log('🔄 Fallback route:', req.path);
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
  
  // Mock data for demonstration
  const accounts = [];
  const videos = [];
  const stats = {
    totalAccounts: 0,
    activeAccounts: 0,
    totalVideos: 0,
    successRate: 0
  };

  // API Routes
  expressApp.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Mystic Shorts YT API is running' });
  });

  // Accounts API
  expressApp.get('/api/accounts', (req, res) => {
    res.json(accounts);
  });

  expressApp.post('/api/accounts', (req, res) => {
    const account = {
      id: Date.now(),
      email: req.body.email,
      password: req.body.password,
      country: req.body.country,
      proxy: req.body.proxy,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    accounts.push(account);
    stats.totalAccounts = accounts.length;
    stats.activeAccounts = accounts.filter(acc => acc.status === 'active').length;
    res.json(account);
  });

  expressApp.put('/api/accounts/:id', (req, res) => {
    const accountId = parseInt(req.params.id);
    const accountIndex = accounts.findIndex(acc => acc.id === accountId);
    
    if (accountIndex === -1) {
      return res.status(404).json({ error: 'Account not found' });
    }
    
    accounts[accountIndex] = { ...accounts[accountIndex], ...req.body };
    res.json(accounts[accountIndex]);
  });

  expressApp.delete('/api/accounts/:id', (req, res) => {
    const accountId = parseInt(req.params.id);
    const accountIndex = accounts.findIndex(acc => acc.id === accountId);
    
    if (accountIndex === -1) {
      return res.status(404).json({ error: 'Account not found' });
    }
    
    accounts.splice(accountIndex, 1);
    stats.totalAccounts = accounts.length;
    stats.activeAccounts = accounts.filter(acc => acc.status === 'active').length;
    res.json({ message: 'Account deleted successfully' });
  });

  // Videos API
  expressApp.get('/api/videos', (req, res) => {
    res.json(videos);
  });

  expressApp.post('/api/videos', (req, res) => {
    const video = {
      id: Date.now(),
      title: req.body.title,
      description: req.body.description,
      filePath: req.body.filePath,
      accountId: req.body.accountId,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    videos.push(video);
    stats.totalVideos = videos.length;
    res.json(video);
  });

  // Stats API
  expressApp.get('/api/stats', (req, res) => {
    res.json(stats);
  });

  // Settings API
  expressApp.get('/api/settings', (req, res) => {
    res.json({
      telegramBotToken: '',
      telegramChatId: '',
      youtubeApiKey: '',
      captchaApiKey: '',
      captchaService: '2captcha',
      defaultCountry: 'US',
      maxConcurrentUploads: 3
    });
  });

  expressApp.put('/api/settings', (req, res) => {
    res.json({ message: 'Settings updated successfully' });
  });

  // Error handling
  expressApp.use((err, req, res, next) => {
    console.error('API Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  });

  expressServer = expressApp.listen(EXPRESS_PORT, () => {
    console.log(`📡 Express server running on port ${EXPRESS_PORT}`);
    console.log(`🚀 API server ready at http://localhost:${EXPRESS_PORT}/api`);
  });
}

// Backend and Frontend are now built-in, no external processes needed

// This method will be called when Electron has finished initialization
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // Close Express server
  if (expressServer) {
    expressServer.close();
  }
  
  // On macOS, keep app running even when all windows are closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS, re-create window when dock icon is clicked
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle app quit
app.on('before-quit', () => {
  console.log('🛑 Shutting down services...');
  
  if (expressServer) {
    expressServer.close();
  }
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
});
