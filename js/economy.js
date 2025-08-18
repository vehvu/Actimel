// MetroSim - Economy System
// Complex economic simulation with supply/demand, taxes, and market dynamics

class EconomyManager {
    constructor() {
        this.money = 50000;
        this.income = 0;
        this.expenses = 0;
        this.taxRate = 0.15;
        this.budgetAllocations = {
            education: 0.25,
            healthcare: 0.20,
            infrastructure: 0.20,
            safety: 0.15,
            environment: 0.10,
            administration: 0.10
        };
        
        this.economicStats = {
            gdp: 0,
            gdpPerCapita: 0,
            unemployment: 0,
            inflation: 0,
            businessGrowth: 0,
            housingPrices: 100000,
            commercialRent: 5000,
            industrialRent: 3000
        };

        this.marketDemand = {
            residential: 1.0,
            commercial: 1.0,
            industrial: 1.0,
            office: 1.0
        };

        this.lastUpdate = Date.now();
        this.monthlyReports = [];
    }

    // Calculate city income from various sources
    calculateIncome(buildings, citizens, cityStats) {
        let totalIncome = 0;
        
        // Tax income from citizens
        const employedCitizens = citizens.filter(c => c.job && c.lifeStage === 'adult');
        const personalTaxes = employedCitizens.reduce((sum, citizen) => {
            const salary = citizen.job ? citizen.job.salary : 0;
            return sum + (salary * this.taxRate * 0.1); // Monthly tax
        }, 0);
        
        // Property taxes
        const propertyTaxes = buildings.reduce((sum, building) => {
            return sum + (building.cost * 0.001); // 0.1% monthly property tax
        }, 0);
        
        // Business taxes from commercial/industrial buildings
        const businessTaxes = buildings
            .filter(b => b.category === 'commercial' || b.category === 'industrial')
            .reduce((sum, building) => {
                return sum + (building.income || 0) * 0.2; // 20% business tax
            }, 0);
        
        // Tourism income
        const tourismBuildings = buildings.filter(b => b.tourism);
        const tourismIncome = tourismBuildings.reduce((sum, building) => {
            return sum + (building.tourism || 0) * cityStats.happiness * 0.1;
        }, 0);

        totalIncome = personalTaxes + propertyTaxes + businessTaxes + tourismIncome;
        
        this.income = totalIncome;
        return totalIncome;
    }

    // Calculate city expenses
    calculateExpenses(buildings, citizens, cityStats) {
        let totalExpenses = 0;

        // Building maintenance
        const maintenanceExpenses = buildings.reduce((sum, building) => {
            return sum + (building.upkeep || 0);
        }, 0);

        // City services based on population
        const population = citizens.length;
        const servicesExpenses = population * 50; // $50 per citizen for basic services

        // Budget allocations
        const budgetExpenses = Object.values(this.budgetAllocations).reduce((sum, allocation) => {
            return sum + (this.money * allocation * 0.01); // 1% of budget per month
        }, 0);

        totalExpenses = maintenanceExpenses + servicesExpenses + budgetExpenses;
        
        this.expenses = totalExpenses;
        return totalExpenses;
    }

    // Update economic statistics
    updateEconomicStats(buildings, citizens, cityStats) {
        const population = citizens.length;
        const employedCitizens = citizens.filter(c => c.job).length;
        const adultCitizens = citizens.filter(c => c.lifeStage === 'adult').length;

        // GDP calculation
        const totalProduction = buildings
            .filter(b => b.category === 'commercial' || b.category === 'industrial')
            .reduce((sum, building) => sum + (building.income || 0), 0);
        
        this.economicStats.gdp = totalProduction * 12; // Annual GDP
        this.economicStats.gdpPerCapita = population > 0 ? this.economicStats.gdp / population : 0;

        // Unemployment rate
        this.economicStats.unemployment = adultCitizens > 0 ? 
            ((adultCitizens - employedCitizens) / adultCitizens) * 100 : 0;

        // Business growth based on demand and supply
        const commercialBuildings = buildings.filter(b => b.category === 'commercial').length;
        const industrialBuildings = buildings.filter(b => b.category === 'industrial').length;
        
        this.economicStats.businessGrowth = Math.min(
            (this.marketDemand.commercial + this.marketDemand.industrial) * 50 - 
            (commercialBuildings + industrialBuildings) * 2, 100
        );

        // Housing prices based on supply and demand
        const housingSupply = buildings.filter(b => b.category === 'residential')
            .reduce((sum, b) => sum + (b.capacity || 0), 0);
        const housingDemand = population;
        
        if (housingDemand > housingSupply) {
            this.economicStats.housingPrices *= 1.02; // 2% increase
        } else if (housingSupply > housingDemand * 1.2) {
            this.economicStats.housingPrices *= 0.99; // 1% decrease
        }

        // Commercial rent based on business success
        const averageBusinessIncome = commercialBuildings > 0 ?
            buildings.filter(b => b.category === 'commercial')
                .reduce((sum, b) => sum + (b.income || 0), 0) / commercialBuildings : 0;
        
        this.economicStats.commercialRent = Math.max(2000, averageBusinessIncome * 0.3);

        // Industrial rent
        this.economicStats.industrialRent = this.economicStats.commercialRent * 0.6;

        // Inflation based on economic growth and money supply
        const moneyGrowth = this.income / Math.max(this.money, 1);
        this.economicStats.inflation = Utils.clamp(
            (this.economicStats.businessGrowth * 0.1) + (moneyGrowth * 5), -5, 15
        );
    }

