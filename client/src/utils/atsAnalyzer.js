// Advanced ATS Analyzer with Heuristics

// Dictionary of Power Words & Action Verbs
const actionVerbs = [
    // Leadership
    'spearheaded', 'orchestrated', 'led', 'managed', 'directed', 'supervised', 'guided', 'mentored', 'trained', 'coached', 'chaired', 'oversaw',
    // Execution
    'implemented', 'executed', 'produced', 'built', 'created', 'developed', 'designed', 'architected', 'engineered', 'launched',
    // Impact/Improvement
    'improved', 'increased', 'decreased', 'optimized', 'reduced', 'maximized', 'accelerated', 'boosted', 'enhanced', 'streamlined', 'transformed',
    // Analysis
    'analyzed', 'audited', 'investigated', 'researched', 'forecasted', 'identified', 'modeled',
    // Communication
    'negotiated', 'presented', 'collaborated', 'partnered', 'persuaded', 'authorized', 'advocated'
];

const weakWords = ['helped', 'assisted', 'responsible for', 'worked on', 'participated in', 'various'];

export const calculateATSScore = (resume) => {
    let score = 0;
    const feedback = {
        critical: [], // Blocking issues (missing contact info)
        improvements: [], // Things that boost score (metrics, keywords)
        good: [] // Things done well
    };

    const { personalDetails = {}, summary = '', experience = [], education = [], skills = '' } = resume || {};

    // --- 1. ESSENTIALS (20 Points) ---
    // These are non-negotiable for ANY resume
    let essentialsScore = 0;
    if (personalDetails.fullName) essentialsScore += 5;

    if (personalDetails.email) {
        essentialsScore += 5;
    } else {
        feedback.critical.push("Missing Email Address: Recruiters cannot contact you.");
    }

    if (personalDetails.phone) {
        essentialsScore += 5;
    } else {
        feedback.critical.push("Missing Phone Number: Essential for quick screening calls.");
    }

    if (personalDetails.location) {
        essentialsScore += 5;
    } else {
        feedback.improvements.push("Add Location (City, State): Helps with local searches.");
    }

    // Cap essentials at 20
    score += essentialsScore;
    if (essentialsScore === 20) feedback.good.push("Contact Information is complete.");


    // --- 2. IMPACT & METRICS (30 Points) ---
    // ATS loves numbers. "Increased revenue by 20%" >> "Increased revenue"
    let impactScore = 0;

    // Regex to find metrics: 20%, $50k, 10M, 5x, etc.
    const metricRegex = /(\d+(\.\d+)?%|\$\d+(k|m|b)?|\d+x|\d+\+? (users|clients|customers|downloads))/gi;
    let metricsFound = 0;

    experience?.forEach(exp => {
        const matches = exp.description?.match(metricRegex);
        if (matches) metricsFound += matches.length;
    });

    if (metricsFound >= 3) {
        impactScore += 30;
        feedback.good.push(`Great job! Found ${metricsFound} quantifiable metrics.`);
    } else if (metricsFound > 0) {
        impactScore += 15;
        feedback.improvements.push(`You have ${metricsFound} metrics, but aim for at least 3-4 to prove impact.`);
    } else {
        feedback.improvements.push("Missing Metrics: Use numbers (%, $, x) to prove your impact (e.g., 'Reduced cost by 20%').");
    }
    score += impactScore;


    // --- 3. WORD CHOICE & TONE (25 Points) ---
    let wordScore = 0;
    let actionVerbCount = 0;

    experience?.forEach(exp => {
        const desc = exp.description?.toLowerCase() || '';
        actionVerbs.forEach(verb => {
            if (desc.includes(verb)) actionVerbCount++;
        });
    });

    // Check for weak words
    let weakWordFound = false;
    experience?.forEach(exp => {
        const desc = exp.description?.toLowerCase() || '';
        weakWords.forEach(weak => {
            if (desc.includes(weak)) weakWordFound = true;
        });
    });

    if (weakWordFound) {
        feedback.improvements.push(`Avoid weak phrases like 'Responsible for' or 'Helped'. Use strong action verbs instead.`);
    }

    if (actionVerbCount >= 4) {
        wordScore += 25;
        feedback.good.push("Strong use of action verbs.");
    } else if (actionVerbCount > 0) {
        wordScore += 12;
        feedback.improvements.push("Use more Power Verbs (e.g., Spearheaded, Orchestrated) instead of passive language.");
    } else {
        feedback.improvements.push("No Power Verbs found. Start bullet points with strong verbs.");
    }
    score += wordScore;


    // --- 4. CONTENT DEPTH & STRUCTURE (25 Points) ---
    let structureScore = 0;

    // Summary Check
    if (summary && summary.length > 50) {
        structureScore += 5;
    } else {
        feedback.improvements.push("Summary is too short. Add 2-3 sentences about your expertise and goals.");
    }

    // Skills Check
    const skillsList = skills?.split(/[,.]/).filter(s => s.trim().length > 0) || [];
    if (skillsList.length >= 6) {
        structureScore += 10;
        feedback.good.push("Good skills section.");
    } else {
        feedback.improvements.push("Add more skills. ATS parses these keywords to match job descriptions.");
    }

    // Experience Check
    if (experience && experience.length > 0) {
        structureScore += 5;

        // Bullet point heuristic (looking for newlines or periods as proxy for structure)
        const avgLength = experience.reduce((acc, curr) => acc + (curr.description?.length || 0), 0) / experience.length;
        if (avgLength > 80) {
            structureScore += 5;
        } else {
            feedback.improvements.push("Expand your experience details. Use the STAR method (Situation, Task, Action, Result).");
        }
    } else {
        feedback.critical.push("No experience listed. This is a major red flag.");
    }

    score += structureScore;

    return {
        score: Math.min(100, Math.max(0, score)),
        feedback,
        details: {
            metrics: metricsFound,
            actionVerbs: actionVerbCount
        }
    };
};
