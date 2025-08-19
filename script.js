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
        this.setupInteractiveDemos();
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

    // Interactive project demos
    setupInteractiveDemos() {
        this.setupNeuralCanvas();
        this.setupQuantumVisualizer();
        this.setupHoloSpace();
        this.setupBioSync();
    }

    // Neural Canvas AI Learning Demo
    setupNeuralCanvas() {
        const canvas = document.getElementById('neuralCanvas');
        if (!canvas) return;

        const cells = canvas.querySelectorAll('[data-cell]');
        let aiLearning = false;
        let userPattern = [];

        cells.forEach((cell, index) => {
            cell.addEventListener('click', () => {
                if (!aiLearning) {
                    aiLearning = true;
                    this.startAILearning(canvas);
                }
                
                cell.classList.add('active');
                userPattern.push(index);
                
                setTimeout(() => {
                    cell.classList.remove('active');
                }, 300);

                // AI responds to user pattern
                setTimeout(() => {
                    this.aiResponse(canvas, userPattern);
                }, 500);
            });
        });
    }

    startAILearning(canvas) {
        const status = canvas.querySelector('.canvas__ai-status');
        if (status) {
            status.textContent = 'AI: Learning...';
            status.style.animation = 'aiPulse 1s ease-in-out infinite';
        }
    }

    aiResponse(canvas, userPattern) {
        const cells = canvas.querySelectorAll('[data-cell]');
        const status = canvas.querySelector('.canvas__ai-status');
        
        if (status) {
            status.textContent = 'AI: Responding...';
        }

        // AI creates a response pattern
        const aiPattern = this.generateAIPattern(userPattern);
        
        aiPattern.forEach((cellIndex, delay) => {
            setTimeout(() => {
                const cell = cells[cellIndex];
                if (cell) {
                    cell.style.background = 'rgba(255, 0, 110, 0.8)';
                    cell.style.transform = 'scale(1.2)';
                    
                    setTimeout(() => {
                        cell.style.background = 'rgba(0, 212, 255, 0.1)';
                        cell.style.transform = 'scale(1)';
                    }, 200);
                }
            }, delay * 200);
        });

        setTimeout(() => {
            if (status) {
                status.textContent = 'AI: Learned!';
                status.style.animation = 'none';
            }
        }, aiPattern.length * 200 + 500);
    }

    generateAIPattern(userPattern) {
        // AI generates a complementary pattern
        const aiPattern = [];
        userPattern.forEach(index => {
            aiPattern.push((index + 4) % 9); // Opposite side
        });
        return aiPattern;
    }

    // Quantum Visualizer Demo
    setupQuantumVisualizer() {
        const canvas = document.getElementById('quantumCanvas');
        if (!canvas) return;

        const qubit = canvas.querySelector('[data-qubit]');
        const controls = canvas.querySelectorAll('[data-control]');
        let superposition = false;
        let rotation = 0;

        controls.forEach(control => {
            control.addEventListener('click', () => {
                const type = control.getAttribute('data-control');
                
                if (type === 'superposition') {
                    superposition = !superposition;
                    this.toggleSuperposition(qubit, superposition);
                } else if (type === 'rotation') {
                    rotation += 90;
                    this.rotateQubit(qubit, rotation);
                }
            });
        });

        // Add mouse interaction
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.quantumEntanglement(qubit, x, y);
        });
    }

    toggleSuperposition(qubit, active) {
        if (active) {
            qubit.style.filter = 'blur(2px)';
            qubit.style.opacity = '0.7';
            qubit.style.transform = 'scale(1.5)';
        } else {
            qubit.style.filter = 'blur(0px)';
            qubit.style.opacity = '1';
            qubit.style.transform = 'scale(1)';
        }
    }

    rotateQubit(qubit, angle) {
        qubit.style.transform = `rotate(${angle}deg)`;
    }

    quantumEntanglement(qubit, x, y) {
        const centerX = 60;
        const centerY = 60;
        const deltaX = (x - centerX) / 10;
        const deltaY = (y - centerY) / 10;
        
        qubit.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    }

    // HoloSpace Demo
    setupHoloSpace() {
        const canvas = document.getElementById('holoCanvas');
        if (!canvas) return;

        const planet = canvas.querySelector('[data-planet]');
        const asteroid = canvas.querySelector('[data-asteroid]');
        const nebula = canvas.querySelector('[data-nebula]');
        const panel = canvas.querySelector('[data-panel]');

        // Add 3D mouse interaction
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.updateHoloPerspective(planet, asteroid, nebula, panel, x, y);
        });

        // Add click interactions
        planet.addEventListener('click', () => {
            this.activateHoloPlanet(planet);
        });

        panel.addEventListener('click', () => {
            this.toggleHoloInterface(panel);
        });
    }

    updateHoloPerspective(planet, asteroid, nebula, panel, x, y) {
        const centerX = 200;
        const centerY = 200;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (x - centerX) / 20;
        
        planet.style.transform = `translate(-50%, -50%) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        asteroid.style.transform = `rotateX(${-rotateX}deg) rotateY(${-rotateY}deg)`;
        nebula.style.transform = `rotateX(${rotateX * 0.5}deg) rotateY(${rotateY * 0.5}deg)`;
    }

    activateHoloPlanet(planet) {
        planet.style.background = 'linear-gradient(45deg, #ff006e, #00ff88)';
        planet.style.boxShadow = '0 0 40px rgba(255, 0, 110, 0.8)';
        
        setTimeout(() => {
            planet.style.background = 'linear-gradient(45deg, var(--color-accent), #ff006e)';
            planet.style.boxShadow = 'none';
        }, 1000);
    }

    toggleHoloInterface(panel) {
        panel.classList.toggle('active');
        if (panel.classList.contains('active')) {
            panel.style.background = 'rgba(0, 212, 255, 0.9)';
            panel.style.borderColor = '#ff006e';
        } else {
            panel.style.background = 'rgba(0, 0, 0, 0.8)';
            panel.style.borderColor = 'var(--color-accent)';
        }
    }

    // BioSync Demo
    setupBioSync() {
        const canvas = document.getElementById('bioCanvas');
        if (!canvas) return;

        const heartbeat = canvas.querySelector('[data-heartbeat]');
        const waves = canvas.querySelectorAll('[data-wave]');
        
        // Simulate biometric data
        this.simulateHeartbeat(heartbeat);
        this.simulateBrainwaves(waves);
        
        // Add interaction
        canvas.addEventListener('click', () => {
            this.triggerBioResponse(heartbeat, waves);
        });
    }

    simulateHeartbeat(heartbeat) {
        setInterval(() => {
            heartbeat.style.animation = 'heartbeatPulse 0.8s ease-in-out';
            setTimeout(() => {
                heartbeat.style.animation = 'heartbeatPulse 2s ease-in-out infinite';
            }, 800);
        }, 3000);
    }

    simulateBrainwaves(waves) {
        waves.forEach((wave, index) => {
            wave.style.animationDelay = `${index * 0.3}s`;
        });
    }

    triggerBioResponse(heartbeat, waves) {
        // Intensify biometric response
        heartbeat.style.animation = 'heartbeatPulse 0.5s ease-in-out';
        heartbeat.style.filter = 'brightness(1.5)';
        
        waves.forEach(wave => {
            wave.style.animation = 'brainwave 0.8s ease-in-out';
            wave.style.filter = 'brightness(1.3)';
        });
        
        setTimeout(() => {
            heartbeat.style.animation = 'heartbeatPulse 2s ease-in-out infinite';
            heartbeat.style.filter = 'brightness(1)';
            
            waves.forEach(wave => {
                wave.style.animation = 'brainwave 1.5s ease-in-out infinite';
                wave.style.filter = 'brightness(1)';
            });
        }, 800);
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

// Demo Launch Functions
function launchNeuralCanvas() {
    // Create fullscreen neural canvas experience
    const overlay = document.createElement('div');
    overlay.className = 'demo-overlay';
    overlay.innerHTML = `
        <div class="demo-container">
            <div class="demo-header">
                <h2>Neural Canvas - AI Learning Interface</h2>
                <button class="demo-close" onclick="closeDemo()">×</button>
            </div>
            <div class="demo-content">
                <div class="neural-demo">
                    <div class="neural-grid" id="fullscreenNeuralGrid"></div>
                    <div class="neural-controls">
                        <button onclick="trainAI()">Train AI</button>
                        <button onclick="resetAI()">Reset</button>
                        <div class="ai-status">AI Status: Ready</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    initializeFullscreenNeural();
}

