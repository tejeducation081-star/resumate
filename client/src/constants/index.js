// Application Constants

export const APP_NAME = 'Resumate';
export const APP_VERSION = '1.0.0';

// View Names
export const VIEWS = {
    LANDING: 'landing',
    AUTH: 'auth',
    DASHBOARD: 'dashboard',
    EDITOR: 'editor',
    TEMPLATES: 'templates'
};

// Resume Fields
export const RESUME_FIELDS = {
    PERSONAL_DETAILS: 'personalDetails',
    SUMMARY: 'summary',
    EXPERIENCE: 'experience',
    EDUCATION: 'education',
    SKILLS: 'skills'
};

// Local Storage Keys
export const STORAGE_KEYS = {
    USER: 'user',
    TOKEN: 'token',
    RESUMES: 'local_resumes',
    THEME: 'theme'
};

// API Request Timeouts
export const API_TIMEOUT = 30000; // 30 seconds

// File Upload Constants
export const UPLOAD = {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp']
};

// ATS Score Thresholds
export const ATS_THRESHOLDS = {
    EXCELLENT: 80,
    GOOD: 60,
    FAIR: 40,
    POOR: 20
};

// Pagination
export const PAGINATION = {
    PER_PAGE: 10,
    MAX_PER_PAGE: 100
};

export default {
    APP_NAME,
    APP_VERSION,
    VIEWS,
    RESUME_FIELDS,
    STORAGE_KEYS,
    API_TIMEOUT,
    UPLOAD,
    ATS_THRESHOLDS,
    PAGINATION
};
