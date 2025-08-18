// MetroSim - Main Game Class
// Central game controller that manages all systems

class Game {
    constructor() {
        this.isInitialized = false;
        this.isPaused = false;
        this.gameSpeed = 1;
        this.lastUpdateTime = 0;
        this.gameStartTime = Date.now();
        this.sessionStartTime = Date.now();
        
        // Game systems
        this.buildingManager = new BuildingManager();
        this.citizenManager = new CitizenManager();
        this.economyManager = new EconomyManager();
        this.disasterManager = new DisasterManager();
        this.researchManager = new ResearchManager();
        this.achievementManager = new AchievementManager();
        
        this.renderer = null;
        this.inputManager = null;
        this.audioManager = null;
        
        // Game state
        this.gameState = {
            cityName: 'New Metro',
            population: 0,
            money: 50000,
            happiness: 50,
            power: { consumption: 0, generation: 0 },
            water: { consumption: 0, generation: 0 },
            pollution: 0,
            safety: 50,
            health: 100,
            education: 0,
            
            // Building and construction
            selectedBuildingType: null,
            selectedBuilding: null,
            currentTool: 'select',
            buildingPreview: null,
            
            // UI state
            showDebugInfo: false,
            notifications: [],
            events: [],
            
            // Statistics
            totalBuildingsBuilt: 0,
            totalIncomeEarned: 0,
            disastersSurvived: 0,
            monthlyProfit: 0,
            playTime: 0,
            sessionPlayTime: 0,
            totalPlayTime: 0,
            cityAge: 0
        };
        
        // Game data
        this.buildings = [];
        this.roads = [];
        this.zones = [];
        
        // Auto-save
        this.autoSaveInterval = 60000; // 1 minute
        this.lastAutoSave = Date.now();
    }

    // Initialize the game
    async initialize() {
        if (this.isInitialized) return;
        
        try {
            // Initialize renderer
            const canvas = document.getElementById('game-canvas');
            if (!canvas) throw new Error('Game canvas not found');
            
            this.renderer = new Renderer(canvas);
            this.inputManager = new InputManager(canvas, this.renderer);
            
            // Setup input handlers
            this.setupInputHandlers();
            
            // Initialize UI
            this.initializeUI();
            
            // Load saved game if available
            this.loadGame();
            
            // Start game loop
            this.isInitialized = true;
            this.startGameLoop();
            
            console.log('🏙️ MetroSim initialized successfully!');
            
        } catch (error) {
            console.error('Failed to initialize game:', error);
            this.showNotification('Failed to initialize game', 'error');
        }
    }

    // Setup input event handlers
    setupInputHandlers() {
        // Click handling
        this.inputManager.on('click', (data) => {
            this.handleClick(data);
        });
        
        // Right click handling
        this.inputManager.on('rightClick', (data) => {
            this.handleRightClick(data);
        });
        
        // Keyboard handling
        this.inputManager.on('keyDown', (data) => {
            this.handleKeyDown(data);
        });
        
        // Hover handling for tooltips
        this.inputManager.on('hover', (data) => {
            this.handleHover(data);
        });
    }

