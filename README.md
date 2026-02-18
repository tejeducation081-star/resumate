# 📄 Resumate - AI-Powered Resume Builder & Job Suite

[![Status](https://img.shields.io/badge/Status-Complete-brightgreen)](.)
[![Tech](https://img.shields.io/badge/Stack-Fullstack-blue)](.)

Resumate is a premium, all-in-one career infrastructure platform. It doesn't just build resumes; it helps you dominate the hiring algorithm with integrated ATS scoring, professional templates, and a direct job search engine.

---

## ✨ Core Features

### 🎨 Architectural Resume Builder
- **25+ Premium Templates**: Select from neural-optimized structures designed for high-end readability.
- **Real-time ATS Scoring**: Instant feedback on ATS compatibility with surgical improvement suggestions.
- **Pixel-Perfect PDF Export**: Download high-quality, professional resumes instantly.
- **Smart Customization**: Complete control over typography, colors, and layout.

### 💼 Integrated Job Suite
- **Global Job Board**: Direct search integration with **Naukri**, **Indeed**, and more.
- **Smart Matching**: Automatically finds jobs matching your resume's job title and skills.
- **Detailed Insights**: View full descriptions, required skills, and salary data directly in the app.
- **Direct Apply**: One-click application redirection to major job platforms.

### 🚀 Performance & UI
- **Buttery Smooth UX**: High-performance animations optimized with GPU acceleration.
- **Modern Aesthetic**: Sleek, glassmorphic design system using the **Outfit** and **Space Grotesk** fonts.
- **Responsive Design**: Flawless experience across desktop, tablet, and mobile.

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **Vite** (Build Tool)
- **Framer Motion** (Fluid Animations)
- **Zustand** (State Management)
- **Lucide React** (Iconography)
- **Vanilla CSS** (Custom Styling)

### Backend
- **Node.js** + **Express.js**
- **Sequelize ORM** + **PostgreSQL**
- **JWT** (Secure Authentication)
- **Supabase** (Database & Auth Hosting)
- **Puppeteer** (PDF Generation)

---

## 🚀 Quick Start

### 1. Installation
Clone the repository and install dependencies in both folders:

```bash
# Install root dependencies
npm install

# Install client & server dependencies
npm run install-all
```

### 2. Configuration
Create appropriate `.env` files in `client/` and `server/` using the provided samples.

**Environment Variable Requirements:**
- `SUPABASE_URL` & `SUPABASE_KEY`
- `JWT_SECRET`
- `RAPID_API_KEY` (Optional, for live job search data via JSearch)

### 3. Run Development Servers
Start both the frontend and backend simultaneously:

```bash
npm run dev
```

- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:5000`

---

## 📂 Project Structure

```
resumate/
├── client/              # React Frontend (Vite)
│   ├── src/
│   │   ├── components/ # UI Components
│   │   ├── store/      # Zustand State
│   │   ├── templates/  # Resume Layouts
│   │   └── utils/      # ATS Analyzer & Shared Logic
├── server/              # Node.js Backend (Express)
│   ├── src/
│   │   ├── routes/     # API Endpoints (Auth, Resumes, Jobs)
│   │   ├── models/     # Database Schemas
│   │   └── config/     # Database & Services Config
└── scripts/             # Maintenance & Database Utilities
```

---

## 🤝 Support & Maintenance

This project is built with professional standards in mind. For maintenance:
1. Ensure **Supabase RLS** policies are active.
2. Monitor **RapidAPI** usage for job search functionality.
3. Keep **Puppeteer** dependencies updated for PDF stability.

**Built with ❤️ by the Resumate Team.**
