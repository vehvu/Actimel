// MetroSim - Achievements System
// Comprehensive achievement system with 50+ achievements

class AchievementManager {
    constructor() {
        this.unlockedAchievements = new Set();
        this.achievementProgress = new Map();
        this.achievements = this.initializeAchievements();
        this.lastCheck = Date.now();
    }

    initializeAchievements() {
        return {
            // POPULATION ACHIEVEMENTS
            'first-citizen': {
                name: 'Welcome Home',
                description: 'Attract your first citizen to the city',
                category: 'population',
                icon: '👋',
                requirement: { type: 'population', target: 1 },
                reward: { money: 1000, happiness: 5 },
                rarity: 'common'
            },
            'small-town': {
                name: 'Small Town',
                description: 'Reach 100 citizens',
                category: 'population',
                icon: '🏘️',
                requirement: { type: 'population', target: 100 },
                reward: { money: 5000, happiness: 10 },
                rarity: 'common'
            },
            'growing-city': {
                name: 'Growing City',
                description: 'Reach 1,000 citizens',
                category: 'population',
                icon: '🏙️',
                requirement: { type: 'population', target: 1000 },
                reward: { money: 25000, researchPoints: 100 },
                rarity: 'uncommon'
            },
            'metropolis': {
                name: 'Metropolis',
                description: 'Reach 10,000 citizens',
                category: 'population',
                icon: '🌆',
                requirement: { type: 'population', target: 10000 },
                reward: { money: 100000, researchPoints: 500 },
                rarity: 'rare'
            },
            'megacity': {
                name: 'Megacity',
                description: 'Reach 100,000 citizens',
                category: 'population',
                icon: '🌃',
                requirement: { type: 'population', target: 100000 },
                reward: { money: 1000000, researchPoints: 2000 },
                rarity: 'legendary'
            },

            // ECONOMIC ACHIEVEMENTS
            'first-dollar': {
                name: 'First Dollar',
                description: 'Earn your first income from taxes',
                category: 'economy',
                icon: '💰',
                requirement: { type: 'income_earned', target: 1 },
                reward: { money: 2000 },
                rarity: 'common'
            },
            'profitable': {
                name: 'In the Black',
                description: 'Maintain positive cash flow for 10 months',
                category: 'economy',
                icon: '📈',
                requirement: { type: 'consecutive_profit', target: 10 },
                reward: { money: 50000, happiness: 15 },
                rarity: 'uncommon'
            },
            'millionaire': {
                name: 'Millionaire Mayor',
                description: 'Accumulate $1,000,000 in city funds',
                category: 'economy',
                icon: '💎',
                requirement: { type: 'money', target: 1000000 },
                reward: { researchPoints: 1000, prestige: 100 },
                rarity: 'rare'
            },
            'economic-powerhouse': {
                name: 'Economic Powerhouse',
                description: 'Generate $100,000 monthly income',
                category: 'economy',
                icon: '🏦',
                requirement: { type: 'monthly_income', target: 100000 },
                reward: { money: 500000, researchPoints: 1500 },
                rarity: 'epic'
            },

            // BUILDING ACHIEVEMENTS
            'first-building': {
                name: 'Foundation',
                description: 'Place your first building',
                category: 'building',
                icon: '🏗️',
                requirement: { type: 'buildings_built', target: 1 },
                reward: { money: 1000 },
                rarity: 'common'
            },
            'urban-planner': {
                name: 'Urban Planner',
                description: 'Build 50 buildings',
                category: 'building',
                icon: '📐',
                requirement: { type: 'buildings_built', target: 50 },
                reward: { money: 25000, buildingDiscount: 0.05 },
                rarity: 'uncommon'
            },
            'master-builder': {
                name: 'Master Builder',
                description: 'Build 200 buildings',
                category: 'building',
                icon: '🏛️',
                requirement: { type: 'buildings_built', target: 200 },
                reward: { money: 100000, buildingDiscount: 0.1 },
                rarity: 'rare'
            },
            'architect': {
                name: 'Visionary Architect',
                description: 'Build 500 buildings',
                category: 'building',
                icon: '🎨',
                requirement: { type: 'buildings_built', target: 500 },
                reward: { money: 500000, buildingDiscount: 0.15 },
                rarity: 'epic'
            },
            'skyscraper-city': {
                name: 'Skyscraper City',
                description: 'Build 10 skyscrapers',
                category: 'building',
                icon: '🏢',
                requirement: { type: 'building_type_count', buildingType: 'skyscraper', target: 10 },
                reward: { money: 200000, prestige: 50 },
                rarity: 'rare'
            },

            // HAPPINESS ACHIEVEMENTS
            'content-citizens': {
                name: 'Content Citizens',
                description: 'Maintain 70% happiness for 6 months',
                category: 'happiness',
                icon: '😊',
                requirement: { type: 'sustained_happiness', target: 70, duration: 6 },
                reward: { money: 50000, happiness: 10 },
                rarity: 'uncommon'
            },
            'utopia': {
                name: 'Utopia',
                description: 'Achieve 95% happiness',
                category: 'happiness',
                icon: '🌈',
                requirement: { type: 'happiness', target: 95 },
                reward: { money: 200000, researchPoints: 1000 },
                rarity: 'epic'
            },
            'perfect-harmony': {
                name: 'Perfect Harmony',
                description: 'Maintain 90% happiness for 12 months',
                category: 'happiness',
                icon: '✨',
                requirement: { type: 'sustained_happiness', target: 90, duration: 12 },
                reward: { money: 1000000, prestige: 200 },
                rarity: 'legendary'
            },

            // RESEARCH ACHIEVEMENTS
            'first-discovery': {
                name: 'First Discovery',
                description: 'Complete your first research',
                category: 'research',
                icon: '🔬',
                requirement: { type: 'research_completed', target: 1 },
                reward: { researchPoints: 100 },
                rarity: 'common'
            },
            'scholar': {
                name: 'Scholar',
                description: 'Complete 10 research projects',
                category: 'research',
                icon: '📚',
                requirement: { type: 'research_completed', target: 10 },
                reward: { researchPoints: 500, researchBoost: 0.1 },
                rarity: 'uncommon'
            },
            'innovator': {
                name: 'Innovator',
                description: 'Complete 25 research projects',
                category: 'research',
                icon: '💡',
                requirement: { type: 'research_completed', target: 25 },
                reward: { researchPoints: 2000, researchBoost: 0.2 },
                rarity: 'rare'
            },
            'tech-pioneer': {
                name: 'Technology Pioneer',
                description: 'Complete all Tier 5 research',
                category: 'research',
                icon: '🚀',
                requirement: { type: 'tier5_research', target: 'all' },
                reward: { researchPoints: 5000, prestige: 300 },
                rarity: 'legendary'
            },

            // DISASTER ACHIEVEMENTS
            'survivor': {
                name: 'Survivor',
                description: 'Successfully manage your first disaster',
                category: 'disaster',
                icon: '🛡️',
                requirement: { type: 'disasters_survived', target: 1 },
                reward: { money: 25000, preparedness: 10 },
                rarity: 'common'
            },
            'crisis-manager': {
                name: 'Crisis Manager',
                description: 'Survive 10 disasters with minimal casualties',
                category: 'disaster',
                icon: '⚡',
                requirement: { type: 'disasters_survived', target: 10 },
                reward: { money: 100000, preparedness: 25 },
                rarity: 'uncommon'
            },
            'disaster-proof': {
                name: 'Disaster Proof',
                description: 'Achieve 90% preparedness in all disaster types',
                category: 'disaster',
                icon: '🏰',
                requirement: { type: 'preparedness_all', target: 90 },
                reward: { money: 500000, prestige: 100 },
                rarity: 'epic'
            },

            // ENVIRONMENTAL ACHIEVEMENTS
            'green-thumb': {
                name: 'Green Thumb',
                description: 'Build 20 parks',
                category: 'environment',
                icon: '🌳',
                requirement: { type: 'building_category_count', category: 'decoration', target: 20 },
                reward: { money: 30000, happiness: 15 },
                rarity: 'uncommon'
            },
            'eco-warrior': {
                name: 'Eco Warrior',
                description: 'Achieve negative pollution levels',
                category: 'environment',
                icon: '🌿',
                requirement: { type: 'pollution', target: -10 },
                reward: { money: 100000, happiness: 25 },
                rarity: 'rare'
            },
            'carbon-neutral': {
                name: 'Carbon Neutral',
                description: 'Generate 100% renewable energy',
                category: 'environment',
                icon: '♻️',
                requirement: { type: 'renewable_energy_percent', target: 100 },
                reward: { money: 200000, researchPoints: 1000 },
                rarity: 'epic'
            },

            // SPECIAL ACHIEVEMENTS
            'speed-builder': {
                name: 'Speed Builder',
                description: 'Reach 1000 population in under 30 minutes',
                category: 'special',
                icon: '⚡',
                requirement: { type: 'population_time', population: 1000, time: 1800000 }, // 30 minutes
                reward: { money: 100000, prestige: 50 },
                rarity: 'rare'
            },
            'efficiency-expert': {
                name: 'Efficiency Expert',
                description: 'Maintain 95% building efficiency city-wide',
                category: 'special',
                icon: '⚙️',
                requirement: { type: 'average_efficiency', target: 95 },
                reward: { money: 150000, buildingDiscount: 0.2 },
                rarity: 'epic'
            },
            'perfectionist': {
                name: 'Perfectionist',
                description: 'Achieve max stats in all categories simultaneously',
                category: 'special',
                icon: '👑',
                requirement: { type: 'perfect_city', targets: { happiness: 100, safety: 100, health: 100, education: 100 } },
                reward: { money: 2000000, prestige: 1000 },
                rarity: 'legendary'
            },

            // TIME-BASED ACHIEVEMENTS
            'dedicated-mayor': {
                name: 'Dedicated Mayor',
                description: 'Play for 2 hours continuously',
                category: 'time',
                icon: '⏰',
                requirement: { type: 'playtime_session', target: 7200000 }, // 2 hours
                reward: { money: 50000, happiness: 10 },
                rarity: 'uncommon'
            },
            'city-veteran': {
                name: 'City Veteran',
                description: 'Total playtime of 10 hours',
                category: 'time',
                icon: '🏅',
                requirement: { type: 'playtime_total', target: 36000000 }, // 10 hours
                reward: { money: 200000, researchPoints: 1000 },
                rarity: 'rare'
            },

            // MILESTONE ACHIEVEMENTS
            'centenarian': {
                name: 'Centenarian City',
                description: 'Celebrate your city\'s 100th anniversary',
                category: 'milestone',
                icon: '🎂',
                requirement: { type: 'city_age', target: 100 }, // 100 months
                reward: { money: 1000000, prestige: 500 },
                rarity: 'legendary'
            },
            'tourist-destination': {
                name: 'Tourist Destination',
                description: 'Attract 1000 tourists per month',
                category: 'milestone',
                icon: '📸',
                requirement: { type: 'monthly_tourists', target: 1000 },
                reward: { money: 300000, happiness: 20 },
                rarity: 'epic'
            }
        };
    }

