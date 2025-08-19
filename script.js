// Nexus Studio - Digital Innovation Lab
// A website designed to compete with the best in web design

class NexusStudio {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupIntersectionObservers();
        this.setupAnimations();
        this.setupParallax();
        this.setupMouseEffects();
        this.setupSmoothScrolling();
        this.setupMobileMenu();
        this.setupPerformanceOptimizations();
    }

    // Navigation functionality
    setupNavigation() {
        const nav = document.querySelector('[data-nav]');
        const navToggle = document.querySelector('[data-nav-toggle]');
        
        if (!nav || !navToggle) return;

        // Scroll effect for navigation
        let lastScrollY = window.scrollY;
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }

            // Hide/show navigation on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                nav.style.transform = 'translateY(-100%)';
            } else {
                nav.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        };

        window.addEventListener('scroll', this.throttle(handleScroll, 16));
        
        // Mobile menu toggle
        navToggle.addEventListener('click', () => {
            nav.classList.toggle('nav--open');
            navToggle.classList.toggle('nav__toggle--active');
        });
    }

    // Scroll effects and animations
    setupScrollEffects() {
        const hero = document.querySelector('[data-hero]');
        if (!hero) return;

        const handleHeroScroll = () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            // Parallax effect for hero elements
            const heroContent = hero.querySelector('.hero__content');
            const heroVisual = hero.querySelector('.hero__visual');
            
            if (heroContent) {
                heroContent.style.transform = `translateY(${rate * 0.3}px)`;
            }
            
            if (heroVisual) {
                heroVisual.style.transform = `translateY(${rate * 0.7}px)`;
            }
        };

        window.addEventListener('scroll', this.throttle(handleHeroScroll, 16));
    }

    // Intersection Observer for scroll animations
    setupIntersectionObservers() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        // Work items animation
        const workItems = document.querySelectorAll('[data-work-item]');
        const workObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 200);
                }
            });
        }, observerOptions);

        workItems.forEach(item => workObserver.observe(item));

        // Approach steps animation
        const approachSteps = document.querySelectorAll('[data-approach-step]');
        const approachObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 150);
                }
            });
        }, observerOptions);

        approachSteps.forEach(step => approachObserver.observe(step));

        // Stats animation trigger
        const statsSection = document.querySelector('.studio__stats');
        if (statsSection) {
            const statsObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateStats();
                        statsObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            statsObserver.observe(statsSection);
        }
    }

    // Advanced animations
    setupAnimations() {
        // Hero grid animation
        const gridItems = document.querySelectorAll('[data-grid-item]');
        gridItems.forEach((item, index) => {
            item.addEventListener('mouseenter', () => {
                this.animateGridItem(item, index);
            });
        });

        // Work item hover effects
        const workImages = document.querySelectorAll('[data-work-image]');
        workImages.forEach(image => {
            image.addEventListener('mouseenter', () => {
                this.animateWorkImage(image);
            });
        });
    }

    // Parallax effects
    setupParallax() {
        const parallaxElements = document.querySelectorAll('.work__item, .approach__step');
        
        const handleParallax = () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach((element, index) => {
                const rate = scrolled * -0.1;
                const delay = index * 0.1;
                element.style.transform = `translateY(${rate + delay}px)`;
            });
        };

        window.addEventListener('scroll', this.throttle(handleParallax, 16));
    }

    // Mouse interaction effects
    setupMouseEffects() {
        const cursor = this.createCustomCursor();
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', (e) => {
            this.updateCursor(cursor, e);
        });

        // Hover effects for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .work__item, .approach__step');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor--hover');
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor--hover');
            });
        });
    }

    // Create custom cursor
    createCustomCursor() {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.innerHTML = `
            <div class="cursor__inner"></div>
            <div class="cursor__outer"></div>
        `;
        
        // Add cursor styles
        const style = document.createElement('style');
        style.textContent = `
            .custom-cursor {
                position: fixed;
                top: 0;
                left: 0;
                width: 40px;
                height: 40px;
                pointer-events: none;
                z-index: 9999;
                mix-blend-mode: difference;
            }
            .cursor__inner {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 8px;
                height: 8px;
                background: #00d4ff;
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: all 0.1s ease;
            }
            .cursor__outer {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 40px;
                height: 40px;
                border: 2px solid #00d4ff;
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: all 0.3s ease;
                opacity: 0.3;
            }
            .cursor--hover .cursor__inner {
                transform: translate(-50%, -50%) scale(1.5);
            }
            .cursor--hover .cursor__outer {
                transform: translate(-50%, -50%) scale(1.2);
                opacity: 0.6;
            }
        `;
        
        document.head.appendChild(style);
        return cursor;
    }

    // Update custom cursor position
    updateCursor(cursor, e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }

    // Animate grid items
    animateGridItem(item, index) {
        const colors = ['#00d4ff', '#ff006e', '#00ff88', '#ffaa00', '#aa00ff'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        item.style.background = `linear-gradient(135deg, ${randomColor}20, ${randomColor}40)`;
        item.style.transform = `scale(1.1) rotate(${Math.random() * 10 - 5}deg)`;
        
        setTimeout(() => {
            item.style.transform = 'scale(1) rotate(0deg)';
            item.style.background = 'linear-gradient(135deg, var(--color-secondary), var(--color-border))';
        }, 300);
    }

    // Animate work images
    animateWorkImage(image) {
        image.style.transform = 'scale(1.05)';
        image.style.boxShadow = '0 20px 40px rgba(0, 212, 255, 0.3)';
        
        setTimeout(() => {
            image.style.transform = 'scale(1)';
            image.style.boxShadow = 'none';
        }, 600);
    }

    // Animate statistics counter
    animateStats() {
        const statNumbers = document.querySelectorAll('[data-stat]');
        
        statNumbers.forEach(statElement => {
            const target = parseInt(statElement.getAttribute('data-stat'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                statElement.textContent = Math.floor(current);
            }, 16);
        });
    }

    // Smooth scrolling for anchor links
    setupSmoothScrolling() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 100;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Mobile menu functionality
    setupMobileMenu() {
        const nav = document.querySelector('[data-nav]');
        const navLinks = document.querySelectorAll('.nav__link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('nav--open');
                document.querySelector('[data-nav-toggle]').classList.remove('nav__toggle--active');
            });
        });
    }

    // Performance optimizations
    setupPerformanceOptimizations() {
        // Lazy load images
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));

        // Debounce scroll events
        let scrollTimeout;
        const handleScrollOptimized = () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(() => {
                // Handle scroll-based animations here
            }, 16);
        };

        window.addEventListener('scroll', handleScrollOptimized);
    }

    // Utility function: Throttle
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Utility function: Debounce
    debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add loading animation
    document.body.classList.add('loaded');
    
    // Initialize the website
    new NexusStudio();
    
    // Preload critical resources
    const preloadLinks = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap'
    ];
    
    preloadLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        document.head.appendChild(link);
    });
});

// Add loading styles
const loadingStyles = document.createElement('style');
loadingStyles.textContent = `
    body:not(.loaded) {
        overflow: hidden;
    }
    
    body:not(.loaded)::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--color-primary);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    body:not(.loaded)::after {
        content: 'NEXUS';
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-family: var(--font-mono);
        font-size: 3rem;
        font-weight: 900;
        color: var(--color-accent);
        z-index: 10001;
        animation: loadingPulse 2s ease-in-out infinite;
    }
    
    @keyframes loadingPulse {
        0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        50% { opacity: 0.5; transform: translate(-50%, -50%) scale(1.1); }
    }
    
    .loaded .custom-cursor {
        opacity: 1;
    }
    
    .custom-cursor {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    
    /* Ensure content is visible after loading */
    body.loaded::before,
    body.loaded::after {
        display: none !important;
    }
`;

document.head.appendChild(loadingStyles);

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        try {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
                console.log('DOM Content Loaded:', perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart, 'ms');
            }
        } catch (error) {
            console.log('Performance monitoring not available');
        }
    });
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NexusStudio;
}
