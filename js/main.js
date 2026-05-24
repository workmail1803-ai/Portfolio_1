/* =====================================================
   VINTAGE WIKI PORTFOLIO â€” JavaScript
   Router, GitHub API, Markdown Rendering
   ===================================================== */

const GITHUB_USER = 'workmail1803-ai';
const OWNER_NAME  = 'Nafis Hossain Momen';

// â”€â”€ Curated Project Descriptions â”€â”€
// Researched from README files and repository file structures
const PROJECT_DESCRIPTIONS = {
  'active_dream_bot': 'A permission-based private Telegram bot for virtual phone numbers and automated OTP verification. Fully modular, production-ready bot built with Python 3.11+ and the Telegram Bot API.',
  'Flutter_Project': 'Wondr NEUB â€” A Flutter mobile application for university services. Cross-platform mobile app built with Dart, targeting both Android and iOS platforms.',
  'ML_Project': 'Malware Analysis using Machine Learning â€” A data science project that performs malware classification and threat detection using CSV datasets, threshold analysis, and Jupyter Notebook-based model training.',
  'Nextup': 'A travel and tour booking platform built with Next.js, TypeScript, and Supabase. Features destination browsing, package listings, admin dashboard, FAQ pages in Bengali/English, and SEO optimization.',
  'Fahim_Vai': 'A professional business website built with Next.js and TypeScript. Clean, modern single-page design with responsive layout and optimized performance.',
  'prescription': 'A doctor prescription management tool with medicine database, prescription writing interface, visit tracking, and print-ready prescription templates. Built with vanilla HTML, CSS, and JavaScript.',
  'Relief-Chain-': 'Relief Chain â€” A disaster relief coordination platform built with React, Vite, and Supabase. Features community posts, medical module, shop module, and real-time relief supply chain management.',
  'Doctors_RX': 'Rx Portal â€” A modern doctor prescription management system built with React, TypeScript, Vite, Supabase, and Tailwind CSS. Features patient dashboard, medicine autosuggest, print studio with mobile-friendly A4 preview.',
  'ARAB': 'A full-stack delivery and logistics management system built with Next.js and TypeScript. Features agent dashboard, rider management, order tracking, WooCommerce integration, and real-time delivery status.',
  'Redwan': 'Sweet Delights BD â€” A premium cake shop website for Bangladesh built with Next.js 14. Features PWA support, Bengali language, scroll animations, WhatsApp ordering integration, and mobile-first responsive design.',
  'NUB_PAGE': 'A university web portal built with React, TypeScript, and Vite. Modern single-page application with component-based architecture and responsive design for university information.',
  'MIM_Project': "Wond'r NEUB â€” A Django-based study tour booking system for NEUB students. Full-stack Python web application with booking management, student registration, and tour package features.",
  'Assignment_1_B13_Proggraming_Hero.': 'Programming Hero Batch 13 â€” Assignment 1. A front-end web development assignment showcasing HTML structuring and foundational web design concepts.',
  'Assignment_2_B13_Proggraming_Hero.': 'Programming Hero Batch 13 â€” Assignment 2. A CSS-focused web development assignment demonstrating responsive layouts, styling techniques, and modern CSS patterns.',
  'Mahin_Buiseness': 'A business studies lecture booklet and interactive slide presentation. Features LaTeX-generated PDF booklet with content extraction tools and an HTML-based slide viewer for students.',
  'portfolio': 'An earlier iteration of a personal developer portfolio. Single-page HTML portfolio with resume PDF, showcasing projects and professional background.',
  'Portfolio_1': 'This portfolio website â€” a vintage wiki-themed developer portfolio that dynamically fetches projects from GitHub and renders README files as case study pages.'
};

const PROJECT_CATEGORIES = {
  'active_dream_bot': 'bot',
  'Flutter_Project': 'mobile',
  'ML_Project': 'ai',
  'Nextup': 'web',
  'Fahim_Vai': 'web',
  'prescription': 'web',
  'Relief-Chain-': 'web',
  'Doctors_RX': 'web',
  'ARAB': 'web',
  'Redwan': 'web',
  'NUB_PAGE': 'web',
  'MIM_Project': 'web',
  'Assignment_1_B13_Proggraming_Hero.': 'academic',
  'Assignment_2_B13_Proggraming_Hero.': 'academic',
  'Mahin_Buiseness': 'academic',
  'portfolio': 'web',
  'Portfolio_1': 'web'
};

function getDescription(repo) {
  return PROJECT_DESCRIPTIONS[repo.name] || repo.description || 'No description available.';
}

function getCategory(repo) {
  return PROJECT_CATEGORIES[repo.name] || 'other';
}

// Cache
let reposCache = null;
let readmeCache = {};

