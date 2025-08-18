// ∞ INFINITE SCROLLS ∞ - Digital Art Installation JavaScript

// Global Variables
let audioContext;
let isPaused = false;
let scrollCount = 0;
let dynamicSectionCount = 0;
let cursorTrails = [];
let isInsaneMode = false;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initLoadingScreen();
    initArtInstallation();
    initGenerativeArt();
    initPoetrySystem();
    initFractalArt();
    initParticleSystem();
    initGlitchEffects();
    initDNAVisualization();
    initMatrixRain();
    initNeuralNetworks();
    initSoundWaves();
    initQuantumEffects();
    initInfiniteScroll();
    initAudioVisualizer();
    initCursorEffects();
    initEasterEggs();
    initScrollProgress();
    initDynamicSections();
    initBackgroundParticles();
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
                case 'insane':
                    toggleInsaneMode();
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

// DNA Visualization
function initDNAVisualization() {
    const canvas = document.getElementById('dnaCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let time = 0;
    let dnaStrands = [];

    // Create DNA strands
    for (let i = 0; i < 20; i++) {
        dnaStrands.push({
            x: (i / 19) * canvas.width,
            y: 0,
            phase: Math.random() * Math.PI * 2,
            amplitude: 30 + Math.random() * 20
        });
    }

    function animateDNA() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw DNA helix
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 2;
        
        for (let i = 0; i < dnaStrands.length; i++) {
            const strand = dnaStrands[i];
            const y = strand.y;
            const x = strand.x + Math.sin(time + strand.phase) * strand.amplitude;
            
            // Draw base pairs
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + 20);
            ctx.stroke();
            
            // Draw complementary strand
            ctx.beginPath();
            ctx.moveTo(canvas.width - x, y);
            ctx.lineTo(canvas.width - x, y + 20);
            ctx.stroke();
            
            strand.y += 2;
            if (strand.y > canvas.height) {
                strand.y = -20;
            }
        }
        
        time += 0.05;
        requestAnimationFrame(animateDNA);
    }

    animateDNA();

    // DNA controls
    const dnaBtns = document.querySelectorAll('.dna-btn');
    dnaBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            switch(action) {
                case 'mutate':
                    mutateDNA();
                    break;
                case 'evolve':
                    evolveDNA();
                    break;
                case 'replicate':
                    replicateDNA();
                    break;
            }
        });
    });
}

