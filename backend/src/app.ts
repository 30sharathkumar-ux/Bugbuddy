import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import 'dotenv/config';

import debugRoutes from './routes/debug.routes';
import searchRoutes from './routes/search.routes';
import healthRoutes from './routes/health.routes';
import { errorHandler } from './middleware/error-handler';

const app = express();

// CORS
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.some(url => origin === url || origin.startsWith(url))) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing
app.use(express.json({ limit: '1mb' }));

// Logging
app.use(morgan('combined'));

// Rate limiting — 60 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { success: false, error: 'Too many requests, please slow down.' },
});
app.use('/api/', limiter);

// Root landing route
app.get(['/', '/api'], (req, res) => {
  const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:5173';
  if (req.headers.accept?.includes('text/html')) {
    return res.redirect(frontendUrl);
  }
  return res.json({
    status: 'online',
    service: 'Bug Buddy Backend API',
    frontendUrl,
    message: `Open ${frontendUrl} in your browser to view the Bug Buddy user interface.`,
    endpoints: {
      health: '/api/health',
      debug: '/api/debug/analyze',
      search: '/api/search',
    },
  });
});

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/debug', debugRoutes);
app.use('/api/search', searchRoutes);

// 404 fallback
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;
