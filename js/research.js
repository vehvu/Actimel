// MetroSim - Research & Technology System
// Technology tree with unlockable buildings and city improvements

class ResearchManager {
    constructor() {
        this.researchPoints = 0;
        this.researchRate = 1; // Points per minute
        this.completedResearch = new Set();
        this.currentResearch = null;
        this.researchQueue = [];
        this.researchTree = this.initializeResearchTree();
        this.lastUpdate = Date.now();
    }

    initializeResearchTree() {
        return {
            // BASIC TECHNOLOGIES (Tier 1)
            'urban-planning': {
                name: 'Urban Planning',
                category: 'infrastructure',
                tier: 1,
                cost: 100,
                duration: 5000, // 5 seconds for demo
                prerequisites: [],
                unlocks: ['central-park', 'zoning-laws'],
                effects: {
                    happiness: 5,
                    buildingCostReduction: 0.1
                },
                description: 'Basic city planning principles to improve layout and citizen satisfaction.',
                icon: '📐'
            },
            'basic-utilities': {
                name: 'Basic Utilities',
                category: 'infrastructure',
                tier: 1,
                cost: 80,
                duration: 4000,
                prerequisites: [],
                unlocks: ['water-treatment', 'power-plant'],
                effects: {
                    utilityEfficiency: 0.15
                },
                description: 'Fundamental utility systems for power and water distribution.',
                icon: '🔧'
            },
            'public-safety': {
                name: 'Public Safety',
                category: 'services',
                tier: 1,
                cost: 120,
                duration: 6000,
                prerequisites: [],
                unlocks: ['police-station', 'fire-station'],
                effects: {
                    safety: 10,
                    crimeReduction: 0.2
                },
                description: 'Emergency services and law enforcement systems.',
                icon: '🚨'
            },

            // INTERMEDIATE TECHNOLOGIES (Tier 2)
            'renewable-energy': {
                name: 'Renewable Energy',
                category: 'environment',
                tier: 2,
                cost: 250,
                duration: 10000,
                prerequisites: ['basic-utilities'],
                unlocks: ['solar-farm', 'wind-turbine'],
                effects: {
                    pollutionReduction: 0.3,
                    energyEfficiency: 0.25
                },
                description: 'Clean energy technologies to reduce environmental impact.',
                icon: '☀️'
            },
            'healthcare': {
                name: 'Healthcare Systems',
                category: 'services',
                tier: 2,
                cost: 300,
                duration: 12000,
                prerequisites: ['public-safety'],
                unlocks: ['hospital', 'clinic'],
                effects: {
                    healthBonus: 20,
                    lifeExpectancy: 5
                },
                description: 'Medical facilities and healthcare infrastructure.',
                icon: '🏥'
            },
            'education': {
                name: 'Education System',
                category: 'services',
                tier: 2,
                cost: 200,
                duration: 8000,
                prerequisites: ['urban-planning'],
                unlocks: ['school', 'library'],
                effects: {
                    educationBonus: 15,
                    researchRate: 0.5
                },
                description: 'Educational institutions to improve citizen skills.',
                icon: '📚'
            },
            'waste-processing': {
                name: 'Waste Management',
                category: 'environment',
                tier: 2,
                cost: 180,
                duration: 7000,
                prerequisites: ['basic-utilities'],
                unlocks: ['waste-management', 'recycling-center'],
                effects: {
                    pollutionReduction: 0.4,
                    sanitationBonus: 25
                },
                description: 'Advanced waste processing and recycling systems.',
                icon: '♻️'
            },

            // ADVANCED TECHNOLOGIES (Tier 3)
            'higher-education': {
                name: 'Higher Education',
                category: 'services',
                tier: 3,
                cost: 500,
                duration: 20000,
                prerequisites: ['education', 'healthcare'],
                unlocks: ['university', 'research-institute'],
                effects: {
                    educationBonus: 30,
                    researchRate: 2,
                    innovationBonus: 0.2
                },
                description: 'Universities and advanced research facilities.',
                icon: '🎓'
            },
            'technology-sector': {
                name: 'Technology Sector',
                category: 'economy',
                tier: 3,
                cost: 400,
                duration: 15000,
                prerequisites: ['education', 'renewable-energy'],
                unlocks: ['tech-campus', 'data-center'],
                effects: {
                    economicGrowth: 0.3,
                    researchRate: 1.5,
                    jobQuality: 0.25
                },
                description: 'High-tech industries and digital infrastructure.',
                icon: '💻'
            },
            'smart-city': {
                name: 'Smart City Systems',
                category: 'infrastructure',
                tier: 3,
                cost: 600,
                duration: 25000,
                prerequisites: ['technology-sector', 'waste-processing'],
                unlocks: ['smart-grid', 'automated-services'],
                effects: {
                    efficiency: 0.4,
                    energyEfficiency: 0.3,
                    trafficReduction: 0.35
                },
                description: 'IoT and AI systems for city automation.',
                icon: '🤖'
            },

            // SPECIALIZED TECHNOLOGIES (Tier 4)
            'luxury-housing': {
                name: 'Luxury Development',
                category: 'residential',
                tier: 4,
                cost: 800,
                duration: 30000,
                prerequisites: ['urban-planning', 'technology-sector'],
                unlocks: ['luxury-condo', 'penthouse-suite'],
                effects: {
                    wealthAttraction: 0.5,
                    propertyValues: 0.3
                },
                description: 'High-end residential developments for wealthy citizens.',
                icon: '🏰'
            },
            'elite-housing': {
                name: 'Elite Communities',
                category: 'residential',
                tier: 4,
                cost: 1000,
                duration: 35000,
                prerequisites: ['luxury-housing', 'smart-city'],
                unlocks: ['mansion', 'private-estate'],
                effects: {
                    eliteAttraction: 1.0,
                    propertyValues: 0.5,
                    exclusivityBonus: 0.3
                },
                description: 'Exclusive gated communities for the ultra-wealthy.',
                icon: '🏛️'
            },
            'megastructures': {
                name: 'Megastructures',
                category: 'infrastructure',
                tier: 4,
                cost: 1200,
                duration: 40000,
                prerequisites: ['smart-city', 'higher-education'],
                unlocks: ['arcology', 'space-elevator'],
                effects: {
                    capacity: 2.0,
                    efficiency: 0.6,
                    prestige: 100
                },
                description: 'Massive architectural projects that define the skyline.',
                icon: '🏗️'
            },

            // FUTURISTIC TECHNOLOGIES (Tier 5)
            'fusion-power': {
                name: 'Fusion Energy',
                category: 'environment',
                tier: 5,
                cost: 2000,
                duration: 60000,
                prerequisites: ['renewable-energy', 'megastructures'],
                unlocks: ['fusion-reactor', 'energy-abundance'],
                effects: {
                    energyGeneration: 5.0,
                    pollutionReduction: 0.9,
                    futureBonus: 1.0
                },
                description: 'Clean fusion power for unlimited energy.',
                icon: '⚛️'
            },
            'space-colonization': {
                name: 'Space Colonization',
                category: 'expansion',
                tier: 5,
                cost: 2500,
                duration: 80000,
                prerequisites: ['megastructures', 'fusion-power'],
                unlocks: ['space-port', 'orbital-habitat'],
                effects: {
                    populationCap: 2.0,
                    prestige: 500,
                    expansion: 'orbital'
                },
                description: 'Expand your city beyond Earth\'s atmosphere.',
                icon: '🚀'
            }
        };
    }

