# Shopify AI Backend - Phase 1

Minimal, extensible backend foundation for a future Shopify + AI agent system.

## 📁 Project Structure

```
backend/
├── api/
│   └── index.js          # Vercel serverless entry point
├── src/
│   ├── index.js          # Main Express application
│   ├── routes/
│   │   └── health.js     # Health check endpoint
│   └── middleware/
│       └── errorHandler.js  # Central error handler
├── .env.example          # Environment variables template
├── .gitignore
├── package.json
├── vercel.json           # Vercel deployment config
└── README.md
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Environment Variables

```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your values (optional for Phase 1)
```

### 3. Run Locally

```bash
npm run dev
```

Server will start at `http://localhost:3000`

## 📡 API Endpoints

| Method | Endpoint  | Description              |
|--------|-----------|--------------------------|
| GET    | `/`       | API info                 |
| GET    | `/health` | Health check with status |

### Health Check Response

```json
{
  "status": "ok",
  "timestamp": "2026-02-01T16:30:00.000Z",
  "uptime": 123.456,
  "environment": "development"
}
```

## 🌐 Deploy to Vercel

### Option 1: Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy from backend directory
cd backend
vercel
```

### Option 2: GitHub Integration

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Set root directory to `backend`
5. Deploy!

### Environment Variables on Vercel

Add your environment variables in Vercel Dashboard:
- Go to Project Settings → Environment Variables
- Add `NODE_ENV=production`
- Add `CORS_ORIGIN=https://your-shopify-store.myshopify.com`

## 🔧 Environment Variables

| Variable      | Description                    | Default       |
|---------------|--------------------------------|---------------|
| `PORT`        | Server port                    | `3000`        |
| `NODE_ENV`    | Environment mode               | `development` |
| `CORS_ORIGIN` | Allowed CORS origin            | `*`           |

## 🔮 Future Phases

This foundation is ready for:
- **Phase 2**: Shopify API integration
- **Phase 3**: AI/LLM agent integration
- **Phase 4**: Database layer
- **Phase 5**: Authentication

## 📝 License

MIT
