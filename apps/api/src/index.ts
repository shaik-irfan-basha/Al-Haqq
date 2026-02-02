/**
 * Al-Haqq API Server
 * Main entry point
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { quranRouter } from './routes/quran';
import { hadithRouter } from './routes/hadith';
import { searchRouter } from './routes/search';
import { basiraRouter } from './routes/basira';
import { errorHandler } from './middleware/error';

// Load environment variables
dotenv.config({ path: '../../.env.local' });

const app = express();
const PORT = process.env.PORT || 4000;

// ==================
// Middleware
// ==================

// Security headers
app.use(helmet());

// CORS configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '1mb' }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// AI endpoint has stricter rate limiting
const aiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 requests per minute
    message: { error: 'AI rate limit exceeded. Please wait before asking more questions.' },
});
app.use('/api/v1/basira', aiLimiter);

// ==================
// Routes
// ==================

// Health check
app.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        service: 'al-haqq-api',
        timestamp: new Date().toISOString(),
    });
});

// API v1 routes
app.use('/api/v1/quran', quranRouter);
app.use('/api/v1/hadith', hadithRouter);
app.use('/api/v1/search', searchRouter);
app.use('/api/v1/basira', basiraRouter);

// 404 handler
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Endpoint not found' }
    });
});

// Error handler
app.use(errorHandler);

// ==================
// Start Server
// ==================

app.listen(PORT, () => {
    console.log(`
🕌 Al-Haqq API Server
=====================
Port: ${PORT}
Environment: ${process.env.NODE_ENV || 'development'}
Timestamp: ${new Date().toISOString()}

Endpoints:
  GET  /health
  GET  /api/v1/quran/surahs
  GET  /api/v1/quran/surahs/:number
  GET  /api/v1/hadith/books
  GET  /api/v1/hadith/:book/:number
  GET  /api/v1/search
  POST /api/v1/basira/ask
  `);
});

export default app;