    // Start researching a technology
    startResearch(technologyId) {
        const tech = this.researchTree[technologyId];
        if (!tech) return { success: false, reason: 'Technology not found' };

        // Check if already researched
        if (this.completedResearch.has(technologyId)) {
            return { success: false, reason: 'Already researched' };
        }

        // Check prerequisites
        const missingPrereqs = tech.prerequisites.filter(prereq => 
            !this.completedResearch.has(prereq)
        );
        if (missingPrereqs.length > 0) {
            return { success: false, reason: `Missing prerequisites: ${missingPrereqs.join(', ')}` };
        }

        // Check research points
        if (this.researchPoints < tech.cost) {
            return { success: false, reason: `Need ${tech.cost} research points (have ${this.researchPoints})` };
        }

        // Start research
        this.researchPoints -= tech.cost;
        this.currentResearch = {
            id: technologyId,
            ...tech,
            startTime: Date.now(),
            progress: 0
        };

        return { success: true, research: this.currentResearch };
    }

    // Add research to queue
    queueResearch(technologyId) {
        const tech = this.researchTree[technologyId];
        if (!tech || this.researchQueue.includes(technologyId)) return false;

        this.researchQueue.push(technologyId);
        return true;
    }

    // Remove research from queue
    removeFromQueue(technologyId) {
        const index = this.researchQueue.indexOf(technologyId);
        if (index > -1) {
            this.researchQueue.splice(index, 1);
            return true;
        }
        return false;
    }

