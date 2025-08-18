// MetroSim - Buildings System
// Comprehensive building types and management

class BuildingManager {
    constructor() {
        this.buildingTypes = this.initializeBuildingTypes();
        this.placedBuildings = new Map();
        this.nextBuildingId = 1;
    }

    initializeBuildingTypes() {
        return {
            // RESIDENTIAL BUILDINGS
            'small-house': {
                name: 'Small House',
                category: 'residential',
                icon: '🏠',
                cost: 5000,
                size: { width: 1, height: 1 },
                capacity: 4,
                upkeep: 50,
                powerConsumption: 2,
                waterConsumption: 2,
                happiness: 5,
                unlocked: true,
                description: 'Basic single-family home'
            },
            'apartment': {
                name: 'Apartment Building',
                category: 'residential',
                icon: '🏢',
                cost: 15000,
                size: { width: 2, height: 2 },
                capacity: 16,
                upkeep: 150,
                powerConsumption: 8,
                waterConsumption: 8,
                happiness: 3,
                unlocked: true,
                description: 'Multi-family apartment complex'
            },
            'luxury-condo': {
                name: 'Luxury Condos',
                category: 'residential',
                icon: '🏰',
                cost: 50000,
                size: { width: 2, height: 3 },
                capacity: 24,
                upkeep: 400,
                powerConsumption: 15,
                waterConsumption: 12,
                happiness: 15,
                unlocked: false,
                research: 'luxury-housing',
                description: 'High-end residential tower'
            },
            'mansion': {
                name: 'Mansion District',
                category: 'residential',
                icon: '🏛️',
                cost: 100000,
                size: { width: 3, height: 3 },
                capacity: 12,
                upkeep: 800,
                powerConsumption: 25,
                waterConsumption: 20,
                happiness: 30,
                unlocked: false,
                research: 'elite-housing',
                description: 'Exclusive mansion neighborhood'
            },

            // COMMERCIAL BUILDINGS
            'corner-shop': {
                name: 'Corner Shop',
                category: 'commercial',
                icon: '🏪',
                cost: 8000,
                size: { width: 1, height: 1 },
                jobs: 3,
                upkeep: 80,
                powerConsumption: 3,
                waterConsumption: 1,
                income: 200,
                happiness: 2,
                unlocked: true,
                description: 'Small neighborhood store'
            },
            'shopping-mall': {
                name: 'Shopping Mall',
                category: 'commercial',
                icon: '🛒',
                cost: 75000,
                size: { width: 3, height: 2 },
                jobs: 45,
                upkeep: 600,
                powerConsumption: 20,
                waterConsumption: 10,
                income: 1500,
                happiness: 10,
                unlocked: false,
                research: 'retail-centers',
                description: 'Large retail complex'
            },
            'office-building': {
                name: 'Office Building',
                category: 'commercial',
                icon: '🏢',
                cost: 40000,
                size: { width: 2, height: 3 },
                jobs: 60,
                upkeep: 400,
                powerConsumption: 15,
                waterConsumption: 8,
                income: 1200,
                happiness: 5,
                unlocked: false,
                research: 'office-spaces',
                description: 'Modern office complex'
            },
            'skyscraper': {
                name: 'Corporate Skyscraper',
                category: 'commercial',
                icon: '🏙️',
                cost: 200000,
                size: { width: 2, height: 4 },
                jobs: 150,
                upkeep: 1200,
                powerConsumption: 40,
                waterConsumption: 25,
                income: 4000,
                happiness: 8,
                unlocked: false,
                research: 'high-rises',
                description: 'Towering corporate headquarters'
            },

            // INDUSTRIAL BUILDINGS
            'small-factory': {
                name: 'Small Factory',
                category: 'industrial',
                icon: '🏭',
                cost: 12000,
                size: { width: 2, height: 1 },
                jobs: 20,
                upkeep: 150,
                powerConsumption: 8,
                waterConsumption: 5,
                income: 400,
                happiness: -5,
                pollution: 3,
                unlocked: true,
                description: 'Basic manufacturing facility'
            },
            'tech-campus': {
                name: 'Tech Campus',
                category: 'industrial',
                icon: '💻',
                cost: 80000,
                size: { width: 3, height: 2 },
                jobs: 80,
                upkeep: 600,
                powerConsumption: 25,
                waterConsumption: 15,
                income: 2000,
                happiness: 10,
                research: 1,
                unlocked: false,
                research: 'technology-sector',
                description: 'High-tech research and development'
            },
            'logistics-center': {
                name: 'Logistics Center',
                category: 'industrial',
                icon: '📦',
                cost: 35000,
                size: { width: 3, height: 2 },
                jobs: 40,
                upkeep: 300,
                powerConsumption: 12,
                waterConsumption: 8,
                income: 800,
                happiness: 0,
                unlocked: false,
                research: 'logistics',
                description: 'Distribution and warehousing'
            },

            // UTILITIES
            'power-plant': {
                name: 'Power Plant',
                category: 'utilities',
                icon: '⚡',
                cost: 25000,
                size: { width: 2, height: 2 },
                jobs: 15,
                upkeep: 500,
                powerGeneration: 100,
                waterConsumption: 10,
                happiness: -8,
                pollution: 5,
                unlocked: true,
                description: 'Generates electricity for the city'
            },
            'solar-farm': {
                name: 'Solar Farm',
                category: 'utilities',
                icon: '☀️',
                cost: 45000,
                size: { width: 3, height: 2 },
                jobs: 5,
                upkeep: 200,
                powerGeneration: 80,
                happiness: 5,
                unlocked: false,
                research: 'renewable-energy',
                description: 'Clean solar power generation'
            },
            'water-treatment': {
                name: 'Water Treatment Plant',
                category: 'utilities',
                icon: '💧',
                cost: 30000,
                size: { width: 2, height: 2 },
                jobs: 20,
                upkeep: 400,
                waterGeneration: 150,
                powerConsumption: 15,
                happiness: -3,
                unlocked: true,
                description: 'Processes and supplies clean water'
            },
            'waste-management': {
                name: 'Waste Management',
                category: 'utilities',
                icon: '♻️',
                cost: 20000,
                size: { width: 2, height: 1 },
                jobs: 12,
                upkeep: 300,
                happiness: -5,
                pollution: -10,
                unlocked: false,
                research: 'waste-processing',
                description: 'Reduces city pollution'
            },

            // SERVICES
            'hospital': {
                name: 'Hospital',
                category: 'services',
                icon: '🏥',
                cost: 60000,
                size: { width: 3, height: 2 },
                jobs: 40,
                upkeep: 800,
                powerConsumption: 20,
                waterConsumption: 15,
                happiness: 20,
                healthBonus: 25,
                unlocked: false,
                research: 'healthcare',
                description: 'Provides medical care'
            },
            'school': {
                name: 'School',
                category: 'services',
                icon: '🏫',
                cost: 35000,
                size: { width: 2, height: 2 },
                jobs: 25,
                upkeep: 400,
                powerConsumption: 10,
                waterConsumption: 8,
                happiness: 15,
                educationBonus: 20,
                unlocked: true,
                description: 'Educates young citizens'
            },
            'university': {
                name: 'University',
                category: 'services',
                icon: '🎓',
                cost: 120000,
                size: { width: 4, height: 3 },
                jobs: 80,
                upkeep: 1000,
                powerConsumption: 30,
                waterConsumption: 20,
                happiness: 25,
                educationBonus: 40,
                research: 2,
                unlocked: false,
                research: 'higher-education',
                description: 'Advanced education and research'
            },
            'police-station': {
                name: 'Police Station',
                category: 'services',
                icon: '👮',
                cost: 25000,
                size: { width: 2, height: 1 },
                jobs: 20,
                upkeep: 400,
                powerConsumption: 8,
                waterConsumption: 5,
                happiness: 10,
                safetyBonus: 30,
                unlocked: true,
                description: 'Maintains law and order'
            },
            'fire-station': {
                name: 'Fire Station',
                category: 'services',
                icon: '🚒',
                cost: 20000,
                size: { width: 2, height: 1 },
                jobs: 15,
                upkeep: 300,
                powerConsumption: 5,
                waterConsumption: 10,
                happiness: 8,
                safetyBonus: 25,
                unlocked: true,
                description: 'Emergency fire response'
            },

            // DECORATION & PARKS
            'small-park': {
                name: 'Small Park',
                category: 'decoration',
                icon: '🌳',
                cost: 3000,
                size: { width: 1, height: 1 },
                upkeep: 50,
                waterConsumption: 2,
                happiness: 8,
                pollution: -2,
                unlocked: true,
                description: 'Green space for relaxation'
            },
            'central-park': {
                name: 'Central Park',
                category: 'decoration',
                icon: '🌲',
                cost: 25000,
                size: { width: 3, height: 3 },
                upkeep: 300,
                waterConsumption: 15,
                happiness: 30,
                pollution: -8,
                unlocked: false,
                research: 'urban-planning',
                description: 'Large recreational area'
            },
            'fountain': {
                name: 'Fountain',
                category: 'decoration',
                icon: '⛲',
                cost: 8000,
                size: { width: 1, height: 1 },
                upkeep: 100,
                powerConsumption: 2,
                waterConsumption: 5,
                happiness: 12,
                unlocked: true,
                description: 'Decorative water feature'
            },
            'statue': {
                name: 'Monument',
                category: 'decoration',
                icon: '🗿',
                cost: 15000,
                size: { width: 1, height: 1 },
                upkeep: 25,
                happiness: 10,
                tourism: 5,
                unlocked: false,
                research: 'monuments',
                description: 'Historic landmark'
            }
        };
    }

