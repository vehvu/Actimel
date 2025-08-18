// MetroSim - Disasters & Emergency System
// Natural disasters, emergencies, and city response systems

class DisasterManager {
    constructor() {
        this.activeDisasters = new Map();
        this.disasterHistory = [];
        this.nextDisasterId = 1;
        this.preparedness = {
            fire: 50,
            flood: 30,
            earthquake: 25,
            tornado: 20,
            epidemic: 40,
            blackout: 60,
            cyberAttack: 10
        };
        this.lastDisasterCheck = Date.now();
        this.disasterCooldown = 0;
    }

    // Define disaster types with their characteristics
    getDisasterTypes() {
        return {
            fire: {
                name: 'Building Fire',
                icon: '🔥',
                probability: 0.15,
                severity: { min: 1, max: 4 },
                duration: { min: 5, max: 15 }, // minutes
                affectedRadius: 2,
                effects: {
                    buildings: 'damage',
                    happiness: -10,
                    safety: -15
                },
                description: 'Fire spreads to nearby buildings if not contained quickly.'
            },
            flood: {
                name: 'Flash Flood',
                icon: '🌊',
                probability: 0.08,
                severity: { min: 2, max: 5 },
                duration: { min: 10, max: 30 },
                affectedRadius: 4,
                effects: {
                    buildings: 'damage',
                    power: -50,
                    water: -30,
                    happiness: -20
                },
                description: 'Flooding damages infrastructure and displaces citizens.'
            },
            earthquake: {
                name: 'Earthquake',
                icon: '🌍',
                probability: 0.05,
                severity: { min: 3, max: 6 },
                duration: { min: 2, max: 5 },
                affectedRadius: 8,
                effects: {
                    buildings: 'destroy',
                    power: -70,
                    water: -60,
                    happiness: -30,
                    population: -5
                },
                description: 'Severe ground shaking can destroy buildings and infrastructure.'
            },
            tornado: {
                name: 'Tornado',
                icon: '🌪️',
                probability: 0.06,
                severity: { min: 2, max: 5 },
                duration: { min: 3, max: 8 },
                affectedRadius: 3,
                effects: {
                    buildings: 'destroy',
                    power: -40,
                    happiness: -25,
                    population: -3
                },
                description: 'Powerful winds can level entire city blocks.'
            },
            epidemic: {
                name: 'Disease Outbreak',
                icon: '🦠',
                probability: 0.07,
                severity: { min: 2, max: 4 },
                duration: { min: 20, max: 60 },
                affectedRadius: 6,
                effects: {
                    population: -10,
                    happiness: -35,
                    productivity: -40,
                    healthcare: -50
                },
                description: 'Contagious disease spreads rapidly through the population.'
            },
            blackout: {
                name: 'Power Grid Failure',
                icon: '⚡',
                probability: 0.12,
                severity: { min: 1, max: 3 },
                duration: { min: 5, max: 20 },
                affectedRadius: 10,
                effects: {
                    power: -100,
                    productivity: -60,
                    happiness: -15,
                    safety: -20
                },
                description: 'Massive power outage affects city operations.'
            },
            cyberAttack: {
                name: 'Cyber Attack',
                icon: '💻',
                probability: 0.04,
                severity: { min: 2, max: 4 },
                duration: { min: 10, max: 25 },
                affectedRadius: 0, // Affects all tech buildings
                effects: {
                    money: -0.1, // 10% of city funds
                    productivity: -30,
                    happiness: -20,
                    research: -50
                },
                description: 'Hackers target city infrastructure and steal data.'
            }
        };
    }

