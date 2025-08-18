// ∞ INFINITE SCROLLS ∞ - Digital Art Installation JavaScript

// Global Variables
let audioContext;
let isPaused = false;
let scrollCount = 0;
let dynamicSectionCount = 0;
let cursorTrails = [];

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initLoadingScreen();
    initArtInstallation();
    initGenerativeArt();
    initPoetrySystem();
    initFractalArt();
    initParticleSystem();
    initGlitchEffects();
    initInfiniteScroll();
    initAudioVisualizer();
    initCursorEffects();
    initEasterEggs();
    initScrollProgress();
    initDynamicSections();
});

// Loading Screen
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    // Simulate loading time
    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 1000);
    }, 3000);
}

// Main Art Installation
function initArtInstallation() {
    // Custom cursor movement
    document.addEventListener('mousemove', (e) => {
        const cursor = document.querySelector('body::before');
        if (cursor) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        }
    });

    // Floating elements parallax
    const floatingElements = document.querySelectorAll('.floating-element');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        floatingElements.forEach(element => {
            const speed = parseFloat(element.dataset.speed);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.1}deg)`;
        });
    });

    // Navigation controls
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            switch(action) {
                case 'pause':
                    togglePause();
                    break;
                case 'random':
                    triggerRandomEffect();
                    break;
                case 'fullscreen':
                    toggleFullscreen();
                    break;
            }
        });
    });
}

// Generative Art Canvas
function initGenerativeArt() {
    const canvas = document.getElementById('generativeCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let particles = [];
    let mouseX = 0;
    let mouseY = 0;

    // Mouse tracking
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        
        // Create particles on mouse move
        for (let i = 0; i < 3; i++) {
            particles.push(new Particle(mouseX, mouseY));
        }
    });

    // Particle class
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 4;
            this.vy = (Math.random() - 0.5) * 4;
            this.life = 1;
            this.decay = Math.random() * 0.02 + 0.01;
            this.size = Math.random() * 4 + 2;
            this.hue = Math.random() * 360;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life -= this.decay;
            this.size *= 0.99;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.life;
            ctx.fillStyle = `hsl(${this.hue}, 70%, 60%)`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // Animation loop
    function animate() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Update and draw particles
        particles = particles.filter(particle => {
            particle.update();
            particle.draw();
            return particle.life > 0;
        });

        // Draw mouse trail
        if (mouseX > 0 && mouseY > 0) {
            ctx.strokeStyle = `hsl(${Date.now() * 0.1 % 360}, 70%, 60%)`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(mouseX, mouseY);
            ctx.lineTo(mouseX + Math.random() * 20 - 10, mouseY + Math.random() * 20 - 10);
            ctx.stroke();
        }

        requestAnimationFrame(animate);
    }

    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    });
}

// Interactive Poetry System
function initPoetrySystem() {
    const poetryLines = document.querySelectorAll('.poetry-line');
    const poetryBtns = document.querySelectorAll('.poetry-btn');

    // Show poetry lines on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    });

    poetryLines.forEach(line => observer.observe(line));

    // Poetry controls
    poetryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            switch(action) {
                case 'rearrange':
                    rearrangePoetry();
                    break;
                case 'randomize':
                    randomizePoetry();
                    break;
                case 'animate':
                    animatePoetry();
                    break;
            }
        });
    });
}

function rearrangePoetry() {
    const poetryLines = document.querySelectorAll('.poetry-line');
    const lines = Array.from(poetryLines);
    
    lines.forEach((line, index) => {
        setTimeout(() => {
            line.style.transform = `translateX(${Math.random() * 200 - 100}px) rotate(${Math.random() * 20 - 10}deg)`;
            line.style.transition = 'all 0.8s ease';
        }, index * 200);
    });

    setTimeout(() => {
        lines.forEach((line, index) => {
            setTimeout(() => {
                line.style.transform = 'translateX(0) rotate(0deg)';
            }, index * 100);
        });
    }, 1000);
}

function randomizePoetry() {
    const poetryLines = document.querySelectorAll('.poetry-line');
    const lines = Array.from(poetryLines);
    
    lines.forEach((line, index) => {
        setTimeout(() => {
            line.style.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
            line.style.fontSize = `${Math.random() * 1 + 1}rem`;
        }, index * 200);
    });
}

function animatePoetry() {
    const poetryLines = document.querySelectorAll('.poetry-line');
    
    poetryLines.forEach((line, index) => {
        setInterval(() => {
            line.style.transform = `translateY(${Math.sin(Date.now() * 0.001 + index) * 10}px)`;
        }, 50);
    });
}

// Fractal Art
function initFractalArt() {
    const canvas = document.getElementById('fractalCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const fractalSlider = document.getElementById('fractalDepth');
    
    function drawFractal(x, y, size, depth) {
        if (depth <= 0) return;

        const colors = ['#ff0066', '#00ffff', '#ffff00', '#ff00ff'];
        ctx.strokeStyle = colors[depth % colors.length];
        ctx.lineWidth = depth * 0.5;

        // Draw fractal pattern
        ctx.beginPath();
        ctx.moveTo(x - size/2, y - size/2);
        ctx.lineTo(x + size/2, y - size/2);
        ctx.lineTo(x + size/2, y + size/2);
        ctx.lineTo(x - size/2, y + size/2);
        ctx.closePath();
        ctx.stroke();

        // Recursive calls
        const newSize = size * 0.7;
        drawFractal(x - size/2, y - size/2, newSize, depth - 1);
        drawFractal(x + size/2, y - size/2, newSize, depth - 1);
        drawFractal(x + size/2, y + size/2, newSize, depth - 1);
        drawFractal(x - size/2, y + size/2, newSize, depth - 1);
    }

    function animateFractal() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const depth = parseInt(fractalSlider.value);
        const time = Date.now() * 0.001;
        
        ctx.save();
        ctx.translate(canvas.width/2, canvas.height/2);
        ctx.rotate(time);
        drawFractal(0, 0, Math.min(canvas.width, canvas.height) * 0.8, depth);
        ctx.restore();
        
        requestAnimationFrame(animateFractal);
    }

    animateFractal();

    // Slider interaction
    fractalSlider.addEventListener('input', () => {
        // Fractal updates automatically
    });
}

// Particle System
function initParticleSystem() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let particles = [];
    let animationId;

    class Particle {
        constructor(x, y, vx, vy) {
            this.x = x || Math.random() * canvas.width;
            this.y = y || Math.random() * canvas.height;
            this.vx = vx || (Math.random() - 0.5) * 2;
            this.vy = vy || (Math.random() - 0.5) * 2;
            this.size = Math.random() * 3 + 1;
            this.life = 1;
            this.decay = Math.random() * 0.01 + 0.005;
            this.hue = Math.random() * 360;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life -= this.decay;
            this.size *= 0.99;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.life;
            ctx.fillStyle = `hsl(${this.hue}, 70%, 60%)`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    function animate() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles = particles.filter(particle => {
            particle.update();
            particle.draw();
            return particle.life > 0;
        });

        animationId = requestAnimationFrame(animate);
    }

    animate();

    // Particle controls
    const particleBtns = document.querySelectorAll('.particle-btn');
    particleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            switch(action) {
                case 'explode':
                    explodeParticles();
                    break;
                case 'implode':
                    implodeParticles();
                    break;
                case 'spiral':
                    spiralParticles();
                    break;
            }
        });
    });
}

function explodeParticles() {
    const canvas = document.getElementById('particleCanvas');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    for (let i = 0; i < 50; i++) {
        const angle = (Math.PI * 2 * i) / 50;
        const speed = Math.random() * 5 + 2;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        
        particles.push(new Particle(centerX, centerY, vx, vy));
    }
}

function implodeParticles() {
    const canvas = document.getElementById('particleCanvas');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    for (let i = 0; i < 50; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const dx = centerX - x;
        const dy = centerY - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const vx = (dx / distance) * 3;
        const vy = (dy / distance) * 3;
        
        particles.push(new Particle(x, y, vx, vy));
    }
}

function spiralParticles() {
    const canvas = document.getElementById('particleCanvas');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    for (let i = 0; i < 100; i++) {
        const angle = (Math.PI * 2 * i) / 100;
        const radius = Math.random() * 100 + 50;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        const vx = -Math.sin(angle) * 2;
        const vy = Math.cos(angle) * 2;
        
        particles.push(new Particle(x, y, vx, vy));
    }
}

// Glitch Effects
function initGlitchEffects() {
    const glitchBtns = document.querySelectorAll('.glitch-btn');
    
    glitchBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            switch(action) {
                case 'trigger':
                    triggerGlitch();
                    break;
                case 'random':
                    randomGlitch();
                    break;
            }
        });
    });
}

function triggerGlitch() {
    const glitchTexts = document.querySelectorAll('.glitch-text');
    
    glitchTexts.forEach((text, index) => {
        setTimeout(() => {
            text.style.animation = 'none';
            text.offsetHeight; // Trigger reflow
            text.style.animation = `glitch${index + 1} 0.3s ease`;
        }, index * 100);
    });
}

function randomGlitch() {
    const glitchTexts = document.querySelectorAll('.glitch-text');
    
    setInterval(() => {
        glitchTexts.forEach(text => {
            text.style.transform = `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)`;
            text.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
        });
    }, 100);
}

// Infinite Scroll Generation
function initInfiniteScroll() {
    let lastScrollTop = 0;
    let scrollDirection = 'down';
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        scrollDirection = scrollTop > lastScrollTop ? 'down' : 'up';
        lastScrollTop = scrollTop;
        
        // Generate new sections when scrolling down
        if (scrollDirection === 'down' && scrollTop > document.body.scrollHeight - window.innerHeight * 2) {
            generateNewSection();
        }
    });
}

function generateNewSection() {
    const dynamicSections = document.getElementById('dynamicSections');
    const sectionTypes = ['generative', 'poetry', 'fractal', 'particle', 'glitch'];
    const randomType = sectionTypes[Math.floor(Math.random() * sectionTypes.length)];
    
    const newSection = document.createElement('section');
    newSection.className = `art-section ${randomType}-section`;
    newSection.dataset.section = `${randomType}-${++dynamicSectionCount}`;
    
    // Generate unique content based on type
    const content = generateSectionContent(randomType, dynamicSectionCount);
    newSection.innerHTML = content;
    
    dynamicSections.appendChild(newSection);
    
    // Initialize the new section
    setTimeout(() => {
        initSectionByType(randomType, newSection);
    }, 100);
}

function generateSectionContent(type, count) {
    const titles = [
        'Digital Dreams',
        'Pixel Poetry',
        'Code Chaos',
        'Virtual Visions',
        'Digital Dimensions',
        'Cyber Creations',
        'Matrix Memories',
        'Digital Delirium'
    ];
    
    const title = titles[count % titles.length];
    
    switch(type) {
        case 'generative':
            return `
                <div class="section-content">
                    <h2 class="section-title">${title}</h2>
                    <div class="generative-canvas-container">
                        <canvas class="generative-canvas" id="genCanvas${count}"></canvas>
                    </div>
                    <div class="interaction-hint">Move your mouse to create art</div>
                </div>
            `;
        case 'poetry':
            return `
                <div class="section-content">
                    <div class="poetry-container">
                        <div class="poetry-line" data-line="1">Digital whispers</div>
                        <div class="poetry-line" data-line="2">In binary code</div>
                        <div class="poetry-line" data-line="3">Creating beauty</div>
                        <div class="poetry-line" data-line="4">From chaos</div>
                    </div>
                </div>
            `;
        default:
            return `
                <div class="section-content">
                    <h2 class="section-title">${title}</h2>
                    <p>New art piece #${count}</p>
                </div>
            `;
    }
}

// Audio Visualizer
function initAudioVisualizer() {
    const canvas = document.getElementById('audioCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 100;

    // Create audio context
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.log('Web Audio API not supported');
        return;
    }

    function animateAudio() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Generate fake audio data for visualization
        const bars = 20;
        const barWidth = canvas.width / bars;
        
        for (let i = 0; i < bars; i++) {
            const height = Math.random() * canvas.height * 0.8;
            const x = i * barWidth;
            const y = canvas.height - height;
            
            const hue = (i / bars) * 360;
            ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
            ctx.fillRect(x, y, barWidth - 2, height);
        }
        
        requestAnimationFrame(animateAudio);
    }

    animateAudio();
}

// Cursor Effects
function initCursorEffects() {
    document.addEventListener('mousemove', (e) => {
        // Create cursor trail
        if (Math.random() > 0.7) {
            createCursorTrail(e.clientX, e.clientY);
        }
    });
}

function createCursorTrail(x, y) {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.left = x + 'px';
    trail.style.top = y + 'px';
    document.body.appendChild(trail);
    
    setTimeout(() => {
        trail.remove();
    }, 1000);
}

// Easter Eggs
function initEasterEggs() {
    // Konami Code
    let konamiCode = [];
    const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.keyCode);
        
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            triggerRainbowMode();
            konamiCode = [];
        }
    });

    // Hidden click areas
    document.addEventListener('click', (e) => {
        if (e.clientX < 50 && e.clientY < 50) {
            triggerSecretEffect();
        }
    });
}

function triggerRainbowMode() {
    document.body.classList.add('rainbow-mode');
    
    setTimeout(() => {
        document.body.classList.remove('rainbow-mode');
    }, 10000);
}

function triggerSecretEffect() {
    // Create explosion effect
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            left: 25px;
            top: 25px;
            width: 10px;
            height: 10px;
            background: hsl(${Math.random() * 360}, 70%, 60%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
        `;
        
        const angle = (Math.PI * 2 * i) / 20;
        const speed = Math.random() * 5 + 2;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        
        document.body.appendChild(particle);
        
        let x = 25, y = 25;
        const animate = () => {
            x += vx;
            y += vy;
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            
            if (x > 0 && x < window.innerWidth && y > 0 && y < window.innerHeight) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        
        animate();
    }
}

