// MetroSim - Citizens & Population System
// Advanced citizen simulation with needs, jobs, and life cycles

class CitizenManager {
    constructor() {
        this.citizens = new Map();
        this.nextCitizenId = 1;
        this.populationStats = {
            total: 0,
            employed: 0,
            unemployed: 0,
            children: 0,
            adults: 0,
            seniors: 0,
            happiness: 50,
            education: 0,
            health: 100
        };
        this.migrationRate = 0.1;
        this.birthRate = 0.02;
        this.deathRate = 0.01;
        this.lastUpdate = Date.now();
    }

    // Create a new citizen
    createCitizen(age = null, education = null) {
        const citizen = {
            id: this.nextCitizenId++,
            name: this.generateName(),
            age: age || Utils.randomInt(18, 65),
            education: education || Utils.randomInt(1, 5),
            job: null,
            home: null,
            happiness: Utils.randomInt(40, 80),
            health: Utils.randomInt(80, 100),
            wealth: Utils.randomInt(1000, 10000),
            needs: {
                housing: Utils.randomInt(60, 100),
                employment: Utils.randomInt(70, 100),
                shopping: Utils.randomInt(50, 90),
                healthcare: Utils.randomInt(60, 100),
                education: Utils.randomInt(40, 80),
                recreation: Utils.randomInt(50, 90),
                safety: Utils.randomInt(70, 100),
                environment: Utils.randomInt(60, 100)
            },
            personality: {
                ambition: Math.random(),
                patience: Math.random(),
                socialness: Math.random(),
                environmentalism: Math.random()
            },
            lifeStage: this.getLifeStage(age || Utils.randomInt(18, 65)),
            birthYear: new Date().getFullYear() - (age || Utils.randomInt(18, 65)),
            moveInDate: Date.now(),
            lastJobSearch: 0,
            complaints: []
        };

        this.citizens.set(citizen.id, citizen);
        this.updatePopulationStats();
        return citizen;
    }

    // Generate random citizen names
    generateName() {
        const firstNames = [
            'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn',
            'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'William', 'Sophia', 'James',
            'Isabella', 'Oliver', 'Charlotte', 'Benjamin', 'Amelia', 'Elijah', 'Mia',
            'Lucas', 'Harper', 'Mason', 'Evelyn', 'Logan', 'Abigail', 'Alexander'
        ];
        
        const lastNames = [
            'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
            'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez',
            'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
            'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark'
        ];

        return Utils.randomChoice(firstNames) + ' ' + Utils.randomChoice(lastNames);
    }

    // Determine life stage based on age
    getLifeStage(age) {
        if (age < 18) return 'child';
        if (age < 65) return 'adult';
        return 'senior';
    }

    // Update citizen needs based on city conditions
    updateCitizenNeeds(citizen, cityStats) {
        const needs = citizen.needs;
        const decay = 0.5; // How much needs decay per update
        const satisfaction = 2; // How much needs are satisfied when met

        // Housing need
        if (citizen.home) {
            needs.housing = Math.min(100, needs.housing + satisfaction);
        } else {
            needs.housing = Math.max(0, needs.housing - decay * 2);
        }

        // Employment need
        if (citizen.job) {
            needs.employment = Math.min(100, needs.employment + satisfaction);
        } else if (citizen.lifeStage === 'adult') {
            needs.employment = Math.max(0, needs.employment - decay * 1.5);
        }

        // Shopping need - based on commercial buildings nearby
        const commercialSatisfaction = Math.min(cityStats.commercialCapacity / this.populationStats.total, 1);
        needs.shopping = Math.max(0, Math.min(100, needs.shopping + (commercialSatisfaction * satisfaction) - decay));

        // Healthcare need - based on hospitals and health services
        const healthcareSatisfaction = Math.min(cityStats.healthcareCapacity / this.populationStats.total, 1);
        needs.healthcare = Math.max(0, Math.min(100, needs.healthcare + (healthcareSatisfaction * satisfaction) - decay));

        // Education need - based on schools and universities
        const educationSatisfaction = Math.min(cityStats.educationCapacity / this.populationStats.total, 1);
        needs.education = Math.max(0, Math.min(100, needs.education + (educationSatisfaction * satisfaction) - decay));

        // Recreation need - based on parks and entertainment
        const recreationSatisfaction = Math.min(cityStats.recreationCapacity / this.populationStats.total, 1);
        needs.recreation = Math.max(0, Math.min(100, needs.recreation + (recreationSatisfaction * satisfaction) - decay));

        // Safety need - based on police stations and crime rate
        const safetySatisfaction = Math.min(cityStats.safetyLevel / 100, 1);
        needs.safety = Math.max(0, Math.min(100, needs.safety + (safetySatisfaction * satisfaction) - decay));

        // Environment need - based on pollution and parks
        const environmentSatisfaction = Math.max(0, (100 - cityStats.pollution) / 100);
        needs.environment = Math.max(0, Math.min(100, needs.environment + (environmentSatisfaction * satisfaction) - decay));

        // Update citizen happiness based on needs
        this.updateCitizenHappiness(citizen);
    }