    // Check for potential disasters based on city conditions
    checkForDisasters(cityStats, buildings, weather) {
        const currentTime = Date.now();
        const timeSinceLastCheck = currentTime - this.lastDisasterCheck;
        
        // Check every 30 seconds
        if (timeSinceLastCheck < 30000) return null;
        
        this.lastDisasterCheck = currentTime;
        
        // Disaster cooldown period
        if (this.disasterCooldown > 0) {
            this.disasterCooldown -= timeSinceLastCheck / 1000;
            return null;
        }

        const disasterTypes = this.getDisasterTypes();
        const potentialDisasters = [];

        for (const [type, disaster] of Object.entries(disasterTypes)) {
            let probability = disaster.probability;
            
            // Modify probability based on city conditions
            probability = this.modifyProbabilityByConditions(type, probability, cityStats, buildings, weather);
            
            // Reduce probability based on preparedness
            const preparednessReduction = (this.preparedness[type] || 0) / 100 * 0.5;
            probability *= (1 - preparednessReduction);

            if (Math.random() < probability) {
                potentialDisasters.push({ type, ...disaster });
            }
        }

        // Trigger the most severe potential disaster
        if (potentialDisasters.length > 0) {
            const disaster = potentialDisasters.reduce((prev, current) => 
                current.severity.max > prev.severity.max ? current : prev
            );
            
            return this.triggerDisaster(disaster.type, cityStats, buildings);
        }

        return null;
    }

    // Modify disaster probability based on city conditions
    modifyProbabilityByConditions(disasterType, baseProbability, cityStats, buildings, weather) {
        let probability = baseProbability;

        switch (disasterType) {
            case 'fire':
                // Higher chance with more buildings and hot weather
                const buildingDensity = buildings.length / 100;
                probability *= (1 + buildingDensity * 0.5);
                if (weather?.temperature > 30) probability *= 1.3;
                if (weather?.humidity < 30) probability *= 1.2;
                break;

            case 'flood':
                // Higher chance with poor drainage and rain
                if (weather?.precipitation > 50) probability *= 2.0;
                const drainageBuildings = buildings.filter(b => b.type === 'water-treatment').length;
                if (drainageBuildings < buildings.length / 20) probability *= 1.5;
                break;

            case 'earthquake':
                // Random but affected by city age and building density
                const oldBuildings = buildings.filter(b => b.condition < 70).length;
                probability *= (1 + oldBuildings / buildings.length);
                break;

            case 'epidemic':
                // Higher chance with poor healthcare and high population density
                const population = cityStats.population || 0;
                const hospitals = buildings.filter(b => b.type === 'hospital').length;
                const healthcareRatio = hospitals / Math.max(population / 1000, 1);
                if (healthcareRatio < 1) probability *= (2 - healthcareRatio);
                if (population > 10000) probability *= 1.2;
                break;

            case 'blackout':
                // Higher chance with insufficient power generation
                const powerBalance = (cityStats.powerGeneration - cityStats.powerConsumption) / Math.max(cityStats.powerConsumption, 1);
                if (powerBalance < 0.2) probability *= 2.0;
                break;

            case 'cyberAttack':
                // Higher chance with more tech buildings
                const techBuildings = buildings.filter(b => b.type === 'tech-campus' || b.type === 'office-building').length;
                probability *= (1 + techBuildings * 0.1);
                break;
        }

        return Math.min(probability, 0.5); // Cap at 50% chance
    }

    // Trigger a specific disaster
    triggerDisaster(disasterType, cityStats, buildings) {
        const disasterTemplate = this.getDisasterTypes()[disasterType];
        if (!disasterTemplate) return null;

        // Generate random severity and duration within ranges
        const severity = Utils.randomInt(disasterTemplate.severity.min, disasterTemplate.severity.max);
        const duration = Utils.randomInt(disasterTemplate.duration.min, disasterTemplate.duration.max) * 1000; // Convert to milliseconds

        // Choose random epicenter
        const epicenter = this.chooseEpicenter(buildings, disasterType);

        const disaster = {
            id: this.nextDisasterId++,
            type: disasterType,
            name: disasterTemplate.name,
            icon: disasterTemplate.icon,
            severity: severity,
            duration: duration,
            startTime: Date.now(),
            epicenter: epicenter,
            affectedRadius: disasterTemplate.affectedRadius,
            effects: { ...disasterTemplate.effects },
            description: disasterTemplate.description,
            status: 'active',
            responseActions: [],
            casualties: 0,
            damageValue: 0
        };

        // Apply immediate effects
        this.applyDisasterEffects(disaster, cityStats, buildings);

        this.activeDisasters.set(disaster.id, disaster);
        this.disasterCooldown = 60; // 60 second cooldown before next disaster

        return disaster;
    }