// â”€â”€ Static Fallback Data â”€â”€
// Embedded snapshot so the site works when API is rate-limited or opened from file://
const REPOS_FALLBACK = [
  { name: 'Portfolio_1', language: 'CSS', description: '', html_url: 'https://github.com/workmail1803-ai/Portfolio_1', homepage: '', created_at: '2026-05-24T00:00:00Z', updated_at: '2026-05-24T00:00:00Z', stargazers_count: 0, forks_count: 0, size: 50, fork: false },
  { name: 'active_dream_bot', language: 'Python', description: '', html_url: 'https://github.com/workmail1803-ai/active_dream_bot', homepage: '', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-05-20T00:00:00Z', stargazers_count: 0, forks_count: 0, size: 120, fork: false },
  { name: 'Flutter_Project', language: 'Dart', description: '', html_url: 'https://github.com/workmail1803-ai/Flutter_Project', homepage: '', created_at: '2025-06-01T00:00:00Z', updated_at: '2026-05-18T00:00:00Z', stargazers_count: 0, forks_count: 0, size: 200, fork: false },
  { name: 'ML_Project', language: 'Jupyter Notebook', description: '', html_url: 'https://github.com/workmail1803-ai/ML_Project', homepage: '', created_at: '2025-09-01T00:00:00Z', updated_at: '2026-05-15T00:00:00Z', stargazers_count: 0, forks_count: 0, size: 5000, fork: false },
  { name: 'Nextup', language: 'TypeScript', description: '', html_url: 'https://github.com/workmail1803-ai/Nextup', homepage: '', created_at: '2025-10-01T00:00:00Z', updated_at: '2026-05-14T00:00:00Z', stargazers_count: 0, forks_count: 0, size: 800, fork: false },
  { name: 'Fahim_Vai', language: 'TypeScript', description: '', html_url: 'https://github.com/workmail1803-ai/Fahim_Vai', homepage: '', created_at: '2025-11-01T00:00:00Z', updated_at: '2026-05-12T00:00:00Z', stargazers_count: 0, forks_count: 0, size: 300, fork: false },
  { name: 'Assignment_2_B13_Proggraming_Hero.', language: 'CSS', description: '', html_url: 'https://github.com/workmail1803-ai/Assignment_2_B13_Proggraming_Hero.', homepage: '', created_at: '2025-03-01T00:00:00Z', updated_at: '2026-05-10T00:00:00Z', stargazers_count: 0, forks_count: 0, size: 20, fork: false },
  { name: 'Mahin_Buiseness', language: 'HTML', description: 'A lecture slide For my student', html_url: 'https://github.com/workmail1803-ai/Mahin_Buiseness', homepage: '', created_at: '2025-08-01T00:00:00Z', updated_at: '2026-05-08T00:00:00Z', stargazers_count: 0, forks_count: 0, size: 150, fork: false },
  { name: 'Assignment_1_B13_Proggraming_Hero.', language: 'HTML', description: '', html_url: 'https://github.com/workmail1803-ai/Assignment_1_B13_Proggraming_Hero.', homepage: '', created_at: '2025-02-01T00:00:00Z', updated_at: '2026-05-06T00:00:00Z', stargazers_count: 0, forks_count: 0, size: 15, fork: false },
  { name: 'NUB_PAGE', language: 'TypeScript', description: '', html_url: 'https://github.com/workmail1803-ai/NUB_PAGE', homepage: '', created_at: '2025-12-01T00:00:00Z', updated_at: '2026-05-04T00:00:00Z', stargazers_count: 0, forks_count: 0, size: 400, fork: false },
  { name: 'Relief-Chain-', language: 'JavaScript', description: '', html_url: 'https://github.com/workmail1803-ai/Relief-Chain-', homepage: '', created_at: '2025-07-01T00:00:00Z', updated_at: '2026-04-28T00:00:00Z', stargazers_count: 0, forks_count: 0, size: 600, fork: false },
  { name: 'MIM_Project', language: 'HTML', description: '', html_url: 'https://github.com/workmail1803-ai/MIM_Project', homepage: '', created_at: '2025-05-01T00:00:00Z', updated_at: '2026-04-25T00:00:00Z', stargazers_count: 0, forks_count: 0, size: 180, fork: false },
  { name: 'ARAB', language: 'TypeScript', description: '', html_url: 'https://github.com/workmail1803-ai/ARAB', homepage: '', created_at: '2025-11-15T00:00:00Z', updated_at: '2026-04-20T00:00:00Z', stargazers_count: 0, forks_count: 0, size: 500, fork: false },
  { name: 'Redwan', language: 'TypeScript', description: '', html_url: 'https://github.com/workmail1803-ai/Redwan', homepage: '', created_at: '2025-10-15T00:00:00Z', updated_at: '2026-04-18T00:00:00Z', stargazers_count: 0, forks_count: 0, size: 350, fork: false },
  { name: 'Doctors_RX', language: 'TypeScript', description: '', html_url: 'https://github.com/workmail1803-ai/Doctors_RX', homepage: '', created_at: '2025-09-15T00:00:00Z', updated_at: '2026-04-15T00:00:00Z', stargazers_count: 0, forks_count: 0, size: 450, fork: false },
  { name: 'portfolio', language: 'HTML', description: '', html_url: 'https://github.com/workmail1803-ai/portfolio', homepage: '', created_at: '2025-01-01T00:00:00Z', updated_at: '2026-03-01T00:00:00Z', stargazers_count: 0, forks_count: 0, size: 30, fork: false },
  { name: 'prescription', language: 'JavaScript', description: '', html_url: 'https://github.com/workmail1803-ai/prescription', homepage: '', created_at: '2025-04-01T00:00:00Z', updated_at: '2026-02-15T00:00:00Z', stargazers_count: 0, forks_count: 0, size: 80, fork: false }
];

// â”€â”€ GitHub API â”€â”€
async function fetchRepos() {
  if (reposCache) return reposCache;
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`);
    if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);
    const repos = await res.json();
    reposCache = repos.filter(r => !r.fork);
    console.log(`âœ“ Loaded ${reposCache.length} repos from GitHub API`);
    return reposCache;
  } catch (err) {
    console.warn('GitHub API unavailable, using cached data:', err.message);
    reposCache = REPOS_FALLBACK;
    return reposCache;
  }
}

async function fetchReadme(repoName) {
  if (readmeCache[repoName]) return readmeCache[repoName];
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${repoName}/readme`, {
      headers: { 'Accept': 'application/vnd.github.v3.raw' }
    });
    if (!res.ok) return null;
    const text = await res.text();
    readmeCache[repoName] = text;
    return text;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// â”€â”€ Language Colors â”€â”€
const LANG_COLORS = {
  'JavaScript': '#f1e05a',
  'TypeScript': '#3178c6',
  'Python':     '#3572A5',
  'Dart':       '#00B4AB',
  'HTML':       '#e34c26',
  'CSS':        '#563d7c',
  'Java':       '#b07219',
  'C++':        '#f34b7d',
  'C#':         '#178600',
  'Kotlin':     '#A97BFF',
  'Swift':      '#F05138',
  'Ruby':       '#701516',
  'Go':         '#00ADD8',
  'Rust':       '#dea584',
  'PHP':        '#4F5D95',
  'Shell':      '#89e051',
  'Jupyter Notebook': '#DA5B0B',
  null:         '#8b8b8b',
};
function langColor(lang) {
  return LANG_COLORS[lang] || '#8b8b8b';
}

// â”€â”€ Router â”€â”€
const container = document.getElementById('pageContainer');

function getRoute() {
  const hash = window.location.hash || '#/home';
  const parts = hash.replace('#/', '').split('/');
  return { page: parts[0] || 'home', param: parts.slice(1).join('/') };
}

async function navigate() {
  const { page, param } = getRoute();

  // Update active nav
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === page);
  });

  // Close mobile menu
  document.getElementById('navLinks').classList.remove('active');
  document.getElementById('navToggle').classList.remove('active');

  // Render page
  window.scrollTo(0, 0);

  switch (page) {
    case 'home':
      await renderHome();
      break;
    case 'projects':
      await renderProjects();
      break;
    case 'project':
      await renderProjectDetail(param);
      break;
    case 'assistant':
      renderAssistant();
      break;
    case 'contact':
      renderContact();
      break;
    default:
      render404();
  }
}

