// MetroSim - Main Application Entry Point
(function() {
    let game = null;
    
    const loadingSteps = [
        'Loading game engine...',
        'Initializing city systems...',
        'Setting up economy...',
        'Preparing research tree...',
        'Loading building database...',
        'Initializing citizens...',
        'Setting up disaster management...',
        'Loading achievements...',
        'Preparing user interface...',
        'Starting simulation...'
    ];

    function updateLoadingScreen(progress, message) {
        const progressBar = document.getElementById('loading-progress');
        const tipElement = document.getElementById('loading-tip');
        
        if (progressBar) progressBar.style.width = `${progress}%`;
        if (tipElement && message) tipElement.textContent = message;
    }

    function hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const gameContainer = document.getElementById('game-container');
        
        if (loadingScreen && gameContainer) {
            loadingScreen.classList.add('hidden');
            gameContainer.classList.add('loaded');
        }
    }

    async function simulateLoading() {
        for (let i = 0; i < loadingSteps.length; i++) {
            const progress = ((i + 1) / loadingSteps.length) * 100;
            updateLoadingScreen(progress, loadingSteps[i]);
            await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));
        }
    }

    async function initializeGame() {
        try {
            updateLoadingScreen(0, 'Initializing MetroSim...');
            await simulateLoading();
            
            game = new Game();
            await game.initialize();
            
            hideLoadingScreen();
            setupGlobalEventHandlers();
            
            console.log('🎮 MetroSim is ready to play!');
            
        } catch (error) {
            console.error('Failed to initialize game:', error);
            
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.innerHTML = `
                    <div class="loading-content">
                        <div class="loading-logo">❌ Error</div>
                        <div class="loading-text">Failed to load MetroSim</div>
                        <div class="loading-hints">${error.message}</div>
                        <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem;">
                            Reload Game
                        </button>
                    </div>
                `;
            }
        }
    }

    function setupGlobalEventHandlers() {
        window.addEventListener('resize', () => {
            if (game) game.handleResize();
        });

        window.addEventListener('beforeunload', (e) => {
            if (game && !game.isPaused) {
                const message = 'Your city progress will be lost if you leave. Are you sure?';
                e.returnValue = message;
                return message;
            }
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        console.log('🏙️ Starting MetroSim - Ultimate City Builder');
        initializeGame();
    });

    window.game = game;
})();