    // Initialize UI elements
    initializeUI() {
        // Building category buttons
        const categoryBtns = document.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectBuildingCategory(btn.dataset.category);
            });
        });
        
        // Tool buttons
        const toolBtns = document.querySelectorAll('.tool-btn');
        toolBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectTool(btn.id.replace('-tool', ''));
            });
        });
        
        // Action buttons
        this.setupActionButtons();
        
        // Speed control
        const speedBtn = document.getElementById('speed-btn');
        speedBtn?.addEventListener('click', () => {
            this.cycleGameSpeed();
        });
        
        // Pause button
        const pauseBtn = document.getElementById('pause-btn');
        pauseBtn?.addEventListener('click', () => {
            this.togglePause();
        });
        
        // Initialize building list
        this.updateBuildingList();
    }

    // Setup action buttons
    setupActionButtons() {
        const buttons = {
            'research-btn': () => this.showModal('research-modal'),
            'budget-btn': () => this.showBudgetModal(),
            'disasters-btn': () => this.showDisastersModal(),
            'achievements-btn': () => this.showModal('achievements-modal'),
            'save-btn': () => this.saveGame(),
            'load-btn': () => this.loadGameDialog(),
            'settings-btn': () => this.showModal('settings-modal')
        };
        
        Object.entries(buttons).forEach(([id, handler]) => {
            const btn = document.getElementById(id);
            btn?.addEventListener('click', handler);
        });
        
        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) this.hideModal(modal.id);
            });
        });
        
        // Modal overlay click to close
        const overlay = document.getElementById('modal-overlay');
        overlay?.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.hideAllModals();
            }
        });
    }

    // Handle click events
    handleClick(data) {
        const { tileX, tileY, button, isDoubleClick } = data;
        
        switch (this.gameState.currentTool) {
            case 'select':
                this.handleSelectClick(tileX, tileY, isDoubleClick);
                break;
                
            case 'bulldoze':
                this.handleBulldozeClick(tileX, tileY);
                break;
                
            case 'road':
                this.handleRoadClick(tileX, tileY);
                break;
                
            default:
                if (this.gameState.selectedBuildingType) {
                    this.handleBuildingPlacement(tileX, tileY);
                }
                break;
        }
    }

    // Handle select tool clicks
    handleSelectClick(tileX, tileY, isDoubleClick) {
        const building = this.buildingManager.getBuildingAt(tileX, tileY);
        
        if (building) {
            this.gameState.selectedBuilding = building;
            this.updateBuildingInfo(building);
            
            if (isDoubleClick) {
                this.centerCameraOnBuilding(building);
            }
        } else {
            this.gameState.selectedBuilding = null;
            this.clearBuildingInfo();
        }
    }

    // Handle bulldoze clicks
    handleBulldozeClick(tileX, tileY) {
        const building = this.buildingManager.getBuildingAt(tileX, tileY);
        
        if (building) {
            const refund = Math.floor(building.cost * 0.3); // 30% refund
            this.economyManager.money += refund;
            
            this.buildingManager.removeBuilding(building.id);
            this.buildings = this.buildingManager.getAllBuildings();
            
            this.showNotification(`Building demolished. Refund: ${Utils.formatCurrency(refund)}`, 'info');
            this.addEvent(`Demolished ${building.name}`);
            
            // Particle effect
            this.renderer.addParticleEffect(tileX * this.renderer.tileSize, tileY * this.renderer.tileSize, 'demolition');
        }
    }

    // Handle building placement
    handleBuildingPlacement(tileX, tileY) {
        const buildingType = this.buildingManager.buildingTypes[this.gameState.selectedBuildingType];
        if (!buildingType) return;
        
        // Check if can afford
        if (!this.buildingManager.canAfford(this.gameState.selectedBuildingType, this.economyManager.money)) {
            this.showNotification(`Not enough money! Need ${Utils.formatCurrency(buildingType.cost)}`, 'error');
            return;
        }
        
        // Check if tile is available
        if (this.buildingManager.getBuildingAt(tileX, tileY)) {
            this.showNotification('Tile already occupied!', 'error');
            return;
        }
        
        // Place building
        const building = this.buildingManager.placeBuilding(this.gameState.selectedBuildingType, tileX, tileY);
        if (building) {
            this.economyManager.money -= buildingType.cost;
            this.buildings = this.buildingManager.getAllBuildings();
            this.gameState.totalBuildingsBuilt++;
            
            this.showNotification(`${buildingType.name} built for ${Utils.formatCurrency(buildingType.cost)}`, 'success');
            this.addEvent(`Built ${buildingType.name}`);
            
            // Particle effect
            this.renderer.addParticleEffect(tileX * this.renderer.tileSize, tileY * this.renderer.tileSize, 'construction');
            
            // Check achievements
            this.checkAchievements();
        }
    }

    // Handle right click events
    handleRightClick(data) {
        // Cancel current action or show context menu
        if (this.gameState.selectedBuildingType) {
            this.gameState.selectedBuildingType = null;
            this.gameState.buildingPreview = null;
            this.updateBuildingList();
        }
    }

    // Handle keyboard input
    handleKeyDown(data) {
        const { code, key, action } = data;
        
        switch (action) {
            case 'pause':
                this.togglePause();
                break;
                
            case 'cancel':
                this.gameState.selectedBuildingType = null;
                this.gameState.buildingPreview = null;
                this.hideAllModals();
                break;
                
            case 'delete':
                if (this.gameState.selectedBuilding) {
                    this.handleBulldozeClick(
                        this.gameState.selectedBuilding.x,
                        this.gameState.selectedBuilding.y
                    );
                }
                break;
        }
        
        // Number keys for building shortcuts
        if (code >= 'Digit1' && code <= 'Digit9') {
            const index = parseInt(code.slice(-1)) - 1;
            this.selectBuildingByIndex(index);
        }
    }

    // Handle hover events for tooltips
    handleHover(data) {
        const { tileX, tileY } = data;
        const building = this.buildingManager.getBuildingAt(tileX, tileY);
        
        if (building) {
            this.showBuildingTooltip(building, data.x, data.y);
        } else {
            this.hideBuildingTooltip();
        }
        
        // Update building preview
        if (this.gameState.selectedBuildingType) {
            this.gameState.buildingPreview = { x: tileX, y: tileY };
        } else {
            this.gameState.buildingPreview = null;
        }
    }

    // Select building category
    selectBuildingCategory(category) {
        // Update category buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });
        
        this.updateBuildingList(category);
    }

    // Update building list UI
    updateBuildingList(category = 'residential') {
        const buildingList = document.getElementById('building-list');
        if (!buildingList) return;
        
        const buildings = this.buildingManager.getBuildingsByCategory(category);
        const unlockedBuildings = buildings.filter(b => b.unlocked);
        
        buildingList.innerHTML = unlockedBuildings.map(building => `
            <div class="building-item ${this.gameState.selectedBuildingType === building.id ? 'selected' : ''}" 
                 data-building-id="${building.id}">
                <div class="building-icon">${building.icon}</div>
                <div class="building-info">
                    <div class="building-name">${building.name}</div>
                    <div class="building-cost">${Utils.formatCurrency(building.cost)}</div>
                </div>
            </div>
        `).join('');
        
        // Add click handlers
        buildingList.querySelectorAll('.building-item').forEach(item => {
            item.addEventListener('click', () => {
                const buildingId = item.dataset.buildingId;
                this.selectBuildingType(buildingId);
            });
        });
    }

    // Select building type
    selectBuildingType(buildingId) {
        this.gameState.selectedBuildingType = buildingId;
        this.gameState.currentTool = 'build';
        
        // Update UI
        document.querySelectorAll('.building-item').forEach(item => {
            item.classList.toggle('selected', item.dataset.buildingId === buildingId);
        });
        
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.remove('active');
        });
    }

    // Select tool
    selectTool(tool) {
        this.gameState.currentTool = tool;
        this.gameState.selectedBuildingType = null;
        this.gameState.buildingPreview = null;
        
        // Update UI
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.toggle('active', btn.id === `${tool}-tool`);
        });
        
        document.querySelectorAll('.building-item').forEach(item => {
            item.classList.remove('selected');
        });
    }

    // Game speed control
    cycleGameSpeed() {
        const speeds = [0.5, 1, 2, 3];
        const currentIndex = speeds.indexOf(this.gameSpeed);
        const nextIndex = (currentIndex + 1) % speeds.length;
        
        this.gameSpeed = speeds[nextIndex];
        
        const speedBtn = document.getElementById('speed-btn');
        if (speedBtn) {
            speedBtn.textContent = `${this.gameSpeed}x`;
        }
    }

    // Toggle pause
    togglePause() {
        this.isPaused = !this.isPaused;
        
        const pauseBtn = document.getElementById('pause-btn');
        if (pauseBtn) {
            pauseBtn.textContent = this.isPaused ? '▶️' : '⏸️';
        }
        
        this.showNotification(this.isPaused ? 'Game Paused' : 'Game Resumed', 'info');
    }

    // Update game state
    update(deltaTime) {
        if (this.isPaused) return;
        
        const scaledDelta = deltaTime * this.gameSpeed;
        
        // Update play time
        this.gameState.playTime = Date.now() - this.gameStartTime;
        this.gameState.sessionPlayTime = Date.now() - this.sessionStartTime;
        this.gameState.totalPlayTime += deltaTime;
        
        // Update all systems
        this.updateCityStats();
        
        const cityStats = this.getCityStats();
        
        // Update managers
        this.citizenManager.update(cityStats);
        const economyReport = this.economyManager.update(this.buildings, this.citizenManager.getAllCitizens(), cityStats);
        const completedResearch = this.researchManager.update(scaledDelta, cityStats);
        this.disasterManager.updateDisasters(scaledDelta);
        
        // Check for new disasters
        const newDisaster = this.disasterManager.checkForDisasters(cityStats, this.buildings);
        if (newDisaster) {
            this.handleNewDisaster(newDisaster);
        }
        
        // Check achievements
        this.checkAchievements();
        
        // Update UI
        this.updateUI();
        
        // Auto-save
        if (Date.now() - this.lastAutoSave > this.autoSaveInterval) {
            this.autoSave();
        }
        
        // Handle completed research
        if (completedResearch) {
            this.handleCompletedResearch(completedResearch);
        }
        
        // Handle monthly economy report
        if (economyReport) {
            this.handleEconomyReport(economyReport);
        }
    }

    // Update city statistics
    updateCityStats() {
        const buildingResources = this.buildingManager.calculateResources();
        const populationStats = this.citizenManager.populationStats;
        
        this.gameState.population = populationStats.total;
        this.gameState.money = this.economyManager.money;
        this.gameState.happiness = populationStats.happiness;
        
        this.gameState.power.consumption = buildingResources.powerConsumption;
        this.gameState.power.generation = buildingResources.powerGeneration;
        this.gameState.water.consumption = buildingResources.waterConsumption;
        this.gameState.water.generation = buildingResources.waterGeneration;
        
        this.gameState.pollution = Math.max(0, buildingResources.pollution);
        this.gameState.health = populationStats.health;
        this.gameState.education = populationStats.education;
    }

    // Get comprehensive city stats
    getCityStats() {
        const buildingResources = this.buildingManager.calculateResources();
        
        return {
            population: this.gameState.population,
            happiness: this.gameState.happiness,
            powerGeneration: this.gameState.power.generation,
            powerConsumption: this.gameState.power.consumption,
            waterGeneration: this.gameState.water.generation,
            waterConsumption: this.gameState.water.consumption,
            pollution: this.gameState.pollution,
            safety: this.gameState.safety,
            health: this.gameState.health,
            education: this.gameState.education,
            jobAvailability: buildingResources.jobs,
            commercialCapacity: buildingResources.capacity,
            healthcareCapacity: this.buildings.filter(b => b.type === 'hospital').length * 1000,
            educationCapacity: this.buildings.filter(b => b.type === 'school' || b.type === 'university').length * 500,
            recreationCapacity: this.buildings.filter(b => b.category === 'decoration').length * 100,
            safetyLevel: this.gameState.safety,
            preparedness: this.disasterManager.preparedness,
            unemployment: this.citizenManager.populationStats.unemployed,
            averageEducation: this.citizenManager.populationStats.education,
            completedResearch: this.researchManager.completedResearch.size,
            researchCompleted: this.researchManager.completedResearch,
            disastersSurvived: this.gameState.disastersSurvived,
            monthlyIncome: this.economyManager.income,
            monthlyProfit: this.economyManager.income - this.economyManager.expenses,
            playTime: this.gameState.playTime,
            sessionPlayTime: this.gameState.sessionPlayTime,
            totalPlayTime: this.gameState.totalPlayTime,
            cityAge: Math.floor(this.gameState.playTime / 60000), // Age in minutes
            totalBuildingsBuilt: this.gameState.totalBuildingsBuilt,
            totalIncomeEarned: this.gameState.totalIncomeEarned,
            buildings: this.buildings
        };
    }

    // Check achievements
    checkAchievements() {
        const cityStats = this.getCityStats();
        const newAchievements = this.achievementManager.checkAchievements(cityStats);
        
        newAchievements.forEach(achievement => {
            this.showNotification(`🏆 Achievement: ${achievement.name}`, 'achievement');
            this.addEvent(`Unlocked: ${achievement.name}`);
        });
    }

    // Update UI elements
    updateUI() {
        // Update resource displays
        this.updateElement('population', this.gameState.population.toLocaleString());
        this.updateElement('money', Utils.formatCurrency(this.gameState.money));
        this.updateElement('happiness', Utils.formatPercent(this.gameState.happiness));
        
        const powerBalance = this.gameState.power.generation - this.gameState.power.consumption;
        this.updateElement('power', `${Math.round(powerBalance)}/${Math.round(this.gameState.power.generation)}`);
        
        const waterBalance = this.gameState.water.generation - this.gameState.water.consumption;
        this.updateElement('water', `${Math.round(waterBalance)}/${Math.round(this.gameState.water.generation)}`);
        
        // Update city stats
        this.updateElement('city-level', Math.floor(this.gameState.population / 1000) + 1);
        this.updateElement('income', `+${Utils.formatCurrency(this.economyManager.income)}/min`);
        this.updateElement('expenses', `-${Utils.formatCurrency(this.economyManager.expenses)}/min`);
        
        const growthRate = this.citizenManager.populationStats.total > 0 ? 
            ((this.economyManager.income - this.economyManager.expenses) / this.economyManager.income) * 100 : 0;
        this.updateElement('growth', Utils.formatPercent(growthRate));
        
        // Update needs bars
        const needs = this.citizenManager.getNeedsSatisfaction();
        this.updateNeedsBar('housing-need', needs.housing || 0);
        this.updateNeedsBar('jobs-need', needs.employment || 0);
        this.updateNeedsBar('shopping-need', needs.shopping || 0);
        this.updateNeedsBar('healthcare-need', needs.healthcare || 0);
    }

    // Update single element
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    // Update needs bar
    updateNeedsBar(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.style.width = `${Math.min(value, 100)}%`;
        }
    }

    // Show notification
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        const container = document.getElementById('notifications');
        if (container) {
            container.appendChild(notification);
            
            // Animate in
            setTimeout(() => notification.classList.add('visible'), 100);
            
            // Remove after duration
            setTimeout(() => {
                notification.classList.remove('visible');
                setTimeout(() => container.removeChild(notification), 300);
            }, duration);
        }
    }

    // Add event to event log
    addEvent(message) {
        const event = {
            time: Utils.getCurrentTime(),
            message: message
        };
        
        this.gameState.events.unshift(event);
        if (this.gameState.events.length > 50) {
            this.gameState.events.pop();
        }
        
        // Update events UI
        const eventsList = document.getElementById('events-list');
        if (eventsList) {
            eventsList.innerHTML = this.gameState.events.slice(0, 10).map(event => `
                <div class="event">
                    <span class="event-time">${event.time}</span>
                    <span class="event-text">${event.message}</span>
                </div>
            `).join('');
        }
    }

    // Modal management
    showModal(modalId) {
        const overlay = document.getElementById('modal-overlay');
        const modal = document.getElementById(modalId);
        
        if (overlay && modal) {
            overlay.classList.add('visible');
            
            // Load modal content based on type
            this.loadModalContent(modalId);
        }
    }

    hideModal(modalId) {
        const overlay = document.getElementById('modal-overlay');
        if (overlay) {
            overlay.classList.remove('visible');
        }
    }

    hideAllModals() {
        const overlay = document.getElementById('modal-overlay');
        if (overlay) {
            overlay.classList.remove('visible');
        }
    }

    // Load content for specific modals
    loadModalContent(modalId) {
        switch (modalId) {
            case 'research-modal':
                this.loadResearchModal();
                break;
            case 'achievements-modal':
                this.loadAchievementsModal();
                break;
        }
    }

    // Load research modal content
    loadResearchModal() {
        const container = document.getElementById('research-tree');
        if (!container) return;
        
        const availableResearch = this.researchManager.getAvailableTechnologies();
        const currentResearch = this.researchManager.currentResearch;
        const stats = this.researchManager.getResearchStats();
        
        container.innerHTML = `
            <div class="research-stats">
                <div>Research Points: ${stats.researchPoints}</div>
                <div>Research Rate: ${stats.researchRate}/min</div>
                ${currentResearch ? `<div>Current: ${currentResearch.name} (${Math.floor(currentResearch.progress * 100)}%)</div>` : ''}
            </div>
            <div class="research-grid">
                ${availableResearch.map(tech => `
                    <div class="research-item ${tech.canAfford ? '' : 'locked'}" data-tech-id="${tech.id}">
                        <div class="research-icon">${tech.icon}</div>
                        <div class="research-name">${tech.name}</div>
                        <div class="research-cost">${tech.cost} RP</div>
                        <div class="research-description">${tech.description}</div>
                    </div>
                `).join('')}
            </div>
        `;
        
        // Add click handlers
        container.querySelectorAll('.research-item').forEach(item => {
            item.addEventListener('click', () => {
                const techId = item.dataset.techId;
                const result = this.researchManager.startResearch(techId);
                if (result.success) {
                    this.showNotification(`Started researching ${result.research.name}`, 'success');
                    this.loadResearchModal(); // Refresh
                } else {
                    this.showNotification(result.reason, 'error');
                }
            });
        });
    }

    // Load achievements modal content
    loadAchievementsModal() {
        const container = document.getElementById('achievements-grid');
        if (!container) return;
        
        const stats = this.achievementManager.getAchievementStats();
        const achievements = Object.entries(this.achievementManager.achievements);
        
        container.innerHTML = `
            <div class="achievements-stats">
                <div>Progress: ${stats.unlocked}/${stats.total} (${stats.percentage}%)</div>
                <div>Score: ${stats.completionScore}</div>
            </div>
            <div class="achievements-list">
                ${achievements.map(([id, achievement]) => {
                    const unlocked = this.achievementManager.unlockedAchievements.has(id);
                    return `
                        <div class="achievement-item ${unlocked ? 'unlocked' : ''}">
                            <div class="achievement-icon">${achievement.icon}</div>
                            <div class="achievement-title">${achievement.name}</div>
                            <div class="achievement-description">${achievement.description}</div>
                            <div class="achievement-rarity">${achievement.rarity}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    // Save game
    saveGame() {
        try {
            const saveData = {
                version: '1.0.0',
                timestamp: Date.now(),
                gameState: this.gameState,
                buildings: this.buildingManager.serialize(),
                citizens: this.citizenManager.serialize(),
                economy: this.economyManager.serialize(),
                disasters: this.disasterManager.serialize(),
                research: this.researchManager.serialize(),
                achievements: this.achievementManager.serialize()
            };
            
            localStorage.setItem('metrosim-save', JSON.stringify(saveData));
            this.showNotification('Game saved successfully!', 'success');
            this.lastAutoSave = Date.now();
            
        } catch (error) {
            console.error('Failed to save game:', error);
            this.showNotification('Failed to save game', 'error');
        }
    }

    // Load game
    loadGame() {
        try {
            const saveData = localStorage.getItem('metrosim-save');
            if (!saveData) return false;
            
            const data = JSON.parse(saveData);
            
            // Restore game state
            if (data.gameState) {
                this.gameState = { ...this.gameState, ...data.gameState };
            }
            
            // Restore managers
            if (data.buildings) this.buildingManager.deserialize(data.buildings);
            if (data.citizens) this.citizenManager.deserialize(data.citizens);
            if (data.economy) this.economyManager.deserialize(data.economy);
            if (data.disasters) this.disasterManager.deserialize(data.disasters);
            if (data.research) this.researchManager.deserialize(data.research);
            if (data.achievements) this.achievementManager.deserialize(data.achievements);
            
            // Update building list
            this.buildings = this.buildingManager.getAllBuildings();
            
            this.showNotification('Game loaded successfully!', 'success');
            return true;
            
        } catch (error) {
            console.error('Failed to load game:', error);
            this.showNotification('Failed to load game', 'error');
            return false;
        }
    }

    // Auto-save
    autoSave() {
        this.saveGame();
        console.log('Auto-saved game');
    }

    // Main game loop
    gameLoop(currentTime) {
        if (!this.isInitialized) return;
        
        const deltaTime = currentTime - this.lastUpdateTime;
        this.lastUpdateTime = currentTime;
        
        // Update input
        this.inputManager.update(deltaTime);
        
        // Update game logic
        this.update(deltaTime);
        
        // Render
        this.renderer.render(this.gameState, deltaTime);
        
        // Continue loop
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    // Start game loop
    startGameLoop() {
        this.lastUpdateTime = performance.now();
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    // Handle window resize
    handleResize() {
        if (this.renderer) {
            this.renderer.resize();
        }
    }
}

// Export for use in other modules
window.Game = Game;
