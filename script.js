// Dark Theme Toggle
const body = document.body;
const themeButton = document.getElementById('theme-toggle');

// Wait for DOM to be ready before adding event listeners
function initializeTheme() {
  if (!themeButton) return;
  
  themeButton.addEventListener('click', () => {
    body.classList.toggle('dark');
    localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
  });

  // Load saved theme preference
  if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark');
  }
}

// Call on DOM ready or immediately if already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeTheme);
} else {
  initializeTheme();
}

// Wallpaper Toggle
const wallpaperButton = document.getElementById('wallpaper-toggle');

const wallpapers = [
  "images/wallpaper1.jpg",
  "images/wallpaper2.jpg",
  "images/wallpaper5.jpg",
  "images/wallpaper6.jpg",
];

let currentWallpaperIndex = localStorage.getItem('wallpaperIndex') ? 
  parseInt(localStorage.getItem('wallpaperIndex')) : 0;

// Set initial wallpaper
if (wallpapers[currentWallpaperIndex]) {
  body.style.backgroundImage = `url('${wallpapers[currentWallpaperIndex]}')`;
  body.style.backgroundSize = "cover";
  body.style.backgroundPosition = "center";
  body.style.backgroundAttachment = "fixed";
}

if (wallpaperButton) {
  wallpaperButton.addEventListener('click', () => {
    currentWallpaperIndex = (currentWallpaperIndex + 1) % wallpapers.length;
    body.style.backgroundImage = `url('${wallpapers[currentWallpaperIndex]}')`;
    localStorage.setItem('wallpaperIndex', currentWallpaperIndex);
  });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe all project cards and sections
document.querySelectorAll('.section, .project-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

/* Certificates Gallery Loader */
function loadCertificatesGallery() {
  const folderName = "to be arranged";
  const manifestPath = encodeURI(`${folderName}/manifest.json`);
  const gallery = document.getElementById('certificates-gallery');
  const message = document.getElementById('certificates-message');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const tabBtns = document.querySelectorAll('.cert-tab-btn');

  if (!gallery || !message || !lightbox) return;

  let allCerts = [];

  fetch(manifestPath)
    .then(res => {
      if (!res.ok) throw new Error('Manifest not found');
      return res.json();
    })
    .then(data => {
      const items = data.certificates || [];
      if (items.length === 0) {
        message.textContent = 'No certificates listed in manifest.json yet.';
        return;
      }

      // Store all certificates
      allCerts = items.map(item => {
        let category = 'general';
        const issuer = (item.issuer || '').toLowerCase();
        const title = (item.title || '').toLowerCase();
        
        if (issuer.includes('coursera')) {
          category = 'coursera';
        } else if (issuer.includes('codechum')) {
          category = 'codechum';
        } else if (issuer.includes('aws')) {
          category = 'aws';
        } else if (title.includes('coursera')) {
          category = 'coursera';
        } else if (title.includes('codechum')) {
          category = 'codechum';
        } else if (title.includes('aws')) {
          category = 'aws';
        }

        return {
          ...item,
          category: category,
          fileSrc: `${folderName}/${item.file}`,
          isPDF: item.file.toLowerCase().endsWith('.pdf')
        };
      });

      message.style.display = 'none';

      // Render initial certificates (all)
      renderCerts('all');

      // Add tab click handlers
      tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          // Remove active class from all tabs
          tabBtns.forEach(b => b.classList.remove('active'));
          // Add active class to clicked tab
          btn.classList.add('active');
          // Render certificates for selected category
          const category = btn.getAttribute('data-tab');
          renderCerts(category);
        });
      });
    })
    .catch(() => {
      message.textContent = "No manifest found. Add 'manifest.json' inside the 'to be arranged' folder.";
    });

  function renderCerts(category) {
    // Clear gallery
    gallery.innerHTML = '';

    // Filter certificates
    const certs = category === 'all' ? allCerts : allCerts.filter(c => c.category === category);

    if (certs.length === 0) {
      gallery.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999;">No certificates in this category</p>';
      return;
    }

    certs.forEach(item => {
      const card = document.createElement('div');
      card.className = 'gallery-item';
      
      if (item.isPDF) {
        card.innerHTML = `
          <div class="pdf-icon">📄</div>
          <div class="gallery-meta">
            <strong>${item.title || ''}</strong>
            <div class="meta-sub">${item.issuer || ''}</div>
          </div>
        `;
      } else {
        card.innerHTML = `
          <img src="${encodeURI(item.fileSrc)}" alt="${item.title || ''}" />
          <div class="gallery-meta">
            <strong>${item.title || ''}</strong>
            <div class="meta-sub">${item.issuer || ''}</div>
          </div>
        `;
      }

      card.addEventListener('click', () => {
        if (item.isPDF) {
          window.open(encodeURI(item.fileSrc), '_blank');
        } else {
          lightboxImg.src = encodeURI(item.fileSrc);
          lightboxCaption.textContent = `${item.title || ''} — ${item.issuer || ''}`;
          lightbox.style.display = 'block';
          lightbox.setAttribute('aria-hidden', 'false');
        }
      });

      gallery.appendChild(card);
    });
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightbox.style.display = 'none';
      lightbox.setAttribute('aria-hidden', 'true');
      if (lightboxImg) lightboxImg.src = '';
    });
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox && lightboxClose) {
      lightboxClose.click();
    }
  });
}

// Call function when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadCertificatesGallery);
} else {
  loadCertificatesGallery();
}

/* GitHub Repositories Loader */
function loadGitHubRepos() {
  const githubUsername = 'MTFrontera';
  const container = document.getElementById('repos-container');
  const message = document.getElementById('repos-message');
  
  if (!container) {
    console.log('repos-container not found');
    return;
  }

  // Load from local repos.json file directly
  fetch('repos.json')
    .then(res => {
      if (!res.ok) throw new Error('repos.json not found');
      return res.json();
    })
    .then(data => {
      console.log('Repos loaded:', data.length);
      const repos = Array.isArray(data) ? data : (data.repos || []);
      renderRepos(repos);
    })
    .catch(err => {
      console.error('Error loading repos.json:', err);
      message.innerHTML = `Unable to load repositories. Visit your <a href="https://github.com/${githubUsername}" target="_blank">GitHub profile</a> directly.`;
    });

  function renderRepos(repos) {
    if (!repos || repos.length === 0) {
      message.textContent = 'No repositories found.';
      return;
    }
    
    message.remove();
    
    repos.forEach(repo => {
      const repoCard = document.createElement('div');
      repoCard.className = 'repo-card';
      
      const lang = repo.language || 'N/A';
      const stars = repo.stargazers_count || 0;
      const desc = repo.description || 'No description';
      const url = repo.html_url || repo.url;

      repoCard.innerHTML = `
        <div class="repo-header">
          <h3><a href="${url}" target="_blank" rel="noopener">${repo.name}</a></h3>
          <span class="repo-lang">${lang}</span>
        </div>
        <p class="repo-desc">${desc || 'No description'}</p>
        <div class="repo-meta">
          <span class="repo-stars">⭐ ${stars} stars</span>
          <a href="${url}" target="_blank" rel="noopener" class="repo-link">View on GitHub →</a>
        </div>
      `;
      
      container.appendChild(repoCard);
    });
  }
}

// Call on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadGitHubRepos);
} else {
  setTimeout(loadGitHubRepos, 100);
}