// ========================
// ES6 PORTFOLIO SCRIPT
// ========================

/**
 * Portfolio Application
 * Main controller for portfolio functionality
 */
class Portfolio {
  constructor() {
    this.initializeElements();
    this.setupEventListeners();
    this.initializeScrollAnimations();
  }

  /**
   * Initialize DOM elements
   */
  initializeElements() {
    this.menuToggle = document.getElementById('menuToggle');
    this.navMenu = document.getElementById('navMenu');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.contactForm = document.getElementById('contactForm');
    this.projectsContainer = document.getElementById('projectsContainer');
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Mobile menu toggle
    this.menuToggle?.addEventListener('click', () => this.toggleMobileMenu());

    // Close menu when nav link is clicked
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });

    // Contact form submission
    this.contactForm?.addEventListener('submit', (e) => this.handleFormSubmit(e));

    // Fetch and load projects
    this.loadProjects();
  }

  /**
   * Toggle mobile menu
   */
  toggleMobileMenu() {
    this.navMenu?.classList.toggle('active');
    this.animateMenuToggle();
  }

  /**
   * Close mobile menu
   */
  closeMenu() {
    this.navMenu?.classList.remove('active');
    this.resetMenuToggle();
  }

  /**
   * Animate menu toggle button
   */
  animateMenuToggle() {
    const spans = this.menuToggle?.querySelectorAll('span');
    if (this.navMenu?.classList.contains('active')) {
      spans?.[0]?.style.setProperty('transform', 'rotate(45deg) translateY(15px)');
      spans?.[1]?.style.setProperty('opacity', '0');
      spans?.[2]?.style.setProperty('transform', 'rotate(-45deg) translateY(-15px)');
    } else {
      this.resetMenuToggle();
    }
  }

  /**
   * Reset menu toggle to original state
   */
  resetMenuToggle() {
    const spans = this.menuToggle?.querySelectorAll('span');
    spans?.forEach(span => {
      span.style.setProperty('transform', 'none');
      span.style.setProperty('opacity', '1');
    });
  }

  /**
   * Handle contact form submission
   */
  handleFormSubmit(event) {
    event.preventDefault();

    const formData = new FormData(this.contactForm);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
      timestamp: new Date().toISOString()
    };

    // Validate form data
    if (!this.validateFormData(data)) {
      console.warn('Form validation failed');
      return;
    }

    // Show success message
    this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');

    // Reset form
    this.contactForm.reset();

    // Optional: Send to backend
    this.sendFormData(data);
  }

  /**
   * Validate form data
   */
  validateFormData(data) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!data.name.trim()) {
      this.showNotification('Please enter your name', 'error');
      return false;
    }

    if (!emailRegex.test(data.email)) {
      this.showNotification('Please enter a valid email', 'error');
      return false;
    }

    if (!data.message.trim()) {
      this.showNotification('Please enter a message', 'error');
      return false;
    }

    return true;
  }

  /**
   * Send form data to backend
   */
  async sendFormData(data) {
    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('Form data sent successfully');
    } catch (error) {
      console.error('Error sending form data:', error);
    }
  }

  /**
   * Load projects from backend API
   */
  async loadProjects() {
    try {
      const response = await fetch('http://localhost:5000/api/projects');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const projects = await response.json();
      this.renderProjects(projects);
    } catch (error) {
      console.error('Error loading projects:', error);
      // Projects will display default static content
    }
  }

  /**
   * Render projects to DOM
   */
  renderProjects(projects) {
    if (!projects.length) return;

    this.projectsContainer.innerHTML = '';

    projects.forEach((project, index) => {
      const projectCard = this.createProjectCard(project, index);
      this.projectsContainer.appendChild(projectCard);
    });
  }

  /**
   * Create project card element
   */
  createProjectCard(project, index) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.style.animationDelay = `${index * 0.1}s`;

    const techTags = Array.isArray(project.tech)
      ? project.tech.map(tech => `<span class="tag">${tech}</span>`).join('')
      : `<span class="tag">${project.tech}</span>`;

    card.innerHTML = `
      <div class="project-image">
        <i class="fas fa-${this.getProjectIcon(project.title)}"></i>
      </div>
      <div class="project-content">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="project-tags">
          ${techTags}
        </div>
        <a href="${project.link || '#'}" class="project-link" target="_blank">
          View Project <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    `;

    return card;
  }

  /**
   * Get icon based on project title
   */
  getProjectIcon(title) {
    const iconMap = {
      weather: 'cloud',
      todo: 'tasks',
      portfolio: 'laptop',
      app: 'mobile',
      chat: 'comments',
      shop: 'shopping-bag'
    };

    for (const [key, icon] of Object.entries(iconMap)) {
      if (title.toLowerCase().includes(key)) {
        return icon;
      }
    }

    return 'project-diagram';
  }

  /**
   * Show notification message
   */
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 25px;
      background: ${type === 'success' ? '#10b981' : '#ef4444'};
      color: white;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
      font-weight: 500;
    `;

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  /**
   * Initialize scroll animations
   */
  initializeScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all cards and sections
    document.querySelectorAll('.project-card, .skill-category, .stat').forEach(el => {
      el.style.opacity = '0';
      observer.observe(el);
    });
  }
}

// ========================
// UTILITY FUNCTIONS
// ========================

/**
 * Smooth scroll to section
 */
const smoothScroll = (target) => {
  const element = document.querySelector(target);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

/**
 * Add keyframe animations
 */
const addAnimationStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100px);
        opacity: 0;
      }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);
};

// ========================
// INITIALIZATION
// ========================

document.addEventListener('DOMContentLoaded', () => {
  // Add animation styles
  addAnimationStyles();

  // Initialize Portfolio
  const portfolio = new Portfolio();

  // Log initialization
  console.log('✓ Portfolio initialized successfully');
});

// ========================
// PERFORMANCE & OPTIMIZATION
// ========================

/**
 * Lazy load images
 */
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}