// js/script.js - Fixed Version with Web3Forms
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing scripts');
    initNavigation();
    initScrollEffects();
    initContactForm();
    initCounterAnimation();
    setCurrentYear();
});

// Navigation and Hamburger Menu
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (!hamburger || !navMenu) return;
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target) || hamburger.contains(event.target);
        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
    
    initNavbarScroll();
}

function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = 'var(--white)';
            navbar.style.backdropFilter = 'none';
        }
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Scroll animations
function initScrollEffects() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const fadeInOnScroll = function() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    };
    
    fadeInOnScroll();
    window.addEventListener('scroll', fadeInOnScroll);
    initSmoothScrolling();
}

function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Contact Form Handling - FIXED VERSION
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) {
        console.log('Contact form not found');
        return;
    }
    
    console.log('Contact form found, setting up event listener');
    contactForm.addEventListener('submit', handleFormSubmit);
    setupRealTimeValidation();
}

async function handleFormSubmit(e) {
    e.preventDefault();
    console.log('Form submitted');
    
    resetFormValidation();
    
    // Validate form
    if (!validateForm()) {
        console.log('Form validation failed');
        return;
    }
    
    console.log('Form validation passed');
    showLoadingState(true);
    
    try {
        const formData = new FormData(this);
        
        // Web3Forms required parameters
        formData.append('access_key', 'b121f601-248b-46db-a43a-fa6fd87281f6');
        formData.append('subject', 'New Contact Form Submission - Nexa Clear Analytics');
        formData.append('from_name', 'Nexa Clear Analytics Website');
        
        console.log('Sending data to Web3Forms...');
        
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        console.log('Web3Forms response:', data);
        
        if (data.success) {
            showFormMessage('✅ Thank you! Your message has been sent successfully. We will get back to you soon.', 'success');
            resetFormAfterSuccess();
        } else {
            showFormMessage('❌ Error: ' + (data.message || 'Failed to send message. Please try again.'), 'error');
        }
        
    } catch (error) {
        console.error('Network error:', error);
        showFormMessage('❌ Network error. Please check your internet connection and try again.', 'error');
    } finally {
        showLoadingState(false);
    }
}

function validateForm() {
    let isValid = true;
    
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const service = document.getElementById('service');
    const message = document.getElementById('message');
    
    // Name validation
    if (!name.value.trim()) {
        showError('name', 'Full name is required');
        isValid = false;
    } else if (name.value.trim().length < 2) {
        showError('name', 'Name must be at least 2 characters long');
        isValid = false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        showError('email', 'Email address is required');
        isValid = false;
    } else if (!emailRegex.test(email.value)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Service validation
    if (!service.value) {
        showError('service', 'Please select a service');
        isValid = false;
    }
    
    // Message validation
    if (!message.value.trim()) {
        showError('message', 'Message is required');
        isValid = false;
    } else if (message.value.trim().length < 10) {
        showError('message', 'Message must be at least 10 characters long');
        isValid = false;
    }
    
    return isValid;
}

function setupRealTimeValidation() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    const fieldsToValidate = ['name', 'email', 'service', 'message'];
    
    fieldsToValidate.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('blur', () => validateField(fieldId));
            field.addEventListener('input', () => clearFieldError(fieldId));
        }
    });
}

function validateField(fieldId) {
    const field = document.getElementById(fieldId);
    const value = field.value.trim();
    
    switch (fieldId) {
        case 'name':
            if (!value) {
                showError(fieldId, 'Full name is required');
            } else if (value.length < 2) {
                showError(fieldId, 'Name must be at least 2 characters long');
            } else {
                showSuccess(fieldId);
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) {
                showError(fieldId, 'Email address is required');
            } else if (!emailRegex.test(value)) {
                showError(fieldId, 'Please enter a valid email address');
            } else {
                showSuccess(fieldId);
            }
            break;
            
        case 'service':
            if (!value) {
                showError(fieldId, 'Please select a service');
            } else {
                showSuccess(fieldId);
            }
            break;
            
        case 'message':
            if (!value) {
                showError(fieldId, 'Message is required');
            } else if (value.length < 10) {
                showError(fieldId, 'Message must be at least 10 characters long');
            } else {
                showSuccess(fieldId);
            }
            break;
    }
}

function showError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + '-error');
    const formGroup = document.getElementById(fieldId)?.closest('.form-group');
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    if (formGroup) {
        formGroup.classList.add('error');
        formGroup.classList.remove('success');
    }
}