    // Complete current research
    completeResearch() {
        if (!this.currentResearch) return null;

        const completedTech = this.currentResearch;
        this.completedResearch.add(completedTech.id);
        this.currentResearch = null;

        // Apply research effects
        this.applyResearchEffects(completedTech);

        // Start next research in queue if available
        if (this.researchQueue.length > 0) {
            const nextResearchId = this.researchQueue.shift();
            const result = this.startResearch(nextResearchId);
            if (!result.success) {
                // Put it back in queue if can't start yet
                this.researchQueue.unshift(nextResearchId);
            }
        }

        return completedTech;
    }

    // Apply effects from completed research
    applyResearchEffects(tech) {
        // Effects are applied by the main game system
        // This method can be extended to apply immediate effects
        
        // Unlock buildings
        if (tech.unlocks && window.game && window.game.buildingManager) {
            tech.unlocks.forEach(buildingId => {
                window.game.buildingManager.unlockBuilding(buildingId);
            });
        }

        // Apply research rate bonus
        if (tech.effects.researchRate) {
            this.researchRate += tech.effects.researchRate;
        }

        console.log(`Research completed: ${tech.name}`);
        console.log(`Unlocked: ${tech.unlocks?.join(', ') || 'None'}`);
    }

    // Update research progress
    update(deltaTime, cityStats) {
        const currentTime = Date.now();
        const timeDelta = currentTime - this.lastUpdate;
        
        // Update every second
        if (timeDelta < 1000) return null;
        
        this.lastUpdate = currentTime;

        // Generate research points
        const baseRate = this.researchRate;
        const populationBonus = Math.min(cityStats.population / 1000, 2); // Up to 2x bonus for large cities
        const educationBonus = (cityStats.averageEducation || 0) / 5; // Education level bonus
        const universityBonus = this.getUniversityBonus(cityStats);
        
        const totalRate = baseRate * (1 + populationBonus + educationBonus + universityBonus);
        this.researchPoints += totalRate / 60; // Per second rate

        // Update current research
        let completedResearch = null;
        if (this.currentResearch) {
            const elapsed = currentTime - this.currentResearch.startTime;
            this.currentResearch.progress = Math.min(elapsed / this.currentResearch.duration, 1);

            if (this.currentResearch.progress >= 1) {
                completedResearch = this.completeResearch();
            }
        }

        return completedResearch;
    }

    // Calculate bonus from universities and research buildings
    getUniversityBonus(cityStats) {
        if (!window.game || !window.game.buildingManager) return 0;
        
        const buildings = window.game.buildingManager.getAllBuildings();
        const universities = buildings.filter(b => b.type === 'university').length;
        const researchInstitutes = buildings.filter(b => b.type === 'research-institute').length;
        const techCampuses = buildings.filter(b => b.type === 'tech-campus').length;
        
        return universities * 0.5 + researchInstitutes * 1.0 + techCampuses * 0.3;
    }

    // Get available technologies to research
    getAvailableTechnologies() {
        const available = [];
        
        for (const [id, tech] of Object.entries(this.researchTree)) {
            if (this.completedResearch.has(id)) continue;
            if (this.currentResearch && this.currentResearch.id === id) continue;
            
            // Check prerequisites
            const hasPrereqs = tech.prerequisites.every(prereq => 
                this.completedResearch.has(prereq)
            );
            
            if (hasPrereqs) {
                available.push({
                    id,
                    ...tech,
                    canAfford: this.researchPoints >= tech.cost,
                    inQueue: this.researchQueue.includes(id)
                });
            }
        }
        
        return available.sort((a, b) => a.tier - b.tier || a.cost - b.cost);
    }