    // Update market demand based on city conditions
    updateMarketDemand(buildings, citizens, cityStats) {
        const population = citizens.length;
        
        // Residential demand based on population growth and job availability
        const jobsAvailable = buildings
            .reduce((sum, b) => sum + (b.jobs || 0), 0);
        const employedCitizens = citizens.filter(c => c.job).length;
        
        this.marketDemand.residential = Math.max(0.5, Math.min(2.0, 
            (population + jobsAvailable - employedCitizens) / Math.max(population, 1)
        ));

        // Commercial demand based on population and income
        const averageIncome = citizens.length > 0 ?
            citizens.filter(c => c.job).reduce((sum, c) => sum + (c.job?.salary || 0), 0) / citizens.length : 0;
        
        this.marketDemand.commercial = Math.max(0.3, Math.min(2.0,
            (population * averageIncome) / 1000000
        ));

        // Industrial demand based on commercial demand and exports
        this.marketDemand.industrial = Math.max(0.4, Math.min(1.8,
            this.marketDemand.commercial * 0.8 + (this.economicStats.gdp / 10000000)
        ));

        // Office demand based on education level and business growth
        const averageEducation = citizens.length > 0 ?
            citizens.reduce((sum, c) => sum + c.education, 0) / citizens.length : 0;
        
        this.marketDemand.office = Math.max(0.2, Math.min(1.5,
            (averageEducation / 5) * (this.economicStats.businessGrowth / 100)
        ));
    }

    // Process monthly budget and finances
    processMonthlyFinances(buildings, citizens, cityStats) {
        const income = this.calculateIncome(buildings, citizens, cityStats);
        const expenses = this.calculateExpenses(buildings, citizens, cityStats);
        const netIncome = income - expenses;

        this.money += netIncome;

        // Create monthly report
        const report = {
            month: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            income: income,
            expenses: expenses,
            netIncome: netIncome,
            totalMoney: this.money,
            population: citizens.length,
            gdp: this.economicStats.gdp,
            unemployment: this.economicStats.unemployment,
            happiness: cityStats.happiness
        };

        this.monthlyReports.push(report);
        if (this.monthlyReports.length > 12) {
            this.monthlyReports.shift(); // Keep only last 12 months
        }

        return report;
    }

    // Adjust tax rate
    setTaxRate(newRate) {
        this.taxRate = Utils.clamp(newRate, 0.05, 0.40); // 5% to 40%
        
        // Tax rate affects citizen happiness
        const happinessEffect = (0.2 - this.taxRate) * 100; // Lower taxes = higher happiness
        return happinessEffect;
    }

    // Adjust budget allocations
    setBudgetAllocation(category, percentage) {
        if (this.budgetAllocations[category] !== undefined) {
            this.budgetAllocations[category] = Utils.clamp(percentage, 0, 0.5); // Max 50% per category
            
            // Normalize allocations to sum to 1.0
            const total = Object.values(this.budgetAllocations).reduce((sum, val) => sum + val, 0);
            if (total > 1.0) {
                for (const key in this.budgetAllocations) {
                    this.budgetAllocations[key] /= total;
                }
            }
            
            return true;
        }
        return false;
    }

    // Get building cost with market demand multiplier
    getBuildingCostWithDemand(buildingType, baseCost) {
        const category = buildingType.category;
        const demandMultiplier = this.marketDemand[category] || 1.0;
        
        // High demand increases construction costs
        return Math.round(baseCost * (0.8 + demandMultiplier * 0.4));
    }