    // Calculate citizen happiness based on needs fulfillment
    updateCitizenHappiness(citizen) {
        const needs = citizen.needs;
        const weights = {
            housing: 0.25,
            employment: 0.20,
            shopping: 0.10,
            healthcare: 0.15,
            education: 0.10,
            recreation: 0.08,
            safety: 0.12,
            environment: citizen.personality.environmentalism * 0.15
        };

        let weightedHappiness = 0;
        let totalWeight = 0;

        for (const [need, value] of Object.entries(needs)) {
            const weight = weights[need] || 0;
            weightedHappiness += value * weight;
            totalWeight += weight;
        }

        citizen.happiness = Math.round(weightedHappiness / totalWeight);

        // Age affects happiness
        if (citizen.age > 70) citizen.happiness -= 5;
        if (citizen.age < 25) citizen.happiness += 5;

        // Wealth affects happiness
        if (citizen.wealth > 50000) citizen.happiness += 10;
        if (citizen.wealth < 5000) citizen.happiness -= 10;

        citizen.happiness = Utils.clamp(citizen.happiness, 0, 100);
    }

    // Assign job to citizen
    assignJob(citizenId, job) {
        const citizen = this.citizens.get(citizenId);
        if (!citizen) return false;

        citizen.job = job;
        citizen.lastJobSearch = Date.now();
        return true;
    }

    // Assign home to citizen
    assignHome(citizenId, building) {
        const citizen = this.citizens.get(citizenId);
        if (!citizen) return false;

        citizen.home = building;
        return true;
    }

    // Find suitable job for citizen
    findJobForCitizen(citizen, availableJobs) {
        if (citizen.lifeStage !== 'adult') return null;

        // Filter jobs based on education requirements
        const suitableJobs = availableJobs.filter(job => {
            return job.educationRequired <= citizen.education;
        });

        if (suitableJobs.length === 0) return null;

        // Prefer higher paying jobs
        suitableJobs.sort((a, b) => b.salary - a.salary);
        return suitableJobs[0];
    }

    // Citizen life cycle updates
    updateCitizenLifeCycle(citizen) {
        const currentYear = new Date().getFullYear();
        citizen.age = currentYear - citizen.birthYear;
        
        const oldStage = citizen.lifeStage;
        citizen.lifeStage = this.getLifeStage(citizen.age);

        // Life stage transitions
        if (oldStage !== citizen.lifeStage) {
            if (citizen.lifeStage === 'senior' && citizen.job) {
                // Retirement
                citizen.job = null;
                citizen.wealth += Utils.randomInt(20000, 100000); // Retirement savings
            }
        }

        // Health decline with age
        if (citizen.age > 50) {
            citizen.health = Math.max(0, citizen.health - 0.1);
        }

        // Education improvement for young adults
        if (citizen.age >= 18 && citizen.age <= 25 && citizen.education < 5) {
            if (Math.random() < 0.1) {
                citizen.education += 1;
            }
        }
    }

    // Migration system - citizens move in/out based on city attractiveness
    processMigration(cityStats) {
        const attractiveness = this.calculateCityAttractiveness(cityStats);
        const currentTime = Date.now();

        // Immigration
        if (attractiveness > 60 && Math.random() < this.migrationRate) {
            const newCitizen = this.createCitizen();
            console.log(`${newCitizen.name} moved to the city!`);
        }

        // Emigration - unhappy citizens leave
        const unhappyCitizens = Array.from(this.citizens.values())
            .filter(citizen => citizen.happiness < 30 && 
                    currentTime - citizen.moveInDate > 30000); // Must live here for 30 seconds

        for (const citizen of unhappyCitizens) {
            if (Math.random() < 0.1) { // 10% chance to leave each update
                this.removeCitizen(citizen.id);
                console.log(`${citizen.name} moved away due to unhappiness.`);
            }
        }
    }

    // Calculate how attractive the city is for new residents
    calculateCityAttractiveness(cityStats) {
        let attractiveness = 50; // Base attractiveness

        // Positive factors
        attractiveness += Math.min(cityStats.jobAvailability * 0.3, 20);
        attractiveness += Math.min(cityStats.happiness * 0.2, 15);
        attractiveness += Math.min(cityStats.safetyLevel * 0.15, 10);
        attractiveness += Math.min((100 - cityStats.pollution) * 0.1, 10);

        // Negative factors
        attractiveness -= Math.max(cityStats.unemployment * 0.5, 0);
        attractiveness -= Math.max(cityStats.pollution * 0.2, 0);
        
        return Utils.clamp(attractiveness, 0, 100);
    }

