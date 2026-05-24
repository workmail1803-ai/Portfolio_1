/* =====================================================
   VINTAGE WIKI PORTFOLIO — JavaScript
   Router, GitHub API, Markdown Rendering
   ===================================================== */

const GITHUB_USER = 'workmail1803-ai';
const OWNER_NAME  = 'Nafis Hossain Momen';

// Cache
let reposCache = null;
let readmeCache = {};

// ── GitHub API ──
async function fetchRepos() {
  if (reposCache) return reposCache;
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`);
    if (!res.ok) throw new Error('Failed to fetch repos');
    const repos = await res.json();
    reposCache = repos.filter(r => !r.fork);
    return reposCache;
  } catch (err) {
    console.error(err);
    return [];
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

// ── Language Colors ──
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

// ── Router ──
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
    case 'contact':
      renderContact();
      break;
    default:
      render404();
  }
}

// ── Loading ──
function showLoading(message = 'Fetching data') {
  container.innerHTML = `
    <div class="loading-state page-enter">
      <div class="loading-dots"><span></span><span></span><span></span></div>
      <span class="loading-text">${message}</span>
    </div>
  `;
}

// ── Format Date ──
function fmtDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// ── HOME PAGE ──
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
            <span class="project-list-desc">${r.description || 'No description'}</span>
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

// ── PROJECTS PAGE ──
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
        <p>${repo.description || 'No description available.'}</p>
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

// ── PROJECT DETAIL PAGE ──
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
        ${repo.description ? `<p style="color:var(--ink-light);font-size:0.88rem;margin-bottom:16px;">${repo.description}</p>` : ''}
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
        <div class="no-readme">
          <div class="no-readme-icon">&#128196;</div>
          <p>No README.md found for this repository.</p>
        </div>
      `}
    </div>
  `;
}

// ── CONTACT PAGE ──
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
      btn.textContent = '✓ MESSAGE SENT';
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

// ── Helpers ──
function formatRepoName(name) {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

// ── Mobile Nav Toggle ──
document.getElementById('navToggle').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('active');
  document.getElementById('navToggle').classList.toggle('active');
});

// ── Initialize ──
window.addEventListener('hashchange', navigate);
window.addEventListener('DOMContentLoaded', () => {
  if (!window.location.hash) window.location.hash = '#/home';
  navigate();
});
