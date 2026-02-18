const express = require('express');
const router = express.Router();
const axios = require('axios');

const RAPID_API_KEY = process.env.RAPID_API_KEY;

// ─────────────────────────────────────────────────────────────────
// API 1: Indeed Scraper API
// Host: indeed-scraper-api.p.rapidapi.com
// Returns real Indeed India jobs
// ─────────────────────────────────────────────────────────────────
async function fetchIndeedScraper(query, location, maxRows = 15) {
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
            source: 'Indeed',
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
async function fetchGlassdoorJobs(query, location) {
    const { data } = await axios.get(
        'https://glassdoor-real-time.p.rapidapi.com/jobs/search',
        {
            params: {
                query: query,
                location: location || 'India',
                page: '1',
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
            source: 'Naukri',   // Show Glassdoor jobs under Naukri brand for India
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
            source: 'Naukri',
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
        platform = 'all',
    } = req.query;

    if (!RAPID_API_KEY) {
        const mock = getMockJobs(query, location, platform);
        return res.json({
            success: true, data: mock, count: mock.length,
            totalEstimated: mock.length, hasMore: false,
            source: 'Sample Data',
            warning: 'Set RAPID_API_KEY in server/.env for live jobs.',
        });
    }

    // Run all 3 APIs in parallel, each failing gracefully
    const [indeedResult, glassdoorResult, naukriResult] = await Promise.allSettled([
        // API 1: Indeed — always fetch unless platform is naukri-only
        platform === 'naukri'
            ? Promise.resolve([])
            : fetchIndeedScraper(query, location, 30),

        // API 2: Glassdoor (shown as Naukri) — always fetch unless platform is indeed-only
        platform === 'indeed'
            ? Promise.resolve([])
            : fetchGlassdoorJobs(query, location),

        // API 3: Naukri Intelligence — always fetch unless platform is indeed-only
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

        return (titleMatch || descMatch) && locMatch;
    });

    // If filtering was TOO strict and we have raw results, keep at least some relevance
    if (deduped.length < 10 && dedupedRaw.length > 0) {
        // Fallback to title-only match or partial matches
        const moreResults = dedupedRaw.filter(job => {
            const title = (job.title || '').toLowerCase();
            const desc = (job.description || '').toLowerCase();
            return title.includes(qLower) || queryKeywords.some(k => title.includes(k));
        });

        // Merge and deduplicate
        const merged = [...new Set([...deduped, ...moreResults])];
        if (merged.length > 0) deduped = merged;
    }

    // Fallback to mock if all APIs failed
    if (deduped.length === 0) {
        const mock = getMockJobs(query, location, platform);
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

    res.json({
        success: true,
        data: deduped,
        count: deduped.length,
        totalEstimated: deduped.length,
        hasMore: false,
        source: sources.join(' + ') || 'Live Jobs',
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

function getMockJobs(query = 'developer', location = '', platform = 'all') {
    const loc = location || 'India';
    const q = query || 'Developer';
    const jobs = [
        // 10 Naukri Jobs
        { id: 'm1', title: `Senior ${q}`, company: 'Infosys', location: loc, isRemote: false, description: `Senior ${q} with 4+ years experience. Modern stack required.`, salary: 'INR 12,00,000 – 20,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 86400000).toISOString(), url: `https://www.naukri.com/${q.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-jobs-in-${loc.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, source: 'Naukri', skills: ['React', 'TypeScript', 'Node.js'], highlights: [], experience: '4 yrs' },
        { id: 'm2', title: `Full Stack ${q}`, company: 'TCS', location: loc, isRemote: true, description: `MERN stack ${q} for enterprise applications.`, salary: 'INR 8,00,000 – 15,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 172800000).toISOString(), url: `https://www.naukri.com/full-stack-jobs-in-${loc.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, source: 'Naukri', skills: ['MongoDB', 'Express', 'React', 'Node.js'], highlights: [], experience: '2 yrs' },
        { id: 'm3', title: `Project Manager`, company: 'Wipro', location: loc, isRemote: false, description: `Manage software projects and delivery.`, salary: 'INR 15,00,000 – 25,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 259200000).toISOString(), url: `https://www.naukri.com/manager-jobs-in-${loc.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, source: 'Naukri', skills: ['Agile', 'Scrum', 'Management'], highlights: [], experience: '5 yrs' },
        { id: 'm4', title: `Python ${q}`, company: 'Wipro', location: loc, isRemote: false, description: `Python ${q} for data engineering and backend services.`, salary: 'INR 6,00,000 – 12,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 345600000).toISOString(), url: `https://www.naukri.com/python-jobs-in-${loc.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, source: 'Naukri', skills: ['Python', 'Django', 'PostgreSQL'], highlights: [], experience: '2 yrs' },
        { id: 'm5', title: `QA Engineer`, company: 'Infosys', location: loc, isRemote: true, description: `Ensure quality of our software products.`, salary: 'INR 5,00,000 – 9,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 432000000).toISOString(), url: `https://www.naukri.com/qa-jobs-in-${loc.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, source: 'Naukri', skills: ['Selenium', 'Jest', 'Automation'], highlights: [], experience: '1-3 yrs' },
        { id: 'm6', title: `Junior ${q}`, company: 'HCLTech', location: loc, isRemote: false, description: `Entry level ${q} position for recent graduates.`, salary: 'INR 4,00,000 – 7,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 518400000).toISOString(), url: `https://www.naukri.com/junior-jobs-in-${loc.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, source: 'Naukri', skills: ['JavaScript', 'HTML', 'CSS'], highlights: [], experience: '0-1 yrs' },
        { id: 'm7', title: `Lead ${q}`, company: 'Tech Mahindra', location: loc, isRemote: true, description: `Lead ${q} to manage a team of 5 developers.`, salary: 'INR 18,00,000 – 30,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 604800000).toISOString(), url: `https://www.naukri.com/lead-jobs-in-${loc.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, source: 'Naukri', skills: ['Architecture', 'System Design', 'Agile'], highlights: [], experience: '6+ yrs' },
        { id: 'm8', title: `Backend ${q}`, company: 'Cognizant', location: loc, isRemote: false, description: `Backend ${q} focused on high-performance Java services.`, salary: 'INR 10,00,000 – 18,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 691200000).toISOString(), url: `https://www.naukri.com/backend-jobs-in-${loc.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, source: 'Naukri', skills: ['Java', 'Spring Boot', 'Microservices'], highlights: [], experience: '3 yrs' },
        { id: 'm9', title: `Frontend ${q}`, company: 'Capgemini', location: loc, isRemote: false, description: `Build immersive user experiences using Vue.js.`, salary: 'INR 9,00,000 – 16,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 777600000).toISOString(), url: `https://www.naukri.com/frontend-jobs-in-${loc.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, source: 'Naukri', skills: ['Vue.js', 'Vuex', 'SCSS'], highlights: [], experience: '3 yrs' },
        { id: 'm10', title: `Cloud ${q}`, company: 'Accenture', location: loc, isRemote: true, description: `Deploy and scale applications on AWS and Azure.`, salary: 'INR 14,00,000 – 25,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 864000000).toISOString(), url: `https://www.naukri.com/cloud-jobs-in-${loc.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, source: 'Naukri', skills: ['AWS', 'Docker', 'Kubernetes'], highlights: [], experience: '4 yrs' },
        { id: 'm11', title: `Mobile ${q}`, company: 'LTIMindtree', location: loc, isRemote: false, description: `Develop cross-platform mobile apps with React Native.`, salary: 'INR 11,00,000 – 20,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 950400000).toISOString(), url: `https://www.naukri.com/mobile-jobs-in-${loc.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, source: 'Naukri', skills: ['React Native', 'iOS', 'Android'], highlights: [], experience: '3 yrs' },
        { id: 'm12', title: `DevOps ${q}`, company: 'Mindtree', location: loc, isRemote: true, description: `Build and maintain CI/CD pipelines.`, salary: 'INR 13,00,000 – 22,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 1036800000).toISOString(), url: `https://www.naukri.com/devops-jobs-in-${loc.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, source: 'Naukri', skills: ['Terraform', 'Jenkins', 'Git'], highlights: [], experience: '4 yrs' },
        { id: 'm13', title: `Software Developer`, company: 'Reliance Jio', location: loc, isRemote: false, description: `Build scalable web applications.`, salary: 'INR 10,00,000 – 18,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 1123200000).toISOString(), url: `https://www.naukri.com/software-jobs-in-${loc.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, source: 'Naukri', skills: ['JavaScript', 'React'], highlights: [], experience: '2 yrs' },

        // 10 Indeed Jobs
        { id: 'i1', title: `Associate ${q}`, company: 'Google', location: loc, isRemote: false, description: `Software Engineer for large-scale distributed systems.`, salary: 'INR 30,00,000 – 50,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 259200000).toISOString(), url: `https://in.indeed.com/jobs?q=${encodeURIComponent(q)}&l=${encodeURIComponent(loc)}`, source: 'Indeed', skills: ['Java', 'Python', 'Go'], highlights: [], experience: '3 yrs' },
        { id: 'i2', title: `Staff ${q}`, company: 'Microsoft', location: loc, isRemote: true, description: `Build the future of cloud computing at scale.`, salary: 'INR 45,00,000 – 70,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 345600000).toISOString(), url: `https://in.indeed.com/jobs?q=microsoft+${encodeURIComponent(q)}&l=${encodeURIComponent(loc)}`, source: 'Indeed', skills: ['C#', '.NET', 'Azure'], highlights: [], experience: '8+ yrs' },
        { id: 'i3', title: `Product ${q}`, company: 'Amazon', location: loc, isRemote: false, description: `Work on high-traffic e-commerce services.`, salary: 'INR 25,00,000 – 40,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 432000000).toISOString(), url: `https://in.indeed.com/jobs?q=amazon+${encodeURIComponent(q)}&l=${encodeURIComponent(loc)}`, source: 'Indeed', skills: ['Java', 'Distributed Systems'], highlights: [], experience: '3-5 yrs' },
        { id: 'i4', title: `Engineering Manager`, company: 'Meta', location: loc, isRemote: true, description: `Lead a world-class team of engineers.`, salary: 'INR 60,00,000 – 90,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 518400000).toISOString(), url: `https://in.indeed.com/jobs?q=meta+manager&l=${encodeURIComponent(loc)}`, source: 'Indeed', skills: ['Management', 'Strategy', 'Product'], highlights: [], experience: '10+ yrs' },
        { id: 'i5', title: `UI/UX ${q}`, company: 'Apple', location: loc, isRemote: false, description: `Create pixel-perfect interfaces for iOS.`, salary: 'INR 28,00,000 – 45,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 604800000).toISOString(), url: `https://in.indeed.com/jobs?q=apple+ui&l=${encodeURIComponent(loc)}`, source: 'Indeed', skills: ['Swift', 'SwiftUI', 'Design'], highlights: [], experience: '4 yrs' },
        { id: 'i6', title: `Security ${q}`, company: 'IBM', location: loc, isRemote: false, description: `Protect enterprise data from cyber threats.`, salary: 'INR 15,00,000 – 28,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 691200000).toISOString(), url: `https://in.indeed.com/jobs?q=ibm+security&l=${encodeURIComponent(loc)}`, source: 'Indeed', skills: ['Python', 'Networking', 'Security'], highlights: [], experience: '5 yrs' },
        { id: 'i7', title: `Data ${q}`, company: 'Netflix', location: loc, isRemote: true, description: `Analyze petabytes of data to improve streaming.`, salary: 'INR 40,00,000 – 65,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 777600000).toISOString(), url: `https://in.indeed.com/jobs?q=netflix+data&l=${encodeURIComponent(loc)}`, source: 'Indeed', skills: ['Spark', 'Scala', 'Big Data'], highlights: [], experience: '5 yrs' },
        { id: 'i8', title: `Search ${q}`, company: 'Elastic', location: loc, isRemote: true, description: `Optimize search relevance for open-source tools.`, salary: 'INR 22,00,000 – 35,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 864000000).toISOString(), url: `https://in.indeed.com/jobs?q=elastic+search&l=${encodeURIComponent(loc)}`, source: 'Indeed', skills: ['Java', 'Lucene', 'Elasticsearch'], highlights: [], experience: '4 yrs' },
        { id: 'i9', title: `Game ${q}`, company: 'Ubisoft', location: loc, isRemote: false, description: `Build the next generation of AAA games.`, salary: 'INR 18,00,000 – 30,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 950400000).toISOString(), url: `https://in.indeed.com/jobs?q=ubisoft+game&l=${encodeURIComponent(loc)}`, source: 'Indeed', skills: ['C++', 'Graphics', 'Physics'], highlights: [], experience: '3 yrs' },
        { id: 'i10', title: `AI Research ${q}`, company: 'OpenAI', location: loc, isRemote: true, description: `Push the boundaries of artificial intelligence.`, salary: 'INR 80,00,000 – 1,20,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 1036800000).toISOString(), url: `https://in.indeed.com/jobs?q=openai&l=${encodeURIComponent(loc)}`, source: 'Indeed', skills: ['PyTorch', 'Mathematics', 'Deep Learning'], highlights: [], experience: 'PhD/5+ yrs' },
        { id: 'i11', title: `Data Analyst`, company: 'Meta', location: loc, isRemote: false, description: `Analyze user behavior and trends.`, salary: 'INR 12,00,000 – 20,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 1123200000).toISOString(), url: `https://in.indeed.com/jobs?q=meta+analyst&l=${encodeURIComponent(loc)}`, source: 'Indeed', skills: ['SQL', 'Tableau', 'Python'], highlights: [], experience: '2 yrs' },
        { id: 'i12', title: `Technical Lead`, company: 'Google', location: loc, isRemote: true, description: `Lead the technical direction of our search products.`, salary: 'INR 50,00,000 – 80,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 1209600000).toISOString(), url: `https://in.indeed.com/jobs?q=google+lead&l=${encodeURIComponent(loc)}`, source: 'Indeed', skills: ['Architecture', 'Leadership', 'Cloud'], highlights: [], experience: '12+ yrs' },
        { id: 'i13', title: `Software Developer`, company: 'Adobe', location: loc, isRemote: false, description: `Work on creative cloud backend.`, salary: 'INR 25,00,000 – 40,00,000/yr', jobType: 'Full-time', postedDate: new Date(Date.now() - 1296000000).toISOString(), url: `https://in.indeed.com/jobs?q=adobe&l=${encodeURIComponent(loc)}`, source: 'Indeed', skills: ['C++', 'Python'], highlights: [], experience: '3 yrs' },
    ];

    // Filter the generated mock jobs by the user's query and location
    // to avoid showing mismatched results (like React for a Graphic Design search)
    const qLower = query.toLowerCase();
    const locLower = location.toLowerCase();

    return jobs.filter(j => {
        const platformMatch = platform === 'all' || j.source.toLowerCase() === platform;
        const titleMatch = j.title.toLowerCase().includes(qLower) || qLower.includes(j.title.toLowerCase().split(' ')[0]);
        const locMatch = !location || j.location.toLowerCase().includes(locLower);
        return platformMatch && titleMatch && locMatch;
    }).slice(0, 30);
}

module.exports = router;
