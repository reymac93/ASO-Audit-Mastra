# 🚀 ASO Skills Agent (Mastra + React)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Node](https://img.shields.io/badge/Node.js-18%2B-green)
![Mastra](https://img.shields.io/badge/Powered%20by-Mastra-blue)
![React](https://img.shields.io/badge/Frontend-React-61DAFB)

A production-ready App Store Optimization (ASO) audit engine that analyzes mobile apps and generates structured, data-driven optimization reports.

---

# 📦 Project Overview

This project includes:

- Mastra backend (AI agent system)
- React frontend (chat UI)
- ASO scoring engine (0–100)

It produces SensorTower-style ASO audit reports.

---

# 🏗️ Architecture

User (React UI)
        ↓
Chat API (/chat/:agentId)
        ↓
Mastra Agent (ASO Skills Agent)
        ↓
ASO Audit Engine (Scoring + Logic)
        ↓
Structured Output (Score + Recommendations)

---


# ⚙️ Installation

## Clone the repository

git clone <your-repo-url>
cd <your-project>

## Install dependencies


---

# ▶️ Running the Project

## Start Mastra Server

npx mastra dev

- Runs on: http://localhost:4111

---

## Start React Frontend

npm run dev

- Runs on: http://localhost:5173

---

# 📡 API

### Endpoint

POST /chat/:agentId

### Example

http://localhost:4111/chat/aso-skills-agent

---

# 🤖 ASO Skills Agent

The agent performs:

- ASO Score calculation (0–100)
- App listing analysis
- Ranking optimization insights
- Conversion improvements

---

# 📊 ASO Audit Framework

| Dimension | Weight |
|----------|--------|
| Title | 20% |
| Subtitle | 15% |
| Keyword Field | 15% |
| Description | 10% |
| Screenshots | 15% |
| App Preview Video | 5% |
| Ratings & Reviews | 15% |
| Icon | 5% |
| Conversion Signals | 5% |
| Competitive Position | 5% |

Total = 100%  
Deterministic scoring  
No incorrect totals  

---

# 📱 Example Input

https://apps.apple.com/us/app/spotify-music-and-podcasts/id324684580

---

# 📈 Output Includes

- ASO Score (0–100)
- Dimension breakdown
- Key issues
- Quick wins
- Strategic improvements
- Competitor comparison

---

# 🧠 Key Features

- Always returns full audit (no blocking)
- Mobile-friendly output
- Strict scoring logic
- Production-grade reports
- Works with minimal input

---

# 🛠️ Tech Stack

- Mastra AI SDK
- React
- TypeScript
- Zod
- Tailwind CSS

---

# 🚀 Roadmap

- [ ] ASO dashboard (charts)
- [ ] Keyword gap analysis
- [ ] Competitor intelligence
- [ ] Historical tracking
- [ ] JSON API output

---

# 📄 License

MIT