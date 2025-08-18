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

    // Code copying functionality
    window.copyCode = function(button) {
        const codeBlock = button.closest('.code-snippet').querySelector('code');
        const text = codeBlock.textContent;
        
        navigator.clipboard.writeText(text).then(function() {
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i> Copied';
            button.style.background = '#00ff41';
            button.style.borderColor = '#00ff41';
            button.style.color = '#000000';
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.background = 'transparent';
                button.style.borderColor = 'var(--primary-color)';
                button.style.color = 'var(--primary-color)';
            }, 2000);
            
            showNotification('📋 Code copied to clipboard!', 'success');
        }).catch(function(err) {
            showNotification('❌ Failed to copy code', 'error');
        });
    };

    // Code execution functionality with popup showcaser
    window.runCode = function(button, language) {
        const codeBlock = button.closest('.code-snippet').querySelector('code');
        const code = codeBlock.textContent;
        
        // Show loading state
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Running';
        button.disabled = true;
        
        setTimeout(() => {
            try {
                let result = '';
                let visualOutput = '';
                
                if (language === 'javascript') {
                    result = executeJavaScript(code);
                    visualOutput = createJavaScriptShowcase(code);
                } else if (language === 'lua') {
                    result = simulateLuaExecution(code);
                    visualOutput = createLuaShowcase(code);
                } else if (language === 'css') {
                    result = demonstrateCSS(code);
                    visualOutput = createCSSShowcase(code);
                } else {
                    result = 'Language execution not supported in browser environment.';
                    visualOutput = '<div class="showcase-placeholder">Language not supported for visual showcase</div>';
                }
                
                // Create and show popup modal
                showCodeShowcase(code, result, visualOutput, language);
                
                showNotification('🚀 Code executed successfully!', 'success');
                
            } catch (error) {
                showNotification('❌ Code execution failed', 'error');
            }
            
            // Restore button
            button.innerHTML = originalText;
            button.disabled = false;
        }, 1500);
    };

    function executeJavaScript(code) {
        // Create a safe execution environment
        const originalConsoleLog = console.log;
        const logs = [];
        
        // Override console.log to capture output
        console.log = function(...args) {
            logs.push(args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' '));
        };
        
        try {
            // Create a temporary container for canvas elements
            const tempContainer = document.createElement('div');
            tempContainer.style.position = 'absolute';
            tempContainer.style.left = '-9999px';
            tempContainer.style.top = '-9999px';
            document.body.appendChild(tempContainer);
            
            // Execute the code in a limited scope with canvas support
            const result = new Function(`
                const container = arguments[0];
                const canvas = document.createElement('canvas');
                canvas.width = 400;
                canvas.height = 300;
                canvas.style.border = '2px solid #00ffff';
                canvas.style.borderRadius = '8px';
                canvas.style.background = '#000';
                container.appendChild(canvas);
                
                ${code}
                
                // Check if dashboard was created
                if (typeof dashboard !== 'undefined') {
                    return 'Dashboard class created successfully! Canvas ready for charts.';
                }
                return 'Code executed with canvas support.';
            `)(tempContainer);
            
            // Clean up temporary container
            document.body.removeChild(tempContainer);
            
            // Restore console.log
            console.log = originalConsoleLog;
            
            let output = '';
            if (logs.length > 0) {
                output += 'Console Output:\n' + logs.join('\n') + '\n\n';
            }
            output += 'Execution Result: ' + result;
            
            return output;
            
        } catch (error) {
            console.log = originalConsoleLog;
            throw error;
        }
    }

    function simulateLuaExecution(code) {
        // Simulate Lua execution with realistic output
        const lines = code.split('\n');
        const output = [];
        
        output.push('🚀 Lua Script Execution Simulation');
        output.push('=====================================');
        output.push('');
        
        // Simulate module loading
        if (code.includes('require(')) {
            output.push('📦 Loading modules...');
            const modules = code.match(/require\('([^']+)'\)/g) || [];
            modules.forEach(mod => {
                const moduleName = mod.match(/require\('([^']+)'\)/)[1];
                output.push(`   ✅ Loaded: ${moduleName}`);
            });
            output.push('');
        }
        
        // Simulate PlayerManager initialization
        if (code.includes('PlayerManager')) {
            output.push('🎮 PlayerManager System');
            output.push('------------------------');
            output.push('✅ PlayerManager class defined');
            output.push('✅ Event handlers registered');
            output.push('✅ Worker threads created (4 threads)');
            output.push('✅ Anti-cheat monitoring started');
            output.push('✅ Database connection established');
            output.push('');
            
            // Simulate player stats
            output.push('📊 Current Server Stats:');
            output.push('   Active Players: 1,247');
            output.push('   Total Connections: 1,250');
            output.push('   Average Latency: 45ms');
            output.push('   Messages/sec: 2,341');
            output.push('   Suspicious Activities: 3');
            output.push('   Banned Players: 127');
            output.push('');
        }
        
        // Simulate function calls
        if (code.includes('function')) {
            const functions = code.match(/function\s+\w+:\w+/g) || [];
            output.push('🔧 Available Functions:');
            functions.slice(0, 5).forEach(func => {
                const funcName = func.replace('function ', '').replace(':', '.');
                output.push(`   • ${funcName}()`);
            });
            if (functions.length > 5) {
                output.push(`   • ... and ${functions.length - 5} more functions`);
            }
            output.push('');
        }
        
        output.push('✅ Script executed successfully');
        output.push('⏱️  Execution time: 0.234 seconds');
        output.push('💾 Memory usage: 15.7 MB');
        
        return output.join('\n');
    }

    function demonstrateCSS(code) {
        const output = [];
        
        output.push('🎨 CSS Style Analysis');
        output.push('=====================');
        output.push('');
        
        // Analyze CSS features
        if (code.includes('gradient')) {
            output.push('✨ Gradient effects detected');
        }
        if (code.includes('animation')) {
            output.push('🎬 CSS animations found');
        }
        if (code.includes('transform')) {
            output.push('🔄 Transform properties detected');
        }
        if (code.includes('box-shadow')) {
            output.push('💫 Shadow effects applied');
        }
        if (code.includes('@keyframes')) {
            output.push('🎭 Custom keyframe animations defined');
        }
        
        output.push('');
        output.push('📱 Responsive Design Features:');
        output.push('   • Mobile-first approach');
        output.push('   • Flexible grid layouts');
        output.push('   • Smooth transitions');
        output.push('   • Cross-browser compatibility');
        
        output.push('');
        output.push('✅ CSS would render beautiful animations and effects!');
        
        return output.join('\n');
    }

    // Matrix rain effect for techy look
    function createMatrixRain() {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '1';
        canvas.style.opacity = '0.1';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
        const matrixArray = matrix.split("");

        const fontSize = 10;
        const columns = canvas.width / fontSize;

        const drops = [];
        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }

        function draw() {
            ctx.fillStyle = 'rgba(15, 15, 35, 0.04)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#00d4ff';
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

        setInterval(draw, 35);

        // Resize handler
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // Initialize matrix effect on tech-themed pages
    setTimeout(createMatrixRain, 2000);

    // Code Showcase Functions
    function createJavaScriptShowcase(code) {
        const container = document.createElement('div');
        container.className = 'showcase-container js-showcase';
        
        // Create interactive demo
        if (code.includes('ModernWebDesignSystem')) {
            container.innerHTML = `
                <div class="showcase-demo">
                    <h3>🎨 Web Design System Demo</h3>
                    <div class="demo-buttons">
                        <button class="demo-btn btn-primary" onclick="this.style.background='linear-gradient(45deg, #00ffff, #ff0080)'">Gradient Button</button>
                        <button class="demo-btn btn-secondary" onclick="this.style.transform='scale(1.1)'">Hover Effect</button>
                        <button class="demo-btn btn-accent" onclick="this.style.boxShadow='0 0 20px #00ff41'">Neon Glow</button>
                    </div>
                    <div class="demo-card" style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); padding: 1rem; border-radius: 10px; margin: 1rem 0;">
                        <h4>Glassmorphism Card</h4>
                        <p>This demonstrates the glassmorphism effect from the CSS system.</p>
                    </div>
                </div>
            `;
        } else {
            container.innerHTML = '<div class="showcase-placeholder">JavaScript code executed successfully!</div>';
        }
        
        return container.outerHTML;
    }

    function createLuaShowcase(code) {
        const container = document.createElement('div');
        container.className = 'showcase-container lua-showcase';
        
        container.innerHTML = `
            <div class="showcase-demo">
                <h3>🎭 Animation System Demo</h3>
                <div class="demo-animations">
                    <div class="demo-element fade-demo" onclick="this.style.opacity='0.5'">Fade Effect</div>
                    <div class="demo-element slide-demo" onclick="this.style.transform='translateX(50px)'">Slide Effect</div>
                    <div class="demo-element scale-demo" onclick="this.style.transform='scale(1.2)'">Scale Effect</div>
                </div>
                <div class="demo-stats">
                    <div class="stat-item">Active Animations: <span id="active-count">0</span></div>
                    <div class="stat-item">Performance: <span id="perf-score">95%</span></div>
                </div>
            </div>
        `;
        
        return container.outerHTML;
    }

    function createCSSShowcase(code) {
        const container = document.createElement('div');
        container.className = 'showcase-container css-showcase';
        
        container.innerHTML = `
            <div class="showcase-demo">
                <h3>🎨 CSS Design System Demo</h3>
                <div class="demo-cards">
                    <div class="demo-card glassmorphism" style="background: rgba(255,255,255,0.1); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.2); border-radius: 20px; padding: 1.5rem; margin: 1rem 0;">
                        <h4>Glassmorphism Card</h4>
                        <p>Advanced backdrop-filter and transparency effects</p>
                    </div>
                    <div class="demo-card neon-border" style="border: 2px solid #00ffff; box-shadow: 0 0 20px #00ffff; border-radius: 15px; padding: 1.5rem; margin: 1rem 0;">
                        <h4>Neon Border Effect</h4>
                        <p>Glowing borders with custom shadows</p>
                    </div>
                </div>
                <div class="demo-gradients">
                    <div class="gradient-demo neon" style="background: linear-gradient(45deg, #00ffff, #ff0080); height: 60px; border-radius: 10px; margin: 1rem 0;"></div>
                    <div class="gradient-demo sunset" style="background: linear-gradient(135deg, #ff6b35, #f7931e); height: 60px; border-radius: 10px; margin: 1rem 0;"></div>
                </div>
            </div>
        `;
        
        return container.outerHTML;
    }

    // Show Code Showcase Modal
    function showCodeShowcase(code, result, visualOutput, language) {
        // Remove existing modal if any
        const existingModal = document.querySelector('.code-showcase-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'code-showcase-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>🚀 Code Execution Showcase</h2>
                    <button class="modal-close" onclick="this.closest('.code-showcase-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="showcase-tabs">
                        <button class="tab-btn active" onclick="switchTab(this, 'visual')">Visual Demo</button>
                        <button class="tab-btn" onclick="switchTab(this, 'output')">Console Output</button>
                        <button class="tab-btn" onclick="switchTab(this, 'code')">Source Code</button>
                    </div>
                    <div class="tab-content">
                        <div id="visual-tab" class="tab-pane active">
                            ${visualOutput}
                        </div>
                        <div id="output-tab" class="tab-pane">
                            <div class="output-content">
                                <h4>Execution Results:</h4>
                                <pre>${result}</pre>
                            </div>
                        </div>
                        <div id="code-tab" class="tab-pane">
                            <div class="code-content">
                                <h4>Source Code:</h4>
                                <pre><code class="language-${language}">${code}</code></pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to page
        document.body.appendChild(modal);
        
        // Add event listeners
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        // Close on overlay click
        modal.querySelector('.modal-overlay').addEventListener('click', () => {
            modal.remove();
        });
    }

    // Tab switching function
    window.switchTab = function(button, tabName) {
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Update active tab content
        document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
        document.getElementById(tabName + '-tab').classList.add('active');
    };

    // Toggle code snippet expansion
    window.toggleCodeSnippet = function(button) {
        const codeSnippet = button.closest('.code-snippet');
        const overlay = button.closest('.read-more-overlay');
        
        if (codeSnippet.classList.contains('expanded')) {
            codeSnippet.classList.remove('expanded');
            button.textContent = 'Read More';
            overlay.classList.remove('hidden');
        } else {
            codeSnippet.classList.add('expanded');
            button.textContent = 'Show Less';
            overlay.classList.add('hidden');
        }
    };

    console.log('🚀 Developer Portfolio Loaded Successfully!');
    console.log('Features: Code Snippets, Matrix Effect, Syntax Highlighting, Copy Functionality, Interactive Showcase');
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
