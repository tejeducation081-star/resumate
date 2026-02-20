// Real ATS Content Analyzer - Analyzes actual content, not field count

// Comprehensive keyword databases for analysis
const actionVerbs = [
    'spearheaded', 'orchestrated', 'led', 'managed', 'directed', 'supervised', 'guided', 'mentored', 'trained', 'coached', 'chaired', 'oversaw',
    'implemented', 'executed', 'produced', 'built', 'created', 'developed', 'designed', 'architected', 'engineered', 'launched', 'established',
    'improved', 'increased', 'decreased', 'optimized', 'reduced', 'maximized', 'accelerated', 'boosted', 'enhanced', 'streamlined', 'transformed', 'revolutionized',
    'analyzed', 'audited', 'investigated', 'researched', 'forecasted', 'identified', 'optimised', 'modeled', 'evaluated', 'assessed',
    'negotiated', 'presented', 'collaborated', 'partnered', 'persuaded', 'advocated', 'championed'
];

const technicalKeywords = [
    'python', 'java', 'javascript', 'react', 'nodejs', 'sql', 'aws', 'azure', 'docker', 'kubernetes', 'git', 'ci/cd', 'api', 'rest',
    'html', 'css', 'typescript', 'angular', 'vue', 'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch', 'jenkins', 'terraform',
    'agile', 'scrum', 'jira', 'linux', 'windows', 'devops', 'microservices', 'cloud', 'machine learning', 'data analysis'
];

const softSkills = [
    'communication', 'leadership', 'teamwork', 'collaboration', 'problem-solving', 'critical thinking', 'creativity',
    'time management', 'project management', 'negotiation', 'public speaking', 'stakeholder management', 'adaptability'
];

const weakWords = ['helped', 'assisted', 'responsible for', 'worked on', 'participated', 'involved'];

// Helper: Analyze text quality
const analyzeTextQuality = (text) => {
    if (!text || text.trim().length === 0) return 0;
    
    const length = text.trim().length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.length > 0);
    
    // Scoring based on content depth
    let qualityScore = 0;
    
    // Length matters (min 30 chars is baseline)
    if (length > 30) qualityScore += 15;
    if (length > 80) qualityScore += 10;
    if (length > 150) qualityScore += 10;
    
    // Sentence structure (variety is good)
    if (sentences.length > 1) qualityScore += 10;
    if (sentences.length > 2) qualityScore += 5;
    
    // Word count (showing detail)
    const avgWordsPerSentence = words.length / sentences.length;
    if (avgWordsPerSentence > 10 && avgWordsPerSentence < 25) qualityScore += 15; // Goldilocks zone
    
    return Math.min(50, qualityScore);
};

// Helper: Count keyword matches
const countKeywordMatches = (text, keywords) => {
    if (!text) return 0;
    const lowerText = text.toLowerCase();
    return keywords.filter(kw => lowerText.includes(kw.toLowerCase())).length;
};

// Helper: Detect metrics in text
const extractMetrics = (text) => {
    if (!text) return [];
    const metricRegex = /(\d+(\.\d+)?%|\$\d+[kmb]?|\d+x increase|\d+\+?\s*(users|clients|customers|projects|downloads|revenue|profit))/gi;
    return text.match(metricRegex) || [];
};

// Helper: Check spelling & grammar basics
const analyzeWritingQuality = (text) => {
    if (!text) return 0;
    
    let score = 0;
    const lowerText = text.toLowerCase();
    
    // Check for weak words
    const hasWeakWords = weakWords.some(w => lowerText.includes(w));
    if (!hasWeakWords) score += 20;
    
    // Check for obvious errors (multiple spaces, extra punctuation)
    if (!text.includes('  ')) score += 10; // No double spaces
    if (text.match(/[.!?]{2,}/g) === null) score += 10; // No multiple punctuation
    
    // Check capitalization (first word should be capitalized)
    if (text.charAt(0) === text.charAt(0).toUpperCase()) score += 5;
    
    return score;
};