    // Calculate loan options for player
    calculateLoanOptions() {
        const creditRating = this.calculateCreditRating();
        const loans = [];

        if (creditRating >= 60) {
            loans.push({
                amount: 100000,
                interestRate: 0.05,
                term: 12, // months
                monthlyPayment: 8792,
                description: 'Small Business Loan'
            });
        }

        if (creditRating >= 75) {
            loans.push({
                amount: 500000,
                interestRate: 0.04,
                term: 24,
                monthlyPayment: 21929,
                description: 'Municipal Development Loan'
            });
        }

        if (creditRating >= 85) {
            loans.push({
                amount: 1000000,
                interestRate: 0.035,
                term: 36,
                monthlyPayment: 29523,
                description: 'Infrastructure Bond'
            });
        }

        return loans;
    }

    // Calculate city's credit rating
    calculateCreditRating() {
        let rating = 50; // Base rating

        // Positive factors
        if (this.money > 0) rating += 20;
        if (this.income > this.expenses) rating += 15;
        if (this.economicStats.unemployment < 10) rating += 10;
        if (this.economicStats.gdpPerCapita > 30000) rating += 10;

        // Negative factors
        if (this.money < 0) rating -= 30;
        if (this.expenses > this.income * 1.2) rating -= 20;
        if (this.economicStats.unemployment > 20) rating -= 15;

        return Utils.clamp(rating, 0, 100);
    }

    // Economic crisis events
    triggerEconomicEvent(eventType) {
        const events = {
            recession: {
                name: 'Economic Recession',
                effects: {
                    businessGrowth: -20,
                    unemployment: 5,
                    income: -0.3,
                    happiness: -15
                },
                duration: 6 // months
            },
            boom: {
                name: 'Economic Boom',
                effects: {
                    businessGrowth: 30,
                    unemployment: -3,
                    income: 0.5,
                    happiness: 10
                },
                duration: 4
            },
            inflation: {
                name: 'High Inflation',
                effects: {
                    housingPrices: 0.15,
                    commercialRent: 0.2,
                    happiness: -10
                },
                duration: 8
            }
        };

        const event = events[eventType];
        if (event) {
            // Apply effects immediately
            this.economicStats.businessGrowth += event.effects.businessGrowth || 0;
            this.economicStats.unemployment += event.effects.unemployment || 0;
            
            if (event.effects.income) {
                this.income *= (1 + event.effects.income);
            }
            
            if (event.effects.housingPrices) {
                this.economicStats.housingPrices *= (1 + event.effects.housingPrices);
            }
            
            if (event.effects.commercialRent) {
                this.economicStats.commercialRent *= (1 + event.effects.commercialRent);
            }

            return event;
        }
        return null;
    }

    // Main update function
    update(buildings, citizens, cityStats) {
        const currentTime = Date.now();
        const deltaTime = currentTime - this.lastUpdate;

        // Update every 10 seconds (represents 1 month in game time)
        if (deltaTime < 10000) return;

        this.lastUpdate = currentTime;

        this.updateEconomicStats(buildings, citizens, cityStats);
        this.updateMarketDemand(buildings, citizens, cityStats);
        
        // Process monthly finances
        const monthlyReport = this.processMonthlyFinances(buildings, citizens, cityStats);
        
        // Random economic events
        if (Math.random() < 0.05) { // 5% chance per month
            const events = ['recession', 'boom', 'inflation'];
            const randomEvent = Utils.randomChoice(events);
            this.triggerEconomicEvent(randomEvent);
        }

        return monthlyReport;
    }

    // Get financial summary for UI
    getFinancialSummary() {
        return {
            money: this.money,
            income: this.income,
            expenses: this.expenses,
            netIncome: this.income - this.expenses,
            taxRate: this.taxRate,
            creditRating: this.calculateCreditRating(),
            economicStats: { ...this.economicStats },
            marketDemand: { ...this.marketDemand },
            budgetAllocations: { ...this.budgetAllocations }
        };
    }

    // Save/Load functionality
    serialize() {
        return {
            money: this.money,
            income: this.income,
            expenses: this.expenses,
            taxRate: this.taxRate,
            budgetAllocations: this.budgetAllocations,
            economicStats: this.economicStats,
            marketDemand: this.marketDemand,
            monthlyReports: this.monthlyReports
        };
    }

    deserialize(data) {
        if (data.money !== undefined) this.money = data.money;
        if (data.income !== undefined) this.income = data.income;
        if (data.expenses !== undefined) this.expenses = data.expenses;
        if (data.taxRate !== undefined) this.taxRate = data.taxRate;
        if (data.budgetAllocations) this.budgetAllocations = data.budgetAllocations;
        if (data.economicStats) this.economicStats = data.economicStats;
        if (data.marketDemand) this.marketDemand = data.marketDemand;
        if (data.monthlyReports) this.monthlyReports = data.monthlyReports;
    }
}

// Export for use in other modules
window.EconomyManager = EconomyManager;
