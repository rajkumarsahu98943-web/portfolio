+class Portfolio {
  constructor() {
    this.initializeElements();
    this.setupEventListeners();
  }

  initializeElements() {
    this.menu = document.getElementById('menu');
    this.navMenu = document.getElementById('navMenu');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.contactForm = document.getElementById('contactForm');
  }

  setupEventListeners() {
    this.menu.addEventListener('click', () => this.toggleMobileMenu());

    this.navLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });

    this.contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
  }

  toggleMobileMenu() {
    this.navMenu.classList.toggle('active');
    this.animateMenuToggle();
  }

  closeMenu() {
    this.navMenu.classList.remove('active');
    this.resetMenuToggle();
  }

  animateMenuToggle() {
    const spans = this.menu.querySelectorAll('span');

    if (this.navMenu.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translateY(15px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translateY(-15px)';
    } else {
      this.resetMenuToggle();
    }
  }

  resetMenuToggle() {
    const spans = this.menu.querySelectorAll('span');

    spans.forEach(span => {
      span.style.transform = 'none';
      span.style.opacity = '1';
    });
  }

  handleFormSubmit(e) {
    e.preventDefault();

    const formData = {
      name: this.contactForm.name.value,
      email: this.contactForm.email.value,
      message: this.contactForm.message.value
    };

    if (!this.validateFormData(formData)) {
      return;
    }

    this.showNotification('Message sent successfully!', 'success');
    this.contactForm.reset();
  }

  validateFormData(data) {
    const check = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!data.name.trim()) {
      this.showNotification('Please enter your name', 'error');
      return false;
    }

    if (!check.test(data.email)) {
      this.showNotification('Please enter a valid email', 'error');
      return false;
    }

    if (!data.message.trim()) {
      this.showNotification('Please enter a message', 'error');
      return false;
    }

    return true;
  }

  showNotification(message, type) {
    alert(message);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Portfolio();
});