function mutateDNA() {
    const canvas = document.getElementById('dnaCanvas');
    if (!canvas) return;
    
    // Create mutation effect
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            left: ${Math.random() * canvas.width}px;
            top: ${Math.random() * canvas.height}px;
            width: 4px;
            height: 4px;
            background: #ff0066;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
        `;
        
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 2000);
    }
}

function evolveDNA() {
    // Increase DNA complexity
    const canvas = document.getElementById('dnaCanvas');
    if (!canvas) return;
    
    canvas.style.filter = 'hue-rotate(180deg)';
    setTimeout(() => {
        canvas.style.filter = '';
    }, 1000);
}

function replicateDNA() {
    // Create DNA replication effect
    const canvas = document.getElementById('dnaCanvas');
    if (!canvas) return;
    
    canvas.style.transform = 'scale(1.1)';
    setTimeout(() => {
        canvas.style.transform = 'scale(1)';
    }, 500);
}

// Matrix Rain
function initMatrixRain() {
    const canvas = document.getElementById('matrixCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const matrixArray = matrix.split("");

    const fontSize = 10;
    const columns = canvas.width / fontSize;
    const drops = [];

    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }

    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0F0';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    setInterval(drawMatrix, 35);

    // Matrix controls
    const matrixBtns = document.querySelectorAll('.matrix-btn');
    matrixBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            switch(action) {
                case 'hack':
                    hackMatrix();
                    break;
                case 'glitch':
                    glitchMatrix();
                    break;
                case 'reset':
                    resetMatrix();
                    break;
            }
        });
    });
}

function hackMatrix() {
    const canvas = document.getElementById('matrixCanvas');
    if (!canvas) return;
    
    canvas.style.filter = 'invert(1) hue-rotate(180deg)';
    setTimeout(() => {
        canvas.style.filter = '';
    }, 2000);
}

function glitchMatrix() {
    const canvas = document.getElementById('matrixCanvas');
    if (!canvas) return;
    
    setInterval(() => {
        canvas.style.transform = `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)`;
    }, 100);
    
    setTimeout(() => {
        canvas.style.transform = '';
    }, 3000);
}

function resetMatrix() {
    const canvas = document.getElementById('matrixCanvas');
    if (!canvas) return;
    
    canvas.style.filter = '';
    canvas.style.transform = '';
}

// Neural Networks
function initNeuralNetworks() {
    const canvas = document.getElementById('neuralCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let neurons = [];
    let connections = [];

    // Create neurons
    for (let i = 0; i < 15; i++) {
        neurons.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 8 + 4,
            firing: false
        });
    }

    // Create connections
    for (let i = 0; i < neurons.length; i++) {
        for (let j = i + 1; j < neurons.length; j++) {
            if (Math.random() > 0.7) {
                connections.push({
                    from: i,
                    to: j,
                    strength: Math.random()
                });
            }
        }
    }

    function animateNeural() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update neurons
        neurons.forEach(neuron => {
            neuron.x += neuron.vx;
            neuron.y += neuron.vy;

            if (neuron.x < 0 || neuron.x > canvas.width) neuron.vx *= -1;
            if (neuron.y < 0 || neuron.y > canvas.height) neuron.vy *= -1;

            // Draw neuron
            ctx.beginPath();
            ctx.arc(neuron.x, neuron.y, neuron.size, 0, Math.PI * 2);
            ctx.fillStyle = neuron.firing ? '#ff8800' : '#fff';
            ctx.fill();
            ctx.strokeStyle = '#ff8800';
            ctx.stroke();
        });

        // Draw connections
        connections.forEach(connection => {
            const from = neurons[connection.from];
            const to = neurons[connection.to];
            
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.strokeStyle = `rgba(255, 136, 0, ${connection.strength})`;
            ctx.lineWidth = connection.strength * 3;
            ctx.stroke();
        });

        requestAnimationFrame(animateNeural);
    }

    animateNeural();

    // Neural controls
    const neuralBtns = document.querySelectorAll('.neural-btn');
    neuralBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            switch(action) {
                case 'learn':
                    learnNeural();
                    break;
                case 'connect':
                    connectNeural();
                    break;
                case 'fire':
                    fireNeural();
                    break;
            }
        });
    });
}

function learnNeural() {
    // Simulate learning
    neurons.forEach(neuron => {
        neuron.size += Math.random() * 2;
        if (neuron.size > 15) neuron.size = 15;
    });
}

function connectNeural() {
    // Add new connections
    for (let i = 0; i < 3; i++) {
        const from = Math.floor(Math.random() * neurons.length);
        const to = Math.floor(Math.random() * neurons.length);
        if (from !== to) {
            connections.push({
                from: from,
                to: to,
                strength: Math.random()
            });
        }
    }
}

function fireNeural() {
    // Fire random neurons
    neurons.forEach(neuron => {
        if (Math.random() > 0.8) {
            neuron.firing = true;
            setTimeout(() => {
                neuron.firing = false;
            }, 1000);
        }
    });
}

// Sound Waves
function initSoundWaves() {
    const canvas = document.getElementById('soundCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let time = 0;
    let waves = [];

    // Create multiple waves
    for (let i = 0; i < 5; i++) {
        waves.push({
            frequency: 0.02 + i * 0.01,
            amplitude: 50 + i * 20,
            phase: i * Math.PI / 3,
            color: `hsl(${i * 60}, 70%, 60%)`
        });
    }

    function animateSound() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        waves.forEach((wave, index) => {
            ctx.strokeStyle = wave.color;
            ctx.lineWidth = 2;
            ctx.beginPath();

            for (let x = 0; x < canvas.width; x++) {
                const y = canvas.height / 2 + 
                    Math.sin(x * wave.frequency + time + wave.phase) * wave.amplitude;
                
                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }

            ctx.stroke();
        });

        time += 0.05;
        requestAnimationFrame(animateSound);
    }

    animateSound();

    // Sound controls
    const soundBtns = document.querySelectorAll('.sound-btn');
    soundBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            switch(action) {
                case 'play':
                    playSound();
                    break;
                case 'visualize':
                    visualizeSound();
                    break;
                case 'distort':
                    distortSound();
                    break;
            }
        });
    });
}

function playSound() {
    // Create audio context and play tone
    try {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 1);
    } catch (e) {
        console.log('Audio not supported');
    }
}

function visualizeSound() {
    // Enhance visualization
    waves.forEach(wave => {
        wave.amplitude *= 1.5;
        if (wave.amplitude > 150) wave.amplitude = 150;
    });
}

function distortSound() {
    // Distort waves
    waves.forEach(wave => {
        wave.frequency *= 1.2;
        wave.phase += Math.PI / 4;
    });
}

// Quantum Effects
function initQuantumEffects() {
    const canvas = document.getElementById('quantumCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let particles = [];
    let time = 0;

    // Create quantum particles
    for (let i = 0; i < 20; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            size: Math.random() * 6 + 3,
            phase: Math.random() * Math.PI * 2,
            entangled: Math.floor(Math.random() * 20)
        });
    }

    function animateQuantum() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off walls
            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

            // Quantum uncertainty
            const uncertainty = Math.sin(time + particle.phase) * 2;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x + uncertainty, particle.y + uncertainty, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${280 + uncertainty * 20}, 70%, 60%)`;
            ctx.fill();

            // Draw entanglement lines
            if (particle.entangled < particles.length) {
                const entangled = particles[particle.entangled];
                ctx.strokeStyle = `rgba(136, 0, 255, 0.3)`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(entangled.x, entangled.y);
                ctx.stroke();
            }
        });

        time += 0.02;
        requestAnimationFrame(animateQuantum);
    }

    animateQuantum();

    // Quantum controls
    const quantumBtns = document.querySelectorAll('.quantum-btn');
    quantumBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            switch(action) {
                case 'superposition':
                    superposition();
                    break;
                case 'entangle':
                    entangle();
                    break;
                case 'collapse':
                    collapse();
                    break;
            }
        });
    });
}

