# ⚡ EVlytics – AI Powered EV Intelligence Platform

A modern frontend web application for electric vehicle analytics and AI-assisted guidance. Built with Next.js 14, TypeScript, Tailwind CSS, and Recharts.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🚀 Features

### App dashboard (`/dashboard`)

All dashboard routes share a sidebar layout and use **client-side persistence** (localStorage) for profile, last range prediction, last CO₂ savings run, and chat history where applicable.

| Area | Route | What it does |
|------|--------|----------------|
| **Overview** | `/dashboard` | Metric cards driven by **your data**: last predicted range, estimated battery health (profile + saved prediction), **CO₂ saved this year** (after you run the Savings calculator), and **monthly EV vs petrol** estimate from profile. Includes demo charts (battery health trend, ICE vs EV emissions). |
| **Profile** | `/dashboard/profile` | Edit user details and **vehicle**: quick presets (e.g. Tiago EV LR, Tigor EV, Citroën ë-C3) that auto-fill battery and range (still editable), charging type, **₹/kWh**, **average monthly km**, and auto efficiency. Saved to localStorage. |
| **Range prediction** | `/dashboard/range` | Form for SOC, temperature, speed, and AC usage; calls the **range prediction API** (see env vars below). Last result is **stored** and feeds the overview and EV Assistant context. Includes range tips and a range-vs-speed chart (illustrative). |
| **Battery** | `/dashboard/battery` | Battery-focused UI with health-style metrics and charts, including an illustrative degradation projection. |
| **CO₂ savings** | `/dashboard/savings` | Calculator vs petrol/diesel ICE factors; **saves your last run** (yearly tons, trees, inputs) for the overview card and assistant context. Monthly emissions comparison chart. |
| **EV Assistant** | `/dashboard/assistant` | Chat UI backed by **`/api/assistant`** (OpenAI on the server). Context is **live**: profile, last range prediction, derived battery health when possible, monthly fuel comparison, CO₂ savings — not static demo trend series. |

### Elsewhere

- **Landing** (`/`) – Marketing hero and CTAs into the app.

## 🎨 Design

- Dark mode with green accent theme
- Glassmorphism navigation and sidebar
- Smooth hover effects and micro-animations
- Fully responsive (mobile + desktop)
- Clean SaaS dashboard aesthetic

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 14** | App Router, SSR framework |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Utility-first styling |
| **Shadcn UI** | Accessible component primitives |
| **Recharts** | Data visualization |
| **Zustand** | Client stores + localStorage hydration |
| **Lucide React** | Icons |

## 📁 Project Structure (high level)

```
evlytics/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx                 # Landing
│   ├── api/assistant/route.ts   # Server chat (OpenAI)
│   └── dashboard/
│       ├── layout.tsx           # Sidebar shell
│       ├── page.tsx             # Overview
│       ├── profile/page.tsx     # User & vehicle profile
│       ├── range/page.tsx       # Range prediction
│       ├── battery/page.tsx     # Battery insights
│       ├── savings/page.tsx     # CO₂ savings
│       └── assistant/page.tsx   # EV Assistant chat
├── components/
│   ├── providers/               # e.g. profile + store hydration
│   └── ui/
├── hooks/                       # useProfile, etc.
├── stores/                      # profile, range prediction, CO₂ savings, LLM snapshot
├── lib/                         # mock-data, evlytics-profile, fuel & CO₂ helpers, presets
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 🏁 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/barnawalraj001/evlytics.git
cd evlytics

# Install dependencies
npm install

# Optional: copy env template (see Environment below)
# cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📄 Routes

| Route | Description |
|---|---|
| `/` | Landing page |
| `/dashboard` | Overview metrics and charts |
| `/dashboard/profile` | Profile and vehicle settings (presets, costs, monthly km) |
| `/dashboard/range` | Range prediction form and results |
| `/dashboard/battery` | Battery health views and charts |
| `/dashboard/savings` | CO₂ savings calculator (persisted summary) |
| `/dashboard/assistant` | AI assistant (server-side OpenAI when configured) |

## 🔐 Environment

Copy `.env.example` to `.env.local` (or use `.env`) and restart the dev server after changes.

| Variable | Purpose |
|---|---|
| `OPENAI_API_KEY` | Required for **EV Assistant** (`/api/assistant`). Without it, the API returns an error the UI surfaces. |
| `NEXT_PUBLIC_RANGE_PREDICTION_API_URL` | Optional base URL for the **range prediction** `/predict` API. If unset, the app uses the default host configured in `app/dashboard/range/page.tsx`. |

## ⚠️ Note

This repo is a **frontend-first** product demo: many **charts still use illustrative mock series**, while **profile, last predictions, CO₂ calculator output, and assistant context** use **real inputs** from the browser. There is **no built-in auth**; data stays on the device via localStorage until you wire a backend.

## 📝 License

MIT License © 2026 EVlytics