// â”€â”€ Loading â”€â”€
function showLoading(message = 'Fetching data') {
  container.innerHTML = `
    <div class="loading-state page-enter">
      <div class="loading-dots"><span></span><span></span><span></span></div>
      <span class="loading-text">${message}</span>
    </div>
  `;
}

// â”€â”€ Format Date â”€â”€
function fmtDate(dateStr) {
  if (!dateStr) return 'â€”';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// â”€â”€ HOME PAGE â”€â”€
async function renderHome() {
  showLoading('Loading portfolio');
  const repos = await fetchRepos();
  const recent = repos.slice(0, 8);
  const totalStars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);
  const languages = [...new Set(repos.map(r => r.language).filter(Boolean))];

  container.innerHTML = `
    <div class="page-enter">
      <!-- Hero -->
      <div class="home-hero">
        <h1 class="hero-name">${OWNER_NAME}</h1>
        <div class="hero-rule"></div>
        <p class="hero-tagline">Full Stack Web Developer | AI-Powered Coder</p>
        <p class="hero-meta">BRAC University &bull; Dhaka, Bangladesh &bull; Est. 2024</p>
        <div class="hero-nav">
          <a href="#/projects" class="hero-btn hero-btn-primary">&#9744; View All Projects</a>
          <a href="#/contact" class="hero-btn hero-btn-outline">&#9993; Get In Touch</a>
          <a href="https://github.com/${GITHUB_USER}" target="_blank" class="hero-btn hero-btn-outline">&#9733; GitHub Profile</a>
        </div>
      </div>

      <!-- Stats -->
      <div class="section-label"><span>Overview</span></div>
      <div class="stats-bar">
        <div class="stat-item">
          <div class="stat-number">${repos.length}</div>
          <div class="stat-label">Repositories</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">${totalStars}</div>
          <div class="stat-label">Total Stars</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">${languages.length}</div>
          <div class="stat-label">Languages</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">&#10003;</div>
          <div class="stat-label">Open to Work</div>
        </div>
      </div>

      <!-- About -->
      <div class="section-label"><span>About</span></div>
      <div class="about-grid">
        <div class="about-card">
          <span class="about-card-label">Profile</span>
          <h3>Who I Am</h3>
          <p>Final semester student at BRAC University with a passion for building modern web applications. I specialize in AI-assisted development, ensuring every line of code is precisely debugged and optimized.</p>
        </div>
        <div class="about-card">
          <span class="about-card-label">Stack</span>
          <h3>Technologies</h3>
          <div class="tech-list">
            ${['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'Python', 'Flutter', 'Dart', 'Git', 'Firebase', 'MongoDB']
              .map(t => `<span class="tech-tag">${t}</span>`).join('')}
          </div>
        </div>
      </div>

      <!-- Recent Projects -->
      <div class="section-label"><span>Recent Projects</span></div>
      <div class="recent-projects">
        ${recent.map(r => `
          <a href="#/project/${r.name}" class="project-list-item">
            <span class="project-list-name">${formatRepoName(r.name)}</span>
            <span class="project-list-desc">${getDescription(r)}</span>
            <span class="project-list-arrow">&rarr;</span>
          </a>
        `).join('')}
      </div>

      ${repos.length > 8 ? `
        <div style="text-align:center;">
          <a href="#/projects" class="hero-btn hero-btn-primary">View All ${repos.length} Projects &rarr;</a>
        </div>
      ` : ''}
    </div>
  `;
}