    // Choose epicenter for disaster
    chooseEpicenter(buildings, disasterType) {
        if (buildings.length === 0) {
            return { x: 50, y: 50 }; // Default center
        }

        // Some disasters prefer certain building types
        let targetBuildings = buildings;
        
        switch (disasterType) {
            case 'fire':
                // Prefer older, wooden buildings
                targetBuildings = buildings.filter(b => b.condition < 80);
                break;
            case 'cyberAttack':
                // Target tech and office buildings
                targetBuildings = buildings.filter(b => 
                    b.type === 'tech-campus' || b.type === 'office-building' || b.type === 'skyscraper'
                );
                break;
            case 'epidemic':
                // Start in high-density residential areas
                targetBuildings = buildings.filter(b => b.category === 'residential');
                break;
        }

        if (targetBuildings.length === 0) {
            targetBuildings = buildings;
        }

        const targetBuilding = Utils.randomChoice(targetBuildings);
        return { x: targetBuilding.x, y: targetBuilding.y };
    }

    // Apply disaster effects to city
    applyDisasterEffects(disaster, cityStats, buildings) {
        const effects = disaster.effects;
        const severityMultiplier = disaster.severity / 3; // Normalize severity

        // Find affected buildings
        const affectedBuildings = this.getAffectedBuildings(disaster, buildings);
        
        // Apply building effects
        if (effects.buildings === 'damage') {
            affectedBuildings.forEach(building => {
                const damage = Utils.randomInt(10, 30) * severityMultiplier;
                building.condition = Math.max(0, building.condition - damage);
                disaster.damageValue += building.cost * (damage / 100);
            });
        } else if (effects.buildings === 'destroy') {
            const destroyChance = 0.1 * severityMultiplier;
            affectedBuildings.forEach(building => {
                if (Math.random() < destroyChance) {
                    building.condition = 0;
                    disaster.damageValue += building.cost;
                } else {
                    const damage = Utils.randomInt(30, 60) * severityMultiplier;
                    building.condition = Math.max(0, building.condition - damage);
                    disaster.damageValue += building.cost * (damage / 100);
                }
            });
        }

        // Apply city-wide effects
        if (effects.happiness) {
            cityStats.happiness += effects.happiness * severityMultiplier;
        }
        if (effects.population) {
            const populationLoss = Math.floor(cityStats.population * Math.abs(effects.population) / 100 * severityMultiplier);
            disaster.casualties = populationLoss;
        }

        // Resource effects are handled by the main game loop
        disaster.appliedEffects = {
            ...effects,
            severityMultiplier: severityMultiplier,
            affectedBuildingCount: affectedBuildings.length
        };
    }

    // Get buildings affected by disaster
    getAffectedBuildings(disaster, buildings) {
        if (disaster.affectedRadius === 0) {
            // Global disaster (like cyber attack)
            switch (disaster.type) {
                case 'cyberAttack':
                    return buildings.filter(b => 
                        b.type === 'tech-campus' || b.type === 'office-building' || b.type === 'skyscraper'
                    );
                default:
                    return buildings;
            }
        }

        // Area-based disaster
        return buildings.filter(building => {
            const distance = Utils.distance(
                building.x, building.y,
                disaster.epicenter.x, disaster.epicenter.y
            );
            return distance <= disaster.affectedRadius;
        });
    }

    // Emergency response actions
    respondToDisaster(disasterId, actionType, resourcesSpent) {
        const disaster = this.activeDisasters.get(disasterId);
        if (!disaster || disaster.status !== 'active') return false;

        const action = {
            type: actionType,
            resources: resourcesSpent,
            timestamp: Date.now(),
            effectiveness: this.calculateResponseEffectiveness(disaster, actionType, resourcesSpent)
        };

        disaster.responseActions.push(action);

        // Apply response effects
        switch (actionType) {
            case 'firefighting':
                if (disaster.type === 'fire') {
                    disaster.duration *= (1 - action.effectiveness * 0.5);
                    disaster.severity = Math.max(1, disaster.severity - 1);
                }
                break;
            case 'evacuation':
                disaster.casualties = Math.max(0, disaster.casualties * (1 - action.effectiveness));
                break;
            case 'medical':
                if (disaster.type === 'epidemic') {
                    disaster.duration *= (1 - action.effectiveness * 0.3);
                }
                disaster.casualties *= (1 - action.effectiveness * 0.5);
                break;
            case 'infrastructure':
                disaster.damageValue *= (1 - action.effectiveness * 0.2);
                break;
        }

        return action;
    }