function showSuccess(fieldId) {
    const errorElement = document.getElementById(fieldId + '-error');
    const formGroup = document.getElementById(fieldId)?.closest('.form-group');
    
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
    
    if (formGroup) {
        formGroup.classList.remove('error');
        formGroup.classList.add('success');
    }
}

function clearFieldError(fieldId) {
    const errorElement = document.getElementById(fieldId + '-error');
    if (errorElement && errorElement.textContent) {
        showSuccess(fieldId);
    }
}

function resetFormValidation() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
        el.style.display = 'none';
    });
    
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error', 'success');
    });
    
    const formMessage = document.getElementById('form-message');
    if (formMessage) {
        formMessage.style.display = 'none';
    }
}

function resetFormAfterSuccess() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.reset();
    }
    resetFormValidation();
}

function showFormMessage(message, type) {
    const formMessage = document.getElementById('form-message');
    if (!formMessage) return;
    
    formMessage.textContent = message;
    formMessage.className = type;
    formMessage.style.display = 'block';
    
    // Auto-hide after 5 seconds (only for success messages)
    if (type === 'success') {
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
}

function showLoadingState(show) {
    const submitBtn = document.querySelector('#contact-form button[type="submit"]');
    if (!submitBtn) return;
    
    const originalText = submitBtn.innerHTML;
    
    if (show) {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
    } else {
        submitBtn.innerHTML = 'Send Message';
        submitBtn.disabled = false;
    }
}

// Counter Animation
function initCounterAnimation() {
    const statsSection = document.querySelector('.stats-section');
    if (!statsSection) return;
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    } else {
        let animated = false;
        
        function checkScroll() {
            if (!animated) {
                const sectionTop = statsSection.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (sectionTop < windowHeight - 100) {
                    animateCounter();
                    animated = true;
                }
            }
        }
        
        window.addEventListener('scroll', checkScroll);
        checkScroll();
    }
}

function animateCounter() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;
    
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-count');
        const count = +counter.innerText.replace(/[^0-9]/g, '') || 0;
        
        const updateCount = () => {
            const inc = target > 1000 ? 50 : target > 100 ? 10 : 1;
            const current = +counter.innerText.replace(/[^0-9]/g, '');
            
            if (current < target) {
                counter.innerText = Math.min(current + inc, target).toLocaleString();
                setTimeout(updateCount, speed / inc);
            }
        };
        
        updateCount();
    });
}

// Utility Functions
function setCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}
formData.append('access_key', 'b121f601-248b-46db-a43a-fa6fd87281f6');
formData.append('redirect', 'https://nexaclearanalytics.github.io/thank-you.html');
if (data.success) {
  showFormMessage('✅ Thank you! Your message has been sent successfully. We will get back to you soon.', 'success');
  resetFormAfterSuccess();
  // Redirect after 2 seconds
  setTimeout(() => {
    window.location.href = 'https://nexaclearanalytics.github.io/thank-you.html';
  }, 2000);
}
async function handleFormSubmit(e) {
  e.preventDefault();
  console.log('Form submitted');

  resetFormValidation();

  if (!validateForm()) {
    console.log('Form validation failed');
    return;
  }

  console.log('Form validation passed');
  showLoadingState(true);

  try {
    const formData = new FormData(this);

    // Web3Forms required parameters
    formData.append('access_key', 'YOUR_VALID_ACCESS_KEY'); // put real key
    formData.append('subject', 'New Contact Form Submission - Nexa Clear Analytics');
    formData.append('from_name', 'Nexa Clear Analytics Website');
    // Web3Forms redirect parameter
    formData.append('redirect', 'https://nexaclearanalytics.github.io/thank-you.html');

    console.log('Sending data to Web3Forms...');

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    console.log('Web3Forms response:', data);

    if (data.success) {
      // Either let Web3Forms redirect automatically or do it manually:
      // window.location.href = 'https://nexaclearanalytics.github.io/thank-you.html';
      showFormMessage('✅ Thank you! Your message has been sent successfully. Redirecting...', 'success');
      resetFormAfterSuccess();
      setTimeout(() => {
        window.location.href = 'https://nexaclearanalytics.github.io/thank-you.html';
      }, 2000);
    } else {
      showFormMessage('❌ Error: ' + (data.message || 'Failed to send message. Please try again.'), 'error');
    }
  } catch (error) {
    console.error('Network error:', error);
    showFormMessage('❌ Network error. Please check your internet connection and try again.', 'error');
  } finally {
    showLoadingState(false);
  }
}
// Final working solution with instant highlight
document.addEventListener('DOMContentLoaded', function() {
    // All Get Started buttons
    const buttons = document.querySelectorAll('a[href*="contact"], #consultation-get-started, #cta-get-started');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (window.location.pathname.includes('contact.html')) {
                e.preventDefault();
                highlightContactForm();
            }
        });
    });
    
    function highlightContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;
        
        // Instant highlight
        form.style.cssText = `
            transition: all 0.5s ease;
            box-shadow: 0 0 25px rgba(0, 153, 117, 0.6) !important;
            border: 3px solid #009975 !important;
            background: #f8fff8 !important;
            transform: scale(1.01);
        `;
        
        // Smooth scroll
        form.scrollIntoView({behavior: 'smooth', block: 'start'});
        
        // Focus and highlight first input
        setTimeout(() => {
            const nameInput = document.getElementById('name');
            if (nameInput) {
                nameInput.focus();
                nameInput.style.cssText = `
                    background: #f0fff0 !important;
                    border-color: #009975 !important;
                    transition: all 0.3s ease;
                `;
            }
        }, 600);
        
        // Remove highlights
        setTimeout(() => {
            form.style.cssText = '';
            const nameInput = document.getElementById('name');
            if (nameInput) nameInput.style.cssText = '';
        }, 4000);
    }
});
// js/script.js - Formspree Version
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing scripts');
    initNavigation();
    initScrollEffects();
    initContactForm();
    initCounterAnimation();
    setCurrentYear();
});

