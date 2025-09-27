// js/script.js
// Navigation and Hamburger Menu
document.addEventListener('DOMContentLoaded', function() {
    // Hamburger menu functionality
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
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
    }
    
    // Set current year in footer
    const currentYear = new Date().getFullYear();
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = currentYear;
    }
    
    // Scroll animations
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
    
    // Check on load
    fadeInOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', fadeInOnScroll);
    
    // Contact form validation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Reset previous error states
            clearErrors();
            
            // Validate form
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const service = document.getElementById('service');
            const message = document.getElementById('message');
            
            let isValid = true;
            
            // Name validation
            if (!name.value.trim()) {
                showError('name-error', 'Please enter your name');
                isValid = false;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email.value.trim()) {
                showError('email-error', 'Please enter your email address');
                isValid = false;
            } else if (!emailRegex.test(email.value)) {
                showError('email-error', 'Please enter a valid email address');
                isValid = false;
            }
            
            // Service validation
            if (!service.value) {
                showError('service-error', 'Please select a service');
                isValid = false;
            }
            
            // Message validation
            if (!message.value.trim()) {
                showError('message-error', 'Please enter your message');
                isValid = false;
            } else if (message.value.trim().length < 10) {
                showError('message-error', 'Message must be at least 10 characters long');
                isValid = false;
            }
            
            if (isValid) {
                // Simulate form submission
                const formMessage = document.getElementById('form-message');
                formMessage.textContent = 'Thank you for your message! We will get back to you soon.';
                formMessage.className = 'success';
                formMessage.style.display = 'block';
                
                // Reset form
                contactForm.reset();
                
                // Scroll to message
                formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            }
        });
        
        function showError(id, message) {
            const errorElement = document.getElementById(id);
            if (errorElement) {
                errorElement.textContent = message;
            }
        }
        
        function clearErrors() {
            const errorElements = document.querySelectorAll('.error-message');
            errorElements.forEach(element => {
                element.textContent = '';
            });
        }
    }
    
    // Smooth scrolling for anchor links
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
    
    // Navbar scroll effect - Fixed version
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
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
});

// Counter Animation for Statistics Section (if exists)
function animateCounter() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200; // The lower the slower
    
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-count');
            const count = +counter.innerText.replace('%', '');
            
            // Lower speed for larger numbers
            const inc = target > 1000 ? 50 : target > 100 ? 10 : 1;
            
            // Check if target is reached
            if (count < target) {
                // Add inc to count and output in counter
                counter.innerText = (count + inc).toLocaleString();
                // Call function every ms
                setTimeout(updateCount, speed / inc);
            } else {
                counter.innerText = target.toLocaleString();
            }
        };
        
        updateCount();
    });
}

// Intersection Observer to trigger animation when section is in view
function setupCounterObserver() {
    const statsSection = document.querySelector('.stats-section');
    
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter();
                    observer.unobserve(entry.target); // Only animate once
                }
            });
        }, { threshold: 0.5 }); // Trigger when 50% of section is visible
        
        observer.observe(statsSection);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupCounterObserver();
    
    // Alternative: Animate on scroll (fallback if IntersectionObserver not supported)
    let animated = false;
    
    function checkScroll() {
        const statsSection = document.querySelector('.stats-section');
        if (statsSection && !animated) {
            const sectionTop = statsSection.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (sectionTop < windowHeight - 100) {
                animateCounter();
                animated = true;
            }
        }
    }
    
    // Fallback for browsers that don't support IntersectionObserver
    if (!('IntersectionObserver' in window)) {
        window.addEventListener('scroll', checkScroll);
        checkScroll(); // Check on load
    }
});
// js/script.js
// Navigation and Hamburger Menu
document.addEventListener('DOMContentLoaded', function() {
    // Hamburger menu functionality
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
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
    }
    
    // Set current year in footer
    const currentYear = new Date().getFullYear();
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = currentYear;
    }
    
    // Scroll animations
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
    
    // Check on load
    fadeInOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', fadeInOnScroll);
    
    // Contact form validation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Reset previous error states
            clearErrors();
            
            // Validate form
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const service = document.getElementById('service');
            const message = document.getElementById('message');
            
            let isValid = true;
            
            // Name validation
            if (!name.value.trim()) {
                showError('name-error', 'Please enter your name');
                isValid = false;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email.value.trim()) {
                showError('email-error', 'Please enter your email address');
                isValid = false;
            } else if (!emailRegex.test(email.value)) {
                showError('email-error', 'Please enter a valid email address');
                isValid = false;
            }
            
            // Service validation
            if (!service.value) {
                showError('service-error', 'Please select a service');
                isValid = false;
            }
            
            // Message validation
            if (!message.value.trim()) {
                showError('message-error', 'Please enter your message');
                isValid = false;
            } else if (message.value.trim().length < 10) {
                showError('message-error', 'Message must be at least 10 characters long');
                isValid = false;
            }
            
            if (isValid) {
                // Simulate form submission
                const formMessage = document.getElementById('form-message');
                formMessage.textContent = 'Thank you for your message! We will get back to you soon.';
                formMessage.className = 'success';
                formMessage.style.display = 'block';
                
                // Reset form
                contactForm.reset();
                
                // Scroll to message
                formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            }
        });
        
        function showError(id, message) {
            const errorElement = document.getElementById(id);
            if (errorElement) {
                errorElement.textContent = message;
            }
        }
        
        function clearErrors() {
            const errorElements = document.querySelectorAll('.error-message');
            errorElements.forEach(element => {
                element.textContent = '';
            });
        }
    }
    
    // Smooth scrolling for anchor links
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
    
    // Navbar scroll effect
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
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
});

