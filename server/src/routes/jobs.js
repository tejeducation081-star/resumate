const express = require('express');
const router = express.Router();
const axios = require('axios');

const RAPID_API_KEY = process.env.RAPID_API_KEY;

// ─────────────────────────────────────────────────────────────────
// API 1: Indeed Scraper API
// Host: indeed-scraper-api.p.rapidapi.com
// Returns real Indeed India jobs
// ─────────────────────────────────────────────────────────────────
async function fetchIndeedScraper(query, location, maxRows = 30) {
    const country = (location || '').toLowerCase().includes('us') ? 'us' : 'in';
    const body = {
        scraper: {
            maxRows,
            query,
            location: location || 'India',
            country,
            sort: 'relevance',
        }
    };

    const { data } = await axios.post(
        'https://indeed-scraper-api.p.rapidapi.com/api/job',
        body,
        {
            headers: {
                'x-rapidapi-key': RAPID_API_KEY,
                'x-rapidapi-host': 'indeed-scraper-api.p.rapidapi.com',
                'Content-Type': 'application/json',
            },
            timeout: 30000,
        }
    );

    // Response: { state, returnvalue: { data: [ ...jobs ] } }
    const jobs = data?.returnvalue?.data || [];

    return jobs.map((job, i) => {
        const loc = job.location?.formattedAddressLong
            || job.location?.fullAddress
            || job.location?.city
            || location || 'India';

        const salaryText = job.salary?.salaryText || '';
        const jobTypes = Array.isArray(job.jobType) ? job.jobType : [];
        const attrs = Array.isArray(job.attributes) ? job.attributes : [];

        return {
            id: `indeed-${job.jobKey || i}`,
            title: job.title || 'Job Opening',
            company: job.companyName || 'Company',
            companyLogo: null,
            location: loc,
            isRemote: job.isRemote || loc.toLowerCase().includes('remote'),
            description: (job.descriptionText || '').slice(0, 600),
            salary: salaryText || 'Not specified',
            jobType: jobTypes[0] || 'Full-time',
            postedDate: job.datePublished
                ? new Date(job.datePublished).toISOString()
                : new Date().toISOString(),
            url: job.jobUrl || (job.jobKey ? `https://in.indeed.com/viewjob?jk=${job.jobKey}` : `https://in.indeed.com/jobs?q=${encodeURIComponent(job.title)}&l=${encodeURIComponent(loc)}`),
            source: 'Resumate Jobs',
            skills: attrs.filter(a => !['Remote', 'Contractual / Temporary', 'Full-time', 'Part-time'].includes(a)).slice(0, 8),
            highlights: jobTypes,
            experience: null,
        };
    });
}

// ─────────────────────────────────────────────────────────────────
// API 2: Glassdoor Real-Time API
// Host: glassdoor-real-time.p.rapidapi.com
// Returns real Glassdoor jobs — shown as "Naukri" source for India jobs
// ─────────────────────────────────────────────────────────────────
async function fetchGlassdoorJobs(query, location, page = 1) {
    const { data } = await axios.get(
        'https://glassdoor-real-time.p.rapidapi.com/jobs/search',
        {
            params: {
                query: query,
                location: location || 'India',
                page: String(page),
            },
            headers: {
                'X-RapidAPI-Key': RAPID_API_KEY,
                'X-RapidAPI-Host': 'glassdoor-real-time.p.rapidapi.com',
            },
            timeout: 15000,
        }
    );

    // Parse Glassdoor response — try common structures
    let jobs = [];
    if (Array.isArray(data)) jobs = data;
    else if (data?.data) jobs = Array.isArray(data.data) ? data.data : [];
    else if (data?.results) jobs = data.results;
    else if (data?.jobListings) jobs = data.jobListings;
    else {
        // Try to find array in response
        const val = Object.values(data || {}).find(v => Array.isArray(v));
        jobs = val || [];
    }

    return jobs.slice(0, 30).map((job, i) => {
        const title = job.jobTitle || job.title || job.name || 'Job Opening';
        const company = job.employer?.name || job.company || job.companyName || 'Company';
        const loc = job.location || job.jobLocation || location || 'India';
        const desc = (job.jobDescription || job.description || '').replace(/<[^>]+>/g, '').slice(0, 600);
        const salary = job.payPeriod
            ? `${job.payCurrency || 'INR'} ${job.payLow || ''} – ${job.payHigh || ''} ${job.payPeriod}`.trim()
            : (job.salary || job.salaryText || 'Not specified');
        const postedDate = job.listingDateUtc || job.postedDate || job.datePosted || new Date().toISOString();
        const url = job.jobViewUrl || job.applyUrl || job.url || `https://www.glassdoor.co.in/Job/jobs.htm?sc.keyword=${encodeURIComponent(title)}&locT=C&locId=${encodeURIComponent(loc)}`;

        return {
            id: `glassdoor-${job.jobListingId || job.id || i}`,
            title,
            company,
            companyLogo: job.employer?.squareLogoUrl || null,
            location: typeof loc === 'string' ? loc : (loc.city || loc.name || 'India'),
            isRemote: (typeof loc === 'string' ? loc : '').toLowerCase().includes('remote')
                || (title || '').toLowerCase().includes('remote'),
            description: desc,
            salary,
            jobType: job.jobType || 'Full-time',
            postedDate: new Date(postedDate).toISOString(),
            url,
            source: 'Resumate Jobs',
            skills: extractSkills(desc),
            highlights: [],
            experience: null,
        };
    });
}

