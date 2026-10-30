require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const photoRoutes = require('./routes/photos');
const { router: authRoutes, ensureAdminAccount } = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5001;

// ──────────────────────────────────────────────
// Middleware
// ──────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:4173',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:4173',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ],
  credentials: true,
}));
app.use(express.json());

// ──────────────────────────────────────────────
// Routes
// ──────────────────────────────────────────────
app.use('/api/photos', photoRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: app.get('dbType') === 'mock' ? 'Mock (In-Memory)' : 'MongoDB'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// ──────────────────────────────────────────────
// Start Server
// ──────────────────────────────────────────────
const startServer = async () => {
  const dbResult = await connectDB();
  app.set('dbType', dbResult.type);
  await ensureAdminAccount();
  
  app.listen(PORT, () => {
    console.log(`\n🚀 Photo Gallery API Server running on http://localhost:${PORT}`);
    console.log(`📡 API endpoint: http://localhost:${PORT}/api/photos`);
    console.log(`❤️  Health check: http://localhost:${PORT}/api/health\n`);
  });
};

startServer();