    // Get buildings by category
    getBuildingsByCategory(category) {
        return Object.entries(this.buildingTypes)
            .filter(([id, building]) => building.category === category)
            .map(([id, building]) => ({ id, ...building }));
    }

    // Get all unlocked buildings
    getUnlockedBuildings() {
        return Object.entries(this.buildingTypes)
            .filter(([id, building]) => building.unlocked)
            .map(([id, building]) => ({ id, ...building }));
    }

    // Check if player can afford building
    canAfford(buildingId, playerMoney) {
        const building = this.buildingTypes[buildingId];
        return building && playerMoney >= building.cost;
    }

    // Place a building
    placeBuilding(buildingId, x, y, rotation = 0) {
        const buildingType = this.buildingTypes[buildingId];
        if (!buildingType) return null;

        const building = {
            id: this.nextBuildingId++,
            type: buildingId,
            x: x,
            y: y,
            rotation: rotation,
            level: 1,
            efficiency: 1.0,
            condition: 100,
            lastMaintenance: Date.now(),
            ...buildingType
        };

        this.placedBuildings.set(building.id, building);
        return building;
    }

    // Remove a building
    removeBuilding(buildingId) {
        return this.placedBuildings.delete(buildingId);
    }

    // Get building at position
    getBuildingAt(x, y) {
        for (const [id, building] of this.placedBuildings) {
            if (building.x === x && building.y === y) {
                return building;
            }
        }
        return null;
    }

