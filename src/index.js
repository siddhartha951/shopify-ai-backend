/**
 * Main Express Application Entry Point
 * Phase-1: Backend Foundation
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const healthRoutes = require('./routes/health');
const shopifyWebhookRoutes = require('./routes/shopifyWebhook');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// ======================
// Middleware
// ======================

// Enable CORS for all origins (configure in production)
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// ======================
// Routes
// ======================

// Health check endpoint
app.use('/health', healthRoutes);

// Shopify webhook endpoint
app.use('/webhooks', shopifyWebhookRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Shopify AI Backend - Phase 1',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      webhooks: '/webhooks/products'
    }
  });
});

// ======================
// Error Handling
// ======================

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Central error handler
app.use(errorHandler);

// ======================
// Server Start (for local development)
// ======================

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
  });
}

// Export for Vercel serverless
module.exports = app;
