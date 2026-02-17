const express = require('express');
const path = require('path');

const multer = require('multer');
require('dotenv').config();

const app = express();

// Configuration
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://resumate-create.vercel.app',
    'https://resumate-create-git-main-tejeducation081-stars-projects.vercel.app'
];

// Super-Robust CORS & Preflight Implementation
app.use((req, res, next) => {
    const origin = req.headers.origin;

    // Log for debugging in production logs
    if (origin) console.log(`[CORS Request] Method: ${req.method}, Origin: ${origin}`);

    const isAllowed = !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1');

    if (isAllowed && origin) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, cache-control');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Max-Age', '86400');
    }

    // Immediate response for Preflight OPTIONS
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});





app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Global Rate Limiting
const limiter = require('./middleware/rateLimitMiddleware');
app.use(limiter);

// Database Connection
const { connectDB } = require('./config/db');
const { seedAdminUser } = require('./config/seedAdmin');

// Connect to database and seed admin user
connectDB().then(() => {
    seedAdminUser();
});

// Block API routes if DB is not connected (returns 503)
const dbCheck = require('./middleware/dbCheck');
app.use('/api', dbCheck);

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Resume Builder API v1.0', status: 'running' });
});

// Multer Storage Configuration (In-Memory for Supabase Upload)
const storage = multer.memoryStorage();


const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only image files (JPEG, PNG, WebP) are allowed'));
        }
    }
});

const supabase = require('./config/supabase');
// Removed local static file serving for uploads as we migrate to Supabase Storage


// Upload Endpoint (Supabase Storage)
app.post('/api/upload', upload.single('image'), async (req, res) => {
    try {
        if (!supabase) {
            return res.status(503).json({
                error: 'Upload feature is currently disabled.',
                detail: 'SUPABASE_URL and SUPABASE_KEY are missing in server environment variables.'
            });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }


        const fileName = `${Date.now()}-${req.file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`;

        // Upload to Supabase Storage
        console.log(`Starting upload for file: ${fileName}, size: ${req.file.size} bytes`);
        const { data, error } = await supabase.storage
            .from('resumes')
            .upload(fileName, req.file.buffer, {
                contentType: req.file.mimetype,
                cacheControl: '3600',
                upsert: false
            });


        if (error) {
            console.error('Supabase Storage Error:', error);
            return res.status(500).json({ error: `Storage upload failed: ${error.message}` });
        }

        // Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('resumes')
            .getPublicUrl(fileName);

        res.json({ imageUrl: publicUrl });
    } catch (err) {
        console.error('Upload catch error:', err);
        res.status(500).json({
            error: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }

});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/resumes', require('./routes/resumes'));
app.use('/api/pdf', require('./routes/pdf'));
app.use('/api/admin', require('./routes/admin'));

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
    });
});

// Server Start
app.listen(PORT, () => {
    console.log(`\n🚀 Resume Builder API running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 CORS Origins: ${allowedOrigins.join(', ')}\n`);
});
