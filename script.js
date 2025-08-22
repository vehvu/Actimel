// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeFullPage();
    initializeWebsite();
});

// FullPage.js Initialization
function initializeFullPage() {
    new fullpage('#fullpage', {
        // Options
        licenseKey: 'YOUR_KEY_HERE',
        scrollingSpeed: 1000,
        easingcss3: 'cubic-bezier(0.4, 0, 0.2, 1)',
        navigation: true,
        navigationPosition: 'right',
        showActiveTooltip: false,
        anchors: ['home', 'gallery', 'gallery-alt', 'about', 'contact'],
        menu: '#nav-menu',
        
        // Callbacks
        onLeave: function(origin, destination, direction) {
            // Add entrance animations for new section
            const newSection = destination.item;
            animateSectionEntrance(newSection);
        },
        
        afterLoad: function(origin, destination, direction) {
            // Trigger animations after section loads
            triggerSectionAnimations(destination.item);
        },
        
        onSlideLeave: function(section, origin, destination, direction) {
            // Handle slide transitions if needed
        }
    });
}

// Main initialization function
function initializeWebsite() {
    setupMobileNavigation();
    setupInteractiveElements();
    setupContactForm();
    setupScrollEffects();
    setupParticleSystem();
    setupWaveAnimations();
    setupGeometricAnimations();
}

// Mobile Navigation
function setupMobileNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
}

// Interactive Elements
function setupInteractiveElements() {
    // Particle system interaction
    const particleSystems = document.querySelectorAll('.particle-system');
    particleSystems.forEach(system => {
        system.addEventListener('mousemove', (e) => {
            const particles = system.querySelectorAll('.particle');
            const rect = system.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            particles.forEach((particle, index) => {
                const speed = (index + 1) * 0.5;
                particle.style.transform = `translate(${x * speed * 0.01}px, ${y * speed * 0.01}px)`;
            });
        });
    });

    // Wave animation interaction
    const waveAnimations = document.querySelectorAll('.wave-animation');
    waveAnimations.forEach(wave => {
        wave.addEventListener('click', () => {
            const waves = wave.querySelectorAll('.wave');
            waves.forEach((w, index) => {
                w.style.animation = 'none';
                setTimeout(() => {
                    w.style.animation = `waveExpand 3s ease-in-out infinite ${index * 0.5}s`;
                }, 10);
            });
        });
    });
}

// Contact Form Handling
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
        
        // Real-time validation
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldValidation);
        });
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const formObject = Object.fromEntries(formData);
    
    // Validate all fields
    let isValid = true;
    const formInputs = e.target.querySelectorAll('input, textarea');
    
    formInputs.forEach(input => {
        if (!validateField({ target: input })) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showNotification('Please fill in all required fields correctly.', 'error');
        return;
    }
    
    // Simulate form submission
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.querySelector('span').textContent;
    const originalIcon = submitBtn.querySelector('i').className;
    
    submitBtn.querySelector('span').textContent = 'Sending...';
    submitBtn.querySelector('i').className = 'fas fa-spinner fa-spin';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        submitBtn.querySelector('span').textContent = 'Message Sent!';
        submitBtn.querySelector('i').className = 'fas fa-check';
        submitBtn.style.background = '#10b981';
        
        setTimeout(() => {
            submitBtn.querySelector('span').textContent = originalText;
            submitBtn.querySelector('i').className = originalIcon;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
            e.target.reset();
            showNotification('Thank you! Your message has been sent successfully.', 'success');
        }, 2000);
    }, 1500);
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const formGroup = field.closest('.form-group');
    
    // Remove existing validation classes
    formGroup.classList.remove('success', 'error');
    
    // Remove existing message
    const existingMessage = formGroup.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Validate based on field type
    let isValid = true;
    let message = '';
    
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        message = 'This field is required.';
    } else if (field.type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        message = 'Please enter a valid email address.';
    }
    
    if (!isValid) {
        formGroup.classList.add('error');
        const messageEl = document.createElement('div');
        messageEl.className = 'message';
        messageEl.textContent = message;
        formGroup.appendChild(messageEl);
    } else if (value) {
        formGroup.classList.add('success');
    }
    
    return isValid;
}

