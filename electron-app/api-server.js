const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json());

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
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Mystic Shorts YT API is running' });
});

// Accounts API
app.get('/api/accounts', (req, res) => {
  res.json(accounts);
});

app.post('/api/accounts', (req, res) => {
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

app.put('/api/accounts/:id', (req, res) => {
  const accountId = parseInt(req.params.id);
  const accountIndex = accounts.findIndex(acc => acc.id === accountId);
  
  if (accountIndex === -1) {
    return res.status(404).json({ error: 'Account not found' });
  }
  
  accounts[accountIndex] = { ...accounts[accountIndex], ...req.body };
  res.json(accounts[accountIndex]);
});

app.delete('/api/accounts/:id', (req, res) => {
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
app.get('/api/videos', (req, res) => {
  res.json(videos);
});

app.post('/api/videos', (req, res) => {
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
app.get('/api/stats', (req, res) => {
  res.json(stats);
});

// Settings API
app.get('/api/settings', (req, res) => {
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

app.put('/api/settings', (req, res) => {
  // In a real app, this would save to a file or database
  res.json({ message: 'Settings updated successfully' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API Server running on port ${PORT}`);
});

module.exports = app;