    // Get technologies by category
    getTechnologiesByCategory(category) {
        return Object.entries(this.researchTree)
            .filter(([id, tech]) => tech.category === category)
            .map(([id, tech]) => ({
                id,
                ...tech,
                completed: this.completedResearch.has(id),
                available: this.isTechnologyAvailable(id),
                canAfford: this.researchPoints >= tech.cost
            }));
    }

    // Check if technology is available to research
    isTechnologyAvailable(technologyId) {
        const tech = this.researchTree[technologyId];
        if (!tech || this.completedResearch.has(technologyId)) return false;
        
        return tech.prerequisites.every(prereq => this.completedResearch.has(prereq));
    }

    // Get research tree visualization data
    getResearchTreeData() {
        const nodes = [];
        const edges = [];
        
        for (const [id, tech] of Object.entries(this.researchTree)) {
            nodes.push({
                id: id,
                name: tech.name,
                category: tech.category,
                tier: tech.tier,
                cost: tech.cost,
                icon: tech.icon,
                completed: this.completedResearch.has(id),
                available: this.isTechnologyAvailable(id),
                current: this.currentResearch && this.currentResearch.id === id,
                progress: this.currentResearch && this.currentResearch.id === id ? 
                    this.currentResearch.progress : 0
            });
            
            // Add edges for prerequisites
            tech.prerequisites.forEach(prereq => {
                edges.push({
                    from: prereq,
                    to: id
                });
            });
        }
        
        return { nodes, edges };
    }

    // Get research statistics
    getResearchStats() {
        return {
            researchPoints: Math.floor(this.researchPoints),
            researchRate: this.researchRate.toFixed(1),
            completedCount: this.completedResearch.size,
            totalTechnologies: Object.keys(this.researchTree).length,
            currentResearch: this.currentResearch ? {
                name: this.currentResearch.name,
                progress: Math.floor(this.currentResearch.progress * 100),
                timeRemaining: this.currentResearch ? 
                    Math.max(0, this.currentResearch.duration - (Date.now() - this.currentResearch.startTime)) : 0
            } : null,
            queueLength: this.researchQueue.length,
            averageTier: this.completedResearch.size > 0 ? 
                Array.from(this.completedResearch).reduce((sum, id) => 
                    sum + this.researchTree[id].tier, 0) / this.completedResearch.size : 0
        };
    }

    // Get all effects from completed research
    getActiveEffects() {
        const effects = {
            happiness: 0,
            buildingCostReduction: 0,
            utilityEfficiency: 0,
            safety: 0,
            crimeReduction: 0,
            pollutionReduction: 0,
            energyEfficiency: 0,
            healthBonus: 0,
            lifeExpectancy: 0,
            educationBonus: 0,
            researchRate: 0,
            sanitationBonus: 0,
            economicGrowth: 0,
            jobQuality: 0,
            efficiency: 0,
            trafficReduction: 0,
            wealthAttraction: 0,
            propertyValues: 0,
            capacity: 0,
            prestige: 0,
            energyGeneration: 0,
            populationCap: 0
        };

        for (const techId of this.completedResearch) {
            const tech = this.researchTree[techId];
            if (tech.effects) {
                for (const [effect, value] of Object.entries(tech.effects)) {
                    if (effects.hasOwnProperty(effect)) {
                        effects[effect] += value;
                    }
                }
            }
        }

        return effects;
    }

    // Save/Load functionality
    serialize() {
        return {
            researchPoints: this.researchPoints,
            researchRate: this.researchRate,
            completedResearch: Array.from(this.completedResearch),
            currentResearch: this.currentResearch,
            researchQueue: this.researchQueue
        };
    }

    deserialize(data) {
        if (data.researchPoints !== undefined) {
            this.researchPoints = data.researchPoints;
        }
        if (data.researchRate !== undefined) {
            this.researchRate = data.researchRate;
        }
        if (data.completedResearch) {
            this.completedResearch = new Set(data.completedResearch);
        }
        if (data.currentResearch) {
            this.currentResearch = data.currentResearch;
        }
        if (data.researchQueue) {
            this.researchQueue = data.researchQueue;
        }
    }
}

// Export for use in other modules
window.ResearchManager = ResearchManager;
