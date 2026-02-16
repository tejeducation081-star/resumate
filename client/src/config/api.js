// API Configuration
// Strip any trailing slash from the env value so endpoints don't get a double '//'
const rawBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_BASE_URL = rawBase.replace(/\/+$/g, '');

export const API_ENDPOINTS = {
    // Auth
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,

    // Resumes
    GET_RESUMES: `${API_BASE_URL}/api/resumes`,
    CREATE_RESUME: `${API_BASE_URL}/api/resumes`,
    UPDATE_RESUME: (id) => `${API_BASE_URL}/api/resumes/${id}`,
    DELETE_RESUME: (id) => `${API_BASE_URL}/api/resumes/${id}`,

    // PDF
    GENERATE_PDF: `${API_BASE_URL}/api/pdf/generate`,

    // Upload
    UPLOAD_IMAGE: `${API_BASE_URL}/api/upload`,
};

export default API_BASE_URL;