function launchQuantumVisualizer() {
    const overlay = document.createElement('div');
    overlay.className = 'demo-overlay';
    overlay.innerHTML = `
        <div class="demo-container">
            <div class="demo-header">
                <h2>Quantum Visualizer - Qubit Manipulation</h2>
                <button class="demo-close" onclick="closeDemo()">×</button>
            </div>
            <div class="demo-content">
                <div class="quantum-demo">
                    <div class="quantum-workspace" id="fullscreenQuantum"></div>
                    <div class="quantum-controls">
                        <button onclick="measureQubit()">Measure</button>
                        <button onclick="entangleQubits()">Entangle</button>
                        <div class="quantum-state">State: |0⟩</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    initializeFullscreenQuantum();
}

function launchHoloSpace() {
    const overlay = document.createElement('div');
    overlay.className = 'demo-overlay';
    overlay.innerHTML = `
        <div class="demo-container">
            <div class="demo-header">
                <h2>HoloSpace - 3D Holographic Interface</h2>
                <button class="demo-close" onclick="closeDemo()">×</button>
            </div>
            <div class="demo-content">
                <div class="holo-demo">
                    <div class="holo-workspace" id="fullscreenHolo"></div>
                    <div class="holo-controls">
                        <button onclick="navigateHolo()">Navigate</button>
                        <button onclick="createHoloObject()">Create Object</button>
                        <div class="holo-position">Position: (0, 0, 0)</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    initializeFullscreenHolo();
}