    // Birth and death system
    processBirthsAndDeaths() {
        const adults = Array.from(this.citizens.values())
            .filter(citizen => citizen.lifeStage === 'adult' && citizen.age >= 25);

        // Births
        for (const citizen of adults) {
            if (citizen.home && citizen.happiness > 60 && Math.random() < this.birthRate) {
                const child = this.createCitizen(0, 0);
                child.lifeStage = 'child';
                child.home = citizen.home;
                console.log(`${child.name} was born!`);
            }
        }

        // Deaths (natural causes)
        const allCitizens = Array.from(this.citizens.values());
        for (const citizen of allCitizens) {
            let deathChance = this.deathRate;
            
            // Age increases death chance
            if (citizen.age > 70) deathChance *= (citizen.age - 60) / 10;
            
            // Poor health increases death chance
            deathChance *= (100 - citizen.health) / 100 + 1;

            if (Math.random() < deathChance) {
                this.removeCitizen(citizen.id);
                console.log(`${citizen.name} passed away at age ${citizen.age}.`);
            }
        }
    }

    // Remove citizen from the city
    removeCitizen(citizenId) {
        const citizen = this.citizens.get(citizenId);
        if (!citizen) return false;

        this.citizens.delete(citizenId);
        this.updatePopulationStats();
        return true;
    }

    // Update population statistics
    updatePopulationStats() {
        const citizens = Array.from(this.citizens.values());
        
        this.populationStats = {
            total: citizens.length,
            employed: citizens.filter(c => c.job).length,
            unemployed: citizens.filter(c => !c.job && c.lifeStage === 'adult').length,
            children: citizens.filter(c => c.lifeStage === 'child').length,
            adults: citizens.filter(c => c.lifeStage === 'adult').length,
            seniors: citizens.filter(c => c.lifeStage === 'senior').length,
            happiness: citizens.length > 0 ? 
                Math.round(citizens.reduce((sum, c) => sum + c.happiness, 0) / citizens.length) : 50,
            education: citizens.length > 0 ?
                Math.round(citizens.reduce((sum, c) => sum + c.education, 0) / citizens.length) : 0,
            health: citizens.length > 0 ?
                Math.round(citizens.reduce((sum, c) => sum + c.health, 0) / citizens.length) : 100
        };
    }

    // Main update function
    update(cityStats) {
        const currentTime = Date.now();
        const deltaTime = currentTime - this.lastUpdate;
        
        // Update every 5 seconds
        if (deltaTime < 5000) return;

        this.lastUpdate = currentTime;

        // Update all citizens
        for (const citizen of this.citizens.values()) {
            this.updateCitizenNeeds(citizen, cityStats);
            this.updateCitizenLifeCycle(citizen);
        }

        // Process migration
        this.processMigration(cityStats);

        // Process births and deaths (less frequently)
        if (Math.random() < 0.1) {
            this.processBirthsAndDeaths();
        }

        this.updatePopulationStats();
    }

    // Get citizen complaints for events system
    getCitizenComplaints() {
        const complaints = [];
        const citizens = Array.from(this.citizens.values());

        for (const citizen of citizens) {
            if (citizen.happiness < 40) {
                const lowNeeds = Object.entries(citizen.needs)
                    .filter(([need, value]) => value < 50)
                    .map(([need, value]) => need);

                if (lowNeeds.length > 0) {
                    const complaint = {
                        citizen: citizen.name,
                        issue: Utils.randomChoice(lowNeeds),
                        severity: Math.round((50 - citizen.happiness) / 10)
                    };
                    complaints.push(complaint);
                }
            }
        }

        return complaints.slice(0, 5); // Return top 5 complaints
    }

    // Get population by need satisfaction
    getNeedsSatisfaction() {
        const citizens = Array.from(this.citizens.values());
        if (citizens.length === 0) return {};

        const needsSum = {
            housing: 0, employment: 0, shopping: 0, healthcare: 0,
            education: 0, recreation: 0, safety: 0, environment: 0
        };

        for (const citizen of citizens) {
            for (const [need, value] of Object.entries(citizen.needs)) {
                needsSum[need] += value;
            }
        }

        const needsSatisfaction = {};
        for (const [need, sum] of Object.entries(needsSum)) {
            needsSatisfaction[need] = Math.round(sum / citizens.length);
        }

        return needsSatisfaction;
    }

    // Save/Load functionality
    serialize() {
        return {
            citizens: Array.from(this.citizens.entries()),
            nextCitizenId: this.nextCitizenId,
            populationStats: this.populationStats,
            migrationRate: this.migrationRate,
            birthRate: this.birthRate,
            deathRate: this.deathRate
        };
    }

    deserialize(data) {
        if (data.citizens) {
            this.citizens = new Map(data.citizens);
        }
        if (data.nextCitizenId) {
            this.nextCitizenId = data.nextCitizenId;
        }
        if (data.populationStats) {
            this.populationStats = data.populationStats;
        }
        if (data.migrationRate !== undefined) {
            this.migrationRate = data.migrationRate;
        }
        if (data.birthRate !== undefined) {
            this.birthRate = data.birthRate;
        }
        if (data.deathRate !== undefined) {
            this.deathRate = data.deathRate;
        }
    }
}

// Export for use in other modules
window.CitizenManager = CitizenManager;
