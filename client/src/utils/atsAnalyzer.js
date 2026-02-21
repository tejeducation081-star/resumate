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

    // SECTION 1: CONTACT INFO (10 points)
    let contactScore = 0;
    if (personalDetails.fullName?.trim()) contactScore += 3;
    if (personalDetails.email?.trim()) contactScore += 3;
    if (personalDetails.phone?.trim()) contactScore += 2;
    if (personalDetails.location?.trim()) contactScore += 2;

    if (contactScore < 8) {
        feedback.critical.push('MISSING CONTACT DATA: ATS cannot identify who you are or how to reach you.');
        feedback.improvements.push('BETTER SUGGESTION: Ensure Phone, Email, and Location are all present.');
    } else {
        feedback.good.push('GOOD: Contact information is robust and easily detected.');
    }
    totalScore += contactScore;

    // SECTION 2: PROFESSIONAL SUMMARY (15 points)
    let summaryScore = 0;
    if (summary && summary.trim().length > 0) {
        summaryScore += analyzeTextQuality(summary);
        summaryScore += analyzeWritingQuality(summary);

        const summaryKeywords = countKeywordMatches(summary, [...technicalKeywords, ...softSkills]);
        if (summaryKeywords > 0) summaryScore += 10;

        if (summaryScore < 30) {
            feedback.critical.push('WEAK SUMMARY: Your profile summary is too brief for effective keyword matching.');
            feedback.improvements.push('BETTER SUGGESTION: Aim for 3-4 sentences outlining your core value and years of experience.');
        } else {
            feedback.good.push('GOOD: Summary is punchy and contains relevant industry keywords.');
        }
    } else {
        feedback.critical.push('BAD: Missing Professional Summary. This leaves a gap in keyword optimization.');
        feedback.improvements.push('BETTER SUGGESTION: Write a summary that highlights your most impressive achievements.');
        summaryScore = 0;
    }
    totalScore += Math.min(15, summaryScore);

    // SECTION 3: EXPERIENCE (35 points)
    let experienceScore = 0;
    if (experience && experience.length > 0) {
        let totalMetrics = 0;
        let totalActionVerbs = 0;

        experience.forEach(exp => {
            totalMetrics += extractMetrics(exp.description).length;
            totalActionVerbs += actionVerbs.filter(v => exp.description?.toLowerCase().includes(v)).length;
        });

        // Scoring for experience
        if (totalMetrics >= 3) experienceScore += 15;
        if (totalActionVerbs >= 5) experienceScore += 10;
        if (experience.length >= 2) experienceScore += 10;

        if (totalMetrics < 3) {
            feedback.critical.push('BAD: Lack of metrics. Your experience current looks like a list of duties, not achievements.');
            feedback.improvements.push('BETTER SUGGESTION: Instead of "Managed a team", try "Managed a team of 10 to increase output by 25%".');
        } else {
            feedback.good.push(`GOOD: Strong use of data points (${totalMetrics} metrics found).`);
        }

        if (totalActionVerbs < 5) {
            feedback.improvements.push('BETTER SUGGESTION: Use more powerful action verbs (e.g., Spearheaded, Orchestrated, Optimized).');
        } else {
            feedback.good.push('GOOD: Active and engaging language used in work history.');
        }
    } else {
        feedback.critical.push('BAD: No core experience listed. This is a major red flag for ATS.');
    }
    totalScore += Math.min(35, experienceScore);

    // SECTION 4: SKILLS (20 points)
    let skillsScore = 0;
    if (skills && skills.trim().length > 0) {
        const skillsList = skills.split(/[,.\n;]/).map(s => s.trim()).filter(s => s.length > 0);

        if (skillsList.length < 5) {
            feedback.critical.push(`BAD: Low skill count (${skillsList.length}). ATS relies on these to match you to jobs.`);
            feedback.improvements.push('BETTER SUGGESTION: Aim for 10-15 relevant industry skills including both hard and soft skills.');
        } else {
            feedback.good.push(`GOOD: Strong skill diversity (${skillsList.length} skills detected).`);
        }

        // Quantity check for score
        if (skillsList.length > 0) skillsScore += 5;
        if (skillsList.length > 5) skillsScore += 5;
        if (skillsList.length > 10) skillsScore += 5;

        const totalMatches = countKeywordMatches(skills, [...technicalKeywords, ...softSkills]);
        if (totalMatches > 0) skillsScore += 5;
    } else {
        feedback.critical.push('BAD: No skills listed. ATS cannot rank you for specific job requirements.');
        feedback.improvements.push('BETTER SUGGESTION: Research a job description you like and include its top 5 requirements.');
    }
    totalScore += Math.min(20, skillsScore);

    // SECTION 5: EDUCATION (10 points)
    let educationScore = 0;
    if (education && education.length > 0) {
        educationScore += 5;
        feedback.good.push('GOOD: Academic foundation is documented.');
    } else {
        feedback.critical.push('BAD: Missing Education background.');
        feedback.improvements.push('BETTER SUGGESTION: Even if not a degree, list relevant certifications or training.');
    }
    totalScore += Math.min(10, educationScore);

    // SECTION 6: KEYWORDS (10 points)
    let keywordScore = 0;
    const totalKeywordMatches = countKeywordMatches(allText, [...technicalKeywords, ...softSkills, ...actionVerbs]);

    if (totalKeywordMatches < 8) {
        keywordScore = 4;
        feedback.critical.push('BAD: Low keyword density. Your resume might not show up in recruiter searches.');
        feedback.improvements.push('BETTER SUGGESTION: Integrate more industry-specific terminology throughout your bullet points.');
    } else {
        keywordScore = 10;
        feedback.good.push(`GOOD: Excellent industry vocabulary (${totalKeywordMatches} keywords detected).`);
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