// ─────────────────────────────────────────────────────────────────
// API 3: Naukri Job Market Intelligence API
// Host: naukri-job-market-intelligence-api.p.rapidapi.com
// Returns Naukri job market data
// ─────────────────────────────────────────────────────────────────
async function fetchNaukriIntelligence(query, location) {
    const { data } = await axios.get(
        'https://naukri-job-market-intelligence-api.p.rapidapi.com/naukri/discovery/roles',
        {
            params: { keyword: query, location: location || 'India' },
            headers: {
                'X-RapidAPI-Key': RAPID_API_KEY,
                'X-RapidAPI-Host': 'naukri-job-market-intelligence-api.p.rapidapi.com',
            },
            timeout: 15000,
        }
    );

    // Parse response — structure varies
    let roles = [];
    if (Array.isArray(data)) roles = data;
    else if (data?.roles) roles = data.roles;
    else if (data?.data) roles = Array.isArray(data.data) ? data.data : [];
    else if (data?.results) roles = data.results;

    return roles.slice(0, 30).map((role, i) => {
        const title = role.roleName || role.title || role.name || query;
        const desc = role.description || role.roleDescription || `${title} opportunity in India. ${role.skills ? 'Skills: ' + role.skills.join(', ') : ''}`;

        return {
            id: `naukri-${role.roleId || role.id || i}`,
            title,
            company: role.company || role.employer || 'Top Company',
            companyLogo: null,
            location: role.location || location || 'India',
            isRemote: (role.location || '').toLowerCase().includes('remote'),
            description: desc.slice(0, 600),
            salary: role.salary || role.salaryRange || 'Not specified',
            jobType: role.jobType || 'Full-time',
            postedDate: role.postedDate || new Date().toISOString(),
            url: role.jobUrl || role.url || `https://www.naukri.com/${(title || query).toLowerCase().replace(/[^a-z0-9]+/g, '-')}-jobs-in-${(location || 'india').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
            source: 'Resumate Jobs',
            skills: Array.isArray(role.skills) ? role.skills.slice(0, 8) : extractSkills(desc),
            highlights: [],
            experience: role.experience || null,
        };
    });
}

// ─────────────────────────────────────────────────────────────────
// Main Search Endpoint
// GET /api/jobs/search?query=React&location=India&platform=all
// ─────────────────────────────────────────────────────────────────
router.get('/search', async (req, res) => {
    const {
        query = 'Software Engineer',
        location = '',
        jobType = '',
        platform = 'all',
        page = 1,
        limit = 30
    } = req.query;

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 30;

    if (!RAPID_API_KEY) {
        const mock = getMockJobs(query, location, platform, jobType);
        return res.json({
            success: true, data: mock, count: mock.length,
            totalEstimated: mock.length, hasMore: false,
            source: 'Sample Data',
            warning: 'Set RAPID_API_KEY in server/.env for live jobs.',
        });
    }

    // Run all 3 APIs in parallel, each failing gracefully
    const [indeedResult, glassdoorResult, naukriResult] = await Promise.allSettled([
        // API 1: Indeed — limit based on limitNum
        platform === 'naukri'
            ? Promise.resolve([])
            : fetchIndeedScraper(query, location, limitNum),

        // API 2: Glassdoor (shown as Naukri) — support page parameter
        platform === 'indeed'
            ? Promise.resolve([])
            : fetchGlassdoorJobs(query, location, pageNum),

        // API 3: Naukri Intelligence
        platform === 'indeed'
            ? Promise.resolve([])
            : fetchNaukriIntelligence(query, location),
    ]);

    const indeedJobs = indeedResult.status === 'fulfilled' ? indeedResult.value : [];
    const glassdoorJobs = glassdoorResult.status === 'fulfilled' ? glassdoorResult.value : [];
    const naukriJobs = naukriResult.status === 'fulfilled' ? naukriResult.value : [];

    // Log any failures
    // Log any failures
    if (indeedResult.status === 'rejected') {
        console.error('Indeed Scraper failed:', indeedResult.reason?.message);
        if (indeedResult.reason?.response) console.error('Indeed Data:', indeedResult.reason.response.data);
    }
    if (glassdoorResult.status === 'rejected') {
        console.error('Glassdoor failed:', glassdoorResult.reason?.message);
        if (glassdoorResult.reason?.response) console.error('Glassdoor Data:', glassdoorResult.reason.response.data);
    }
    if (naukriResult.status === 'rejected') {
        console.error('Naukri Intelligence failed:', naukriResult.reason?.message);
        if (naukriResult.reason?.response) console.error('Naukri Data:', naukriResult.reason.response.data);
    }

    // Merge: Naukri jobs first, then Indeed
    const naukriAll = [...glassdoorJobs, ...naukriJobs];
    const indeedAll = [...indeedJobs];

    let allJobs;
    if (platform === 'naukri') allJobs = naukriAll;
    else if (platform === 'indeed') allJobs = indeedAll;
    else allJobs = [...naukriAll, ...indeedAll];

    // Deduplicate by title+company
    const seen = new Set();
    const dedupedRaw = allJobs.filter(job => {
        const key = `${(job.title || '').toLowerCase().slice(0, 30)}-${(job.company || '').toLowerCase().slice(0, 20)}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    // ── CRITICAL: Ensure live results actually match query/location ──
    // If user searched for 'graphic design' in 'pune', don't show 'React' from 'delhi'
    const qLower = query.toLowerCase();
    const locLower = location.toLowerCase();

    // Relaxed filtering: match title or description, and location (if provided)
    // Also handle keywords like 'developer' vs 'engineering'
    const queryKeywords = qLower.split(/\s+/).filter(k => k.length > 2);

    let deduped = dedupedRaw.filter(job => {
        const title = (job.title || '').toLowerCase();
        const desc = (job.description || '').toLowerCase();
        const loc = (job.location || '').toLowerCase();

        const titleMatch = title.includes(qLower) || queryKeywords.some(k => title.includes(k));
        const descMatch = desc.includes(qLower) || queryKeywords.some(k => desc.includes(k));
        const locMatch = !location || loc.includes(locLower);
        const typeMatch = !jobType || (job.jobType || '').toLowerCase().includes(jobType.toLowerCase());

        return (titleMatch || descMatch) && locMatch && typeMatch;
    });

    // If filtering was TOO strict and we have raw results, keep at least some relevance
    if (deduped.length < 10 && dedupedRaw.length > 0) {
        // Fallback to title-only match or partial matches
        const moreResults = dedupedRaw.filter(job => {
            const title = (job.title || '').toLowerCase();
            const desc = (job.description || '').toLowerCase();
            const typeMatch = !jobType || (job.jobType || '').toLowerCase().includes(jobType.toLowerCase());
            return (title.includes(qLower) || queryKeywords.some(k => title.includes(k))) && typeMatch;
        });

        // Merge and deduplicate
        const merged = [...new Set([...deduped, ...moreResults])];
        if (merged.length > 0) deduped = merged;
    }

    // Fallback to mock if all APIs failed
    if (deduped.length === 0) {
        const mock = getMockJobs(query, location, platform, jobType);
        return res.json({
            success: true, data: mock, count: mock.length,
            totalEstimated: mock.length, hasMore: false,
            source: 'Sample Data',
            warning: 'All APIs returned no results. Showing sample jobs.',
        });
    }

    const sources = [];
    if (naukriAll.length > 0) sources.push(`Naukri (${naukriAll.length})`);
    if (indeedAll.length > 0) sources.push(`Indeed (${indeedAll.length})`);

    // Hide platform sources - don't expose which API/platform jobs come from
    res.json({
        success: true,
        data: deduped,
        count: deduped.length,
        totalEstimated: deduped.length,
        hasMore: false,
        source: 'Resumate Jobs', // Generic source name instead of listing APIs
        isLive: true,
        timestamp: new Date().toISOString(),
    });
});

// ─────────────────────────────────────────────────────────────────
// Platform deep-links
// GET /api/jobs/platforms
// ─────────────────────────────────────────────────────────────────
router.get('/platforms', (req, res) => {
    const { query = '', location = '' } = req.query;
    const eq = encodeURIComponent(query);
    const el = encodeURIComponent(location);

    res.json({
        success: true,
        data: [
            {
                id: 'naukri',
                name: 'Naukri.com',
                url: `https://www.naukri.com/jobs-in-india?q=${eq}&l=${el}`,
                color: '#00429a',
                description: "India's #1 Job Portal",
            },
            {
                id: 'indeed',
                name: 'Indeed India',
                url: `https://in.indeed.com/jobs?q=${eq}&l=${el}`,
                color: '#2557a7',
                description: "World's #1 Job Site",
            },
            {
                id: 'linkedin',
                name: 'LinkedIn',
                url: `https://www.linkedin.com/jobs/search/?keywords=${eq}&location=${el}`,
                color: '#0a66c2',
                description: "World's largest professional network",
            },
        ],
    });
});

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────
function extractSkills(description) {
    if (!description) return [];
    const techSkills = [
        'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Scala', 'R',
        'React', 'Vue', 'Angular', 'Next.js', 'Node.js', 'Express', 'Django', 'Flask', 'FastAPI', 'Spring Boot', 'Laravel',
        'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Firebase',
        'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Jenkins', 'GitHub Actions',
        'Git', 'REST API', 'GraphQL', 'Microservices', 'Agile', 'Scrum',
        'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'NLP', 'Pandas', 'NumPy',
        'HTML', 'CSS', 'SASS', 'Tailwind', 'Bootstrap',
        'Linux', 'Bash', 'DevOps', 'Selenium', 'Jest',
    ];
    return techSkills
        .filter(skill => new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(description))
        .slice(0, 8);
}

function getMockJobs(query = 'developer', location = '', platform = 'all', requestedType = '') {
    const loc = location || 'India';
    const q = query || 'Developer';
    const jobs = [
        // 10 Naukri Jobs
        { id: 'm1', title: `Senior ${q}`, company: 'Infosys', location: loc, isRemote: false, description: `We are looking for a Senior Software Developer with 4+ years of proven experience in building scalable web applications. You will work with a talented team on modern tech stack including React, TypeScript, and Node.js. Your responsibilities will include designing and implementing new features, code reviews, mentoring junior developers, and contributing to architectural decisions. The ideal candidate has strong problem-solving skills, excellent communication abilities, and a passion for writing clean, maintainable code. You should be comfortable in a fast-paced environment and have experience with agile development methodologies. This role offers opportunities to work on challenging projects that impact millions of users worldwide.`, salary: 'INR 12,00,000 – 20,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 86400000).toISOString(), url: `https://www.naukri.com/${q.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-jobs-in-${loc.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, source: 'Resumate Jobs', skills: ['React', 'TypeScript', 'Node.js'], highlights: [], experience: '4 yrs' },
        { id: 'm2', title: `Full Stack ${q}`, company: 'TCS', location: loc, isRemote: true, description: `Join our team as a Full Stack Developer specializing in the MERN stack (MongoDB, Express, React, Node.js). You'll develop enterprise-grade applications that serve millions of customers globally. This role involves developing RESTful APIs, building responsive user interfaces, optimizing database queries, and deploying solutions to production environments. You should have 2+ years of experience with JavaScript/TypeScript, experience with version control systems, and familiarity with cloud platforms. We value developers who are self-motivated, collaborative, and keen on continuous learning. You'll work remotely with a distributed team, have access to professional development opportunities, and contribute to impactful projects. Experience with Docker, microservices, and testing frameworks is a plus.`, salary: 'INR 8,00,000 – 15,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 172800000).toISOString(), url: `https://www.naukri.com/full-stack-jobs-in-${loc.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, source: 'Resumate Jobs', skills: ['MongoDB', 'Express', 'React', 'Node.js'], highlights: [], experience: '2 yrs' },
        { id: 'm3', title: `Project Manager Internship`, company: 'Wipro', location: loc, isRemote: false, description: `We are seeking an enthusiastic Intern Project Manager to assist in overseeing software development projects...`, salary: 'INR 25,000 – 40,000/mo', jobType: 'Internship', postedDate: new Date(Date.now() - 259200000).toISOString(), url: `https://www.naukri.com/intern-jobs-in-${loc.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, source: 'Resumate Jobs', skills: ['Agile', 'Scrum', 'Management'], highlights: [], experience: '0-1 yrs' },
        { id: 'm4', title: `Python Developer (Contract)`, company: 'Wipro', location: loc, isRemote: false, description: `We're looking for a Python Developer for a 6-month contract...`, salary: 'INR 80,000 – 1,20,000/mo', jobType: 'Contract', postedDate: new Date(Date.now() - 345600000).toISOString(), url: `https://www.naukri.com/python-jobs-in-${loc.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, source: 'Resumate Jobs', skills: ['Python', 'Django', 'PostgreSQL'], highlights: [], experience: '2 yrs' },
        { id: 'm5', title: `QA Engineer`, company: 'Infosys', location: loc, isRemote: true, description: `Join our Quality Assurance team and ensure the quality of our software products...`, salary: 'INR 5,00,000 – 9,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 432000000).toISOString(), url: `https://www.naukri.com/qa-jobs-in-${loc.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, source: 'Resumate Jobs', skills: ['Selenium', 'Jest', 'Automation'], highlights: [], experience: '1-3 yrs' },
        { id: 'm6', title: `Junior Developer Internship`, company: 'HCLTech', location: loc, isRemote: false, description: `Perfect opportunity for recent graduates to start your software development career...`, salary: 'INR 20,000 – 35,000/mo', jobType: 'Internship', postedDate: new Date(Date.now() - 518400000).toISOString(), url: `https://www.naukri.com/junior-jobs-in-${loc.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, source: 'Resumate Jobs', skills: ['JavaScript', 'HTML', 'CSS'], highlights: [], experience: '0-1 yrs' },
        { id: 'm437', title: `Contract Recruiter`, company: 'LinkedIn', location: loc, isRemote: true, description: `LinkedIn is seeking a Contract Recruiter for a 12-month assignment...`, salary: 'INR 60,000 – 90,000/mo', jobType: 'Contract', postedDate: new Date(Date.now() - 1296000000).toISOString(), url: `https://in.indeed.com/jobs?q=recruiter&l=${encodeURIComponent(loc)}`, source: 'Resumate Jobs', skills: ['Recruitment', 'Sourcing', 'Networking'], highlights: [], experience: '3 yrs' },
        { id: 'm7', title: `Lead ${q}`, company: 'Tech Mahindra', location: loc, isRemote: true, description: `We are seeking an experienced Technical Lead to manage and mentor a team of 5+ developers while contributing to technical architecture decisions. As a Lead, you will oversee project delivery, conduct code reviews, ensure code quality standards, and help junior developers grow. You should have 6+ years of software development experience with strong architectural knowledge, system design expertise, and proficiency in Agile methodologies. Responsibilities include technical planning, team management, performance evaluation, mentoring, leading design discussions, and ensuring best practices implementation. The ideal candidate possesses excellent leadership skills, deep technical expertise, strong communication abilities, and a track record of delivering complex projects. You'll work remotely in a flexible environment with opportunities to influence product direction. Experience with distributed systems, microservices architecture, and cloud technologies is essential. This role offers significant growth potential and a chance to build high-performing teams.`, salary: 'INR 18,00,000 – 30,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 604800000).toISOString(), url: `https://www.naukri.com/lead-jobs-in-${loc.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, source: 'Resumate Jobs', skills: ['Architecture', 'System Design', 'Agile'], highlights: [], experience: '6+ yrs' },
        { id: 'm8', title: `Backend ${q}`, company: 'Cognizant', location: loc, isRemote: false, description: `We're looking for a Backend Developer to build high-performance Java services that power our platform serving millions of users. You'll develop scalable microservices, optimize database operations, design APIs, and ensure system reliability and performance. This role requires 3+ years of Java experience, strong understanding of Spring Boot framework, knowledge of microservices architecture, and experience with application servers. Responsibilities include developing backend services, writing unit tests, performing code reviews, troubleshooting production issues, and optimizing performance. The ideal candidate has excellent problem-solving skills, understanding of distributed systems, database optimization knowledge, and a passion for writing clean code. You should be comfortable with Linux environments, version control systems, and debugging tools. Experience with Docker, Kubernetes, Apache Kafka, and cloud platforms is appreciated. Join a collaborative team working on challenging technical problems with opportunities for professional growth and learning new technologies.`, salary: 'INR 10,00,000 – 18,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 691200000).toISOString(), url: `https://www.naukri.com/backend-jobs-in-${loc.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, source: 'Resumate Jobs', skills: ['Java', 'Spring Boot', 'Microservices'], highlights: [], experience: '3 yrs' },
        { id: 'm9', title: `Frontend ${q}`, company: 'Capgemini', location: loc, isRemote: false, description: `Join our Frontend team and build immersive, responsive user experiences using Vue.js and modern web technologies. You'll create intuitive interfaces, optimize performance, ensure cross-browser compatibility, and collaborate with designers and backend developers. This role requires 3+ years of Vue.js experience, proficiency in CSS/SCSS, strong JavaScript knowledge, and understanding of web standards. Responsibilities include developing reusable UI components, implementing responsive designs, writing unit tests, optimizing bundle sizes, and maintaining code quality. The ideal candidate has excellent UI/UX sensibility, attention to detail, problem-solving abilities, and passion for creating delightful user interfaces. You should be comfortable with browser developer tools, version control systems, and build tools. Experience with state management (Vuex), API integration, accessibility standards, and performance optimization is essential. Work with a creative team on products used by thousands of users worldwide with opportunities to learn cutting-edge frontend technologies and best practices.`, salary: 'INR 9,00,000 – 16,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 777600000).toISOString(), url: `https://www.naukri.com/frontend-jobs-in-${loc.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, source: 'Resumate Jobs', skills: ['Vue.js', 'Vuex', 'SCSS'], highlights: [], experience: '3 yrs' },
        { id: 'm10', title: `Cloud ${q}`, company: 'Accenture', location: loc, isRemote: true, description: `We're seeking a Cloud Developer to design, deploy, and scale applications on AWS and Azure platforms. This role involves containerizing applications using Docker, orchestrating with Kubernetes, managing cloud infrastructure, optimizing costs, and ensuring high availability. You should have 4+ years of cloud development experience, strong understanding of AWS and/or Azure services, hands-on experience with containerization and orchestration, and knowledge of cloud security best practices. Responsibilities include migrating applications to cloud, implementing CI/CD pipelines, monitoring performance, troubleshooting production issues, and conducting infrastructure optimization. The ideal candidate has strong problem-solving abilities, infrastructure-as-code knowledge, experience with monitoring tools, and understanding of distributed systems. You should be comfortable with Linux, command-line tools, and scripting languages. Experience with Terraform, Jenkins, serverless architecture, and microservices is beneficial. Work remotely with a global team on enterprise-scale cloud projects with opportunities for specialization and technical advancement.`, salary: 'INR 14,00,000 – 25,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 864000000).toISOString(), url: `https://www.naukri.com/cloud-jobs-in-${loc.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, source: 'Resumate Jobs', skills: ['AWS', 'Docker', 'Kubernetes'], highlights: [], experience: '4 yrs' },
        { id: 'm11', title: `Mobile ${q}`, company: 'LTIMindtree', location: loc, isRemote: false, description: `Join our Mobile Development team to create innovative cross-platform mobile applications using React Native. You'll develop performant apps, implement native modules, optimize app performance, ensure code quality, and collaborate with product and design teams. This role requires 3+ years of mobile development experience, proven expertise in React Native, understanding of iOS and Android platforms, and strong JavaScript knowledge. Responsibilities include developing features, writing unit tests, debugging app issues, optimizing performance, and staying updated with latest mobile technologies. The ideal candidate has excellent problem-solving skills, attention to detail, user-centric mindset, and passion for creating great mobile experiences. You should be comfortable with Xcode and Android Studio, have experience with third-party libraries, and understand app lifecycle management. Experience with Redux, native modules, Firebase, and app store deployment is valued. Work on apps serving millions of users with opportunities to influence product direction and learn emerging mobile technologies.`, salary: 'INR 11,00,000 – 20,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 950400000).toISOString(), url: `https://www.naukri.com/mobile-jobs-in-${loc.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, source: 'Resumate Jobs', skills: ['React Native', 'iOS', 'Android'], highlights: [], experience: '3 yrs' },
        { id: 'm12', title: `DevOps ${q}`, company: 'Mindtree', location: loc, isRemote: true, description: `We're looking for a DevOps Engineer to build and maintain CI/CD pipelines ensuring reliable software deployments. You'll automate infrastructure provisioning, optimize deployment processes, improve system reliability, troubleshoot production issues, and implement monitoring solutions. This role requires 4+ years of DevOps experience, strong knowledge of CI/CD tools like Jenkins, infrastructure-as-code experience with Terraform, and proficiency with version control systems. Responsibilities include designing deployment architecture, implementing automation scripts, managing containerized applications, monitoring system health, and collaborating with development teams. The ideal candidate has strong problem-solving abilities, understanding of Linux systems, scripting skills, security awareness, and passion for automation. You should be comfortable with cloud platforms, monitoring tools, and troubleshooting complex infrastructure issues. Experience with Kubernetes, Docker, Apache Kafka, AWS/Azure, and shell scripting is essential. Work remotely with a distributed team on enterprise-scale infrastructure with opportunities for specialization in specific areas like security or performance optimization.`, salary: 'INR 13,00,000 – 22,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 1036800000).toISOString(), url: `https://www.naukri.com/devops-jobs-in-${loc.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, source: 'Resumate Jobs', skills: ['Terraform', 'Jenkins', 'Git'], highlights: [], experience: '4 yrs' },
        { id: 'm13', title: `Software Developer`, company: 'Reliance Jio', location: loc, isRemote: false, description: `We're seeking a Software Developer to build scalable web applications that serve millions of users across India. You'll develop responsive interfaces, optimize performance, collaborate with backend teams, and contribute to product innovation. This role requires 2+ years of software development experience, strong JavaScript and React knowledge, understanding of web technologies, and ability to write clean code. Responsibilities include developing features, writing tests, debugging issues, participating in code reviews, and maintaining code quality standards. The ideal candidate has excellent problem-solving abilities, strong communication skills, willingness to learn new technologies, and passion for creating great user experiences. You should be comfortable with version control, component-based development, and browser developer tools. Experience with Redux, TypeScript, REST APIs, and responsive design is beneficial. Join a dynamic team working on cutting-edge projects with opportunities to grow your skills and make significant impact on millions of users' lives.`, salary: 'INR 10,00,000 – 18,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 1123200000).toISOString(), url: `https://www.naukri.com/software-jobs-in-${loc.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, source: 'Resumate Jobs', skills: ['JavaScript', 'React'], highlights: [], experience: '2 yrs' },

        // 10 Indeed Jobs
        { id: 'i1', title: `Associate ${q}`, company: 'Google', location: loc, isRemote: false, description: `Google seeks talented Software Engineers to work on large-scale distributed systems that impact billions of people worldwide. You'll develop infrastructure solutions, design fault-tolerant systems, optimize performance at scale, and collaborate with world-class engineers. This role requires 3+ years of software development experience, strong proficiency in Java/Python/Go, understanding of distributed systems, and excellent problem-solving abilities. Responsibilities include system design, code implementation, performance optimization, and contributing to architectural decisions. The ideal candidate has deep technical expertise, passion for solving complex problems, strong communication skills, and track record of delivering high-quality solutions. You should be comfortable with large codebases, familiar with software development best practices, and able to work on ambiguous problems. Experience with microservices, cloud technologies, databases, and open-source projects is beneficial. Work on projects used by billions with opportunities for significant technical and career growth in a collaborative, innovative environment.`, salary: 'INR 30,00,000 – 50,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 259200000).toISOString(), url: `https://in.indeed.com/jobs?q=${encodeURIComponent(q)}&l=${encodeURIComponent(loc)}`, source: 'Resumate Jobs', skills: ['Java', 'Python', 'Go'], highlights: [], experience: '3 yrs' },
        { id: 'i2', title: `Staff ${q}`, company: 'Microsoft', location: loc, isRemote: true, description: `Microsoft seeks exceptional Staff Engineers to build the future of cloud computing at massive scale. You'll architect enterprise solutions, mentor engineering teams, drive technical strategy, and solve complex infrastructure challenges. This role requires 8+ years of software engineering experience, deep expertise in C#/.NET/Azure, proven track record of shipping products at scale, and excellent leadership abilities. Responsibilities include technical leadership, system architecture design, mentoring junior engineers, driving technical initiatives, and representing engineering organization to stakeholders. The ideal candidate is a respected technical leader with strong vision, excellent communication, ability to influence without authority, and passion for innovation. You should have experience with cloud architecture, distributed systems, API design, and building high-performing teams. Experience with enterprise customers, security considerations, and large-scale migrations is valued. Join Microsoft's cloud division working remotely on products serving millions of enterprise customers globally with opportunities for executive growth.`, salary: 'INR 45,00,000 – 70,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 345600000).toISOString(), url: `https://in.indeed.com/jobs?q=microsoft+${encodeURIComponent(q)}&l=${encodeURIComponent(loc)}`, source: 'Resumate Jobs', skills: ['C#', '.NET', 'Azure'], highlights: [], experience: '8+ yrs' },
        { id: 'i3', title: `Product ${q}`, company: 'Amazon', location: loc, isRemote: false, description: `Amazon seeks Software Engineers to work on high-traffic e-commerce services that handle billions of transactions daily. You'll build scalable systems, optimize performance, improve customer experience, and work on challenging technical problems. This role requires 3-5 years of software development experience, strong Java expertise, deep understanding of distributed systems, and proven ability to deliver high-quality solutions. Responsibilities include designing and implementing services, optimizing for performance and cost, contributing to architectural discussions, and mentoring junior engineers. The ideal candidate has excellent problem-solving skills, strong technical foundation, ability to work independently and with teams, and passion for customer obsession. You should be comfortable with large-scale data processing, familiar with AWS services, and have experience with performance optimization. Experience with databases, caching, load balancing, and containerization is essential. Work on critical services with opportunities to impact millions of customers and drive your career growth at one of the world's leading technology companies.`, salary: 'INR 25,00,000 – 40,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 432000000).toISOString(), url: `https://in.indeed.com/jobs?q=amazon+${encodeURIComponent(q)}&l=${encodeURIComponent(loc)}`, source: 'Resumate Jobs', skills: ['Java', 'Distributed Systems'], highlights: [], experience: '3-5 yrs' },
        { id: 'i4', title: `Engineering Manager`, company: 'Meta', location: loc, isRemote: true, description: `Meta is seeking experienced Engineering Managers to lead world-class teams of engineers building products at billion-user scale. You'll manage team performance, conduct code reviews, drive technical direction, mentor engineers, and ensure delivery of high-impact projects. This role requires 10+ years of experience including 5+ years of management, strong technical background, proven leadership abilities, and strategic thinking. Responsibilities include team hiring and development, performance management, technical roadmap creation, stakeholder communication, and driving engineering excellence. The ideal candidate is a respected leader with strong vision, excellent mentoring abilities, ability to attract top talent, and passion for creating high-performing teams. You should have experience managing distributed teams, be comfortable with ambiguity, have strong communication skills, and drive results. Experience with large-scale systems, cross-functional collaboration, and building engineering cultures is essential. Work remotely on products used by billions globally with opportunities for significant impact and career growth in leadership.`, salary: 'INR 60,00,000 – 90,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 518400000).toISOString(), url: `https://in.indeed.com/jobs?q=meta+manager&l=${encodeURIComponent(loc)}`, source: 'Resumate Jobs', skills: ['Management', 'Strategy', 'Product'], highlights: [], experience: '10+ yrs' },
        { id: 'i5', title: `UI/UX ${q}`, company: 'Apple', location: loc, isRemote: false, description: `Apple seeks talented UI/UX Developers to create pixel-perfect interfaces for iOS applications that delight millions of users. You'll design intuitive user experiences, develop engaging interfaces using SwiftUI, optimize performance, and collaborate with product teams. This role requires 4+ years of iOS development experience, strong proficiency in Swift and SwiftUI, deep understanding of Apple design principles, and passion for creating exceptional user experiences. Responsibilities include UI implementation, animation development, performance optimization, and iterating on designs based on user feedback. The ideal candidate has strong design sensibility, attention to detail, creative problem-solving abilities, and commitment to quality. You should be comfortable with Xcode, Interface Builder, and debugging tools. Experience with accessibility features, native iOS frameworks, and human interface guidelines is essential. Work on products loved by millions of users worldwide with opportunities to influence design direction and push boundaries of mobile interface design.`, salary: 'INR 28,00,000 – 45,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 604800000).toISOString(), url: `https://in.indeed.com/jobs?q=apple+ui&l=${encodeURIComponent(loc)}`, source: 'Resumate Jobs', skills: ['Swift', 'SwiftUI', 'Design'], highlights: [], experience: '4 yrs' },
        { id: 'i6', title: `Security ${q}`, company: 'IBM', location: loc, isRemote: false, description: `IBM is looking for Security Engineers to protect enterprise data and systems from cyber threats. You'll identify vulnerabilities, implement security solutions, perform security audits, respond to incidents, and develop security best practices. This role requires 5+ years of cybersecurity experience, strong proficiency in Python, deep understanding of networking concepts, and comprehensive security knowledge. Responsibilities include vulnerability assessment, penetration testing, security architecture design, incident response, and security awareness training. The ideal candidate has strong security acumen, analytical thinking, attention to detail, and passion for staying ahead of evolving threats. You should be familiar with security tools and frameworks, understand regulatory compliance requirements, and have hands-on experience with threat detection. Experience with cloud security, SIEM tools, encryption, and security automation is beneficial. Work on critical security projects protecting some of the world's largest enterprises with opportunities to specialize in emerging security technologies.`, salary: 'INR 15,00,000 – 28,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 691200000).toISOString(), url: `https://in.indeed.com/jobs?q=ibm+security&l=${encodeURIComponent(loc)}`, source: 'Resumate Jobs', skills: ['Python', 'Networking', 'Security'], highlights: [], experience: '5 yrs' },
        { id: 'i7', title: `Data ${q}`, company: 'Netflix', location: loc, isRemote: true, description: `Netflix is seeking Data Engineers to analyze petabytes of data and improve streaming experience for millions of subscribers globally. You'll build data pipelines, optimize queries, develop analytics solutions, and work with data scientists on insights. This role requires 5+ years of data engineering experience, strong expertise in Spark and Scala, deep understanding of big data technologies, and proven ability to handle massive datasets. Responsibilities include designing data architectures, building ETL pipelines, optimizing data processing, and ensuring data quality. The ideal candidate has strong problem-solving skills, understanding of distributed systems, experience with data warehousing, and passion for data-driven insights. You should be comfortable with Hadoop, Hive, NoSQL databases, and cloud platforms. Experience with machine learning pipelines, data visualization, and real-time processing is beneficial. Work remotely on data challenges at Netflix scale with opportunities to influence product recommendations and drive millions of decisions daily.`, salary: 'INR 40,00,000 – 65,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 777600000).toISOString(), url: `https://in.indeed.com/jobs?q=netflix+data&l=${encodeURIComponent(loc)}`, source: 'Resumate Jobs', skills: ['Spark', 'Scala', 'Big Data'], highlights: [], experience: '5 yrs' },
        { id: 'i8', title: `Search ${q}`, company: 'Elastic', location: loc, isRemote: true, description: `Elastic seeks talented Engineers to optimize search relevance for Elasticsearch and enhance our open-source search platform used by millions worldwide. You'll work on search architecture, relevance algorithms, performance optimization, and scale systems to handle billions of queries. This role requires 4+ years of search or data systems experience, strong Java expertise, deep knowledge of Lucene concepts, and proven ability to solve complex problems. Responsibilities include developing search features, optimizing performance, improving ranking algorithms, and contributing to product strategy. The ideal candidate has strong technical foundation, passion for search technology, excellent communication skills, and commitment to open source. You should be comfortable with distributed systems, information retrieval concepts, and performance optimization. Experience with machine learning for ranking, analytics, and information architecture is beneficial. Work remotely on an open-source project with significant industry impact and opportunities to shape future of search technology.`, salary: 'INR 22,00,000 – 35,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 864000000).toISOString(), url: `https://in.indeed.com/jobs?q=elastic+search&l=${encodeURIComponent(loc)}`, source: 'Resumate Jobs', skills: ['Java', 'Lucene', 'Elasticsearch'], highlights: [], experience: '4 yrs' },
        { id: 'i9', title: `Game ${q}`, company: 'Ubisoft', location: loc, isRemote: false, description: `Ubisoft is seeking talented Game Developers to build the next generation of AAA games that will be played by millions worldwide. You'll develop gameplay mechanics, optimize graphics, implement physics systems, work with game engines, and collaborate with creative teams. This role requires 3+ years of game development experience, strong C++ expertise, deep knowledge of graphics programming, and proven ability to ship games. Responsibilities include feature development, performance optimization, technical problem-solving, and code review participation. The ideal candidate has strong creative-technical balance, passion for games, attention to detail, and collaborative spirit. You should be comfortable with game engines like Unreal or Unity, version control, and debugging tools. Experience with 3D graphics, physics engines, AI programming, and multiplayer systems is beneficial. Join a world-renowned game studio creating memorable gaming experiences with opportunities to work on acclaimed franchises.`, salary: 'INR 18,00,000 – 30,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 950400000).toISOString(), url: `https://in.indeed.com/jobs?q=ubisoft+game&l=${encodeURIComponent(loc)}`, source: 'Resumate Jobs', skills: ['C++', 'Graphics', 'Physics'], highlights: [], experience: '3 yrs' },
        { id: 'i10', title: `AI Research ${q}`, company: 'OpenAI', location: loc, isRemote: true, description: `OpenAI is seeking exceptional researchers and engineers to push the boundaries of artificial intelligence and develop safe, beneficial AI systems. You'll conduct cutting-edge research, implement novel algorithms, scale models, and collaborate with world-class researchers. This role requires PhD or 5+ years of relevant experience, strong expertise in PyTorch, deep understanding of deep learning, and proven research contributions. Responsibilities include research design, implementation, experimentation, paper writing, and collaboration with multidisciplinary teams. The ideal candidate is a visionary thinker, excellent researcher, strong problem solver, and passionate about AI's positive impact. You should have strong mathematical foundation, experience with large language models, familiarity with reinforcement learning, and understanding of ethics in AI. Work remotely on groundbreaking AI research with global impact and opportunities to influence future of artificial intelligence and technology. Competitive compensation reflects importance of this work.`, salary: 'INR 80,00,000 – 1,20,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 1036800000).toISOString(), url: `https://in.indeed.com/jobs?q=openai&l=${encodeURIComponent(loc)}`, source: 'Resumate Jobs', skills: ['PyTorch', 'Mathematics', 'Deep Learning'], highlights: [], experience: 'PhD/5+ yrs' },
        { id: 'i11', title: `Data Analyst`, company: 'Meta', location: loc, isRemote: false, description: `Meta is looking for Data Analysts to analyze user behavior and trends driving billion-user platforms. You'll create data models, design dashboards, extract insights, and support product decision-making with data-driven recommendations. This role requires 2+ years of data analysis experience, strong SQL expertise, proficiency in visualization tools like Tableau, and Python knowledge. Responsibilities include data analysis, dashboard creation, statistical testing, report generation, and stakeholder communication. The ideal candidate has strong analytical thinking, attention to detail, curiosity about data patterns, and ability to translate insights into action. You should be comfortable with databases, knowledge of statistics, and ability to work independently. Experience with A/B testing, machine learning concepts, and big data tools is beneficial. Work on products serving billions of users with opportunities to influence product direction through data-driven insights.`, salary: 'INR 12,00,000 – 20,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 1123200000).toISOString(), url: `https://in.indeed.com/jobs?q=meta+analyst&l=${encodeURIComponent(loc)}`, source: 'Resumate Jobs', skills: ['SQL', 'Tableau', 'Python'], highlights: [], experience: '2 yrs' },
        { id: 'i12', title: `Technical Lead`, company: 'Google', location: loc, isRemote: true, description: `Google seeks an exceptional Technical Lead to lead the technical direction of our search products and influence billions of searches daily. You'll define technical strategy, mentor engineering teams, drive innovation, and solve complex technical challenges at global scale. This role requires 12+ years of experience including proven technical leadership, deep expertise in search and information retrieval, strong architectural thinking, and excellent communication. Responsibilities include technical planning, architecture design, team development, innovation driving, and strategic direction setting. The ideal candidate is a visionary technical leader, respected expert, excellent mentor, and passionate about creating impactful products. You should have extensive experience with large distributed systems, cloud infrastructure, and ability to think strategically. Experience with machine learning, information retrieval, and analytics at scale is essential. Work remotely on problems impacting billions of people worldwide with opportunities for significant technical and career impact.`, salary: 'INR 50,00,000 – 80,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 1209600000).toISOString(), url: `https://in.indeed.com/jobs?q=google+lead&l=${encodeURIComponent(loc)}`, source: 'Resumate Jobs', skills: ['Architecture', 'Leadership', 'Cloud'], highlights: [], experience: '12+ yrs' },
        { id: 'i13', title: `Software Developer`, company: 'Adobe', location: loc, isRemote: false, description: `Adobe is seeking talented Software Developers to work on Creative Cloud backend systems serving millions of creative professionals worldwide. You'll develop scalable services, optimize performance, ensure reliability, and contribute to product innovation. This role requires 3+ years of software development experience, strong C++ and Python expertise, understanding of distributed systems, and proven ability to deliver quality solutions. Responsibilities include service development, performance optimization, troubleshooting production issues, and code review participation. The ideal candidate has strong technical foundation, excellent problem-solving skills, commitment to quality, and passion for creative tools. You should be comfortable with microservices architecture, familiar with cloud platforms, and experienced in performance optimization. Knowledge of media processing, graphics, and collaborative technologies is beneficial. Join Adobe's team working on world-class creative tools with opportunities to impact creative professionals and drive your career in a collaborative, innovative environment.`, salary: 'INR 25,00,000 – 40,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 1296000000).toISOString(), url: `https://in.indeed.com/jobs?q=adobe&l=${encodeURIComponent(loc)}`, source: 'Resumate Jobs', skills: ['C++', 'Python'], highlights: [], experience: '3 yrs' },

        // 15+ Non-Technical Jobs
        { id: 'n1', title: `Sales Manager`, company: 'HubSpot', location: loc, isRemote: true, description: `HubSpot is seeking an experienced Sales Manager to lead a high-performing sales team and drive revenue growth. You'll manage team performance, develop sales strategies, conduct client negotiations, conduct pipeline management, and mentor sales representatives. This role requires 5+ years of sales experience including 2+ years of management, proven track record of exceeding targets, strong leadership abilities, and excellent communication skills. Responsibilities include team hiring and training, performance management, strategic account management, forecasting, and driving sales excellence. The ideal candidate is a results-driven leader, skilled negotiator, excellent coach, and passionate about building high-performing teams. You should have experience with CRM systems, understanding of B2B/B2C sales processes, and ability to manage complex deals. Knowledge of SaaS sales, customer relationship management, and strategic planning is beneficial. Work remotely with competitive commission, growth opportunities, and ability to build and scale your team in a fast-growing company.`, salary: 'INR 12,00,000 – 22,00,000/yr + Commission', jobType: 'Full-time', postedDate: new Date(Date.now() - 86400000).toISOString(), url: `https://in.indeed.com/jobs?q=sales+manager&l=${encodeURIComponent(loc)}`, source: 'Resumate Jobs', skills: ['Sales Strategy', 'CRM', 'Leadership'], highlights: [], experience: '5+ yrs' },
        { id: 'n2', title: `Marketing Manager`, company: 'Unilever', location: loc, isRemote: false, description: `Unilever is looking for a dynamic Marketing Manager to develop and execute marketing campaigns that drive brand awareness and market share growth. You'll create strategic marketing plans, manage campaigns across channels, analyze market trends, collaborate with teams, and optimize marketing spend. This role requires 4+ years of marketing experience, strong understanding of brand management, expertise in digital and traditional marketing, and proven ability to drive results. Responsibilities include campaign planning and execution, budget management, data analysis, competitive analysis, and team collaboration. The ideal candidate has creative thinking, strategic mindset, analytical skills, and passion for brand building. You should be comfortable with marketing analytics, social media marketing, content strategy, and market research. Experience with advertising platforms, SEO/SEM, and marketing automation tools is beneficial. Work on iconic global brands with opportunities to impact millions of consumers and drive meaningful market growth.`, salary: 'INR 10,00,000 – 18,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 172800000).toISOString(), url: `https://in.indeed.com/jobs?q=marketing+manager&l=${encodeURIComponent(loc)}`, source: 'Resumate Jobs', skills: ['Brand Strategy', 'Digital Marketing', 'Analytics'], highlights: [], experience: '4 yrs' },
        { id: 'n3', title: `HR Manager`, company: 'Deloitte', location: loc, isRemote: false, description: `Deloitte is seeking an experienced HR Manager to lead human resources initiatives and develop talent across the organization. You'll manage recruitment, handle employee relations, develop training programs, ensure compliance, and drive talent development strategies. This role requires 5+ years of HR experience, strong knowledge of labor laws and compliance, excellent interpersonal skills, and strategic thinking. Responsibilities include talent acquisition, employee development, performance management, maintaining company culture, and HR policy development. The ideal candidate is a people-focused leader, excellent communicator, problem solver, and passionate about creating positive workplace environments. You should have experience with HRIS systems, recruitment practices, and employee engagement. Knowledge of compensation and benefits, organizational development, and conflict resolution is essential. Work on building world-class teams with opportunities to shape company culture and impact employee growth in a dynamic consulting environment.`, salary: 'INR 9,00,000 – 16,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 259200000).toISOString(), url: `https://in.indeed.com/jobs?q=hr+manager&l=${encodeURIComponent(loc)}`, source: 'Resumate Jobs', skills: ['Recruitment', 'Employee Relations', 'Compliance'], highlights: [], experience: '5 yrs' },
        { id: 'n4', title: `Financial Analyst`, company: 'JPMorgan Chase', location: loc, isRemote: false, description: `JPMorgan Chase is looking for a talented Financial Analyst to analyze financial data, prepare forecasts, and provide insights for business decision-making. You'll analyze financial statements, develop financial models, track budgets, create reports, and support investment decisions. This role requires 3+ years of financial analysis experience, strong proficiency in Excel and financial modeling, understanding of accounting principles, and excellent analytical skills. Responsibilities include financial data analysis, report preparation, budget monitoring, scenario modeling, and stakeholder communication. The ideal candidate has strong quantitative skills, attention to detail, understanding of business processes, and passion for financial analysis. You should be comfortable with financial databases, data visualization tools, and have knowledge of investment analysis. Experience with Python/SQL, valuation models, and financial software is beneficial. Work on critical financial decisions with opportunities to grow into senior finance roles in a leading global financial institution.`, salary: 'INR 8,00,000 – 14,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 345600000).toISOString(), url: `https://in.indeed.com/jobs?q=financial+analyst&l=${encodeURIComponent(loc)}`, source: 'Resumate Jobs', skills: ['Excel', 'Financial Modeling', 'Analytics'], highlights: [], experience: '3 yrs' },
        { id: 'n5', title: `Operations Manager`, company: 'Amazon Logistics', location: loc, isRemote: false, description: `Amazon is seeking an Operations Manager to oversee warehouse operations and ensure efficient fulfillment processes serving millions of customers. You'll manage teams, optimize workflows, monitor KPIs, ensure safety compliance, and implement process improvements. This role requires 4+ years of operations management experience, strong leadership abilities, process improvement expertise, and proven ability to manage large-scale operations. Responsibilities include team management, process optimization, safety compliance, performance monitoring, and continuous improvement initiatives. The ideal candidate is a results-driven leader, strong problem solver, data-oriented, and passionate about operational excellence. You should have experience with warehouse management systems, lean methodologies, and safety protocols. Knowledge of supply chain operations, inventory management, and quality assurance is beneficial. Work on critical operations with opportunities to grow into senior operations leadership in a company that logistics serves millions of customers daily.`, salary: 'INR 10,00,000 – 18,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 432000000).toISOString(), url: `https://in.indeed.com/jobs?q=operations+manager&l=${encodeURIComponent(loc)}`, source: 'Resumate Jobs', skills: ['Team Management', 'Process Optimization', 'Analytics'], highlights: [], experience: '4 yrs' },
        { id: 'n6', title: `Business Analyst`, company: 'Accenture', location: loc, isRemote: true, description: `Accenture is looking for a Business Analyst to gather requirements, analyze business processes, develop solutions, and ensure successful implementation of projects. You'll conduct stakeholder interviews, document requirements, create process flows, develop use cases, and support testing efforts. This role requires 3+ years of business analysis experience, strong communication skills, understanding of SDLC, and ability to work with cross-functional teams. Responsibilities include requirements gathering, process analysis, documentation, stakeholder management, and solution design support. The ideal candidate has strong analytical thinking, excellent communication, attention to detail, and understanding of business operations. You should be comfortable with business analysis tools, understanding of data requirements, and knowledge of project management. Experience with UML, prototyping, and SAP/Oracle is beneficial. Work remotely on consulting engagements with opportunities to grow into business strategy roles and work with leading global enterprises.`, salary: 'INR 8,00,000 – 14,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 518400000).toISOString(), url: `https://in.indeed.com/jobs?q=business+analyst&l=${encodeURIComponent(loc)}`, source: 'Resumate Jobs', skills: ['Requirements Analysis', 'Documentation', 'Business Process'], highlights: [], experience: '3 yrs' },
        { id: 'n7', title: `Customer Success Manager`, company: 'Salesforce', location: loc, isRemote: true, description: `Salesforce is seeking a Customer Success Manager to ensure customer satisfaction, reduce churn, and grow account value through strategic partnerships. You'll manage customer relationships, identify upsell opportunities, provide training and support, monitor health metrics, and resolve escalations. This role requires 3+ years of customer success experience, strong relationship management skills, understanding of SaaS business model, and proven ability to drive customer growth. Responsibilities include account management, training delivery, health monitoring, issue resolution, and customer advocacy. The ideal candidate is customer-focused, excellent communicator, strategic thinker, and passionate about customer success. You should have experience with CRM systems, understanding of customer lifecycle, and ability to work independently. Knowledge of sales processes, product features, and business metrics is beneficial. Work remotely managing high-value accounts with opportunities to build strategic partnerships and drive significant revenue growth.`, salary: 'INR 9,00,000 – 15,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 604800000).toISOString(), url: `https://in.indeed.com/jobs?q=customer+success&l=${encodeURIComponent(loc)}`, source: 'Resumate Jobs', skills: ['Account Management', 'CRM', 'Customer Relations'], highlights: [], experience: '3 yrs' },
        { id: 'n8', title: `Content Manager`, company: 'Medium', location: loc, isRemote: true, description: `Medium is looking for a Content Manager to develop and execute content strategy, manage editorial calendar, create quality content, and drive audience engagement. You'll plan content, conduct research, write and edit articles, manage publishing workflow, analyze performance, and collaborate with writers. This role requires 3+ years of content management experience, strong writing and editing skills, understanding of SEO, and proven ability to create engaging content. Responsibilities include content strategy development, article writing and editing, SEO optimization, performance analysis, and audience growth. The ideal candidate is a creative writer, strategic thinker, detail-oriented, and passionate about quality storytelling. You should have strong writing skills, understanding of content marketing, and familiarity with CMS systems. Experience with multimedia content, analytics tools, and social media is beneficial. Work remotely for a content-focused platform with opportunities to build publishing strategy and grow audience reach globally.`, salary: 'INR 7,00,000 – 12,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 691200000).toISOString(), url: `https://in.indeed.com/jobs?q=content+manager&l=${encodeURIComponent(loc)}`, source: 'Resumate Jobs', skills: ['Content Strategy', 'SEO', 'Writing'], highlights: [], experience: '3 yrs' },
        { id: 'n9', title: `Product Manager`, company: 'Stripe', location: loc, isRemote: true, description: `Stripe is seeking an experienced Product Manager to define product vision, develop roadmaps, and deliver products that delight merchants worldwide. You'll conduct market research, prioritize features, work with engineering and design, gather feedback, and drive product adoption. This role requires 5+ years of product management experience, strong strategic thinking, understanding of payment systems, and proven ability to ship successful products. Responsibilities include vision setting, roadmap development, feature prioritization, stakeholder management, and success metrics definition. The ideal candidate is a strategic thinker, exceptional communicator, data-driven decision maker, and passionate about solving customer problems. You should have experience with analytics, understanding of technical concepts, and ability to influence without authority. Knowledge of fintech, API design, and marketplace dynamics is beneficial. Work remotely on products used by millions of merchants with opportunities to shape global payments infrastructure.`, salary: 'INR 25,00,000 – 40,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 777600000).toISOString(), url: `https://in.indeed.com/jobs?q=product+manager&l=${encodeURIComponent(loc)}`, source: 'Resumate Jobs', skills: ['Product Strategy', 'Analytics', 'Leadership'], highlights: [], experience: '5 yrs' },
        { id: 'n10', title: `Account Executive`, company: 'Oracle', location: loc, isRemote: false, description: `Oracle is looking for a talented Account Executive to sell enterprise software solutions and build strategic customer partnerships. You'll identify prospects, conduct presentations, negotiate contracts, close deals, and maintain customer relationships. This role requires 4+ years of enterprise sales experience, proven track record of exceeding quotas, strong presentation skills, and extensive sales knowledge. Responsibilities include lead generation, prospect qualification, solution selling, negotiation, and account management. The ideal candidate is results-driven, excellent communicator, confident presenter, and passionate about sales. You should have experience with complex B2B sales cycles, understanding of enterprise solutions, and ability to manage long sales cycles. Knowledge of software licensing, ERP systems, and enterprise architecture is beneficial. Work on high-value enterprise deals with significant commissions and opportunities to grow into sales leadership in a global software leader.`, salary: 'INR 10,00,000 – 20,00,000/yr + Commission', jobType: 'Full-time', postedDate: new Date(Date.now() - 864000000).toISOString(), url: `https://in.indeed.com/jobs?q=account+executive&l=${encodeURIComponent(loc)}`, source: 'Resumate Jobs', skills: ['Enterprise Sales', 'Negotiation', 'B2B'], highlights: [], experience: '4 yrs' },
        { id: 'n11', title: `Supply Chain Manager`, company: 'Nestlé', location: loc, isRemote: false, description: `Nestlé is seeking a Supply Chain Manager to optimize procurement, manage supplier relationships, reduce costs, and ensure supply reliability. You'll develop procurement strategies, manage supplier performance, optimize inventory, minimize risks, and drive continuous improvement. This role requires 5+ years of supply chain experience, strong procurement knowledge, understanding of logistics, and proven ability to reduce costs. Responsibilities include supplier management, inventory planning, cost reduction initiatives, quality assurance, and process improvement. The ideal candidate is strategic thinker, excellent negotiator, detail-oriented, and passionate about operational excellence. You should have experience with ERP systems, understanding of supply chain networks, and ability to manage complex stakeholder relationships. Knowledge of logistics optimization, risk management, and global supply chains is beneficial. Work on global supply chain with opportunities to impact millions of customers and drive significant business value.`, salary: 'INR 12,00,000 – 20,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 950400000).toISOString(), url: `https://in.indeed.com/jobs?q=supply+chain+manager&l=${encodeURIComponent(loc)}`, source: 'Resumate Jobs', skills: ['Procurement', 'Supplier Management', 'Logistics'], highlights: [], experience: '5 yrs' },
        { id: 'n12', title: `Training Specialist`, company: 'Cisco', location: loc, isRemote: true, description: `Cisco is looking for a Training Specialist to develop and deliver training programs, create learning materials, assess training effectiveness, and support employee development. You'll design courses, conduct training sessions, develop training materials, evaluate effectiveness, and stay updated with training methodologies. This role requires 3+ years of training and development experience, strong communication skills, ability to create engaging training materials, and understanding of adult learning principles. Responsibilities include training program development, content creation, training delivery, evaluation, and continuous improvement. The ideal candidate is passionate about learning, excellent trainer, creative designer, and dedicated to employee development. You should have strong presentation skills, ability to use learning technology platforms, and understanding of learning objectives framework. Experience with LMS systems, e-learning development, and train-the-trainer is beneficial. Work remotely helping employees develop skills and advance their careers in a technology leader company.`, salary: 'INR 6,00,000 – 11,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 1036800000).toISOString(), url: `https://in.indeed.com/jobs?q=training+specialist&l=${encodeURIComponent(loc)}`, source: 'Resumate Jobs', skills: ['Instructional Design', 'Training Delivery', 'Learning Management'], highlights: [], experience: '3 yrs' },
        { id: 'n13', title: `Finance Manager`, company: 'Goldman Sachs', location: loc, isRemote: false, description: `Goldman Sachs is seeking a Finance Manager to oversee financial planning, manage budgets, ensure compliance, and provide financial guidance to business units. You'll prepare financial statements, conduct variance analysis, manage forecasting processes, ensure controls, and support strategic initiatives. This role requires 6+ years of financial management experience, strong accounting knowledge, understanding of financial governance, and proven ability to manage large budgets. Responsibilities include financial planning and analysis, budget management, compliance monitoring, financial reporting, and strategic guidance. The ideal candidate is detail-oriented, strong analytical thinker, excellent communicator, and strategic mindset. You should have strong accounting knowledge, experience with financial systems, and understanding of internal controls. Knowledge of IFRS/GAAP, risk management, and treasury is beneficial. Work on critical financial decisions with opportunities to grow into senior finance leadership in a global financial powerhouse.`, salary: 'INR 18,00,000 – 28,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 1123200000).toISOString(), url: `https://in.indeed.com/jobs?q=finance+manager&l=${encodeURIComponent(loc)}`, source: 'Resumate Jobs', skills: ['Financial Analysis', 'Budget Management', 'Accounting'], highlights: [], experience: '6 yrs' },
        { id: 'n14', title: `Brand Manager`, company: 'Procter & Gamble', location: loc, isRemote: false, description: `P&G is looking for a Brand Manager to develop and execute brand strategy, drive market share growth, manage brand communications, and ensure consistent brand experiences. You'll develop marketing plans, manage advertising campaigns, conduct market research, monitor brand health, and collaborate across functions. This role requires 4+ years of brand management experience, strong strategic thinking, understanding of consumer behavior, and proven ability to drive brand growth. Responsibilities include brand strategy development, campaign management, budget allocation, market analysis, and consumer insights management. The ideal candidate is strategic thinker, creative problem solver, excellent communicator, and passionate about brand building. You should have experience with marketing analytics, understanding of digital and traditional channels, and ability to manage complex projects. Knowledge of consumer insights, advertising placement, and brand positioning is essential. Work on iconic global brands with opportunities to impact millions of consumers worldwide.`, salary: 'INR 12,00,000 – 20,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 1209600000).toISOString(), url: `https://in.indeed.com/jobs?q=brand+manager&l=${encodeURIComponent(loc)}`, source: 'Resumate Jobs', skills: ['Brand Strategy', 'Marketing', 'Consumer Insights'], highlights: [], experience: '4 yrs' },
        { id: 'n15', title: `Recruiter`, company: 'LinkedIn', location: loc, isRemote: true, description: `LinkedIn is seeking a dynamic Recruiter to identify and attract top talent for various roles, manage recruitment processes, and build relationships with candidates. You'll source candidates, conduct interviews, manage hiring workflows, negotiate offers, and support onboarding. This role requires 3+ years of recruitment experience, strong sourcing and networking skills, excellent communication abilities, and passion for talent acquisition. Responsibilities include candidate sourcing, screening, interviewing, offer negotiation, and hiring process management. The ideal candidate is people-focused, excellent communicator, persistent, and passionate about finding great talent. You should have strong networking abilities, understanding of different industries, and familiarity with recruitment tools and platforms. Experience with applicant tracking systems, employer branding, and talent strategy is beneficial. Work remotely for a leading talent platform with opportunities to build teams and shape company culture by attracting exceptional talent.`, salary: 'INR 7,00,000 – 12,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 1296000000).toISOString(), url: `https://in.indeed.com/jobs?q=recruiter&l=${encodeURIComponent(loc)}`, source: 'Resumate Jobs', skills: ['Recruitment', 'Sourcing', 'Networking'], highlights: [], experience: '3 yrs' }
    ];

    // Add some default Full-time jobs if list is short (to simulate a larger pool)
    if (jobs.length < 20) {
        jobs.push({ id: 'm_gen_1', title: `Frontend Developer`, company: 'Modern Tech', location: loc, isRemote: true, description: `Looking for a Frontend Developer...`, salary: 'INR 10,00,000 /yr', jobType: 'Full-time', postedDate: new Date().toISOString(), url: '#', source: 'Resumate Jobs', skills: ['React'], highlights: [], experience: '2 yrs' });
    }

    // Filter the generated mock jobs by location and platform only
    // Frontend handles category and search filtering
    const locLower = location.toLowerCase();
    const typeLower = requestedType.toLowerCase();

    return jobs.filter(j => {
        const platformMatch = platform === 'all' || j.source.toLowerCase() === platform;
        const locMatch = !location || j.location.toLowerCase().includes(locLower);
        const typeMatch = !requestedType || j.jobType.toLowerCase().includes(typeLower);
        return platformMatch && locMatch && typeMatch;
    }).slice(0, 100);
}

module.exports = router;