// Navigation and Hamburger Menu
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (!hamburger || !navMenu) return;
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target) || hamburger.contains(event.target);
        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
    
    // Navbar scroll effect
    initNavbarScroll();
}

function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add background when scrolled
        if (scrollTop > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = 'var(--white)';
            navbar.style.backdropFilter = 'none';
        }
        
        // Hide/show navbar on scroll
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Scroll animations
function initScrollEffects() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const fadeInOnScroll = function() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    };
    
    fadeInOnScroll();
    window.addEventListener('scroll', fadeInOnScroll);
    
    // Smooth scrolling for anchor links
    initSmoothScrolling();
}

function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Contact Form Handling for Formspree
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) {
        console.log('Contact form not found');
        return;
    }
    
    console.log('Formspree form detected');
    contactForm.addEventListener('submit', handleFormspreeSubmit);
    setupRealTimeValidation();
}

// Formspree-specific submission handler
async function handleFormspreeSubmit(e) {
    e.preventDefault();
    console.log('Formspree submission started');
    
    resetFormValidation();
    
    // Validate form before submission
    if (!validateForm()) {
        console.log('Form validation failed');
        return;
    }
    
    console.log('Form validation passed');
    showLoadingState(true);
    
    try {
        const formData = new FormData(this);
        
        // Formspree API endpoint from your form action
        const formspreeEndpoint = 'https://formspree.io/f/xovkjwlj';
        
        console.log('Submitting to Formspree...');
        
        const response = await fetch(formspreeEndpoint, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            // Formspree success - they will handle redirect
            showFormMessage('✅ Thank you! Your message has been sent successfully. Redirecting...', 'success');
            console.log('Formspree submission successful');
            
            // Formspree will handle redirect via _next parameter
            // Optional: Manual redirect after delay
            setTimeout(() => {
                window.location.href = 'https://nexaclearanalytics.github.io/thankyou.html';
            }, 2000);
            
        } else {
            // Formspree error
            const errorData = await response.json();
            console.error('Formspree error:', errorData);
            showFormMessage('❌ Error: ' + (errorData.error || 'Failed to send message. Please try again.'), 'error');
        }
        
    } catch (error) {
        console.error('Network error:', error);
        showFormMessage('❌ Network error. Please check your internet connection and try again.', 'error');
    } finally {
        showLoadingState(false);
    }
}

