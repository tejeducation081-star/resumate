const express = require('express');
const router = express.Router();
const Resume = require('../models/Resume');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const authenticate = require('../middleware/authMiddleware');

router.get('/', authenticate, async (req, res) => {
    try {
        const resumes = await Resume.findAll({ where: { userId: req.userId } });
        // Convert skills array back to string for frontend compatibility
        const formattedResumes = resumes.map(r => {
            const data = r.toJSON();
            if (Array.isArray(data.skills)) {
                data.skills = data.skills.join('. ');
            }
            return data;
        });
        res.json(formattedResumes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const calculateAtsScore = (resume) => {
    let score = 0;
    const { personalDetails, summary, experience, education, skills } = resume;

    // 1. ESSENTIALS (20 Pts)
    if (personalDetails?.fullName) score += 5;
    if (personalDetails?.email) score += 5;
    if (personalDetails?.phone) score += 5;
    if (personalDetails?.location) score += 5;

    // 2. IMPACT & METRICS (30 Pts)
    const metricRegex = /(\d+(\.\d+)?%|\$\d+(k|m|b)?|\d+x|\d+\+? (users|clients|customers|downloads))/gi;
    let metricsFound = 0;
    experience?.forEach(exp => {
        const matches = exp.description?.match(metricRegex);
        if (matches) metricsFound += matches.length;
    });

    if (metricsFound >= 3) score += 30;
    else if (metricsFound > 0) score += 15;

    // 3. WORD CHOICE (25 Pts)
    const actionVerbs = [
        'spearheaded', 'orchestrated', 'led', 'managed', 'directed', 'supervised', 'guided',
        'implemented', 'executed', 'produced', 'built', 'created', 'developed', 'designed', 'architected',
        'improved', 'increased', 'decreased', 'optimized', 'reduced', 'maximized', 'accelerated',
        'analyzed', 'audited', 'investigated', 'researched', 'forecasted',
        'negotiated', 'presented', 'collaborated', 'partnered'
    ];
    let actionVerbCount = 0;
    experience?.forEach(exp => {
        const desc = exp.description?.toLowerCase() || '';
        actionVerbs.forEach(verb => {
            if (desc.includes(verb)) actionVerbCount++;
        });
    });

    if (actionVerbCount >= 4) score += 25;
    else if (actionVerbCount > 0) score += 12;

    // 4. CONTENT DEPTH (25 Pts)
    if (summary && summary.length > 50) score += 5;

    // Skills Analysis (Handle both string and array)
    let skillsList = [];
    if (Array.isArray(skills)) {
        skillsList = skills;
    } else if (typeof skills === 'string') {
        skillsList = skills.split(/[,.]/).filter(s => s.trim().length > 0);
    }

    if (skillsList.length >= 6) score += 10;

    // Experience Structure
    if (experience && experience.length > 0) {
        score += 5;
        const avgLength = experience.reduce((acc, curr) => acc + (curr.description?.length || 0), 0) / experience.length;
        if (avgLength > 80) score += 5;
    }

    // Education
    if (education && education.length > 0) {
        score += 5;
        const hasDegree = education.some(edu => edu.degree && edu.degree.length > 0);
        if (hasDegree) score += 5;
    }

    return Math.min(100, Math.max(0, score));
};

router.post('/', authenticate, async (req, res) => {
    try {
        console.log('--- POST /api/resumes request ---');
        console.log('User ID:', req.userId);

        const resumeData = { ...req.body, userId: req.userId };

        // Convert skills string to array for DB storage
        if (typeof resumeData.skills === 'string') {
            resumeData.skills = resumeData.skills.split(/[,.\n]/).map(s => s.trim()).filter(Boolean);
        }

        resumeData.atsScore = calculateAtsScore(resumeData);
        const resume = await Resume.create(resumeData);

        console.log('Resume Created ID:', resume.id);

        // Convert back to string for response
        const responseData = resume.toJSON();
        if (Array.isArray(responseData.skills)) {
            responseData.skills = responseData.skills.join('. ');
        }
        res.json(responseData);
    } catch (err) {
        console.error('Resume Creation Error:', err);
        res.status(400).json({ error: err.message });
    }
});

router.put('/:id', authenticate, async (req, res) => {
    try {
        const updateData = { ...req.body };

        // Convert skills string to array for DB storage
        if (typeof updateData.skills === 'string') {
            updateData.skills = updateData.skills.split(/[,.\n]/).map(s => s.trim()).filter(Boolean);
        }

        updateData.atsScore = calculateAtsScore(updateData);

        const [updatedRows] = await Resume.update(updateData, {
            where: { id: req.params.id, userId: req.userId }
        });

        if (updatedRows === 0) return res.status(404).json({ error: 'Resume not found' });

        const updatedResume = await Resume.findOne({ where: { id: req.params.id, userId: req.userId } });

        // Convert back to string for response
        const responseData = updatedResume.toJSON();
        if (Array.isArray(responseData.skills)) {
            responseData.skills = responseData.skills.join('. ');
        }

        res.json(responseData);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/:id', authenticate, async (req, res) => {
    try {
        const deleted = await Resume.destroy({ where: { id: req.params.id, userId: req.userId } });
        if (deleted === 0) return res.status(404).json({ error: 'Resume not found' });
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