// â”€â”€ PROJECTS PAGE â”€â”€
async function renderProjects() {
  showLoading('Fetching repositories');
  const repos = await fetchRepos();
  const languages = ['All', ...new Set(repos.map(r => r.language).filter(Boolean))];

  container.innerHTML = `
    <div class="page-enter">
      <div class="projects-header">
        <h1>Project Index</h1>
        <p>All public repositories fetched live from GitHub. Click any project to view its case study.</p>
      </div>

      <div class="projects-count">${repos.length} repositories found</div>

      <div class="filter-bar" id="filterBar">
        ${languages.map(l => `
          <button class="filter-tab ${l === 'All' ? 'active' : ''}" data-lang="${l}">${l}</button>
        `).join('')}
      </div>

      <div class="projects-grid" id="projectsGrid">
        ${repos.map((r, i) => renderProjectCard(r, i)).join('')}
      </div>
    </div>
  `;

  // Filter logic
  document.getElementById('filterBar').addEventListener('click', (e) => {
    if (!e.target.classList.contains('filter-tab')) return;
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    e.target.classList.add('active');
    const lang = e.target.dataset.lang;
    document.querySelectorAll('.project-card').forEach(card => {
      if (lang === 'All' || card.dataset.lang === lang) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
}

function renderProjectCard(repo, index) {
  return `
    <a href="#/project/${repo.name}" class="project-card" data-lang="${repo.language || ''}">
      <div class="project-index">${String(index + 1).padStart(2, '0')}</div>
      <div class="project-card-body">
        <h3>${formatRepoName(repo.name)}</h3>
        <p>${getDescription(repo)}</p>
        <div class="project-card-meta">
          ${repo.language ? `<span><span class="lang-dot" style="background:${langColor(repo.language)}"></span>${repo.language}</span>` : ''}
          ${repo.stargazers_count ? `<span>&#9733; ${repo.stargazers_count}</span>` : ''}
          <span>${fmtDate(repo.updated_at)}</span>
        </div>
      </div>
      <span class="project-card-arrow">&rarr;</span>
    </a>
  `;
}

// â”€â”€ PROJECT DETAIL PAGE â”€â”€
async function renderProjectDetail(repoName) {
  showLoading('Loading project');

  // Fetch repo info and README in parallel
  const [repos, readme] = await Promise.all([
    fetchRepos(),
    fetchReadme(repoName)
  ]);

  const repo = repos.find(r => r.name === repoName);
  if (!repo) { render404(); return; }

  // Render markdown
  let readmeHtml = '';
  if (readme) {
    readmeHtml = marked.parse(readme);
  }

  container.innerHTML = `
    <div class="page-enter">
      <a href="#/projects" class="detail-back">&larr; Back to Index</a>

      <div class="detail-header">
        <h1 class="detail-title">${formatRepoName(repo.name)}</h1>
        <p style="color:var(--ink-light);font-size:0.88rem;margin-bottom:16px;">${getDescription(repo)}</p>
        <div class="detail-meta-bar">
          ${repo.language ? `<span class="detail-meta-item"><strong>Language:</strong> ${repo.language}</span>` : ''}
          <span class="detail-meta-item"><strong>Created:</strong> ${fmtDate(repo.created_at)}</span>
          <span class="detail-meta-item"><strong>Updated:</strong> ${fmtDate(repo.updated_at)}</span>
          ${repo.stargazers_count ? `<span class="detail-meta-item"><strong>Stars:</strong> ${repo.stargazers_count}</span>` : ''}
          ${repo.forks_count ? `<span class="detail-meta-item"><strong>Forks:</strong> ${repo.forks_count}</span>` : ''}
          <span class="detail-meta-item"><strong>Size:</strong> ${(repo.size / 1024).toFixed(1)} MB</span>
        </div>
        <div class="detail-links">
          <a href="${repo.html_url}" target="_blank" class="detail-link">&#9733; View on GitHub</a>
          ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="detail-link">&#9741; Live Demo</a>` : ''}
        </div>
      </div>

      ${readmeHtml ? `
        <div class="detail-readme">
          ${readmeHtml}
        </div>
      ` : `
        <div class="detail-readme">
          <h2>About This Project</h2>
          <p>${getDescription(repo)}</p>
          <hr>
          <p><em>The full README.md could not be loaded at this time. This may be due to GitHub API rate limiting or the repository not having a README file. Visit the <a href="${repo.html_url}" target="_blank">GitHub repository</a> to view the full source code and documentation.</em></p>
        </div>
      `}
    </div>
  `;
}

// â”€â”€ CONTACT PAGE â”€â”€
function renderContact() {
  container.innerHTML = `
    <div class="page-enter">
      <div class="contact-header">
        <h1>Get In Touch</h1>
        <p>Have a project in mind? Let's bring your vision to life.</p>
      </div>

      <div class="contact-grid">
        <form class="contact-form" id="contactForm">
          <div class="form-group">
            <label class="form-label">Your Name</label>
            <input type="text" class="form-input" required>
          </div>
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" class="form-input" required>
          </div>
          <div class="form-group">
            <label class="form-label">Subject</label>
            <input type="text" class="form-input">
          </div>
          <div class="form-group">
            <label class="form-label">Message</label>
            <textarea class="form-textarea" required></textarea>
          </div>
          <button type="submit" class="form-submit" id="formSubmit">Send Message</button>
        </form>

        <div class="contact-info">
          <div class="info-item">
            <div class="info-item-label">Email</div>
            <div class="info-item-value">
              <a href="mailto:workmail1803.ai@gmail.com">workmail1803.ai@gmail.com</a>
            </div>
          </div>
          <div class="info-item">
            <div class="info-item-label">Phone / WhatsApp</div>
            <div class="info-item-value">
              <a href="https://wa.me/8801756003283" target="_blank">+880 1756-003283</a>
            </div>
          </div>
          <div class="info-item">
            <div class="info-item-label">Location</div>
            <div class="info-item-value">Dhaka, Bangladesh</div>
          </div>
          <div class="info-item">
            <div class="info-item-label">University</div>
            <div class="info-item-value">BRAC University | CSE</div>
          </div>
          <div class="info-item">
            <div class="info-item-label">GitHub</div>
            <div class="info-item-value">
              <a href="https://github.com/${GITHUB_USER}" target="_blank">github.com/${GITHUB_USER}</a>
            </div>
          </div>
          <div class="info-item">
            <div class="info-item-label">Connect</div>
            <div class="social-row">
              <a href="https://wa.me/8801756003283" target="_blank" class="social-btn" aria-label="WhatsApp">
                <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
              <a href="https://github.com/${GITHUB_USER}" target="_blank" class="social-btn" aria-label="GitHub">
                <svg viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="https://linkedin.com/in/nafis-hossain-momen" target="_blank" class="social-btn" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Form submit handler
  document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.getElementById('formSubmit');
    btn.textContent = 'SENDING...';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'âœ“ MESSAGE SENT';
      btn.style.background = '#2d6a2d';
      btn.style.borderColor = '#2d6a2d';
      setTimeout(() => {
        btn.textContent = 'SEND MESSAGE';
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.disabled = false;
        e.target.reset();
      }, 3000);
    }, 1500);
  });
}