    // Calculate how effective a response action is
    calculateResponseEffectiveness(disaster, actionType, resourcesSpent) {
        let baseEffectiveness = Math.min(resourcesSpent / 10000, 1.0); // $10k for 100% effectiveness
        
        // Modify based on preparedness
        const preparedness = this.preparedness[disaster.type] || 0;
        baseEffectiveness *= (0.5 + preparedness / 200); // 50% to 100% based on preparedness

        // Modify based on response time
        const responseTime = Date.now() - disaster.startTime;
        const timeMultiplier = Math.max(0.3, 1 - (responseTime / disaster.duration));
        baseEffectiveness *= timeMultiplier;

        return Utils.clamp(baseEffectiveness, 0, 1);
    }

    // Update active disasters
    updateDisasters(deltaTime) {
        const currentTime = Date.now();
        const completedDisasters = [];

        for (const [id, disaster] of this.activeDisasters) {
            const elapsed = currentTime - disaster.startTime;
            
            if (elapsed >= disaster.duration) {
                // Disaster is over
                disaster.status = 'completed';
                disaster.endTime = currentTime;
                
                this.disasterHistory.push({ ...disaster });
                completedDisasters.push(id);
            }
        }

        // Remove completed disasters
        completedDisasters.forEach(id => {
            this.activeDisasters.delete(id);
        });

        return completedDisasters.length > 0;
    }

    // Improve city preparedness
    improvePreparedness(disasterType, investment) {
        if (!this.preparedness[disasterType]) return false;

        const improvement = Math.min(investment / 1000, 10); // $1k = 1 point, max 10 per investment
        this.preparedness[disasterType] = Math.min(100, this.preparedness[disasterType] + improvement);
        
        return improvement;
    }

    // Get disaster statistics
    getDisasterStats() {
        const stats = {
            activeDisasters: this.activeDisasters.size,
            totalDisasters: this.disasterHistory.length,
            totalCasualties: this.disasterHistory.reduce((sum, d) => sum + d.casualties, 0),
            totalDamage: this.disasterHistory.reduce((sum, d) => sum + d.damageValue, 0),
            preparedness: { ...this.preparedness },
            mostCommonDisaster: null,
            averageResponseTime: 0
        };

        // Find most common disaster
        const disasterCounts = {};
        this.disasterHistory.forEach(disaster => {
            disasterCounts[disaster.type] = (disasterCounts[disaster.type] || 0) + 1;
        });
        
        if (Object.keys(disasterCounts).length > 0) {
            stats.mostCommonDisaster = Object.keys(disasterCounts).reduce((a, b) => 
                disasterCounts[a] > disasterCounts[b] ? a : b
            );
        }

        // Calculate average response time
        const responseTimes = this.disasterHistory
            .filter(d => d.responseActions.length > 0)
            .map(d => d.responseActions[0].timestamp - d.startTime);
        
        if (responseTimes.length > 0) {
            stats.averageResponseTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
        }

        return stats;
    }

    // Save/Load functionality
    serialize() {
        return {
            activeDisasters: Array.from(this.activeDisasters.entries()),
            disasterHistory: this.disasterHistory,
            nextDisasterId: this.nextDisasterId,
            preparedness: this.preparedness,
            disasterCooldown: this.disasterCooldown
        };
    }

    deserialize(data) {
        if (data.activeDisasters) {
            this.activeDisasters = new Map(data.activeDisasters);
        }
        if (data.disasterHistory) {
            this.disasterHistory = data.disasterHistory;
        }
        if (data.nextDisasterId) {
            this.nextDisasterId = data.nextDisasterId;
        }
        if (data.preparedness) {
            this.preparedness = data.preparedness;
        }
        if (data.disasterCooldown !== undefined) {
            this.disasterCooldown = data.disasterCooldown;
        }
    }
}

// Export for use in other modules
window.DisasterManager = DisasterManager;
