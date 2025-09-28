const { app, BrowserWindow, Menu, shell, dialog, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const express = require('express');
const cors = require('cors');

// Keep a global reference of the window object
let mainWindow;
let backendProcess;
let frontendProcess;
let expressServer;

// Backend and Frontend ports
const BACKEND_PORT = 8000;
const FRONTEND_PORT = 3000;
const EXPRESS_PORT = 9000;

function createWindow() {
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
  startServices();

  // Load the app
  mainWindow.loadURL(`http://localhost:${EXPRESS_PORT}`);

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Open DevTools in development
    if (process.env.NODE_ENV === 'development') {
      mainWindow.webContents.openDevTools();
    }
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

function startServices() {
  console.log('🚀 Starting Mystic Shorts YT services...');

  // Start Express server to serve the frontend
  startExpressServer();

  // Start Python backend
  startBackend();

  // Start React frontend
  startFrontend();
}

function startExpressServer() {
  const expressApp = express();
  
  expressApp.use(cors());
  expressApp.use(express.static(path.join(__dirname, '../frontend/build')));
  
  // Proxy API requests to backend
  expressApp.use('/api', (req, res) => {
    const { spawn } = require('child_process');
    const curl = spawn('curl', [
      '-X', req.method,
      `http://localhost:${BACKEND_PORT}${req.path}`,
      '-H', 'Content-Type: application/json',
      '-d', JSON.stringify(req.body)
    ]);
    
    curl.stdout.on('data', (data) => {
      res.send(data);
    });
    
    curl.stderr.on('data', (data) => {
      console.error('Backend error:', data.toString());
    });
  });

  expressServer = expressApp.listen(EXPRESS_PORT, () => {
    console.log(`📡 Express server running on port ${EXPRESS_PORT}`);
  });
}

function startBackend() {
  const backendPath = path.join(__dirname, '../backend');
  
  console.log('🐍 Starting Python backend...');
  
  backendProcess = spawn('python3', ['main.py'], {
    cwd: backendPath,
    stdio: 'pipe'
  });

  backendProcess.stdout.on('data', (data) => {
    console.log('Backend:', data.toString());
  });

  backendProcess.stderr.on('data', (data) => {
    console.error('Backend error:', data.toString());
  });

  backendProcess.on('close', (code) => {
    console.log(`Backend process exited with code ${code}`);
  });
}

function startFrontend() {
  const frontendPath = path.join(__dirname, '../frontend');
  
  console.log('⚛️ Starting React frontend...');
  
  frontendProcess = spawn('npm', ['start'], {
    cwd: frontendPath,
    stdio: 'pipe',
    shell: true
  });

  frontendProcess.stdout.on('data', (data) => {
    console.log('Frontend:', data.toString());
  });

  frontendProcess.stderr.on('data', (data) => {
    console.error('Frontend error:', data.toString());
  });

  frontendProcess.on('close', (code) => {
    console.log(`Frontend process exited with code ${code}`);
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // Kill all processes
  if (backendProcess) {
    backendProcess.kill();
  }
  if (frontendProcess) {
    frontendProcess.kill();
  }
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
  
  if (backendProcess) {
    backendProcess.kill();
  }
  if (frontendProcess) {
    frontendProcess.kill();
  }
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