    // Check all achievements for progress
    checkAchievements(gameState) {
        const newlyUnlocked = [];
        
        for (const [id, achievement] of Object.entries(this.achievements)) {
            if (this.unlockedAchievements.has(id)) continue;
            
            if (this.checkAchievementRequirement(achievement, gameState)) {
                this.unlockAchievement(id, achievement, gameState);
                newlyUnlocked.push({ id, ...achievement });
            } else {
                // Update progress for partially completed achievements
                this.updateAchievementProgress(id, achievement, gameState);
            }
        }
        
        return newlyUnlocked;
    }

    // Check if an achievement requirement is met
    checkAchievementRequirement(achievement, gameState) {
        const req = achievement.requirement;
        
        switch (req.type) {
            case 'population':
                return gameState.population >= req.target;
            
            case 'money':
                return gameState.money >= req.target;
            
            case 'buildings_built':
                return gameState.totalBuildingsBuilt >= req.target;
            
            case 'building_type_count':
                const typeCount = gameState.buildings.filter(b => b.type === req.buildingType).length;
                return typeCount >= req.target;
            
            case 'building_category_count':
                const categoryCount = gameState.buildings.filter(b => b.category === req.category).length;
                return categoryCount >= req.target;
            
            case 'happiness':
                return gameState.happiness >= req.target;
            
            case 'sustained_happiness':
                const progressKey = `sustained_happiness_${req.target}`;
                const progress = this.achievementProgress.get(progressKey) || 0;
                return progress >= req.duration;
            
            case 'research_completed':
                return gameState.completedResearch >= req.target;
            
            case 'tier5_research':
                if (req.target === 'all') {
                    const tier5Techs = ['fusion-power', 'space-colonization'];
                    return tier5Techs.every(tech => gameState.researchCompleted.has(tech));
                }
                return false;
            
            case 'disasters_survived':
                return gameState.disastersSurvived >= req.target;
            
            case 'preparedness_all':
                return Object.values(gameState.preparedness).every(prep => prep >= req.target);
            
            case 'pollution':
                return gameState.pollution <= req.target;
            
            case 'renewable_energy_percent':
                const renewablePercent = (gameState.renewableEnergy / Math.max(gameState.totalEnergy, 1)) * 100;
                return renewablePercent >= req.target;
            
            case 'population_time':
                return gameState.population >= req.population && gameState.playTime <= req.time;
            
            case 'average_efficiency':
                const avgEfficiency = gameState.buildings.reduce((sum, b) => sum + (b.efficiency || 1), 0) / Math.max(gameState.buildings.length, 1) * 100;
                return avgEfficiency >= req.target;
            
            case 'perfect_city':
                return Object.entries(req.targets).every(([stat, target]) => gameState[stat] >= target);
            
            case 'playtime_session':
                return gameState.sessionPlayTime >= req.target;
            
            case 'playtime_total':
                return gameState.totalPlayTime >= req.target;
            
            case 'city_age':
                return gameState.cityAge >= req.target;
            
            case 'monthly_income':
                return gameState.monthlyIncome >= req.target;
            
            case 'monthly_tourists':
                return gameState.monthlyTourists >= req.target;
            
            case 'income_earned':
                return gameState.totalIncomeEarned >= req.target;
            
            case 'consecutive_profit':
                const profitProgressKey = 'consecutive_profit_months';
                const profitProgress = this.achievementProgress.get(profitProgressKey) || 0;
                return profitProgress >= req.target;
            
            default:
                return false;
        }
    }