    // Get all buildings
    getAllBuildings() {
        return Array.from(this.placedBuildings.values());
    }

    // Get buildings by type
    getBuildingsByType(type) {
        return this.getAllBuildings().filter(building => building.type === type);
    }

    // Calculate total resource consumption/generation
    calculateResources() {
        const resources = {
            powerConsumption: 0,
            powerGeneration: 0,
            waterConsumption: 0,
            waterGeneration: 0,
            income: 0,
            upkeep: 0,
            jobs: 0,
            capacity: 0,
            happiness: 0,
            pollution: 0
        };

        for (const building of this.getAllBuildings()) {
            const efficiency = building.efficiency || 1.0;
            const condition = (building.condition || 100) / 100;
            const multiplier = efficiency * condition;

            resources.powerConsumption += (building.powerConsumption || 0) * multiplier;
            resources.powerGeneration += (building.powerGeneration || 0) * multiplier;
            resources.waterConsumption += (building.waterConsumption || 0) * multiplier;
            resources.waterGeneration += (building.waterGeneration || 0) * multiplier;
            resources.income += (building.income || 0) * multiplier;
            resources.upkeep += building.upkeep || 0;
            resources.jobs += building.jobs || 0;
            resources.capacity += building.capacity || 0;
            resources.happiness += building.happiness || 0;
            resources.pollution += building.pollution || 0;
        }

        return resources;
    }