export const calculateATSScore = (resume) => {
    const { personalDetails = {}, summary = '', experience = [], education = [], skills = '' } = resume || {};
    
    let totalScore = 0;
    const feedback = { critical: [], improvements: [], good: [] };
    const allText = `${personalDetails.fullName} ${personalDetails.email} ${personalDetails.phone} ${summary} ${experience.map(e => `${e.company} ${e.position} ${e.description}`).join(' ')} ${education.map(e => `${e.school} ${e.degree} ${e.field}`).join(' ')} ${skills}`.toLowerCase();
    
    // SECTION 1: CONTACT INFO (10 points) - Non-negotiable
    let contactScore = 0;
    if (personalDetails.fullName?.trim()) contactScore += 3;
    if (personalDetails.email?.trim()) contactScore += 3;
    if (personalDetails.phone?.trim()) contactScore += 2;
    if (personalDetails.location?.trim()) contactScore += 2;
    
    if (contactScore < 8) {
        feedback.critical.push('Missing contact information - These are essential for ATS to identify and reach you.');
    } else {
        feedback.good.push('Contact information is complete and ATS-readable.');
    }
    totalScore += contactScore;
    
    // SECTION 2: PROFESSIONAL SUMMARY ANALYSIS (15 points) - Content quality
    let summaryScore = 0;
    if (summary && summary.trim().length > 0) {
        summaryScore += analyzeTextQuality(summary);
        summaryScore += analyzeWritingQuality(summary);
        
        // Check for keywords
        const summaryKeywords = countKeywordMatches(summary, [...technicalKeywords, ...softSkills]);
        if (summaryKeywords > 0) summaryScore += 10;
        
        if (summaryScore < 30) {
            feedback.improvements.push('Expand your professional summary - Include your expertise, years of experience, and key skills ATS will search for.');
        } else {
            feedback.good.push('Strong professional summary with relevant keywords.');
        }
    } else {
        feedback.improvements.push('Add a professional summary - This is crucial for ATS keyword matching and helps recruiters understand your value.');
        summaryScore = 0;
    }
    totalScore += Math.min(15, summaryScore);
    
    // SECTION 3: EXPERIENCE ANALYSIS (35 points) - Deep content analysis
    let experienceScore = 0;
    if (experience && experience.length > 0) {
        experienceScore += (experience.length > 0 ? 5 : 0);
        
        let totalExpQuality = 0;
        let totalMetrics = 0;
        let totalActionVerbs = 0;
        
        experience.forEach(exp => {
            const expText = `${exp.company} ${exp.position} ${exp.description}`;
            
            // Analyze description depth
            totalExpQuality += analyzeTextQuality(exp.description);
            totalExpQuality += analyzeWritingQuality(exp.description);
            
            // Count metrics (numbers, percentages, etc.)
            const metrics = extractMetrics(exp.description);
            totalMetrics += metrics.length;
            
            // Count action verbs
            const verbs = actionVerbs.filter(v => exp.description?.toLowerCase().includes(v)).length;
            totalActionVerbs += verbs;
            
            // Check for STAR method indicators
            if (exp.description?.toLowerCase().includes('result') || exp.description?.toLowerCase().includes('achieved') || exp.description?.toLowerCase().includes('delivered')) {
                totalExpQuality += 10;
            }
        });
        
        // Calculate average quality
        const avgQuality = Math.round(totalExpQuality / experience.length);
        experienceScore += Math.min(15, avgQuality);
        
        // Metrics bonus (0-8 points)
        if (totalMetrics >= 5) {
            experienceScore += 8;
            feedback.good.push(`Excellent! Found ${totalMetrics} quantifiable metrics showing impact.`);
        } else if (totalMetrics >= 3) {
            experienceScore += 5;
            feedback.improvements.push(`Found ${totalMetrics} metrics. Add more numbers to show impact (e.g., "Increased sales by 30%").`);
        } else {
            feedback.improvements.push('Add quantifiable results to your experience - Numbers prove your impact to ATS systems.');
        }
        
        // Action verbs bonus (0-7 points)
        if (totalActionVerbs >= 6) {
            experienceScore += 7;
            feedback.good.push(`Strong action verbs used (${totalActionVerbs} found). Great for ATS parsing.`);
        } else if (totalActionVerbs > 0) {
            experienceScore += 3;
            feedback.improvements.push(`Use ${totalActionVerbs} strong action verbs found, but aim for 6+. Replace weak words with power verbs.`);
        } else {
            feedback.improvements.push('Start experience bullets with power verbs like "Spearheaded", "Orchestrated", "Transformed".');
        }
    } else {
        feedback.critical.push('No experience listed - This is critical for ATS evaluation. Add at least one position.');
    }
    totalScore += Math.min(35, experienceScore);
    
    // SECTION 4: SKILLS ANALYSIS (20 points) - Keyword density & relevance
    let skillsScore = 0;
    if (skills && skills.trim().length > 0) {
        const skillsList = skills.split(/[,.\n;]/).map(s => s.trim()).filter(s => s.length > 0);
        
        // Quantity check
        if (skillsList.length > 0) skillsScore += 5;
        if (skillsList.length > 5) skillsScore += 5;
        if (skillsList.length > 10) skillsScore += 5;
        
        // Quality check - match against known keywords
        const technicalMatches = skillsList.filter(s => technicalKeywords.some(k => s.toLowerCase().includes(k) || k.includes(s.toLowerCase()))).length;
        const softMatches = skillsList.filter(s => softSkills.some(k => s.toLowerCase().includes(k) || k.includes(s.toLowerCase()))).length;
        
        const totalMatches = technicalMatches + softMatches;
        if (totalMatches > 0) skillsScore += 5;
        
        if (skillsList.length < 5) {
            feedback.improvements.push(`Add more skills (currently ${skillsList.length}). ATS systems search for skill keywords when matching resumes to jobs.`);
        } else {
            feedback.good.push(`Good skill diversity (${skillsList.length} skills). Including both technical and soft skills helps ATS matching.`);
        }
    } else {
        feedback.improvements.push('Add a skills section - ATS systems heavily weight skills when matching resumes to job descriptions.');
        skillsScore = 0;
    }
    totalScore += Math.min(20, skillsScore);
    
    // SECTION 5: EDUCATION ANALYSIS (10 points) - Completeness
    let educationScore = 0;
    if (education && education.length > 0) {
        educationScore += 5;
        
        const avgEducationQuality = education.reduce((acc, edu) => {
            let quality = 0;
            if (edu.school?.trim()) quality += 2;
            if (edu.degree?.trim()) quality += 2;
            if (edu.field?.trim()) quality += 1;
            return acc + quality;
        }, 0) / education.length;
        
        educationScore += Math.min(5, Math.round(avgEducationQuality));
        feedback.good.push('Education section is complete.');
    } else {
        feedback.improvements.push('Add education information - Even if still studying, this helps ATS understand your background.');
    }
    totalScore += Math.min(10, educationScore);
    
    // SECTION 6: OVERALL KEYWORD OPTIMIZATION (10 points)
    let keywordScore = 0;
    const totalKeywordMatches = countKeywordMatches(allText, [...technicalKeywords, ...softSkills, ...actionVerbs]);
    
    if (totalKeywordMatches > 15) {
        keywordScore = 10;
        feedback.good.push(`Excellent keyword optimization (${totalKeywordMatches} industry keywords found). ATS will rank this highly.`);
    } else if (totalKeywordMatches > 8) {
        keywordScore = 7;
        feedback.improvements.push(`Good keyword density (${totalKeywordMatches} keywords), but could add more industry-specific terms.`);
    } else if (totalKeywordMatches > 0) {
        keywordScore = 4;
        feedback.improvements.push(`Limited keyword optimization (${totalKeywordMatches} keywords). Research job descriptions and include relevant industry terms.`);
    } else {
        feedback.improvements.push('Add industry-specific keywords to your resume - Match skills from the job description you\'re applying to.');
    }
    totalScore += keywordScore;
    
    // Final score calculation
    const finalScore = Math.min(100, Math.max(0, totalScore));
    
    return {
        score: Math.round(finalScore),
        feedback,
        details: {
            overall: `Your resume scores ${Math.round(finalScore)}/100 on ATS optimization.`,
            analysis: {
                contentQuality: 'Real content analysis based on depth, structure, and writing quality.',
                keywordMatching: `${totalKeywordMatches} industry keywords detected across your resume.`,
                metricsFound: experience.reduce((sum, exp) => sum + extractMetrics(exp.description).length, 0),
                actionVerbsFound: experience.reduce((sum, exp) => sum + actionVerbs.filter(v => exp.description?.toLowerCase().includes(v)).length, 0)
            }
        }
    };
};