// Form validation for your specific fields
function validateForm() {
    let isValid = true;
    
    const fields = [
        { id: 'name', required: true, minLength: 2 },
        { id: 'email', required: true, type: 'email' },
        { id: 'service', required: true },
        { id: 'message', required: true, minLength: 10 },
        { id: 'phone', required: false, type: 'phone' },
        { id: 'company', required: false }
    ];
    
    fields.forEach(field => {
        if (field.required && !validateField(field.id, field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(fieldId, rules) {
    const field = document.getElementById(fieldId);
    if (!field) return true; // Skip if field doesn't exist
    
    const value = field.value.trim();
    const errorElement = document.getElementById(fieldId + '-error');
    
    // Clear previous error
    if (errorElement) {
        errorElement.textContent = '';
    }
    
    field.classList.remove('error', 'success');
    
    // Required field validation
    if (rules.required && !value) {
        showFieldError(fieldId, `${getFieldName(fieldId)} is required`);
        return false;
    }
    
    // Skip further validation if field is empty and not required
    if (!value && !rules.required) {
        field.classList.add('success');
        return true;
    }
    
    // Minimum length validation
    if (rules.minLength && value.length < rules.minLength) {
        showFieldError(fieldId, `${getFieldName(fieldId)} must be at least ${rules.minLength} characters`);
        return false;
    }
    
    // Email validation
    if (rules.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(fieldId, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Phone validation (basic)
    if (rules.type === 'phone' && value) {
        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            showFieldError(fieldId, 'Please enter a valid phone number');
            return false;
        }
    }
    
    // If all validations pass
    field.classList.add('success');
    return true;
}

// Real-time validation setup
function setupRealTimeValidation() {
    const fields = ['name', 'email', 'phone', 'company', 'service', 'message'];
    
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            // Validate on blur (when user leaves field)
            field.addEventListener('blur', () => {
                validateSingleField(fieldId);
            });
            
            // Clear error when user starts typing
            field.addEventListener('input', () => {
                clearFieldError(fieldId);
            });
        }
    });
}

function validateSingleField(fieldId) {
    const rules = {
        'name': { required: true, minLength: 2 },
        'email': { required: true, type: 'email' },
        'phone': { required: false, type: 'phone' },
        'company': { required: false },
        'service': { required: true },
        'message': { required: true, minLength: 10 }
    };
    
    validateField(fieldId, rules[fieldId]);
}

// Helper functions
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + '-error');
    
    if (field) {
        field.classList.add('error');
        field.classList.remove('success');
    }
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + '-error');
    
    if (field) {
        field.classList.remove('error');
    }
    
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

function getFieldName(fieldId) {
    const names = {
        'name': 'Full name',
        'email': 'Email address',
        'phone': 'Phone number',
        'company': 'Company name',
        'service': 'Service',
        'message': 'Message'
    };
    return names[fieldId] || fieldId;
}

function resetFormValidation() {
    // Clear all error messages
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
        el.style.display = 'none';
    });
    
    // Remove error/success classes from fields
    const fields = ['name', 'email', 'phone', 'company', 'service', 'message'];
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.classList.remove('error', 'success');
        }
    });
    
    // Hide main form message
    hideFormMessage();
}

function hideFormMessage() {
    const formMessage = document.getElementById('form-message');
    if (formMessage) {
        formMessage.style.display = 'none';
    }
}

function showFormMessage(message, type) {
    const formMessage = document.getElementById('form-message');
    if (!formMessage) return;
    
    formMessage.textContent = message;
    formMessage.className = type;
    formMessage.style.display = 'block';
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
}

function showLoadingState(show) {
    const submitBtn = document.querySelector('#contact-form button[type="submit"]');
    if (!submitBtn) return;
    
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    if (show) {
        if (btnText) btnText.style.display = 'none';
        if (btnLoading) btnLoading.style.display = 'inline-block';
        submitBtn.disabled = true;
    } else {
        if (btnText) btnText.style.display = 'inline-block';
        if (btnLoading) btnLoading.style.display = 'none';
        submitBtn.disabled = false;
    }
}

// Counter Animation
function initCounterAnimation() {
    const statsSection = document.querySelector('.stats-section');
    if (!statsSection) return;
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    } else {
        // Fallback for older browsers
        let animated = false;
        
        function checkScroll() {
            if (!animated && statsSection) {
                const sectionTop = statsSection.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (sectionTop < windowHeight - 100) {
                    animateCounter();
                    animated = true;
                }
            }
        }
        
        window.addEventListener('scroll', checkScroll);
        checkScroll();
    }
}

function animateCounter() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;
    
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-count');
        const count = +counter.innerText.replace(/[^0-9]/g, '') || 0;
        
        const updateCount = () => {
            const inc = target > 1000 ? 50 : target > 100 ? 10 : 1;
            const current = +counter.innerText.replace(/[^0-9]/g, '');
            
            if (current < target) {
                counter.innerText = Math.min(current + inc, target).toLocaleString();
                setTimeout(updateCount, speed / inc);
            }
        };
        
        updateCount();
    });
}

// Utility Functions
function setCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}