# 📄 Resumate - AI-Powered Resume Builder

[![Node.js](https://img.shields.io/badge/Node.js-v16+-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.2-blue)](https://react.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-brightgreen)](.)

A modern, full-stack resume builder application with ATS (Applicant Tracking System) scoring, multiple templates, PDF generation, and professional resume management.

## ✨ Key Features

- 🎨 **Multiple Professional Templates** - Choose from beautifully designed resume templates
- 📊 **Real-time ATS Score Analysis** - Get instant feedback on ATS compatibility
- 📥 **PDF Export** - Download resumes as high-quality PDFs
- 🎯 **Smart Customization** - Customize fonts, colors, and layout
- ✏️ **Real-time Editing** - Instant preview while editing
- 🔐 **Secure Authentication** - User authentication with JWT & PostgreSQL
- 💾 **Resume Management** - Save, update, delete multiple resumes
- 🖼️ **Profile Photo Upload** - Add professional photos to resumes
- 📱 **Fully Responsive** - Works perfectly on desktop, tablet, and mobile

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18** | UI Library |
| **Vite** | Fast build tool & dev server |
| **Zustand** | Lightweight state management |
| **React Hook Form** | Form handling & validation |
| **Framer Motion** | Smooth animations |
| **Lucide React** | Beautiful icons |
| **Chart.js** | Data visualization |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js** | JavaScript runtime |
| **Express.js** | Web framework |
| **Sequelize** | SQL ORM |
| **PostgreSQL** | Relational database |
| **JWT** | Token authentication |
| **Multer** | File uploads |
| **bcryptjs** | Password hashing |
| **express-rate-limit** | API rate limiting |

### Services
- **Supabase** - PostgreSQL hosting & real-time features
- **CORS** - Cross-origin resource handling

## 📋 Prerequisites

- **Node.js** v16+ ([Download](https://nodejs.org/))
- **npm** v7+ (comes with Node.js)
- **Supabase Account** (Free tier available at [supabase.com](https://supabase.com))
- **Git** for version control

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone <repository-url>
cd Resumate
```

### 2. Install All Dependencies
```bash
npm install-all
```

### 3. Configure Environment Variables

Copy environment templates:
```bash
cp .env.example .env
cp client/.env.example client/.env
cp server/.env.example server/.env
```

Edit each `.env` file with your configuration:

**`/.env`** (Root):
```env
NODE_ENV=development
PORT=5000
SERVER_URL=http://localhost:5000
CLIENT_URL=http://localhost:5173
SUPABASE_CONNECTION_STRING=postgresql://...
JWT_SECRET=your_secret_key_here_change_in_production
```

**`/client/.env`**:
```env
VITE_API_URL=http://localhost:5000
VITE_SERVER_URL=http://localhost:5000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_APP_NAME=Resumate
```

**`/server/.env`**: (Same as root)

### 4. Set Up Database
1. Create Supabase project: [app.supabase.com](https://app.supabase.com)
2. Get PostgreSQL connection string from Supabase Dashboard
3. Add to `.env` as `SUPABASE_CONNECTION_STRING`

### 5. Start Development
```bash
npm run dev
```

Open in browser:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

## 📂 Project Structure

```
Resumate/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── config/           # API configuration
│   │   ├── constants/        # App constants
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API services
│   │   ├── store/            # Zustand stores
│   │   ├── utils/            # Utility functions
│   │   └── templates/        # Resume templates
│   ├── .env.example
│   └── package.json
│
├── server/                    # Express backend
│   ├── src/
│   │   ├── app.js            # Express app
│   │   ├── routes/           # API routes
│   │   ├── models/           # Database models
│   │   ├── middleware/       # Custom middleware
│   │   └── config/           # Database config
│   ├── .env.example
│   └── package.json
│
├── .env.example              # Root env template
├── SETUP_GUIDE.md            # Detailed setup
├── PROJECT_STRUCTURE.md      # Full structure docs
└── README.md                 # This file
```

See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for detailed organization.

## 📚 API Documentation

### Authentication
```
POST   /api/auth/register      Register new user
POST   /api/auth/login         Login user
POST   /api/auth/logout        Logout user
```

### Resumes
```
GET    /api/resumes            Fetch user resumes
POST   /api/resumes            Create new resume
PUT    /api/resumes/:id        Update resume
DELETE /api/resumes/:id        Delete resume
```

### Utilities
```
POST   /api/upload             Upload image
POST   /api/pdf/generate       Generate PDF
GET    /health                 Health check
```

## 🎯 Available Scripts

### All Commands
```bash
npm run dev              # Start frontend + backend in dev mode
npm run start            # Run production mode
npm run build            # Build both applications
npm run install-all      # Install all dependencies
npm run lint             # Lint all code
npm run test             # Run all tests
```

### Frontend Only
```bash
cd client
npm run start            # Dev server (port 5173)
npm run build            # Production build
npm run preview          # Preview build
npm run lint             # Lint React
```

### Backend Only
```bash
cd server
npm run start            # Production mode
npm run dev              # Dev mode with auto-reload
npm run lint             # Lint Node.js
npm run test             # Run tests
```

## 🔑 Environment Variables

All environment variables are documented in `.env.example` files:
- **Root**: `/.env.example`
- **Client**: `/client/.env.example`
- **Server**: `/server/.env.example`

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Linux/Mac - Kill process on port
lsof -ti:5000 | xargs kill -9    # Server
lsof -ti:5173 | xargs kill -9    # Client

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### CORS Errors
- Verify `VITE_API_URL` matches server URL
- Check `.env` files are correct
- Ensure `CLIENT_URL` in server matches frontend

### Database Connection Issues
- Test connection string in Supabase
- Verify firewall allows PostgreSQL
- Check database is running

### Module Not Found
```bash
rm -rf node_modules client/node_modules server/node_modules
npm install-all
```

## 📚 Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed setup instructions
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Complete folder structure

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and test
3. Commit: `git commit -m "feat: Add feature"`
4. Push: `git push origin feature/your-feature`
5. Create Pull Request

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Development Team**

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) - Database & Auth
- [React](https://react.dev) - UI Framework
- [Vite](https://vitejs.dev) - Build Tool
- [Zustand](https://github.com/pmndrs/zustand) - State Management

## 📞 Support

For issues or questions:
1. Check [SETUP_GUIDE.md](./SETUP_GUIDE.md)
2. Review [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
3. Check environment configuration
4. Review server logs

---

<div align="center">
  Made with ❤️ | Resumate v1.0.0
</div>
2. Go to **Settings** → **Database** to get your connection string
3. Copy your anon key and service role key from **Settings** → **API**
4. Add them to your `.env` files

## 🏃 Running Locally

### Terminal 1 - Backend Server

```bash
cd server
npm run dev
```

Server will run on `http://localhost:5000`

### Terminal 2 - Frontend Development

```bash
cd client
npm start
```

Frontend will run on `http://localhost:5173`

## 🏗️ Project Structure

```
resumate/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── store/            # Zustand state management
│   │   ├── utils/            # Utility functions (ATS analyzer)
│   │   ├── data/             # Sample data, fonts
│   │   ├── templates/        # Resume templates
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── supabase.js       # Supabase client config
│   │   └── firebase.js       # Firebase config (deprecated)
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                    # Node.js backend
│   ├── routes/               # API endpoints
│   │   ├── auth.js          # Authentication routes
│   │   ├── resumes.js       # Resume CRUD operations
│   │   └── pdf.js           # PDF generation
│   ├── models/              # Sequelize models
│   │   ├── User.js
│   │   └── Resume.js
│   ├── middleware/          # Express middleware
│   │   ├── authMiddleware.js
│   │   └── rateLimitMiddleware.js
│   ├── config/              # Configuration
│   │   └── db.js           # Database connection
│   ├── public/uploads/      # File upload storage
│   ├── index.js            # Express server entry point
│   └── package.json
│
├── .gitignore
├── package.json             # Root dependencies
└── README.md
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Login user

**Request body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "username": "username"
}
```

### Resumes

- `GET /api/resumes` - Get all user resumes
- `POST /api/resumes` - Create new resume
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume

**Resume fields:**
```json
{
  "personalDetails": { "fullName": "", "email": "", "phone": "", "location": "" },
  "summary": "Professional summary",
  "experience": [],
  "education": [],
  "skills": [],
  "projects": [],
  "certifications": [],
  "languages": [],
  "templateId": "template-1",
  "customColor": "#000000",
  "customBgColor": "#ffffff"
}
```

### PDF Generation

- `POST /api/pdf/generate` - Generate PDF from resume

### File Upload

- `POST /api/upload` - Upload image file

## 🌐 Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Connect repository to [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy automatically on every push

### Backend (Railway/Render)

1. Connect GitHub repository to [Railway](https://railway.app) or [Render](https://render.com)
2. Add environment variables
3. Set start command: `npm start`
4. Deploy

### Database (Supabase)

Already hosted on Supabase - no additional setup needed!

## 📦 Environment Variables Reference

### `.env.example` - Frontend

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# API Configuration
VITE_API_URL=http://localhost:5000
```

### `.env.example` - Backend

```env
# Server Configuration
PORT=5000
CLIENT_URL=http://localhost:5173

# JWT Configuration
JWT_SECRET=your_secure_jwt_secret_key_here

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_service_role_key_here
SUPABASE_CONNECTION_STRING=postgresql://user:password@db.supabase.co:5432/postgres
```

## 🔒 Security Notes

⚠️ **Important:**
- Never commit `.env` files to Git
- Always use `.env.example` as reference for required variables
- Use strong JWT secrets in production
- Regenerate Supabase keys regularly
- Enable Row Level Security (RLS) in Supabase

## 🐛 Troubleshooting

### Database Connection Error

```
❌ CRITICAL ERROR: SUPABASE_CONNECTION_STRING is missing in .env
```

**Solution:** Add `SUPABASE_CONNECTION_STRING` to your `.env` file

### CORS Error

```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:** Update `CLIENT_URL` in backend `.env` and restart server

### File Upload Issues

Ensure `public/uploads/` directory exists and has write permissions:

```bash
mkdir -p server/public/uploads
chmod 755 server/public/uploads
```

## 📈 Performance & Optimization

- **Frontend:** Vite for fast HMR and optimized builds
- **Backend:** Rate limiting implemented to prevent abuse
- **Database:** Sequelize ORM with connection pooling
- **PDF Generation:** Server-side rendering with Puppeteer

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 📞 Support

For issues and questions:
- Create an issue on [GitHub Issues](https://github.com/yourusername/resumate/issues)
- Check existing documentation and FAQ

## 🚀 Roadmap

- [ ] Collaborative resume editing
- [ ] Export to multiple formats (Word, Google Docs)
- [ ] LinkedIn profile import
- [ ] Resume version history
- [ ] AI-powered suggestions
- [ ] Advanced analytics

---

**Built with ❤️ using React, Node.js, and Supabase**
