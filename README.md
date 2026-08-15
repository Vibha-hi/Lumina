<div align="center">

# 🌟 LUMINA.AI

### Attention Economy Visualizer & Responsible Posting Assistant

_Understand Content Before It Understands You_

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://typescriptlang.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![Express](https://img.shields.io/badge/Express-5-000?logo=express)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?logo=mongodb)](https://mongodb.com)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

</div>

---

## 📖 Overview

LUMINA.AI is a production-quality full-stack web application that helps users understand the psychological impact of online content and predicts the consequences of social media posts **before publishing them**.

The project focuses on:

- 🧠 **Media & Information Literacy**
- 🛡️ **Online Safety & Responsible Communication**
- 💭 **Emotional Awareness**
- ❌ **Misinformation Prevention**
- 🔒 **Privacy Protection**

---

## 🏗️ Architecture

```
mian-safe-_UNESCO_/
├── src/                    # Frontend (React + TanStack Start + Vite)
│   ├── components/         # UI components
│   ├── routes/             # Page routes
│   ├── lib/                # Utilities & server functions
│   └── integrations/       # Supabase integration
├── backend/                # Backend (Express + TypeScript + MongoDB)
│   └── src/
│       ├── config/         # Database, env, passport config
│       ├── controllers/    # Request handlers (11 controllers)
│       ├── middleware/      # Auth, rate-limit, validation, errors
│       ├── models/         # Mongoose models (6 models)
│       ├── routes/         # Express routes (11 route groups)
│       ├── services/       # AI service interfaces (11 services)
│       ├── types/          # Shared TypeScript types
│       ├── utils/          # JWT, password, validators, response
│       ├── app.ts          # Express app setup
│       └── server.ts       # Entry point
├── ai/                     # AI Model Integration Documentation
│   ├── interfaces/         # Service interface specifications
│   └── examples/           # Sample request/response payloads
└── supabase/               # Supabase migrations
```

---

## 🛠️ Tech Stack

### Frontend

| Technology      | Purpose                 |
| --------------- | ----------------------- |
| React 19        | UI Framework            |
| Vite 8          | Build tool              |
| TypeScript      | Type safety             |
| TailwindCSS 4   | Styling                 |
| TanStack Router | Routing                 |
| Framer Motion   | Animations              |
| Recharts        | Charts & visualizations |
| Lucide Icons    | Icon library            |

### Backend

| Technology         | Purpose          |
| ------------------ | ---------------- |
| Node.js            | Runtime          |
| Express 5          | HTTP framework   |
| TypeScript         | Type safety      |
| MongoDB + Mongoose | Database         |
| JWT                | Authentication   |
| Passport.js        | Google OAuth     |
| Zod                | Validation       |
| Helmet             | Security headers |
| bcrypt             | Password hashing |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the repository

```bash
git clone <repository-url>
cd mian-safe-_UNESCO_
```

### 2. Setup the Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev
```

The backend starts at `http://localhost:5000`.

### 3. Setup the Frontend

```bash
# From the project root
npm install
npm run dev
```

The frontend starts at `http://localhost:5173`.

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

| Variable               | Description                       | Default                                          |
| ---------------------- | --------------------------------- | ------------------------------------------------ |
| `PORT`                 | Server port                       | `5000`                                           |
| `NODE_ENV`             | Environment                       | `development`                                    |
| `MONGODB_URI`          | MongoDB connection string         | `mongodb://localhost:27017/lumina-ai`            |
| `JWT_SECRET`           | JWT signing secret (min 16 chars) | —                                                |
| `JWT_EXPIRES_IN`       | Token expiry                      | `7d`                                             |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID            | —                                                |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret               | —                                                |
| `GOOGLE_CALLBACK_URL`  | OAuth callback URL                | `http://localhost:5000/api/auth/google/callback` |
| `CORS_ORIGIN`          | Allowed frontend origin           | `http://localhost:5173`                          |
| `FORMSPREE_ENDPOINT`   | Feedback form endpoint            | —                                                |

### Frontend (`.env`)

| Variable                        | Description              |
| ------------------------------- | ------------------------ |
| `VITE_SUPABASE_URL`             | Supabase project URL     |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key |

---

## 📡 API Documentation

Base URL: `http://localhost:5000/api`

