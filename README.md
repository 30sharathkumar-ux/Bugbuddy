# Bug Buddy — Live Research Debugging Assistant

> An intelligent debugging assistant that searches the **live web** using SerpAPI + You.com, extracts evidence from GitHub Issues, Stack Overflow, and official docs, and generates grounded AI analysis with Gemini.

---

## ⚡ Quick Start

### Option A — One-Click Startup (Windows)
```
Double-click: start.bat
```

### Option B — Manual Startup

**1. Configure API Keys**
```bash
copy backend\.env.example backend\.env
# Edit backend\.env and add your keys
```

**2. Start Backend** (Terminal 1)
```bash
cd backend
npm install
npm run dev
# → http://localhost:3001
```

**3. Start Frontend** (Terminal 2)
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

---

## 🔑 API Keys

| Variable | Source | Required? |
|---|---|---|
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com) | **Required** |
| `SERPAPI_API_KEY` | [serpapi.com](https://serpapi.com) | Recommended |
| `YDC_API_KEY` | [api.you.com](https://api.you.com) | Recommended |

> **Without search keys**: The app still works — Gemini analyzes the error from its training knowledge and clearly indicates that live research was unavailable.

---

## 🏗️ Architecture

```
frontend/                    React 19 + Vite 8 + Tailwind v4
backend/
  src/services/
    gemini.service.ts        Gemini AI (query gen, root cause, fix comparison)
    serpapi.service.ts       Google search via SerpAPI
    youcom.service.ts        Web search via You.com (ydc-index.io/v1/search)
    query-generator.service  Generates 4-6 targeted search queries per error
    retrieval.service.ts     Parallel search across both providers
    content-extractor.ts     Fetches & cleans page content
    source-ranking.service   Scores sources by type, relevance, tech match
    debugging.service.ts     Main pipeline orchestrator
```

## 🌐 API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/debug/analyze` | Full debugging pipeline |
| `POST` | `/api/debug` | Same (alias) |
| `GET` | `/api/health` | Backend + provider status |
| `GET` | `/api/search` | Raw search query |

**Request body for `/api/debug/analyze`:**
```json
{
  "error": "npm ERR! ERESOLVE unable to resolve dependency tree",
  "technology": ["Node.js", "npm"],
  "context": "React 18 project"
}
```

## 🧪 Test Cases

The app is designed to handle:

1. `npm ERR! ERESOLVE unable to resolve dependency tree`
2. `ModuleNotFoundError: No module named 'pandas'`
3. `Failed to resolve import "/src/main.tsx" from "index.html"`
4. `java.lang.NullPointerException`
5. `Access denied for user 'root'@'localhost'`
6. `Error: Cannot find module 'express'`

## 🛡️ Provider Failure Handling

| SerpAPI | You.com | Behavior |
|---------|---------|----------|
| ✓ | ✓ | Full dual-source research |
| ✓ | ✗ | Uses SerpAPI only, notes You.com unavailable |
| ✗ | ✓ | Uses You.com only |
| ✗ | ✗ | Gemini analyzes from training knowledge, clearly disclosed |

---

## 📁 Project Structure

```
Paytmbuildathon/
├── backend/
│   ├── src/
│   │   ├── routes/          debug.routes.ts, health.routes.ts, search.routes.ts
│   │   ├── services/        7 modular service classes
│   │   ├── types/           search.types.ts, debug.types.ts
│   │   ├── middleware/      error-handler.ts
│   │   └── utils/           deduplicate.ts, validation.ts, logger.ts
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      Sidebar, ErrorInput, DebugReport, ProgressPanel
│   │   ├── api/             debugApi.ts (with backend adapter)
│   │   ├── types/           Shared TypeScript interfaces
│   │   └── constants/       Example errors, technology list
│   └── package.json
├── README.md
└── start.bat
```