function superposition() {
    // Create superposition effect
    particles.forEach(particle => {
        particle.x += (Math.random() - 0.5) * 50;
        particle.y += (Math.random() - 0.5) * 50;
    });
}

function entangle() {
    // Create new entanglements
    particles.forEach(particle => {
        particle.entangled = Math.floor(Math.random() * particles.length);
    });
}

function collapse() {
    // Collapse quantum states
    particles.forEach(particle => {
        particle.vx = 0;
        particle.vy = 0;
        setTimeout(() => {
            particle.vx = (Math.random() - 0.5) * 4;
            particle.vy = (Math.random() - 0.5) * 4;
        }, 1000);
    });
}

// Insane Mode
function toggleInsaneMode() {
    isInsaneMode = !isInsaneMode;
    
    if (isInsaneMode) {
        document.body.classList.add('insane-mode');
        triggerInsaneEffects();
    } else {
        document.body.classList.remove('insane-mode');
        stopInsaneEffects();
    }
}

function triggerInsaneEffects() {
    // Make everything go crazy
    setInterval(() => {
        if (isInsaneMode) {
            document.body.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
            document.body.style.transform = `scale(${0.9 + Math.random() * 0.2})`;
        }
    }, 100);

    // Create insane particle explosions
    setInterval(() => {
        if (isInsaneMode) {
            createInsaneExplosion();
        }
    }, 500);
}

function createInsaneExplosion() {
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            left: ${Math.random() * window.innerWidth}px;
            top: ${Math.random() * window.innerHeight}px;
            width: ${Math.random() * 10 + 5}px;
            height: ${Math.random() * 10 + 5}px;
            background: hsl(${Math.random() * 360}, 70%, 60%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            animation: insaneFloat 2s ease-out forwards;
        `;
        
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 2000);
    }
}

function stopInsaneEffects() {
    document.body.style.filter = '';
    document.body.style.transform = '';
}

// Background Particles
function initBackgroundParticles() {
    const container = document.getElementById('backgroundParticles');
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'background-particle';
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = (Math.random() * 5 + 5) + 's';
        
        container.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, 15000);
    }
    
    // Create particles continuously
    setInterval(createParticle, 200);
}