// =====================================================
//  AI ASSISTANT
// =====================================================

const SYSTEM_PROMPT = `You are Nafis Hossain Momen (Nafis). You are communicating directly with potential clients and visitors on your developer portfolio. Speak in the first person ("I", "my", "we"). 

1. CORE IDENTITY & PROFESSIONAL PHILOSOPHY:
- I am an expert software developer, systems architect, and AI integration specialist.
- My primary objective is to act as a high-tier consultative technical partner for potential clients. I do not just write code; I solve business problems through scalable web applications, robust backends, and targeted AI models.
- I treat clients as partners. I am confident, deeply knowledgeable, and firmly grounded in reality. I never use sleazy sales tactics. My authority comes from my ability to listen, diagnose problems accurately, and propose technically sound, cost-effective solutions.

2. MY TECHNICAL ARSENAL & EXPERTISE DOMAINS:
- AI & LLM Integration: Google AI Studio, Gemini API, Groq API. I know how to manage API usage tiers, billing caps, and token optimization to save clients money.
- Deployment & Cloud Infrastructure: Vercel, Railway, PythonAnywhere.
- Database & Backend Architecture: Supabase, MongoDB Atlas.
- System-Level & Security Expertise: Deep understanding of system architectures (e.g., malware detection through system calls, running virtualized environments).
- Technical Documentation: Proficient in LaTeX for delivering high-end, compiled technical reports, architecture breakdowns, or academic-grade whitepapers when clients require rigorous documentation.
- Education: BRAC University (Final Semester), CSE Department, Dhaka, Bangladesh.
- Contact: workmail1803.ai@gmail.com | +880 1756-003283 (WhatsApp)
- GitHub Handle: workmail1803-ai (I construct repository URLs using this handle only when offering concrete proof of past work).

PROJECT PORTFOLIO (Use these as concrete evidence of past work in Phase 5):
1. Doctors_RX [TypeScript/React] → https://github.com/workmail1803-ai/Doctors_RX
   Rx Portal: Modern prescription management system for doctors. React + TypeScript + Vite + Supabase + Tailwind CSS. Features: patient dashboard, medicine autosuggest, mobile-friendly print studio with auto-scaling A4 layout.
2. active_dream_bot [Python] → https://github.com/workmail1803-ai/active_dream_bot
   Private Telegram bot for virtual phone numbers and automated OTP verification. Python 3.11+ with Telegram Bot API.
3. Relief-Chain- [JavaScript/React] → https://github.com/workmail1803-ai/Relief-Chain-
   Disaster relief coordination platform. React + Vite + Supabase. SQL schema for supply chain, medical, and community modules.
4. ARAB [TypeScript/Next.js] → https://github.com/workmail1803-ai/ARAB
   Logistics and delivery management system. Agent dashboard, rider tracking, WooCommerce integration.
5. Redwan [TypeScript/Next.js] → https://github.com/workmail1803-ai/Redwan
   Sweet Delights BD: Cake shop website for Bangladesh. Next.js 14, PWA, WhatsApp ordering, scroll animations.
6. Nextup [TypeScript/Next.js] → https://github.com/workmail1803-ai/Nextup
   Travel booking platform. Next.js, Supabase, multilingual FAQ, full SEO.
7. Flutter_Project [Dart] → https://github.com/workmail1803-ai/Flutter_Project
   Wondr NEUB: Flutter mobile app for university services. Cross-platform (Android + iOS).
8. ML_Project [Python/Jupyter] → https://github.com/workmail1803-ai/ML_Project
   Malware Analysis using Machine Learning. Classifying threat detection with CSV datasets and threshold analysis.
9. MIM_Project [Python/Django] → https://github.com/workmail1803-ai/MIM_Project
   Wond'r NEUB: Django-based study tour booking system. Full-stack Python web app.
10. NUB_PAGE [TypeScript/React] → https://github.com/workmail1803-ai/NUB_PAGE
    University web portal. React + TypeScript + Vite modern SPA.
11. prescription [JavaScript] → https://github.com/workmail1803-ai/prescription
    Doctor prescription tool with medicine database and print templates. Vanilla HTML/CSS/JS.
12. Fahim_Vai [TypeScript/Next.js] → https://github.com/workmail1803-ai/Fahim_Vai
    Professional business website. Clean modern single-page design.
13. Mahin_Buiseness [HTML/LaTeX] → https://github.com/workmail1803-ai/Mahin_Buiseness
    Business studies booklet and slide presentation using LaTeX.
14. Portfolio_1 [HTML/CSS/JS] → https://github.com/workmail1803-ai/Portfolio_1
    My vintage-themed wiki developer portfolio (this website).

3. THE CONSULTATIVE SALES FRAMEWORK (Interaction Rules):
Follow this exact conversational progression when dealing with a new lead:
- Phase 1: Natural Rapport (The Hook): Start like a human. If they say "Hi" or "Hello", reply with a warm, professional greeting. Never list your skills or drop links in the first message. Ask them what brings them in today or what vision they are trying to bring to life.
- Phase 2: Deep Discovery (The Diagnosis): Ask highly targeted questions. If they want an "AI app," ask: Who is the end user? What is the core bottleneck you are trying to solve? Are you handling sensitive data?
- Phase 3: The Reality Check (Value Building): Gently correct misconceptions. If they want something technically impossible or overly expensive, tell them directly. Suggest a leaner MVP (Minimum Viable Product) first.
- Phase 4: The Custom Pitch: Only after understanding their problem, explain how your specific stack solves it. Example: "Since you need real-time data syncing without massive server costs, I'd build this using Supabase for the backend and deploy the frontend on Vercel."
- Phase 5: Contextual Proof: Introduce your GitHub repositories only to back up a claim. Frame it as: "I actually built a similar architecture for handling [X]. You can see how I structured the database here: github.com/workmail1803-ai/..."

4. STRICT BEHAVIORAL BOUNDARIES:
- No Robotic Empathy: Avoid phrases like "I completely understand your needs!" or overuse of emojis (🚀, 🔥). Sound like a sharp developer having a coffee with a client.
- No Yes-Man Behavior: If a client proposes a bad technical architecture, push back professionally.
- Maintain Scope: Keep the conversation focused on software architecture, AI integration, and project development.
- Pricing: Do not quote exact flat rates immediately. Discuss scope first, and lean towards milestone-based or architecture-dependent pricing.

5. ADVANCED SCENARIO HANDLING:
- The "$50 budget" Client: Be polite but firm. Explain the actual cost of API integrations and secure backend hosting. Offer a drastically reduced scope or point them to existing SaaS tools.
- The Non-Technical Founder: Ditch the jargon. Don't talk about MongoDB clusters; talk about "a secure database that grows as you get more users without slowing down."
- The Highly Technical Client: Match their level. Dive deep into latency optimization, token limits with Groq, and system call monitoring.

6. RESPONSE FORMATTING:
- Use markdown for emphasis: **bold** for key terms, lists for points, and [links](url) for repos.`;

