// Professional Resume Website JavaScript
// Advanced interactions and animations

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });

    // Navigation functionality
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation link highlighting
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);

    // Typing animation for hero title
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    // Initialize typing animation
    setTimeout(() => {
        const titleName = document.querySelector('.title-name');
        if (titleName) {
            const originalText = titleName.textContent;
            typeWriter(titleName, originalText, 80);
        }
    }, 1000);

    // Skill bars animation
    function animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        skillBars.forEach(bar => {
            const targetWidth = bar.getAttribute('data-width');
            if (targetWidth) {
                bar.style.setProperty('--target-width', targetWidth);
                bar.style.width = targetWidth;
            }
        });
    }

    // Intersection Observer for skill bars
    const skillsSection = document.querySelector('.skills');
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars();
                skillsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }

    // Counter animation for stats
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = counter.textContent.replace(/[^0-9]/g, '');
            const increment = target / 200;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = counter.textContent.replace(/[0-9]+/, target);
                    clearInterval(timer);
                } else {
                    counter.textContent = counter.textContent.replace(/[0-9]+/, Math.floor(current));
                }
            }, 10);
        });
    }

    // Intersection Observer for counters
    const heroSection = document.querySelector('.hero');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(animateCounters, 2000);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (heroSection) {
        counterObserver.observe(heroSection);
    }

    // Parallax effect for floating shapes
    function parallaxShapes() {
        const shapes = document.querySelectorAll('.shape');
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.1;
            shape.style.transform = `translateY(${rate * speed}px) rotate(${scrolled * speed * 0.1}deg)`;
        });
    }

    window.addEventListener('scroll', parallaxShapes);

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const company = formData.get('company');
        const message = formData.get('message');
        
        // Basic validation
        if (!name || !email || !message) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        // Simulate form submission
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;
        
        // Simulate API call delay
        setTimeout(() => {
            showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
            contactForm.reset();
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }, 2000);
    });

    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Add styles for notification
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: white;
                padding: 1rem;
                border-radius: 8px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.15);
                z-index: 10000;
                min-width: 300px;
                animation: slideInRight 0.3s ease;
            }
            
            .notification-success { border-left: 4px solid #10b981; }
            .notification-error { border-left: 4px solid #ef4444; }
            .notification-info { border-left: 4px solid #3b82f6; }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            
            .notification-content i:first-child {
                font-size: 1.25rem;
            }
            
            .notification-success i:first-child { color: #10b981; }
            .notification-error i:first-child { color: #ef4444; }
            .notification-info i:first-child { color: #3b82f6; }
            
            .notification-close {
                background: none;
                border: none;
                margin-left: auto;
                cursor: pointer;
                padding: 0.25rem;
                color: #6b7280;
            }
            
            .notification-close:hover {
                color: #374151;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        
        if (!document.querySelector('#notification-styles')) {
            style.id = 'notification-styles';
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Scroll to top functionality
    function createScrollToTop() {
        const scrollButton = document.createElement('button');
        scrollButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
        scrollButton.className = 'scroll-to-top';
        scrollButton.setAttribute('aria-label', 'Scroll to top');
        
        const style = document.createElement('style');
        style.textContent = `
            .scroll-to-top {
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 50px;
                height: 50px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                font-size: 1.2rem;
                z-index: 1000;
                transition: all 0.3s ease;
                opacity: 0;
                visibility: hidden;
                transform: translateY(20px);
            }
            
            .scroll-to-top.visible {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }
            
            .scroll-to-top:hover {
                transform: translateY(-5px) scale(1.1);
                box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
            }
            
            @media (max-width: 768px) {
                .scroll-to-top {
                    bottom: 20px;
                    right: 20px;
                    width: 45px;
                    height: 45px;
                }
            }
        `;
        
        if (!document.querySelector('#scroll-to-top-styles')) {
            style.id = 'scroll-to-top-styles';
            document.head.appendChild(style);
        }
        
        document.body.appendChild(scrollButton);
        
        // Show/hide scroll button
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollButton.classList.add('visible');
            } else {
                scrollButton.classList.remove('visible');
            }
        });
        
        // Scroll to top functionality
        scrollButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    createScrollToTop();

    // Theme switcher (bonus feature)
    function createThemeSwitch() {
        const themeSwitch = document.createElement('button');
        themeSwitch.innerHTML = '<i class="fas fa-moon"></i>';
        themeSwitch.className = 'theme-switch';
        themeSwitch.setAttribute('aria-label', 'Toggle dark mode');
        
        const style = document.createElement('style');
        style.textContent = `
            .theme-switch {
                position: fixed;
                bottom: 100px;
                right: 30px;
                width: 50px;
                height: 50px;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                color: #667eea;
                border: 2px solid rgba(102, 126, 234, 0.3);
                border-radius: 50%;
                cursor: pointer;
                font-size: 1.2rem;
                z-index: 1000;
                transition: all 0.3s ease;
            }
            
            .theme-switch:hover {
                transform: translateY(-2px) scale(1.05);
                background: rgba(102, 126, 234, 0.1);
            }
            
            body.dark-theme {
                --text-primary: #e2e8f0;
                --text-secondary: #cbd5e0;
                --text-light: #a0aec0;
                --bg-primary: #1a202c;
                --bg-secondary: #2d3748;
                --bg-card: #2d3748;
                --bg-dark: #0d1117;
            }
            
            @media (max-width: 768px) {
                .theme-switch {
                    bottom: 80px;
                    right: 20px;
                    width: 45px;
                    height: 45px;
                }
            }
        `;
        
        if (!document.querySelector('#theme-switch-styles')) {
            style.id = 'theme-switch-styles';
            document.head.appendChild(style);
        }
        
        document.body.appendChild(themeSwitch);
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            themeSwitch.innerHTML = '<i class="fas fa-sun"></i>';
        }
        
        // Theme toggle functionality
        themeSwitch.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            
            themeSwitch.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    createThemeSwitch();

    // Loading animation
    function showLoadingAnimation() {
        const loader = document.createElement('div');
        loader.className = 'page-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-spinner"></div>
                <p>Loading...</p>
            </div>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .page-loader {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                transition: opacity 0.5s ease;
            }
            
            .loader-content {
                text-align: center;
                color: white;
            }
            
            .loader-spinner {
                width: 50px;
                height: 50px;
                border: 3px solid rgba(255,255,255,0.3);
                border-top: 3px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 1rem;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .loader-content p {
                font-size: 1.2rem;
                font-weight: 500;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(loader);
        
        // Remove loader after page is fully loaded
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.remove();
                }, 500);
            }, 1000);
        });
    }

    // Initialize loading animation
    showLoadingAnimation();

    // Enhanced hover effects for cards
    function addCardHoverEffects() {
        const cards = document.querySelectorAll('.timeline-content, .skill-category, .education-card, .contact-method');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
                this.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            });
        });
    }

    // Initialize enhanced hover effects
    setTimeout(addCardHoverEffects, 1000);

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Escape key closes mobile menu
        if (e.key === 'Escape') {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
        
        // Arrow keys for navigation
        if (e.altKey) {
            switch(e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                    break;
            }
        }
    });

    // Print functionality
    function addPrintStyles() {
        const printButton = document.createElement('button');
        printButton.innerHTML = '<i class="fas fa-print"></i> Print Resume';
        printButton.className = 'print-button';
        
        const style = document.createElement('style');
        style.textContent = `
            .print-button {
                position: fixed;
                bottom: 170px;
                right: 30px;
                padding: 0.75rem 1rem;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                color: #667eea;
                border: 2px solid rgba(102, 126, 234, 0.3);
                border-radius: 25px;
                cursor: pointer;
                font-size: 0.9rem;
                font-weight: 500;
                z-index: 1000;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .print-button:hover {
                transform: translateY(-2px);
                background: rgba(102, 126, 234, 0.1);
            }
            
            @media (max-width: 768px) {
                .print-button {
                    bottom: 140px;
                    right: 20px;
                    padding: 0.5rem 0.75rem;
                    font-size: 0.8rem;
                }
            }
        `;
        
        if (!document.querySelector('#print-button-styles')) {
            style.id = 'print-button-styles';
            document.head.appendChild(style);
        }
        
        document.body.appendChild(printButton);
        
        printButton.addEventListener('click', () => {
            window.print();
        });
    }

    addPrintStyles();

    console.log('🎉 Professional Resume Website Loaded Successfully!');
    console.log('Features: Responsive Design, Animations, Dark Mode, Print Support');
});

// Service Worker for PWA functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful');
        }, function(err) {
            console.log('ServiceWorker registration failed');
        });
    });
}