### Authentication

| Method | Endpoint                | Description               | Auth |
| ------ | ----------------------- | ------------------------- | ---- |
| POST   | `/auth/signup`          | Register new user         | No   |
| POST   | `/auth/login`           | Login with email/password | No   |
| GET    | `/auth/google`          | Initiate Google OAuth     | No   |
| GET    | `/auth/google/callback` | Google OAuth callback     | No   |
| POST   | `/auth/forgot-password` | Request password reset    | No   |
| POST   | `/auth/reset-password`  | Reset password with token | No   |
| POST   | `/auth/logout`          | Logout                    | Yes  |

### Analysis

| Method | Endpoint         | Description                  | Auth |
| ------ | ---------------- | ---------------------------- | ---- |
| POST   | `/analyze`       | Full analysis (all services) | Yes  |
| POST   | `/analyze/guest` | Guest analysis (1 free)      | No   |

### Individual Services

| Method | Endpoint    | Description            | Auth |
| ------ | ----------- | ---------------------- | ---- |
| POST   | `/rewrite`  | AI rewrite suggestions | Yes  |
| POST   | `/grammar`  | Grammar & tone check   | Yes  |
| POST   | `/privacy`  | Privacy risk detection | Yes  |
| POST   | `/legal`    | Legal risk analysis    | Yes  |
| POST   | `/emotions` | Emotion detection      | Yes  |

### History & Profile

| Method | Endpoint       | Description               | Auth |
| ------ | -------------- | ------------------------- | ---- |
| GET    | `/history`     | List analyses (paginated) | Yes  |
| GET    | `/history/:id` | Get single analysis       | Yes  |
| DELETE | `/history/:id` | Delete analysis           | Yes  |
| GET    | `/profile`     | Get user profile          | Yes  |
| PUT    | `/profile`     | Update profile            | Yes  |
| DELETE | `/profile`     | Delete account            | Yes  |

### Other

| Method | Endpoint       | Description          | Auth     |
| ------ | -------------- | -------------------- | -------- |
| POST   | `/feedback`    | Submit feedback      | Optional |
| GET    | `/admin/users` | List users           | Yes      |
| GET    | `/admin/stats` | Dashboard statistics | Yes      |
| GET    | `/health`      | Health check         | No       |

---

## 🤖 AI Service Integration

All AI services currently return **mock data**. See the [`ai/`](ai/) directory for:

- Interface specifications for each service
- Expected request/response JSON formats
- Integration guide for connecting real models

### Available Services

1. **EmotionAnalysisService** — 8 emotions (Anger, Fear, Joy, Curiosity, Sadness, Disgust, Trust, Neutral)
2. **GrammarService** — Grammar, spelling, punctuation, tone, professionalism
3. **RewriteService** — Safer, professional, friendly, neutral alternatives
4. **PrivacyService** — PII detection (phone, email, SSN, credit cards, etc.)
5. **LegalService** — Defamation, threats, harassment, hate speech, copyright
6. **ReachPredictionService** — Virality, shareability, audience estimation
7. **TrendAnalysisService** — Trending topic relevance
8. **ClickbaitDetectionService** — Clickbait technique identification
9. **BiasDetectionService** — Cognitive bias detection
10. **SourceCredibilityService** — Source citation and credibility evaluation
11. **ManipulationDetectionService** — Psychological manipulation techniques

---

## 🔒 Security

- **Helmet** — HTTP security headers
- **CORS** — Configurable allowed origins
- **Rate Limiting** — 100 general / 20 auth / 10 analysis per 15 min
- **bcrypt** — Password hashing with 12 salt rounds
- **JWT** — Stateless token authentication
- **Mongo Sanitize** — NoSQL injection prevention
- **Zod Validation** — Input validation on all endpoints
- **Environment Variables** — Validated at startup

---

## 🏗️ Building for Production

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
npm run build
npm run preview
```

---

## 🧪 Testing

```bash
# Backend build verification
cd backend
npm run build

# Health check
curl http://localhost:5000/api/health

# Test signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"test123","confirmPassword":"test123"}'
```

---

## 📄 License

This project is built for UNESCO's Media & Information Literacy initiative.

---

<div align="center">

**Built with ❤️ for a safer internet**

</div>