// â”€â”€ Chat State â”€â”€
let chatHistory = [];
let serverMode = null; // null = not checked, true = serverless available, false = fallback to client-side
let currentProvider = 'gemini';

function getApiKey() {
  try { return localStorage.getItem('portfolio_ai_key') || ''; }
  catch { return ''; }
}
function setApiKey(key) {
  try { localStorage.setItem('portfolio_ai_key', key); }
  catch {}
}

// â”€â”€ API Call: Server-side (Vercel) â”€â”€
async function callServerAPI(messages) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, systemPrompt: SYSTEM_PROMPT })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Server error ${res.status}`);
  }
  const data = await res.json();
  return data.reply;
}

// â”€â”€ API Call: Client-side (Direct Gemini) â”€â”€
async function callClientAPI(messages, apiKey) {
  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
      })
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error ${res.status}`);
  }
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
}

// ── Check if serverless endpoint is available ──
async function checkServerMode() {
  if (serverMode !== null) return serverMode;
  try {
    if (window.location.protocol === 'file:') {
      serverMode = false;
      return false;
    }
    // Simple GET health check — doesn't burn any AI API quota
    const res = await fetch('/api/chat', { method: 'GET' });
    serverMode = res.ok;
    return serverMode;
  } catch {
    serverMode = false;
    return false;
  }
}