    // Update building conditions over time
    updateBuildings(deltaTime) {
        const currentTime = Date.now();
        
        for (const building of this.getAllBuildings()) {
            // Decay condition over time
            const timeSinceLastMaintenance = currentTime - (building.lastMaintenance || currentTime);
            const decayRate = 0.1; // Condition points per hour
            const hoursPassed = timeSinceLastMaintenance / (1000 * 60 * 60);
            
            building.condition = Math.max(0, building.condition - (decayRate * hoursPassed));
            
            // Update efficiency based on condition
            building.efficiency = Math.max(0.2, building.condition / 100);
        }
    }

    // Upgrade building
    upgradeBuilding(buildingId) {
        const building = this.placedBuildings.get(buildingId);
        if (!building || building.level >= 3) return false;

        const upgradeCost = building.cost * building.level * 0.5;
        building.level += 1;
        building.efficiency += 0.2;
        
        // Increase building stats
        if (building.income) building.income *= 1.3;
        if (building.capacity) building.capacity *= 1.2;
        if (building.jobs) building.jobs *= 1.2;
        if (building.powerGeneration) building.powerGeneration *= 1.3;
        if (building.waterGeneration) building.waterGeneration *= 1.3;
        
        building.upkeep *= 1.4;

        return { cost: upgradeCost, building };
    }

    // Repair building
    repairBuilding(buildingId) {
        const building = this.placedBuildings.get(buildingId);
        if (!building) return false;

        const repairCost = building.cost * (1 - building.condition / 100) * 0.3;
        building.condition = 100;
        building.efficiency = 1.0;
        building.lastMaintenance = Date.now();

        return { cost: repairCost, building };
    }

    // Unlock building type
    unlockBuilding(buildingId) {
        if (this.buildingTypes[buildingId]) {
            this.buildingTypes[buildingId].unlocked = true;
            return true;
        }
        return false;
    }

    // Get building info for UI
    getBuildingInfo(buildingId) {
        const building = this.placedBuildings.get(buildingId);
        if (!building) return null;

        return {
            ...building,
            upgradeCost: building.level < 3 ? building.cost * building.level * 0.5 : null,
            repairCost: building.cost * (1 - building.condition / 100) * 0.3,
            canUpgrade: building.level < 3,
            needsRepair: building.condition < 80
        };
    }

    // Save/Load functionality
    serialize() {
        return {
            buildingTypes: this.buildingTypes,
            placedBuildings: Array.from(this.placedBuildings.entries()),
            nextBuildingId: this.nextBuildingId
        };
    }

    deserialize(data) {
        if (data.buildingTypes) {
            this.buildingTypes = data.buildingTypes;
        }
        if (data.placedBuildings) {
            this.placedBuildings = new Map(data.placedBuildings);
        }
        if (data.nextBuildingId) {
            this.nextBuildingId = data.nextBuildingId;
        }
    }
}

// Export for use in other modules
window.BuildingManager = BuildingManager;
