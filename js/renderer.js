// MetroSim - Rendering Engine
// Canvas-based 2D renderer for the city simulation

class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.camera = {
            x: 0,
            y: 0,
            zoom: 1,
            targetZoom: 1,
            minZoom: 0.3,
            maxZoom: 3
        };
        this.tileSize = 32;
        this.gridVisible = true;
        this.animations = [];
        this.particles = [];
        this.lastFrameTime = 0;
        
        // Colors and styles
        this.colors = {
            background: '#0a0f13',
            grid: 'rgba(0, 255, 213, 0.1)',
            gridMajor: 'rgba(0, 255, 213, 0.2)',
            water: '#1a4b5c',
            grass: '#2d4a3d',
            road: '#3a3a3a',
            residential: '#4a7c59',
            commercial: '#7c5a4a',
            industrial: '#5a4a7c',
            utilities: '#7c7c4a',
            services: '#4a5a7c',
            decoration: '#59a659'
        };
        
        this.buildingIcons = {
            // Residential
            'small-house': '🏠',
            'apartment': '🏢',
            'luxury-condo': '🏰',
            'mansion': '🏛️',
            
            // Commercial
            'corner-shop': '🏪',
            'shopping-mall': '🛒',
            'office-building': '🏢',
            'skyscraper': '🏙️',
            
            // Industrial
            'small-factory': '🏭',
            'tech-campus': '💻',
            'logistics-center': '📦',
            
            // Utilities
            'power-plant': '⚡',
            'solar-farm': '☀️',
            'water-treatment': '💧',
            'waste-management': '♻️',
            
            // Services
            'hospital': '🏥',
            'school': '🏫',
            'university': '🎓',
            'police-station': '👮',
            'fire-station': '🚒',
            
            // Decoration
            'small-park': '🌳',
            'central-park': '🌲',
            'fountain': '⛲',
            'statue': '🗿'
        };
        
        this.setupCanvas();
    }

    setupCanvas() {
        // Handle high DPI displays
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        
        this.ctx.scale(dpr, dpr);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        
        // Set default styles
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
    }

    // World to screen coordinate conversion
    worldToScreen(worldX, worldY) {
        return {
            x: (worldX - this.camera.x) * this.camera.zoom + this.canvas.width / 2,
            y: (worldY - this.camera.y) * this.camera.zoom + this.canvas.height / 2
        };
    }

    // Screen to world coordinate conversion
    screenToWorld(screenX, screenY) {
        return {
            x: (screenX - this.canvas.width / 2) / this.camera.zoom + this.camera.x,
            y: (screenY - this.canvas.height / 2) / this.camera.zoom + this.camera.y
        };
    }

    // Update camera position smoothly
    updateCamera(deltaTime) {
        // Smooth zoom
        const zoomSpeed = 5;
        const zoomDiff = this.camera.targetZoom - this.camera.zoom;
        this.camera.zoom += zoomDiff * zoomSpeed * deltaTime / 1000;
        
        // Clamp zoom
        this.camera.zoom = Utils.clamp(this.camera.zoom, this.camera.minZoom, this.camera.maxZoom);
        this.camera.targetZoom = Utils.clamp(this.camera.targetZoom, this.camera.minZoom, this.camera.maxZoom);
    }

    // Set camera position
    setCameraPosition(x, y) {
        this.camera.x = x;
        this.camera.y = y;
    }

    // Set camera zoom
    setCameraZoom(zoom) {
        this.camera.targetZoom = Utils.clamp(zoom, this.camera.minZoom, this.camera.maxZoom);
    }

    // Pan camera
    panCamera(deltaX, deltaY) {
        this.camera.x += deltaX / this.camera.zoom;
        this.camera.y += deltaY / this.camera.zoom;
    }

    // Clear canvas
    clear() {
        this.ctx.fillStyle = this.colors.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Draw grid
    drawGrid() {
        if (!this.gridVisible || this.camera.zoom < 0.5) return;
        
        const screenBounds = this.getScreenBounds();
        const tileSize = this.tileSize * this.camera.zoom;
        
        // Calculate grid bounds
        const startX = Math.floor(screenBounds.left / this.tileSize) * this.tileSize;
        const endX = Math.ceil(screenBounds.right / this.tileSize) * this.tileSize;
        const startY = Math.floor(screenBounds.top / this.tileSize) * this.tileSize;
        const endY = Math.ceil(screenBounds.bottom / this.tileSize) * this.tileSize;
        
        this.ctx.strokeStyle = this.colors.grid;
        this.ctx.lineWidth = 1;
        
        // Draw vertical lines
        for (let x = startX; x <= endX; x += this.tileSize) {
            const screenPos = this.worldToScreen(x, 0);
            this.ctx.beginPath();
            this.ctx.moveTo(screenPos.x, 0);
            this.ctx.lineTo(screenPos.x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Draw horizontal lines
        for (let y = startY; y <= endY; y += this.tileSize) {
            const screenPos = this.worldToScreen(0, y);
            this.ctx.beginPath();
            this.ctx.moveTo(0, screenPos.y);
            this.ctx.lineTo(this.canvas.width, screenPos.y);
            this.ctx.stroke();
        }
        
        // Draw major grid lines every 10 tiles
        this.ctx.strokeStyle = this.colors.gridMajor;
        this.ctx.lineWidth = 2;
        
        for (let x = startX; x <= endX; x += this.tileSize * 10) {
            const screenPos = this.worldToScreen(x, 0);
            this.ctx.beginPath();
            this.ctx.moveTo(screenPos.x, 0);
            this.ctx.lineTo(screenPos.x, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let y = startY; y <= endY; y += this.tileSize * 10) {
            const screenPos = this.worldToScreen(0, y);
            this.ctx.beginPath();
            this.ctx.moveTo(0, screenPos.y);
            this.ctx.lineTo(this.canvas.width, screenPos.y);
            this.ctx.stroke();
        }
    }

    // Get screen bounds in world coordinates
    getScreenBounds() {
        const topLeft = this.screenToWorld(0, 0);
        const bottomRight = this.screenToWorld(this.canvas.width, this.canvas.height);
        
        return {
            left: topLeft.x,
            top: topLeft.y,
            right: bottomRight.x,
            bottom: bottomRight.y,
            width: bottomRight.x - topLeft.x,
            height: bottomRight.y - topLeft.y
        };
    }

    // Draw terrain/background
    drawTerrain(gameState) {
        console.log('drawTerrain called');
        const bounds = this.getScreenBounds();
        const tileSize = this.tileSize;
        
        console.log('Screen bounds:', bounds);
        console.log('Tile size:', tileSize);
        console.log('Camera:', this.camera);
        
        // Calculate tile bounds from world bounds
        const minTileX = Math.floor(bounds.left / tileSize);
        const maxTileX = Math.ceil(bounds.right / tileSize);
        const minTileY = Math.floor(bounds.top / tileSize);
        const maxTileY = Math.ceil(bounds.bottom / tileSize);
        
        console.log('Tile bounds:', {minTileX, maxTileX, minTileY, maxTileY});
        
        let tilesDrawn = 0;
        let terrainFound = 0;
        
        for (let tileX = minTileX; tileX <= maxTileX; tileX++) {
            for (let tileY = minTileY; tileY <= maxTileY; tileY++) {
                // Convert tile coordinates to world coordinates for rendering
                const worldX = tileX * tileSize;
                const worldY = tileY * tileSize;
                const screenPos = this.worldToScreen(worldX, worldY);
                const size = tileSize * this.camera.zoom;
                
                // Get terrain type from game state using tile coordinates
                let terrainType = 'grass'; // Default
                if (gameState.terrain) {
                    const foundTerrain = gameState.terrain.get(`${tileX},${tileY}`);
                    if (foundTerrain) {
                        terrainType = foundTerrain;
                        terrainFound++;
                    }
                } else {
                    // Fallback to procedural generation
                    const noise = Math.sin(tileX * 0.1) * Math.cos(tileY * 0.1);
                    if (noise < -0.3) terrainType = 'water';
                    else if (noise > 0.5) terrainType = 'grass';
                }
                
                this.ctx.fillStyle = this.colors[terrainType];
                this.ctx.fillRect(screenPos.x, screenPos.y, size, size);
                tilesDrawn++;
            }
        }
        
        console.log(`Drew ${tilesDrawn} tiles, ${terrainFound} from terrain data`);
    }

    // Draw building
    drawBuilding(building) {
        const worldX = building.x * this.tileSize;
        const worldY = building.y * this.tileSize;
        const screenPos = this.worldToScreen(worldX, worldY);
        const size = this.tileSize * this.camera.zoom;
        
        // Building background
        const categoryColor = this.colors[building.category] || this.colors.residential;
        this.ctx.fillStyle = categoryColor;
        
        // Adjust opacity based on building condition
        const condition = building.condition || 100;
        const opacity = Math.max(0.3, condition / 100);
        this.ctx.globalAlpha = opacity;
        
        // Draw building size (width x height)
        const buildingWidth = (building.size?.width || 1) * size;
        const buildingHeight = (building.size?.height || 1) * size;
        
        this.ctx.fillRect(screenPos.x, screenPos.y, buildingWidth, buildingHeight);
        
        // Building border
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 1;
        this.ctx.globalAlpha = 1;
        this.ctx.strokeRect(screenPos.x, screenPos.y, buildingWidth, buildingHeight);
        
        // Building icon (if zoom level allows)
        if (this.camera.zoom > 0.8) {
            const icon = this.buildingIcons[building.type] || '🏢';
            const fontSize = Math.min(size * 0.6, 24);
            
            this.ctx.font = `${fontSize}px Arial`;
            this.ctx.fillStyle = '#ffffff';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(
                icon,
                screenPos.x + buildingWidth / 2,
                screenPos.y + buildingHeight / 2
            );
        }
        
        // Building level indicator
        if (building.level > 1 && this.camera.zoom > 1) {
            this.ctx.font = '12px Arial';
            this.ctx.fillStyle = '#ffff00';
            this.ctx.textAlign = 'right';
            this.ctx.textBaseline = 'top';
            this.ctx.fillText(
                `L${building.level}`,
                screenPos.x + buildingWidth - 5,
                screenPos.y + 5
            );
        }
        
        // Condition warning
        if (condition < 50) {
            this.ctx.fillStyle = '#ff4444';
            this.ctx.fillText('⚠', screenPos.x + 5, screenPos.y + 5);
        }
    }

    // Draw all buildings
    drawBuildings(buildings) {
        console.log('drawBuildings called with:', buildings ? buildings.length + ' buildings' : 'null');
        const bounds = this.getScreenBounds();
        
        // Only draw buildings that are visible
        const visibleBuildings = buildings.filter(building => {
            const worldX = building.x * this.tileSize;
            const worldY = building.y * this.tileSize;
            const buildingWidth = (building.size?.width || 1) * this.tileSize;
            const buildingHeight = (building.size?.height || 1) * this.tileSize;
            
            return worldX + buildingWidth >= bounds.left &&
                   worldX <= bounds.right &&
                   worldY + buildingHeight >= bounds.top &&
                   worldY <= bounds.bottom;
        });
        
        // Sort by size (draw larger buildings first for proper layering)
        visibleBuildings.sort((a, b) => {
            const sizeA = (a.size?.width || 1) * (a.size?.height || 1);
            const sizeB = (b.size?.width || 1) * (b.size?.height || 1);
            return sizeB - sizeA;
        });
        
        visibleBuildings.forEach(building => this.drawBuilding(building));
    }

    // Draw roads
    drawRoads(roads) {
        this.ctx.strokeStyle = this.colors.road;
        this.ctx.lineWidth = this.tileSize * this.camera.zoom * 0.3;
        
        roads.forEach(road => {
            const startPos = this.worldToScreen(road.startX * this.tileSize, road.startY * this.tileSize);
            const endPos = this.worldToScreen(road.endX * this.tileSize, road.endY * this.tileSize);
            
            this.ctx.beginPath();
            this.ctx.moveTo(startPos.x, startPos.y);
            this.ctx.lineTo(endPos.x, endPos.y);
            this.ctx.stroke();
        });
    }

    // Draw particle effects
    drawParticles(deltaTime) {
        this.particles = this.particles.filter(particle => {
            particle.life -= deltaTime;
            
            if (particle.life <= 0) return false;
            
            // Update particle
            particle.x += particle.vx * deltaTime / 1000;
            particle.y += particle.vy * deltaTime / 1000;
            particle.vy += particle.gravity * deltaTime / 1000;
            
            // Draw particle
            const screenPos = this.worldToScreen(particle.x, particle.y);
            const alpha = particle.life / particle.maxLife;
            
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.fillRect(screenPos.x - 1, screenPos.y - 1, 2, 2);
            this.ctx.globalAlpha = 1;
            
            return true;
        });
    }

    // Add particle effect
    addParticleEffect(x, y, type) {
        const particleCount = 10;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = {
                x: x + Utils.random(-16, 16),
                y: y + Utils.random(-16, 16),
                vx: Utils.random(-50, 50),
                vy: Utils.random(-100, -20),
                gravity: 100,
                life: Utils.random(1000, 3000),
                maxLife: 0,
                color: type === 'construction' ? '#ffff00' : '#ff4444'
            };
            particle.maxLife = particle.life;
            this.particles.push(particle);
        }
    }

    // Draw UI overlays
    drawUI(gameState) {
        // Selected building highlight
        if (gameState.selectedBuilding) {
            const building = gameState.selectedBuilding;
            const worldX = building.x * this.tileSize;
            const worldY = building.y * this.tileSize;
            const screenPos = this.worldToScreen(worldX, worldY);
            const buildingWidth = (building.size?.width || 1) * this.tileSize * this.camera.zoom;
            const buildingHeight = (building.size?.height || 1) * this.tileSize * this.camera.zoom;
            
            this.ctx.strokeStyle = '#00ffff';
            this.ctx.lineWidth = 3;
            this.ctx.setLineDash([5, 5]);
            this.ctx.strokeRect(screenPos.x - 2, screenPos.y - 2, buildingWidth + 4, buildingHeight + 4);
            this.ctx.setLineDash([]);
        }
        
        // Building placement preview
        if (gameState.buildingPreview) {
            const preview = gameState.buildingPreview;
            const screenPos = this.worldToScreen(preview.x * this.tileSize, preview.y * this.tileSize);
            const size = this.tileSize * this.camera.zoom;
            
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            this.ctx.fillRect(screenPos.x, screenPos.y, size, size);
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(screenPos.x, screenPos.y, size, size);
        }
    }

    // Draw disaster effects
    drawDisasterEffects(disasters) {
        disasters.forEach(disaster => {
            if (disaster.status !== 'active') return;
            
            const screenPos = this.worldToScreen(
                disaster.epicenter.x * this.tileSize,
                disaster.epicenter.y * this.tileSize
            );
            const radius = disaster.affectedRadius * this.tileSize * this.camera.zoom;
            
            // Disaster effect circle
            this.ctx.strokeStyle = '#ff4444';
            this.ctx.lineWidth = 3;
            this.ctx.setLineDash([10, 5]);
            this.ctx.beginPath();
            this.ctx.arc(screenPos.x, screenPos.y, radius, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
            
            // Disaster icon
            this.ctx.font = '24px Arial';
            this.ctx.fillStyle = '#ff4444';
            this.ctx.fillText(disaster.icon, screenPos.x, screenPos.y);
        });
    }

    // Main render function
    render(gameState, deltaTime) {
        const currentTime = performance.now();
        const actualDelta = currentTime - this.lastFrameTime;
        this.lastFrameTime = currentTime;
        
        // Debug logging
        console.log('Renderer.render called:', {
            terrain: gameState.terrain ? `${gameState.terrain.size} tiles` : 'null',
            buildings: gameState.buildings ? `${gameState.buildings.length} buildings` : 'null',
            roads: gameState.roads ? `${gameState.roads.length} roads` : 'null',
            camera: this.camera,
            canvasSize: `${this.canvas.width}x${this.canvas.height}`
        });
        
        // Update camera
        this.updateCamera(actualDelta);
        
        // Clear canvas
        this.clear();
        
        // Draw terrain
        this.drawTerrain(gameState);
        
        // Draw grid
        this.drawGrid();
        
        // Draw roads
        if (gameState.roads) {
            this.drawRoads(gameState.roads);
        }
        
        // Draw buildings
        if (gameState.buildings) {
            this.drawBuildings(gameState.buildings);
        }
        
        // Draw disaster effects
        if (gameState.disasters) {
            this.drawDisasterEffects(gameState.disasters);
        }
        
        // Draw particles
        this.drawParticles(actualDelta);
        
        // Draw UI overlays
        this.drawUI(gameState);
        
        // Performance info (if enabled)
        if (gameState.showDebugInfo) {
            this.drawDebugInfo(actualDelta);
        }
    }

    // Draw debug information
    drawDebugInfo(deltaTime) {
        const fps = Math.round(1000 / deltaTime);
        
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(10, 10, 200, 100);
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '14px monospace';
        this.ctx.textAlign = 'left';
        
        this.ctx.fillText(`FPS: ${fps}`, 20, 30);
        this.ctx.fillText(`Zoom: ${this.camera.zoom.toFixed(2)}`, 20, 50);
        this.ctx.fillText(`Camera: ${Math.round(this.camera.x)}, ${Math.round(this.camera.y)}`, 20, 70);
        this.ctx.fillText(`Particles: ${this.particles.length}`, 20, 90);
        
        this.ctx.textAlign = 'center';
    }

    // Toggle grid visibility
    toggleGrid() {
        this.gridVisible = !this.gridVisible;
    }

    // Resize canvas
    resize() {
        this.setupCanvas();
    }

    // Get tile at screen position
    getTileAtScreenPosition(screenX, screenY) {
        const worldPos = this.screenToWorld(screenX, screenY);
        return {
            x: Math.floor(worldPos.x / this.tileSize),
            y: Math.floor(worldPos.y / this.tileSize)
        };
    }
}

// Export for use in other modules
window.Renderer = Renderer;
