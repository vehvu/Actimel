/**
 * NEXUS STUDIO - VISUAL DESIGN EXCELLENCE
 * A showcase of cutting-edge web design, typography, and visual innovation
 * 
 * This JavaScript file implements sophisticated animations, smooth interactions,
 * and performance optimizations to create a truly exceptional user experience.
 */

class NexusStudio {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.startAnimations();
    }

    init() {
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupIntersectionObservers();
        this.setupParallaxEffects();
        this.setupMouseEffects();
        this.setupSmoothScrolling();
        this.setupMobileMenu();
        this.setupPerformanceOptimizations();
        this.setupParticleSystem();
        this.setupNoiseOverlay();
    }

    // ==========================================================================
    // NAVIGATION SYSTEM
    // ==========================================================================
    setupNavigation() {
        const nav = document.querySelector('[data-nav]');
        const navToggle = document.querySelector('[data-nav-toggle]');
        const navMenu = document.querySelector('.nav__menu');

        // Scroll effect for navigation
        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateNav = () => {
            if (window.scrollY > 100) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
            lastScrollY = window.scrollY;
            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateNav);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick);

        // Mobile menu toggle
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('nav__toggle--active');
                navMenu.classList.toggle('nav__menu--active');
            });
        }

        // Smooth navigation links
        const navLinks = document.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    this.smoothScrollTo(targetSection);
                    // Close mobile menu if open
                    if (navToggle.classList.contains('nav__toggle--active')) {
                        navToggle.classList.remove('nav__toggle--active');
                        navMenu.classList.remove('nav__menu--active');
                    }
                }
            });
        });
    }

    // ==========================================================================
    // SCROLL EFFECTS & ANIMATIONS
    // ==========================================================================
    setupScrollEffects() {
        // Parallax scrolling for hero background
        const heroBackground = document.querySelector('.hero__background');
        
        if (heroBackground) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                heroBackground.style.transform = `translateY(${rate}px)`;
            });
        }

        // Staggered animation for hero grid items
        const gridItems = document.querySelectorAll('[data-grid-item]');
        gridItems.forEach((item, index) => {
            item.style.animationDelay = `${0.7 + (index * 0.1)}s`;
        });

        // Smooth reveal animations for sections
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('section--visible');
                        }
                    });
                },
                { threshold: 0.1 }
            );
            observer.observe(section);
        });
    }

    // ==========================================================================
    // INTERSECTION OBSERVERS
    // ==========================================================================
    setupIntersectionObservers() {
        // Work items animation
        const workItems = document.querySelectorAll('[data-work-item]');
        const workObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('work__item--visible');
                        }, index * 200);
                    }
                });
            },
            { threshold: 0.2, rootMargin: '0px 0px -100px 0px' }
        );

        workItems.forEach(item => workObserver.observe(item));

        // Approach steps animation
        const approachSteps = document.querySelectorAll('[data-approach-step]');
        const approachObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('approach__step--visible');
                        }, index * 300);
                    }
                });
            },
            { threshold: 0.3, rootMargin: '0px 0px -50px 0px' }
        );

        approachSteps.forEach(step => approachObserver.observe(step));

        // Stats counter animation
        const stats = document.querySelectorAll('[data-stat]');
        const statsObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        stats.forEach(stat => statsObserver.observe(stat));
    }

    // ==========================================================================
    // PARALLAX EFFECTS
    // ==========================================================================
    setupParallaxEffects() {
        // Floating geometry shapes in work header
        const geometryShapes = document.querySelectorAll('.geometry__shape');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            geometryShapes.forEach((shape, index) => {
                const rate = scrolled * (0.1 + index * 0.05);
                const rotation = scrolled * (0.02 + index * 0.01);
                shape.style.transform = `translateY(${rate}px) rotate(${rotation}deg)`;
            });
        });

        // Hero background layers parallax
        const bgLayers = document.querySelectorAll('.hero__bg-layer');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            bgLayers.forEach((layer, index) => {
                const rate = scrolled * (0.05 + index * 0.02);
                layer.style.transform = `translateY(${rate}px)`;
            });
        });
    }

    // ==========================================================================
    // MOUSE EFFECTS & INTERACTIONS
    // ==========================================================================
    setupMouseEffects() {
        // Custom cursor effect
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.innerHTML = '<div class="cursor__dot"></div><div class="cursor__ring"></div>';
        document.body.appendChild(cursor);

        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Smooth cursor animation
        const animateCursor = () => {
            const dx = mouseX - cursorX;
            const dy = mouseY - cursorY;
            
            cursorX += dx * 0.1;
            cursorY += dy * 0.1;
            
            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        // Cursor hover effects
        const interactiveElements = document.querySelectorAll('a, button, .work__item, .approach__step');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor--hover');
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor--hover');
            });
        });

        // Magnetic effect for buttons
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0)';
            });
        });
    }

    // ==========================================================================
    // SMOOTH SCROLLING
    // ==========================================================================
    setupSmoothScrolling() {
        // Smooth scroll to section
        this.smoothScrollTo = (target) => {
            const targetPosition = target.offsetTop - 100;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 1000;
            let start = null;

            const animation = (currentTime) => {
                if (start === null) start = currentTime;
                const timeElapsed = currentTime - start;
                const run = this.easeInOutCubic(timeElapsed, startPosition, distance, duration);
                window.scrollTo(0, run);
                if (timeElapsed < duration) requestAnimationFrame(animation);
            };

            requestAnimationFrame(animation);
        };

        // Easing function
        this.easeInOutCubic = (t, b, c, d) => {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t * t + b;
            t -= 2;
            return c / 2 * (t * t * t + 2) + b;
        };
    }

    // ==========================================================================
    // MOBILE MENU
    // ==========================================================================
    setupMobileMenu() {
        const navToggle = document.querySelector('[data-nav-toggle]');
        const navMenu = document.querySelector('.nav__menu');
        const navLinks = document.querySelectorAll('.nav__link');

        if (navToggle && navMenu) {
            // Animate menu items
            navLinks.forEach((link, index) => {
                link.style.opacity = '0';
                link.style.transform = 'translateY(20px)';
                
                if (navToggle.classList.contains('nav__toggle--active')) {
                    setTimeout(() => {
                        link.style.transition = 'all 0.3s ease';
                        link.style.opacity = '1';
                        link.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }
    }

    // ==========================================================================
    // PERFORMANCE OPTIMIZATIONS
    // ==========================================================================
    setupPerformanceOptimizations() {
        // Throttle scroll events
        let ticking = false;
        
        const updateOnScroll = () => {
            // Update scroll-based animations
            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateOnScroll);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick, { passive: true });

        // Lazy loading for images
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '50px' }
        );

        images.forEach(img => imageObserver.observe(img));

        // Debounce resize events
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    }

    // ==========================================================================
    // PARTICLE SYSTEM
    // ==========================================================================
    setupParticleSystem() {
        const particles = document.querySelectorAll('.particle');
        
        particles.forEach((particle, index) => {
            // Randomize particle properties
            const size = Math.random() * 6 + 2;
            const duration = Math.random() * 20 + 15;
            const delay = Math.random() * 10;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `${delay}s`;
        });

        // Interactive particle movement on mouse move
        let mouseX = 0;
        let mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX / window.innerWidth;
            mouseY = e.clientY / window.innerHeight;
            
            particles.forEach((particle, index) => {
                const speed = (index + 1) * 0.5;
                const x = (mouseX - 0.5) * speed;
                const y = (mouseY - 0.5) * speed;
                
                particle.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }

    // ==========================================================================
    // NOISE OVERLAY
    // ==========================================================================
    setupNoiseOverlay() {
        const noiseOverlay = document.querySelector('.noise-overlay');
        
        if (noiseOverlay) {
            // Subtle noise animation
            let noiseOffset = 0;
            
            const animateNoise = () => {
                noiseOffset += 0.1;
                noiseOverlay.style.backgroundPosition = `${noiseOffset}px ${noiseOffset}px`;
                requestAnimationFrame(animateNoise);
            };
            
            animateNoise();
        }
    }

    // ==========================================================================
    // ANIMATION SYSTEM
    // ==========================================================================
    startAnimations() {
        // Staggered entrance animations
        const animatedElements = document.querySelectorAll('.hero__title-line, .hero__subtitle, .hero__cta');
        
        animatedElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });

        // Continuous floating animations
        this.startFloatingAnimations();
        
        // Background gradient animations
        this.startBackgroundAnimations();
    }

    startFloatingAnimations() {
        // Subtle floating effect for various elements
        const floatingElements = document.querySelectorAll('.hero__grid-item, .work__item, .approach__step');
        
        floatingElements.forEach((element, index) => {
            const delay = index * 0.5;
            const duration = 4 + Math.random() * 2;
            
            element.style.animation = `floating ${duration}s ease-in-out ${delay}s infinite`;
        });
    }

    startBackgroundAnimations() {
        // Animate background gradients
        const bgLayers = document.querySelectorAll('.hero__bg-layer');
        
        bgLayers.forEach((layer, index) => {
            const duration = 20 + index * 5;
            const delay = index * 2;
            
            layer.style.animation = `bgFloat${index + 1} ${duration}s ease-in-out ${delay}s infinite`;
        });
    }

    // ==========================================================================
    // UTILITY FUNCTIONS
    // ==========================================================================
    animateCounter(element) {
        const target = parseInt(element.dataset.stat);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };
        
        updateCounter();
    }

    handleResize() {
        // Handle responsive adjustments
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            document.body.classList.add('mobile');
        } else {
            document.body.classList.remove('mobile');
        }
    }

    // ==========================================================================
    // EVENT LISTENERS
    // ==========================================================================
    setupEventListeners() {
        // Performance monitoring
        window.addEventListener('load', () => {
            this.logPerformance();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });

        // Touch gestures for mobile
        if ('ontouchstart' in window) {
            this.setupTouchGestures();
        }
    }

    logPerformance() {
        if ('performance' in window) {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                console.log('🚀 Nexus Studio Performance:');
                console.log(`Page Load: ${Math.round(perfData.loadEventEnd - perfData.loadEventStart)}ms`);
                console.log(`DOM Ready: ${Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart)}ms`);
                console.log(`Total Time: ${Math.round(perfData.loadEventEnd - perfData.fetchStart)}ms`);
            }
        }
    }

    handleKeyboardNavigation(e) {
        // Arrow key navigation
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.navigateToNextSection();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.navigateToPreviousSection();
        }
    }

    navigateToNextSection() {
        const sections = Array.from(document.querySelectorAll('section'));
        const currentSection = this.getCurrentSection(sections);
        const nextSection = sections[sections.indexOf(currentSection) + 1];
        
        if (nextSection) {
            this.smoothScrollTo(nextSection);
        }
    }

    navigateToPreviousSection() {
        const sections = Array.from(document.querySelectorAll('section'));
        const currentSection = this.getCurrentSection(sections);
        const prevSection = sections[sections.indexOf(currentSection) - 1];
        
        if (prevSection) {
            this.smoothScrollTo(prevSection);
        }
    }

    getCurrentSection(sections) {
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        for (let section of sections) {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
                return section;
            }
        }
        
        return sections[0];
    }

    setupTouchGestures() {
        let startY = 0;
        let startX = 0;
        
        document.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
            startX = e.touches[0].clientX;
        });
        
        document.addEventListener('touchend', (e) => {
            const endY = e.changedTouches[0].clientY;
            const endX = e.changedTouches[0].clientX;
            const deltaY = startY - endY;
            const deltaX = startX - endX;
            
            // Swipe up/down navigation
            if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
                if (deltaY > 0) {
                    this.navigateToNextSection();
                } else {
                    this.navigateToPreviousSection();
                }
            }
        });
    }
}