// â”€â”€ Render Assistant Page â”€â”€
function renderAssistant() {
  const hasKey = !!getApiKey();

  container.innerHTML = `
    <div class="page-enter">
      <div class="chat-header">
        <h1>Chat with Nafis</h1>
        <p>Chat directly with me. Ask about my skills, experience, or describe your project requirements — I will help you find the right solution and share matching work I've done.</p>
      </div>

      <!-- API Key Section (only shows in fallback mode) -->
      <div id="apiSection"></div>

      <!-- Chat Window -->
      <div class="chat-window">
        <div class="chat-messages" id="chatMessages">
          ${chatHistory.length === 0 ? renderWelcome() : chatHistory.map(m => renderMessage(m.role, m.content)).join('')}
        </div>
        <div class="chat-input-bar">
          <input type="text" class="chat-input" id="chatInput" placeholder="Ask about my skills, projects, or tell me about your project needs...">
          <button class="chat-send" id="chatSend">Send</button>
        </div>
      </div>

      <!-- Suggestions -->
      <div class="chat-suggestions" id="chatSuggestions">
        <button class="chat-suggestion" data-q="What is your tech stack?">What is your tech stack?</button>
        <button class="chat-suggestion" data-q="I need an e-commerce website for my business. Can you help me?">Can you build an e-commerce site?</button>
        <button class="chat-suggestion" data-q="Have you built any cross-platform mobile apps?">Have you built mobile apps?</button>
        <button class="chat-suggestion" data-q="I need a custom Telegram bot. What is your experience with bots?">Can you build a Telegram bot?</button>
        <button class="chat-suggestion" data-q="Have you built a management dashboard with database integration?">I need a management dashboard</button>
        <button class="chat-suggestion" data-q="Do you have experience building healthcare or medical software?">Medical software experience?</button>
      </div>
    </div>
  `;

  // Check server mode and show fallback UI if needed
  initAssistant();
}

async function initAssistant() {
  const isServer = await checkServerMode();
  const apiSection = document.getElementById('apiSection');

  if (isServer) {
    // Server mode â€” no key needed, just show connected status
    apiSection.innerHTML = `
      <div class="api-status">
        <span class="api-status-dot connected"></span>
        <span>AI ASSISTANT â€” ONLINE &bull; Powered by Gemini</span>
      </div>
    `;
  } else {
    // Fallback mode â€” need API key
    const hasKey = !!getApiKey();
    if (hasKey) {
      const key = getApiKey();
      const masked = key.substring(0, 6) + 'â€¢'.repeat(12) + key.slice(-4);
      apiSection.innerHTML = `
        <div class="api-status">
          <span class="api-status-dot connected"></span>
          <span>Connected via your API key â€” ${masked}</span>
          <button class="api-status-change" id="apiChangeBtn">Change Key</button>
        </div>
      `;
      document.getElementById('apiChangeBtn')?.addEventListener('click', () => {
        try { localStorage.removeItem('portfolio_ai_key'); } catch {}
        renderAssistant();
      });
    } else {
      apiSection.innerHTML = `
        <div class="api-setup">
          <div class="api-setup-title">Connect Gemini API</div>
          <p>The AI server is not available. To use the assistant, enter your free Gemini API key. Your key is stored locally in your browser only.</p>
          <div class="api-setup-row">
            <input type="password" class="api-key-input" id="apiKeyInput" placeholder="Paste your Gemini API key here...">
            <button class="api-key-btn" id="apiKeyBtn">Connect</button>
          </div>
          <p class="api-setup-hint">Get free key â†’ <a href="https://aistudio.google.com/apikey" target="_blank">aistudio.google.com/apikey</a></p>
        </div>
      `;
      document.getElementById('apiKeyBtn')?.addEventListener('click', () => {
        const key = document.getElementById('apiKeyInput').value.trim();
        if (!key) return;
        setApiKey(key);
        renderAssistant();
      });
      document.getElementById('apiKeyInput')?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') document.getElementById('apiKeyBtn')?.click();
      });
      // Disable chat until key is provided
      document.getElementById('chatInput').disabled = true;
      document.getElementById('chatSend').disabled = true;
    }
  }

  bindChatEvents();
  scrollChat();
}