function launchBioSync() {
    const overlay = document.createElement('div');
    overlay.className = 'demo-overlay';
    overlay.innerHTML = `
        <div class="demo-container">
            <div class="demo-header">
                <h2>BioSync - Biometric Interface</h2>
                <button class="demo-close" onclick="closeDemo()">×</button>
            </div>
            <div class="demo-content">
                <div class="bio-demo">
                    <div class="bio-monitor" id="fullscreenBio"></div>
                    <div class="bio-controls">
                        <button onclick="calibrateBio()">Calibrate</button>
                        <button onclick="optimizeBio()">Optimize</button>
                        <div class="bio-metrics">Heart Rate: -- BPM</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    initializeFullscreenBio();
}

function closeDemo() {
    const overlay = document.querySelector('.demo-overlay');
    if (overlay) {
        overlay.remove();
    }
}

// Info functions
function showNeuralCanvasInfo() {
    alert('Neural Canvas: An AI-powered interface that learns from user interactions and creates personalized experiences. Click on the grid cells to teach the AI your pattern!');
}

function showQuantumInfo() {
    alert('Quantum Visualizer: Experience quantum computing concepts through interactive qubit manipulation. Use the controls to explore superposition and entanglement!');
}

function showHoloInfo() {
    alert('HoloSpace: Navigate through a 3D holographic interface where websites exist as floating islands. Move your mouse to change perspective!');
}

function showBioInfo() {
    alert('BioSync: A revolutionary interface that responds to your biometric data. The website literally comes alive based on your physiological state!');
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