function clearFieldValidation(e) {
    const field = e.target;
    const formGroup = field.closest('.form-group');
    
    if (field.value.trim()) {
        formGroup.classList.remove('error');
        const message = formGroup.querySelector('.message');
        if (message) {
            message.remove();
        }
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Scroll Effects
function setupScrollEffects() {
    // Parallax effect for floating shapes
    const floatingShapes = document.querySelectorAll('.floating-shapes .shape');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        floatingShapes.forEach((shape, index) => {
            const speed = 0.5 + (index * 0.1);
            shape.style.transform = `translateY(${rate * speed}px)`;
        });
    });
}

// Particle System
function setupParticleSystem() {
    const particles = document.querySelectorAll('.particle');
    
    particles.forEach((particle, index) => {
        // Add random movement
        setInterval(() => {
            const randomX = (Math.random() - 0.5) * 20;
            const randomY = (Math.random() - 0.5) * 20;
            particle.style.transform = `translate(${randomX}px, ${randomY}px)`;
        }, 2000 + (index * 500));
    });
}

// Wave Animations
function setupWaveAnimations() {
    const waves = document.querySelectorAll('.wave');
    
    waves.forEach((wave, index) => {
        // Add subtle rotation
        setInterval(() => {
            wave.style.transform = `rotate(${Math.random() * 360}deg)`;
        }, 3000 + (index * 1000));
    });
}

// Geometric Animations
function setupGeometricAnimations() {
    const geoShapes = document.querySelectorAll('.geo-shape');
    
    geoShapes.forEach((shape, index) => {
        // Add hover effect
        shape.addEventListener('mouseenter', () => {
            shape.style.transform = 'scale(1.1) rotate(45deg)';
        });
        
        shape.addEventListener('mouseleave', () => {
            shape.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

// Section Animations
function animateSectionEntrance(section) {
    // Add entrance animation class
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    
    setTimeout(() => {
        section.style.transition = 'all 0.8s ease';
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
    }, 100);
}

function triggerSectionAnimations(section) {
    // Trigger animations for elements in the section
    const animatedElements = section.querySelectorAll('[data-aos]');
    
    animatedElements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                el.style.transition = 'all 0.6s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 100);
        }, index * 200);
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
        font-family: inherit;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(15, 23, 42, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(15, 23, 42, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
const throttledScrollHandler = throttle(() => {
    // Scroll-based animations can go here
}, 16); // ~60fps

window.addEventListener('scroll', throttledScrollHandler);

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }
    
    // FullPage.js keyboard navigation
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        fullpage_api.moveSectionDown();
    }
    if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        fullpage_api.moveSectionUp();
    }
});

// Focus management for accessibility
function setupFocusManagement() {
    const focusableElements = document.querySelectorAll(
        'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', () => {
            element.style.outline = '2px solid var(--primary-color)';
            element.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', () => {
            element.style.outline = '';
            element.style.outlineOffset = '';
        });
    });
}

// Initialize focus management
setupFocusManagement();

// Add smooth reveal animations for sections
function revealOnScroll() {
    const sections = document.querySelectorAll('.section');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'all 0.8s ease';
        revealObserver.observe(section);
    });
}

// Initialize reveal animations
revealOnScroll();

// Add loading animation for images
function setupImageLoading() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });
}

// Initialize image loading
setupImageLoading();

// Add ripple effect styles
const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .notification {
        font-family: inherit;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
`;
document.head.appendChild(rippleStyles);

// Button ripple effects
function setupButtonRipples() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', createRipple);
    });
}

function createRipple(e) {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Initialize button ripples
setupButtonRipples();