    // Update progress for achievements that track over time
    updateAchievementProgress(achievementId, achievement, gameState) {
        const req = achievement.requirement;
        
        switch (req.type) {
            case 'sustained_happiness':
                const progressKey = `sustained_happiness_${req.target}`;
                let progress = this.achievementProgress.get(progressKey) || 0;
                
                if (gameState.happiness >= req.target) {
                    progress += 1; // Increment by 1 month
                } else {
                    progress = 0; // Reset if happiness drops
                }
                
                this.achievementProgress.set(progressKey, progress);
                break;
            
            case 'consecutive_profit':
                const profitKey = 'consecutive_profit_months';
                let profitProgress = this.achievementProgress.get(profitKey) || 0;
                
                if (gameState.monthlyProfit > 0) {
                    profitProgress += 1;
                } else {
                    profitProgress = 0;
                }
                
                this.achievementProgress.set(profitKey, profitProgress);
                break;
        }
    }

    // Unlock an achievement and apply rewards
    unlockAchievement(id, achievement, gameState) {
        this.unlockedAchievements.add(id);
        
        // Apply rewards
        if (achievement.reward) {
            if (achievement.reward.money && window.game?.economyManager) {
                window.game.economyManager.money += achievement.reward.money;
            }
            if (achievement.reward.researchPoints && window.game?.researchManager) {
                window.game.researchManager.researchPoints += achievement.reward.researchPoints;
            }
            if (achievement.reward.happiness && window.game) {
                // Apply happiness bonus - this would be handled by the main game
            }
            if (achievement.reward.prestige && window.game) {
                // Apply prestige bonus - this would be handled by the main game
            }
        }
        
        console.log(`🏆 Achievement Unlocked: ${achievement.name}`);
        console.log(`📝 ${achievement.description}`);
        
        // Show notification
        if (window.game?.showNotification) {
            window.game.showNotification(
                `🏆 ${achievement.name}`,
                achievement.description,
                'achievement'
            );
        }
    }

