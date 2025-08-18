// Digital Playground - Modern JavaScript Architecture

// Main Application Class
class DigitalPlayground {
    constructor() {
        this.state = {
            theme: 'light',
            currentExperiment: null,
            isPlaying: false,
            particles: [],
            fractals: [],
            audioContext: null,
            animationFrames: new Map()
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeComponents();
        this.startLoadingSequence();
    }

    setupEventListeners() {
        // Theme toggle
        document.getElementById('themeToggle')?.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.smoothScrollTo(e.target.getAttribute('href'));
            });
        });

        // Hero actions
        document.getElementById('exploreBtn')?.addEventListener('click', () => {
            this.smoothScrollTo('#playground');
        });

        document.getElementById('viewCodeBtn')?.addEventListener('click', () => {
            this.openGitHub();
        });

        // Playground controls
        this.setupPlaygroundControls();
        
        // Experiment cards
        this.setupExperimentCards();
        
        // Gallery controls
        this.setupGalleryControls();
        
        // Modal
        this.setupModal();
        
        // Resize handling
        window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));
        
        // Intersection Observer for animations
        this.setupIntersectionObserver();
    }

    initializeComponents() {
        // Initialize all canvas-based experiments
        this.initHeroCanvas();
        this.initParticleSystem();
        this.initFractalExplorer();
        this.initAudioVisualizer();
        this.initGenerativeArt();
        this.initExperimentPreviews();
        
        // Initialize gallery
        this.initGallery();
        
        // Initialize code display
        this.initCodeDisplay();
    }

    startLoadingSequence() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (!loadingScreen) return;

        // Simulate loading process
        setTimeout(() => {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                this.startEntranceAnimations();
            }, 500);
        }, 2000);
    }

    startEntranceAnimations() {
        // Animate hero elements
        const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-actions');
        heroElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.8s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });

        // Animate floating elements
        const floatingElements = document.querySelectorAll('.floating-element');
        floatingElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'scale(0)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s ease';
                element.style.opacity = '1';
                element.style.transform = 'scale(1)';
            }, 1000 + index * 200);
        });
    }

    // Theme Management
    toggleTheme() {
        this.state.theme = this.state.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.state.theme);
        
        const icon = document.querySelector('.theme-toggle i');
        if (icon) {
            icon.className = this.state.theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
        
        // Save preference
        localStorage.setItem('theme', this.state.theme);
    }

    // Navigation
    smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Canvas Initialization
    initHeroCanvas() {
        const canvas = document.getElementById('heroCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        this.resizeCanvas(canvas);
        
        // Create animated background pattern
        this.animateHeroCanvas(canvas, ctx);
    }

    animateHeroCanvas(canvas, ctx) {
        let time = 0;
        
        const animate = () => {
            const animationId = requestAnimationFrame(animate);
            this.state.animationFrames.set('hero', animationId);
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Create flowing gradient effect
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, `hsla(${time * 0.1 % 360}, 70%, 60%, 0.1)`);
            gradient.addColorStop(0.5, `hsla(${(time * 0.1 + 180) % 360}, 70%, 60%, 0.1)`);
            gradient.addColorStop(1, `hsla(${time * 0.1 % 360}, 70%, 60%, 0.1)`);
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Add subtle moving particles
            for (let i = 0; i < 5; i++) {
                const x = (time * 0.5 + i * 100) % canvas.width;
                const y = (time * 0.3 + i * 80) % canvas.height;
                const size = Math.sin(time * 0.01 + i) * 3 + 5;
                
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${time * 0.1 + i * 60 % 360}, 70%, 60%, 0.3)`;
                ctx.fill();
            }
            
            time += 1;
        };
        
        animate();
    }

    // Particle System
    initParticleSystem() {
        const canvas = document.getElementById('particleCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        this.resizeCanvas(canvas);
        
        // Create particle system
        this.createParticleSystem(canvas, ctx);
        
        // Setup controls
        this.setupParticleControls(canvas, ctx);
    }

    createParticleSystem(canvas, ctx) {
        const particles = [];
        const particleCount = 100;
        
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 2;
                this.vy = (Math.random() - 0.5) * 2;
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
                
                // Bounce off edges
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }
            
            draw(ctx) {
                ctx.save();
                ctx.globalAlpha = this.life;
                ctx.fillStyle = `hsl(${this.hue}, 70%, 60%)`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }
        
        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
        
        // Animation loop
        const animate = () => {
            const animationId = requestAnimationFrame(animate);
            this.state.animationFrames.set('particles', animationId);
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Update and draw particles
            for (let i = particles.length - 1; i >= 0; i--) {
                const particle = particles[i];
                particle.update();
                particle.draw(ctx);
                
                // Remove dead particles
                if (particle.life <= 0) {
                    particles.splice(i, 1);
                    particles.push(new Particle());
                }
            }
        };
        
        animate();
        this.state.particles = particles;
    }

    setupParticleControls(canvas, ctx) {
        const resetBtn = document.querySelector('[data-action="reset"]');
        const explodeBtn = document.querySelector('[data-action="explode"]');
        
        resetBtn?.addEventListener('click', () => {
            this.state.particles.forEach(particle => {
                particle.x = Math.random() * canvas.width;
                particle.y = Math.random() * canvas.height;
                particle.vx = (Math.random() - 0.5) * 2;
                particle.vy = (Math.random() - 0.5) * 2;
                particle.life = 1;
            });
        });
        
        explodeBtn?.addEventListener('click', () => {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            
            this.state.particles.forEach(particle => {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 8 + 4;
                particle.vx = Math.cos(angle) * speed;
                particle.vy = Math.sin(angle) * speed;
                particle.x = centerX;
                particle.y = centerY;
                particle.life = 1;
            });
        });
    }

    // Fractal Explorer
    initFractalExplorer() {
        const canvas = document.getElementById('fractalCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        this.resizeCanvas(canvas);
        
        this.animateFractal(canvas, ctx);
        this.setupFractalControls(canvas, ctx);
    }

    animateFractal(canvas, ctx) {
        let time = 0;
        
        const drawFractal = (x, y, size, depth) => {
            if (depth <= 0) return;
            
            const colors = ['#007AFF', '#34C759', '#FF9500', '#FF3B30', '#AF52DE'];
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
            const angle = Math.sin(time * 0.01) * 0.5;
            
            drawFractal(x - size/2, y - size/2, newSize, depth - 1);
            drawFractal(x + size/2, y - size/2, newSize, depth - 1);
            drawFractal(x + size/2, y + size/2, newSize, depth - 1);
            drawFractal(x - size/2, y + size/2, newSize, depth - 1);
        };
        
        const animate = () => {
            const animationId = requestAnimationFrame(animate);
            this.state.animationFrames.set('fractal', animationId);
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const depth = parseInt(document.getElementById('fractalDepth')?.value || 4);
            drawFractal(canvas.width/2, canvas.height/2, Math.min(canvas.width, canvas.height) * 0.4, depth);
            
            time += 1;
        };
        
        animate();
    }

    setupFractalControls(canvas, ctx) {
        const slider = document.getElementById('fractalDepth');
        if (slider) {
            slider.addEventListener('input', () => {
                // Fractal updates automatically
            });
        }
    }

    // Audio Visualizer
    initAudioVisualizer() {
        const canvas = document.getElementById('audioCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        this.resizeCanvas(canvas);
        
        this.createAudioVisualizer(canvas, ctx);
        this.setupAudioControls(canvas, ctx);
    }

    createAudioVisualizer(canvas, ctx) {
        let time = 0;
        const bars = 30;
        const barWidth = canvas.width / bars;
        
        const animate = () => {
            const animationId = requestAnimationFrame(animate);
            this.state.animationFrames.set('audio', animationId);
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Generate animated bars
            for (let i = 0; i < bars; i++) {
                const height = Math.sin(time * 0.02 + i * 0.2) * canvas.height * 0.4 + canvas.height * 0.3;
                const x = i * barWidth;
                const y = canvas.height - height;
                
                const hue = (i / bars) * 360 + time * 0.5;
                ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
                ctx.fillRect(x, y, barWidth - 2, height);
            }
            
            time += 1;
        };
        
        animate();
    }

    setupAudioControls(canvas, ctx) {
        const playBtn = document.querySelector('[data-action="play"]');
        const stopBtn = document.querySelector('[data-action="stop"]');
        
        playBtn?.addEventListener('click', () => {
            this.playAudio();
        });
        
        stopBtn?.addEventListener('click', () => {
            this.stopAudio();
        });
    }

    playAudio() {
        try {
            if (!this.state.audioContext) {
                this.state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            const oscillator = this.state.audioContext.createOscillator();
            const gainNode = this.state.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.state.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(440, this.state.audioContext.currentTime);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, this.state.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.state.audioContext.currentTime + 2);
            
            oscillator.start(this.state.audioContext.currentTime);
            oscillator.stop(this.state.audioContext.currentTime + 2);
            
            this.state.isPlaying = true;
        } catch (e) {
            console.log('Audio not supported');
        }
    }

    stopAudio() {
        if (this.state.audioContext) {
            this.state.audioContext.close();
            this.state.audioContext = null;
        }
        this.state.isPlaying = false;
    }

    // Generative Art
    initGenerativeArt() {
        const canvas = document.getElementById('generativeCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        this.resizeCanvas(canvas);
        
        this.createGenerativeArt(canvas, ctx);
        this.setupGenerativeControls(canvas, ctx);
    }

    createGenerativeArt(canvas, ctx) {
        let time = 0;
        
        const animate = () => {
            const animationId = requestAnimationFrame(animate);
            this.state.animationFrames.set('generative', animationId);
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Create flowing lines
            for (let i = 0; i < 5; i++) {
                ctx.strokeStyle = `hsl(${time * 0.1 + i * 60 % 360}, 70%, 60%)`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                
                for (let x = 0; x < canvas.width; x += 10) {
                    const y = canvas.height / 2 + 
                        Math.sin(x * 0.01 + time * 0.02 + i) * 100 +
                        Math.sin(time * 0.01 + i) * 50;
                    
                    if (x === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                
                ctx.stroke();
            }
            
            time += 1;
        };
        
        animate();
    }

    setupGenerativeControls(canvas, ctx) {
        const newBtn = document.querySelector('[data-action="new"]');
        const animateBtn = document.querySelector('[data-action="animate"]');
        
        newBtn?.addEventListener('click', () => {
            // Generate new pattern
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        });
        
        animateBtn?.addEventListener('click', () => {
            // Toggle animation
            const isAnimating = this.state.animationFrames.has('generative');
            if (isAnimating) {
                cancelAnimationFrame(this.state.animationFrames.get('generative'));
                this.state.animationFrames.delete('generative');
            } else {
                this.createGenerativeArt(canvas, ctx);
            }
        });
    }

    // Experiment Previews
    initExperimentPreviews() {
        const previews = ['matrix', 'neural', 'glitch', 'quantum'];
        
        previews.forEach(type => {
            const canvas = document.getElementById(`${type}Preview`);
            if (canvas) {
                this.createExperimentPreview(canvas, type);
            }
        });
    }

    createExperimentPreview(canvas, type) {
        const ctx = canvas.getContext('2d');
        this.resizeCanvas(canvas);
        
        switch (type) {
            case 'matrix':
                this.createMatrixPreview(canvas, ctx);
                break;
            case 'neural':
                this.createNeuralPreview(canvas, ctx);
                break;
            case 'glitch':
                this.createGlitchPreview(canvas, ctx);
                break;
            case 'quantum':
                this.createQuantumPreview(canvas, ctx);
                break;
        }
    }

    createMatrixPreview(canvas, ctx) {
        const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
        const matrixArray = matrix.split("");
        const fontSize = 8;
        const columns = canvas.width / fontSize;
        const drops = Array(columns).fill(1);
        
        const animate = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#00FF00';
            ctx.font = fontSize + 'px monospace';
            
            for (let i = 0; i < drops.length; i++) {
                const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }

    createNeuralPreview(canvas, ctx) {
        const neurons = Array(8).fill().map(() => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 4 + 2
        }));
        
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw neurons
            neurons.forEach(neuron => {
                ctx.beginPath();
                ctx.arc(neuron.x, neuron.y, neuron.size, 0, Math.PI * 2);
                ctx.fillStyle = '#FF8800';
                ctx.fill();
            });
            
            // Draw connections
            ctx.strokeStyle = 'rgba(255, 136, 0, 0.3)';
            ctx.lineWidth = 1;
            
            for (let i = 0; i < neurons.length; i++) {
                for (let j = i + 1; j < neurons.length; j++) {
                    if (Math.random() > 0.7) {
                        ctx.beginPath();
                        ctx.moveTo(neurons[i].x, neurons[i].y);
                        ctx.lineTo(neurons[j].x, neurons[j].y);
                        ctx.stroke();
                    }
                }
            }
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }

    createGlitchPreview(canvas, ctx) {
        let time = 0;
        
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Create glitch effect
            const glitchIntensity = Math.sin(time * 0.1) * 0.5 + 0.5;
            
            ctx.fillStyle = '#FF0066';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Glitch lines
            for (let i = 0; i < 5; i++) {
                const y = Math.random() * canvas.height;
                const height = Math.random() * 10 + 5;
                const offset = (Math.random() - 0.5) * glitchIntensity * 20;
                
                ctx.fillStyle = '#00FFFF';
                ctx.fillRect(offset, y, canvas.width, height);
            }
            
            time += 1;
            requestAnimationFrame(animate);
        };
        
        animate();
    }

    createQuantumPreview(canvas, ctx) {
        const particles = Array(15).fill().map(() => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 3 + 2
        }));
        
        const animate = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
                
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = '#8800FF';
                ctx.fill();
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }

    // Gallery System
    initGallery() {
        this.generateGalleryItems();
        this.setupGalleryControls();
    }

    generateGalleryItems() {
        const galleryGrid = document.getElementById('galleryGrid');
        if (!galleryGrid) return;
        
        const itemCount = 12;
        
        for (let i = 0; i < itemCount; i++) {
            const item = this.createGalleryItem(i);
            galleryGrid.appendChild(item);
        }
    }

    createGalleryItem(index) {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        
        const canvas = document.createElement('canvas');
        canvas.width = 250;
        canvas.height = 200;
        
        item.appendChild(canvas);
        
        // Generate unique art for each item
        this.generateGalleryArt(canvas, index);
        
        return item;
    }

    generateGalleryArt(canvas, index) {
        const ctx = canvas.getContext('2d');
        const patterns = ['circles', 'lines', 'waves', 'dots', 'squares', 'triangles'];
        const pattern = patterns[index % patterns.length];
        
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        switch (pattern) {
            case 'circles':
                this.drawCirclePattern(ctx, canvas.width, canvas.height);
                break;
            case 'lines':
                this.drawLinePattern(ctx, canvas.width, canvas.height);
                break;
            case 'waves':
                this.drawWavePattern(ctx, canvas.width, canvas.height);
                break;
            case 'dots':
                this.drawDotPattern(ctx, canvas.width, canvas.height);
                break;
            case 'squares':
                this.drawSquarePattern(ctx, canvas.width, canvas.height);
                break;
            case 'triangles':
                this.drawTrianglePattern(ctx, canvas.width, canvas.height);
                break;
        }
    }

    drawCirclePattern(ctx, width, height) {
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = Math.random() * 20 + 10;
            const hue = Math.random() * 360;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
            ctx.fill();
        }
    }

    drawLinePattern(ctx, width, height) {
        ctx.strokeStyle = '#007AFF';
        ctx.lineWidth = 2;
        
        for (let i = 0; i < 15; i++) {
            const x1 = Math.random() * width;
            const y1 = Math.random() * height;
            const x2 = Math.random() * width;
            const y2 = Math.random() * height;
            
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
    }

    drawWavePattern(ctx, width, height) {
        ctx.strokeStyle = '#34C759';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        for (let x = 0; x < width; x += 5) {
            const y = height / 2 + Math.sin(x * 0.02) * 50;
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
    }

    drawDotPattern(ctx, width, height) {
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = Math.random() * 4 + 2;
            const hue = Math.random() * 360;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
            ctx.fill();
        }
    }

    drawSquarePattern(ctx, width, height) {
        for (let i = 0; i < 25; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = Math.random() * 30 + 15;
            const hue = Math.random() * 360;
            
            ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
            ctx.fillRect(x, y, size, size);
        }
    }

    drawTrianglePattern(ctx, width, height) {
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = Math.random() * 25 + 15;
            const hue = Math.random() * 360;
            
            ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + size, y);
            ctx.lineTo(x + size/2, y - size);
            ctx.closePath();
            ctx.fill();
        }
    }

    setupGalleryControls() {
        const generateBtn = document.getElementById('generateBtn');
        const clearBtn = document.getElementById('clearBtn');
        
        generateBtn?.addEventListener('click', () => {
            this.generateGalleryItems();
        });
        
        clearBtn?.addEventListener('click', () => {
            const galleryGrid = document.getElementById('galleryGrid');
            if (galleryGrid) {
                galleryGrid.innerHTML = '';
            }
        });
    }

    // Code Display
    initCodeDisplay() {
        const codeDisplay = document.getElementById('codeDisplay');
        if (!codeDisplay) return;
        
        const sampleCode = `// Creative Coding Example
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.gravity = 0.1;
    }
    
    addParticle(x, y) {
        this.particles.push({
            x, y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            life: 1.0
        });
    }
    
    update() {
        this.particles.forEach(particle => {
            particle.vy += this.gravity;
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= 0.01;
        });
        
        this.particles = this.particles.filter(p => p.life > 0);
    }
    
    draw(ctx) {
        this.particles.forEach(particle => {
            ctx.globalAlpha = particle.life;
            ctx.fillStyle = \`hsl(\${particle.life * 360}, 70%, 60%)\`;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, 5, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}`;
        
        codeDisplay.textContent = sampleCode;
    }

    // Utility Methods
    resizeCanvas(canvas) {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        
        const ctx = canvas.getContext('2d');
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    handleResize() {
        // Resize all canvases
        document.querySelectorAll('canvas').forEach(canvas => {
            this.resizeCanvas(canvas);
        });
    }

    debounce(func, wait) {
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

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observe sections for animation
        document.querySelectorAll('section').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'all 0.8s ease';
            observer.observe(section);
        });
    }

    setupPlaygroundControls() {
        // Setup all playground control buttons
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                const type = e.target.closest('.playground-item')?.dataset.type;
                
                if (action && type) {
                    this.handlePlaygroundAction(action, type);
                }
            });
        });
    }

    handlePlaygroundAction(action, type) {
        switch (action) {
            case 'reset':
                this.resetExperiment(type);
                break;
            case 'explode':
                this.explodeExperiment(type);
                break;
            case 'new':
                this.newExperiment(type);
                break;
            case 'animate':
                this.toggleAnimation(type);
                break;
        }
    }

    resetExperiment(type) {
        // Reset specific experiment
        console.log(`Resetting ${type} experiment`);
    }

    explodeExperiment(type) {
        // Trigger explosion effect
        console.log(`Exploding ${type} experiment`);
    }

    newExperiment(type) {
        // Generate new experiment
        console.log(`Generating new ${type} experiment`);
    }

    toggleAnimation(type) {
        // Toggle animation state
        console.log(`Toggling ${type} animation`);
    }

    setupExperimentCards() {
        document.querySelectorAll('.experiment-card').forEach(card => {
            const viewBtn = card.querySelector('[data-action="view"]');
            const fullscreenBtn = card.querySelector('[data-action="fullscreen"]');
            
            viewBtn?.addEventListener('click', () => {
                this.viewExperiment(card.dataset.experiment);
            });
            
            fullscreenBtn?.addEventListener('click', () => {
                this.fullscreenExperiment(card.dataset.experiment);
            });
        });
    }

    viewExperiment(type) {
        console.log(`Viewing ${type} experiment`);
        // Implement experiment viewer
    }

    fullscreenExperiment(type) {
        console.log(`Fullscreen ${type} experiment`);
        // Implement fullscreen mode
    }

    setupModal() {
        const modal = document.getElementById('experimentModal');
        const modalClose = document.getElementById('modalClose');
        
        modalClose?.addEventListener('click', () => {
            modal?.classList.remove('active');
        });
        
        // Close modal on outside click
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    openGitHub() {
        // Open GitHub repository
        window.open('https://github.com/yourusername/digital-playground', '_blank');
    }

    // Cleanup
    destroy() {
        // Cancel all animation frames
        this.state.animationFrames.forEach(animationId => {
            cancelAnimationFrame(animationId);
        });
        
        // Close audio context
        if (this.state.audioContext) {
            this.state.audioContext.close();
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Create application instance
    window.digitalPlayground = new DigitalPlayground();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.digitalPlayground) {
        window.digitalPlayground.destroy();
    }
});