function renderWelcome() {
  return `
    <div class="chat-msg chat-msg-ai">
      <div class="chat-msg-label">Nafis Momen</div>
      <div class="chat-msg-bubble">
        <p><strong>Hello!</strong> I'm Nafis Hossain Momen. Welcome to my portfolio chat.</p>
        <p>I'm a Full Stack Web & Mobile Developer specializing in building high-quality, optimized web applications, cross-platform mobile apps, and backend automation tools.</p>
        <p>How can I help you today? Tell me about your project requirements or what you are looking to build, and I will share my relevant experience and works with you!</p>
      </div>
    </div>
  `;
}

function renderMessage(role, content) {
  if (role === 'user') {
    return `
      <div class="chat-msg chat-msg-user">
        <div class="chat-msg-label">You</div>
        <div class="chat-msg-bubble">${escapeHtml(content)}</div>
      </div>
    `;
  } else {
    return `
      <div class="chat-msg chat-msg-ai">
        <div class="chat-msg-label">Nafis Momen</div>
        <div class="chat-msg-bubble">${marked.parse(content)}</div>
      </div>
    `;
  }
}

function renderTyping() {
  return `
    <div class="chat-msg chat-msg-ai" id="typingIndicator">
      <div class="chat-msg-label">Nafis Momen</div>
      <div class="chat-typing"><span></span><span></span><span></span></div>
    </div>
  `;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function scrollChat() {
  const el = document.getElementById('chatMessages');
  if (el) el.scrollTop = el.scrollHeight;
}

// â”€â”€ Chat Events â”€â”€
function bindChatEvents() {
  const sendMsg = () => {
    const input = document.getElementById('chatInput');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    sendChatMessage(text);
  };

  document.getElementById('chatSend')?.addEventListener('click', sendMsg);
  document.getElementById('chatInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); }
  });

  // Suggestions
  document.getElementById('chatSuggestions')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.chat-suggestion');
    if (!btn) return;
    const input = document.getElementById('chatInput');
    if (input?.disabled) return;
    sendChatMessage(btn.dataset.q);
  });
}

// â”€â”€ Send & Receive â”€â”€
async function sendChatMessage(text) {
  // Add user message
  chatHistory.push({ role: 'user', content: text });
  const messagesEl = document.getElementById('chatMessages');
  messagesEl.innerHTML = chatHistory.map(m => renderMessage(m.role, m.content)).join('');
  messagesEl.innerHTML += renderTyping();
  scrollChat();

  // Disable input while waiting
  const sendBtn = document.getElementById('chatSend');
  const inputEl = document.getElementById('chatInput');
  if (sendBtn) sendBtn.disabled = true;
  if (inputEl) inputEl.disabled = true;

  try {
    let reply;
    if (serverMode) {
      // Use Vercel serverless function
      reply = await callServerAPI(chatHistory);
    } else {
      // Use client-side API key
      const apiKey = getApiKey();
      if (!apiKey) throw new Error('No API key configured');
      reply = await callClientAPI(chatHistory, apiKey);
    }
    chatHistory.push({ role: 'assistant', content: reply });
  } catch (err) {
    chatHistory.push({
      role: 'assistant',
      content: `**Error:** ${err.message}\n\nPlease try again or contact Nafis directly at workmail1803.ai@gmail.com`
    });
  }

  // Render all messages
  messagesEl.innerHTML = chatHistory.map(m => renderMessage(m.role, m.content)).join('');
  scrollChat();

  if (sendBtn) sendBtn.disabled = false;
  if (inputEl) { inputEl.disabled = false; inputEl.focus(); }
}


// ── 404 ──
function render404() {
  container.innerHTML = `
    <div class="error-page page-enter">
      <div class="error-code">404</div>
      <p class="error-msg">The page you're looking for doesn't exist.</p>
      <a href="#/home" class="hero-btn hero-btn-primary">&larr; Return Home</a>
    </div>
  `;
}

// â”€â”€ Helpers â”€â”€
function formatRepoName(name) {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

// â”€â”€ Mobile Nav Toggle â”€â”€
document.getElementById('navToggle').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('active');
  document.getElementById('navToggle').classList.toggle('active');
});

// â”€â”€ Initialize â”€â”€
window.addEventListener('hashchange', navigate);
window.addEventListener('DOMContentLoaded', () => {
  if (!window.location.hash) window.location.hash = '#/home';
  navigate();
});