// Counter Animation for Statistics Section (if exists)
function animateCounter() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200; // The lower the slower
    
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-count');
            const count = +counter.innerText.replace('%', '');
            
            // Lower speed for larger numbers
            const inc = target > 1000 ? 50 : target > 100 ? 10 : 1;
            
            // Check if target is reached
            if (count < target) {
                // Add inc to count and output in counter
                counter.innerText = (count + inc).toLocaleString();
                // Call function every ms
                setTimeout(updateCount, speed / inc);
            } else {
                counter.innerText = target.toLocaleString();
            }
        };
        
        updateCount();
    });
}

// Intersection Observer to trigger animation when section is in view
function setupCounterObserver() {
    const statsSection = document.querySelector('.stats-section');
    
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter();
                    observer.unobserve(entry.target); // Only animate once
                }
            });
        }, { threshold: 0.5 }); // Trigger when 50% of section is visible
        
        observer.observe(statsSection);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupCounterObserver();
    
    // Alternative: Animate on scroll (fallback if IntersectionObserver not supported)
    let animated = false;
    
    function checkScroll() {
        const statsSection = document.querySelector('.stats-section');
        if (statsSection && !animated) {
            const sectionTop = statsSection.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (sectionTop < windowHeight - 100) {
                animateCounter();
                animated = true;
            }
        }
    }
    
    // Fallback for browsers that don't support IntersectionObserver
    if (!('IntersectionObserver' in window)) {
        window.addEventListener('scroll', checkScroll);
        checkScroll(); // Check on load
    }
});
// Contact Form Validation
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Reset previous error states
        clearErrors();
        
        // Validate form
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const service = document.getElementById('service');
        const message = document.getElementById('message');
        
        let isValid = true;
        
        // Name validation
        if (!name.value.trim()) {
            showError('name-error', 'Please enter your name');
            isValid = false;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) {
            showError('email-error', 'Please enter your email address');
            isValid = false;
        } else if (!emailRegex.test(email.value)) {
            showError('email-error', 'Please enter a valid email address');
            isValid = false;
        }
        
        // Service validation
        if (!service.value) {
            showError('service-error', 'Please select a service');
            isValid = false;
        }
        
        // Message validation
        if (!message.value.trim()) {
            showError('message-error', 'Please enter your message');
            isValid = false;
        } else if (message.value.trim().length < 10) {
            showError('message-error', 'Message must be at least 10 characters long');
            isValid = false;
        }
        
        if (isValid) {
            // Show loading state
            const submitBtn = document.getElementById('submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                const formMessage = document.getElementById('form-message');
                formMessage.textContent = 'Thank you for your message! We will get back to you within 24 hours.';
                formMessage.className = 'success';
                formMessage.style.display = 'block';
                
                // Reset form
                contactForm.reset();
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Scroll to message
                formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            }, 1500);
        }
        
        function showError(id, message) {
            const errorElement = document.getElementById(id);
            if (errorElement) {
                errorElement.textContent = message;
            }
        }
        
        function clearErrors() {
            const errorElements = document.querySelectorAll('.error-message');
            errorElements.forEach(element => {
                element.textContent = '';
            });
        }
    });
    
    // Schedule call button functionality
    const scheduleCallBtn = document.getElementById('schedule-call');
    if (scheduleCallBtn) {
        scheduleCallBtn.addEventListener('click', function() {
            const formMessage = document.getElementById('form-message');
            formMessage.textContent = 'Please contact us at +91-9876543210 to schedule a call, or email us at info@nexaclear.com';
            formMessage.className = 'success';
            formMessage.style.display = 'block';
            
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }
}
// Smooth scroll to contact form
document.addEventListener('DOMContentLoaded', function() {
    const scrollToFormBtn = document.getElementById('scroll-to-form');
    
    if (scrollToFormBtn) {
        scrollToFormBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const contactForm = document.getElementById('contact-form');
            
            if (contactForm) {
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const formPosition = contactForm.getBoundingClientRect().top + window.pageYOffset - headerHeight - 30;
                
                window.scrollTo({
                    top: formPosition,
                    behavior: 'smooth'
                });
                
                // Focus on name field after scroll
                setTimeout(() => {
                    const nameInput = document.getElementById('name');
                    if (nameInput) {
                        nameInput.focus();
                    }
                }, 800);
            }
        });
    }
});
// Smooth scroll to contact form for Send Message button
document.addEventListener('DOMContentLoaded', function() {
    const sendMessageBtn = document.getElementById('send-message-btn');
    
    if (sendMessageBtn) {
        sendMessageBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const contactForm = document.getElementById('contact-form');
            
            if (contactForm) {
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const formPosition = contactForm.getBoundingClientRect().top + window.pageYOffset - headerHeight - 30;
                
                window.scrollTo({
                    top: formPosition,
                    behavior: 'smooth'
                });
                
                // Focus on name field after scroll
                setTimeout(() => {
                    const nameInput = document.getElementById('name');
                    if (nameInput) {
                        nameInput.focus();
                    }
                }, 800);
            }
        });
    }
});
// Hero section Get Started button functionality
document.addEventListener('DOMContentLoaded', function() {
    const heroGetStartedBtn = document.getElementById('hero-get-started');
    
    if (heroGetStartedBtn) {
        heroGetStartedBtn.addEventListener('click', function(e) {
            // Check if we're already on contact page
            if (window.location.pathname.includes('contact.html')) {
                e.preventDefault();
                
                const contactForm = document.getElementById('contact-form');
                if (contactForm) {
                    // Smooth scroll to form
                    contactForm.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Add visual feedback after scroll
                    setTimeout(function() {
                        contactForm.style.transition = 'all 0.3s ease';
                        contactForm.style.boxShadow = '0 0 0 3px rgba(0, 153, 117, 0.3)';
                        
                        // Focus on first input field
                        const nameInput = document.getElementById('name');
                        if (nameInput) {
                            nameInput.focus();
                        }
                        
                        // Remove highlight after 2 seconds
                        setTimeout(function() {
                            contactForm.style.boxShadow = '';
                        }, 2000);
                        
                    }, 800);
                }
            }
            // If not on contact page, let the link work normally (redirect to contact.html)
        });
    }
});
// Contact page auto-scroll when accessed with hash
document.addEventListener('DOMContentLoaded', function() {
    // Check if URL has #contact-form hash
    if (window.location.hash === '#contact-form') {
        setTimeout(function() {
            const contactForm = document.getElementById('contact-form');
            if (contactForm) {
                // Smooth scroll to form
                contactForm.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Add visual highlight
                contactForm.style.transition = 'all 0.3s ease';
                contactForm.style.boxShadow = '0 0 0 3px rgba(0, 153, 117, 0.3)';
                
                // Focus on name field
                setTimeout(function() {
                    const nameInput = document.getElementById('name');
                    if (nameInput) {
                        nameInput.focus();
                    }
                }, 800);
                
                // Remove highlight after 3 seconds
                setTimeout(function() {
                    contactForm.style.boxShadow = '';
                }, 3000);
            }
        }, 300);
    }
});
// Auto-scroll when page loads with #contact-form hash
if (window.location.hash === '#contact-form') {
    setTimeout(() => {
        const form = document.getElementById('contact-form');
        if (form) {
            form.scrollIntoView({ behavior: 'smooth' });
        }
    }, 300);
}
// Global function for Get Started button
function handleGetStarted(event) {
    // If already on contact page, scroll to form
    if (window.location.pathname.includes('contact.html')) {
        event.preventDefault();
        
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
            
            // Focus on form after scroll
            setTimeout(() => {
                const nameInput = document.getElementById('name');
                if (nameInput) nameInput.focus();
            }, 800);
        }
    }
}