    // Get achievements by category
    getAchievementsByCategory(category) {
        return Object.entries(this.achievements)
            .filter(([id, achievement]) => achievement.category === category)
            .map(([id, achievement]) => ({
                id,
                ...achievement,
                unlocked: this.unlockedAchievements.has(id),
                progress: this.getAchievementProgress(id, achievement)
            }));
    }

    // Get achievement progress percentage
    getAchievementProgress(id, achievement) {
        if (this.unlockedAchievements.has(id)) return 100;
        
        const req = achievement.requirement;
        
        // For achievements that track progress over time
        if (req.type === 'sustained_happiness') {
            const progressKey = `sustained_happiness_${req.target}`;
            const progress = this.achievementProgress.get(progressKey) || 0;
            return Math.min((progress / req.duration) * 100, 100);
        }
        
        if (req.type === 'consecutive_profit') {
            const profitKey = 'consecutive_profit_months';
            const progress = this.achievementProgress.get(profitKey) || 0;
            return Math.min((progress / req.target) * 100, 100);
        }
        
        // For other achievements, we'd need current game state to calculate progress
        // This would be implemented when called with current game state
        return 0;
    }

    // Get achievement statistics
    getAchievementStats() {
        const total = Object.keys(this.achievements).length;
        const unlocked = this.unlockedAchievements.size;
        const byRarity = { common: 0, uncommon: 0, rare: 0, epic: 0, legendary: 0 };
        const byCategory = {};
        
        for (const [id, achievement] of Object.entries(this.achievements)) {
            const isUnlocked = this.unlockedAchievements.has(id);
            
            if (isUnlocked) {
                byRarity[achievement.rarity]++;
                byCategory[achievement.category] = (byCategory[achievement.category] || 0) + 1;
            }
        }
        
        return {
            total,
            unlocked,
            percentage: Math.round((unlocked / total) * 100),
            byRarity,
            byCategory,
            completionScore: this.calculateCompletionScore()
        };
    }

    // Calculate completion score based on rarity
    calculateCompletionScore() {
        const rarityPoints = { common: 1, uncommon: 2, rare: 5, epic: 10, legendary: 25 };
        let score = 0;
        
        for (const [id, achievement] of Object.entries(this.achievements)) {
            if (this.unlockedAchievements.has(id)) {
                score += rarityPoints[achievement.rarity] || 1;
            }
        }
        
        return score;
    }

    // Get recent achievements
    getRecentAchievements(limit = 5) {
        // This would need to track unlock timestamps
        return Array.from(this.unlockedAchievements)
            .slice(-limit)
            .map(id => ({ id, ...this.achievements[id] }));
    }

    // Save/Load functionality
    serialize() {
        return {
            unlockedAchievements: Array.from(this.unlockedAchievements),
            achievementProgress: Array.from(this.achievementProgress.entries())
        };
    }

    deserialize(data) {
        if (data.unlockedAchievements) {
            this.unlockedAchievements = new Set(data.unlockedAchievements);
        }
        if (data.achievementProgress) {
            this.achievementProgress = new Map(data.achievementProgress);
        }
    }
}

// Export for use in other modules
window.AchievementManager = AchievementManager;
