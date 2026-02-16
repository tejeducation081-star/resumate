const express = require('express');
const router = express.Router();

// PDF generation is disabled on free tier
// TODO: Integrate with a PDF service like PDFKit or use third-party API
router.post('/generate-pdf', async (req, res) => {
    const { htmlContent, styles } = req.body;
    if (!htmlContent) {
        return res.status(400).json({ error: 'No content provided' });
    }

    try {
        // Return a message indicating PDF generation is not available
        // In production, you can integrate with:
        // - PDFKit (node-only)
        // - Third-party API (html2pdf, DocRaptor, etc.)
        res.json({
            message: 'PDF generation feature is currently under development',
            status: 'pending',
            note: 'Consider using browser-based PDF export or integrating a third-party service'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'PDF generation failed' });
    }
});

module.exports = router;