// Auto-scroll when contact page loads with specific parameter
document.addEventListener('DOMContentLoaded', function() {
    // Check if we need to auto-scroll (from CTA section)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('source') === 'cta') {
        setTimeout(() => {
            const contactForm = document.getElementById('contact-form');
            if (contactForm) {
                contactForm.scrollIntoView({ behavior: 'smooth' });
            }
        }, 500);
    }
});
// Simple and working solution
document.addEventListener('DOMContentLoaded', function() {
    const ctaBtn = document.querySelector('.cta-get-started-btn');
    
    if (ctaBtn) {
        ctaBtn.addEventListener('click', function(e) {
            if (window.location.pathname.includes('contact.html')) {
                e.preventDefault();
                const form = document.getElementById('contact-form');
                if (form) {
                    form.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }
});
// Consultation Section Get Started Button
document.addEventListener('DOMContentLoaded', function() {
    const consultationBtn = document.getElementById('consultation-get-started');
    
    if (consultationBtn) {
        consultationBtn.addEventListener('click', function(e) {
            // If already on contact page, scroll to form
            if (window.location.pathname.includes('contact.html')) {
                e.preventDefault();
                
                const contactForm = document.getElementById('contact-form');
                if (contactForm) {
                    // Smooth scroll to form
                    contactForm.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Add visual feedback after scroll
                    setTimeout(function() {
                        contactForm.style.transition = 'all 0.3s ease';
                        contactForm.style.boxShadow = '0 0 0 3px rgba(0, 153, 117, 0.3)';
                        
                        // Focus on first input field
                        const nameInput = document.getElementById('name');
                        if (nameInput) {
                            nameInput.focus();
                        }
                        
                        // Remove highlight after 2 seconds
                        setTimeout(function() {
                            contactForm.style.boxShadow = '';
                        }, 2000);
                        
                    }, 800);
                }
            }
            // If not on contact page, the link will redirect normally
        });
    }
});
// Instant form highlight on Get Started click
document.addEventListener('DOMContentLoaded', function() {
    // All Get Started buttons ke liye
    const getStartedButtons = [
        document.getElementById('consultation-get-started'),
        document.getElementById('cta-get-started'),
        document.getElementById('hero-get-started'),
        document.getElementById('scroll-to-form')
    ].filter(btn => btn !== null);
    
    getStartedButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // If already on contact page
            if (window.location.pathname.includes('contact.html')) {
                e.preventDefault();
                
                const contactForm = document.getElementById('contact-form');
                if (contactForm) {
                    // Instantly highlight form
                    contactForm.style.transition = 'all 0.3s ease';
                    contactForm.style.boxShadow = '0 0 0 4px rgba(0, 153, 117, 0.5)';
                    contactForm.style.border = '2px solid #009975';
                    contactForm.style.backgroundColor = '#f8fff8';
                    
                    // Smooth scroll to form
                    contactForm.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Focus on first input field
                    setTimeout(() => {
                        const nameInput = document.getElementById('name');
                        if (nameInput) {
                            nameInput.focus();
                            nameInput.style.backgroundColor = '#f0fff0';
                        }
                    }, 600);
                    
                    // Remove highlight after 3 seconds
                    setTimeout(() => {
                        contactForm.style.boxShadow = '';
                        contactForm.style.border = '';
                        contactForm.style.backgroundColor = '';
                        
                        if (document.getElementById('name')) {
                            document.getElementById('name').style.backgroundColor = '';
                        }
                    }, 3000);
                }
            }
        });
    });
});
// Simple Form Validation
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    let isValid = true;
    
    // Required fields
    const requiredFields = {
        'name': 'Full name is required',
        'email': 'Email address is required', 
        'service': 'Please select a service',
        'message': 'Message is required'
    };
    
    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-group').forEach(el => el.classList.remove('error'));
    
    // Check required fields
    for (const [fieldId, errorMsg] of Object.entries(requiredFields)) {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            document.getElementById(fieldId + '-error').textContent = errorMsg;
            field.closest('.form-group').classList.add('error');
            isValid = false;
        }
    }
    
    // Email format check
    const email = document.getElementById('email');
    if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        document.getElementById('email-error').textContent = 'Please enter a valid email address';
        email.closest('.form-group').classList.add('error');
        isValid = false;
    }
    
    // Message length check
    const message = document.getElementById('message');
    if (message.value.trim() && message.value.trim().length < 10) {
        document.getElementById('message-error').textContent = 'Message must be at least 10 characters';
        message.closest('.form-group').classList.add('error');
        isValid = false;
    }
    
    if (isValid) {
        this.submit();
    }
});