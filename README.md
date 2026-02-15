# ⚡ EVlytics – AI Powered EV Intelligence Platform

A modern, production-ready frontend web application for AI-powered electric vehicle analytics. Built with Next.js 14, TypeScript, Tailwind CSS, and Recharts.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🚀 Features

- **Range Prediction** – AI-powered range estimation based on driving conditions, temperature, speed, and AC usage
- **Battery Health Monitoring** – Track degradation trends with an 8-year projection and circular progress indicator
- **CO₂ Savings Calculator** – Compare your emissions against ICE vehicles and see equivalent trees planted
- **EV Assistant** – ChatGPT-style AI assistant for EV tips and optimization advice
- **Dashboard Overview** – Real-time metrics cards, charging stats, and interactive charts

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
| **Lucide React** | Icons |

## 📁 Project Structure

```
evlytics/
├── app/
│   ├── globals.css              # Theme & global styles
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   └── dashboard/
│       ├── layout.tsx           # Sidebar + navbar
│       ├── page.tsx             # Overview
│       ├── range/page.tsx       # Range Prediction
│       ├── battery/page.tsx     # Battery Health
│       ├── savings/page.tsx     # CO₂ Savings
│       └── assistant/page.tsx   # EV Assistant Chat
├── components/
│   └── ui/                      # Reusable UI components
├── lib/
│   ├── utils.ts                 # Utility functions
│   └── mock-data.ts             # Centralized mock data
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

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📄 Pages

| Route | Description |
|---|---|
| `/` | Landing page with hero, features, and CTA |
| `/dashboard` | Overview with metrics and charts |
| `/dashboard/range` | Range prediction form and visualization |
| `/dashboard/battery` | Battery health monitoring |
| `/dashboard/savings` | CO₂ savings calculator |
| `/dashboard/assistant` | AI chat assistant interface |

## ⚠️ Note

This is a **frontend-only** application. All data is static mock data — no backend, API calls, or authentication logic is included. This is designed as a realistic UI/UX showcase.

## 📝 License

MIT License © 2026 EVlytics