// ==========================================================================
// INITIALIZATION & UTILITIES
// ==========================================================================

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add loading animation
    document.body.classList.add('loaded');
    
    // Initialize the website
    new NexusStudio();
    
    // Preload critical resources
    this.preloadResources();
    
    // Add CSS animations
    this.addCSSAnimations();
});

// Preload critical resources
function preloadResources() {
    // Preload fonts
    const fontLinks = document.querySelectorAll('link[rel="preconnect"]');
    fontLinks.forEach(link => {
        if (link.href.includes('fonts.googleapis.com')) {
            const fontLink = document.createElement('link');
            fontLink.rel = 'preload';
            fontLink.as = 'style';
            fontLink.href = link.href;
            document.head.appendChild(fontLink);
        }
    });
}

// Add CSS animations dynamically
function addCSSAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floating {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
        
        .section--visible {
            animation: sectionReveal 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        @keyframes sectionReveal {
            from {
                opacity: 0;
                transform: translateY(50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .work__item--visible {
            animation: workItemReveal 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        @keyframes workItemReveal {
            from {
                opacity: 0;
                transform: translateY(50px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        .approach__step--visible {
            animation: approachStepReveal 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        @keyframes approachStepReveal {
            from {
                opacity: 0;
                transform: translateY(30px) rotateX(10deg);
            }
            to {
                opacity: 1;
                transform: translateY(0) rotateX(0deg);
            }
        }
        
        .custom-cursor {
            position: fixed;
            top: 0;
            left: 0;
            width: 20px;
            height: 20px;
            pointer-events: none;
            z-index: 10000;
            mix-blend-mode: difference;
        }
        
        .cursor__dot {
            width: 8px;
            height: 8px;
            background: var(--color-accent);
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            transition: all 0.1s ease;
        }
        
        .cursor__ring {
            width: 32px;
            height: 32px;
            border: 2px solid var(--color-accent);
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            transition: all 0.3s ease;
        }
        
        .cursor--hover .cursor__dot {
            transform: translate(-50%, -50%) scale(1.5);
        }
        
        .cursor--hover .cursor__ring {
            transform: translate(-50%, -50%) scale(1.2);
            border-color: var(--color-accent-light);
        }
        
        .mobile .custom-cursor {
            display: none;
        }
    `;
    document.head.appendChild(style);
}

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NexusStudio;
}