// Scroll Progress
function initScrollProgress() {
    const progressBar = document.querySelector('.progress-bar');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        if (progressBar) {
            progressBar.style.width = scrollPercent + '%';
        }
    });
}

// Utility Functions
function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        document.body.style.animationPlayState = 'paused';
    } else {
        document.body.style.animationPlayState = 'running';
    }
}

function triggerRandomEffect() {
    const effects = [
        () => document.body.style.filter = 'hue-rotate(180deg)',
        () => document.body.style.transform = 'scale(0.95)',
        () => document.body.style.animation = 'rainbow 2s infinite',
        () => createExplosion(),
        () => triggerGlitch()
    ];
    
    const randomEffect = effects[Math.floor(Math.random() * effects.length)];
    randomEffect();
    
    setTimeout(() => {
        document.body.style.filter = '';
        document.body.style.transform = '';
        document.body.style.animation = '';
    }, 3000);
}

function createExplosion() {
    // Create explosion particles
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            left: ${window.innerWidth / 2}px;
            top: ${window.innerHeight / 2}px;
            width: 8px;
            height: 8px;
            background: hsl(${Math.random() * 360}, 70%, 60%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
        `;
        
        document.body.appendChild(particle);
        
        const angle = (Math.PI * 2 * i) / 30;
        const speed = Math.random() * 8 + 4;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        
        let x = window.innerWidth / 2, y = window.innerHeight / 2;
        const animate = () => {
            x += vx;
            y += vy;
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            
            if (x > 0 && x < window.innerWidth && y > 0 && y < window.innerHeight) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        
        animate();
    }
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// Initialize sections by type
function initSectionByType(type, section) {
    switch(type) {
        case 'generative':
            // Initialize generative canvas for new section
            break;
        case 'poetry':
            // Initialize poetry animations for new section
            break;
        // Add other types as needed
    }
}

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(() => {
    // Handle scroll events efficiently
}, 16);

window.addEventListener('scroll', debouncedScrollHandler);

// Cleanup function
function cleanup() {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    if (audioContext) {
        audioContext.close();
    }
}

// Cleanup on page unload
window.addEventListener('beforeunload', cleanup);