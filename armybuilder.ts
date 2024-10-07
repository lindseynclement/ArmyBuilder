type Unit = {
  name: string;
  speed: number;
  wounds: number;
  armor: number;
  shootingAccuracy: number;
  shootingDamage: number;
  closeCombatAccuracy: number;
  closeCombatDamage: number;
  pointCost: number;
  maxCount: number; // Maximum number of this unit allowed in the army
};

type Codex = {
  name: string;
  units: Unit[];
};

// Calculate efficiency score for a unit
function calculateEfficiency(unit: Unit): number {
  const speedWeight = 1.0;
  const woundsWeight = 1.2;
  const armorWeight = 1.1;
  const shootingAccuracyWeight = 1.05;
  const shootingDamageWeight = 1.15;
  const closeCombatAccuracyWeight = 1.05;
  const closeCombatDamageWeight = 1.2;

  const efficiency = (speedWeight * unit.speed +
                      woundsWeight * unit.wounds +
                      armorWeight * unit.armor +
                      shootingAccuracyWeight * unit.shootingAccuracy +
                      shootingDamageWeight * unit.shootingDamage +
                      closeCombatAccuracyWeight * unit.closeCombatAccuracy +
                      closeCombatDamageWeight * unit.closeCombatDamage) / unit.pointCost;

  return efficiency;
}

// Rank units by efficiency and return the ranked list
function rankUnitsByEfficiency(codex: Codex): Array<{ unit: Unit; efficiencyScore: number }> {
  return codex.units
    .map(unit => ({ unit, efficiencyScore: calculateEfficiency(unit) }))
    .sort((a, b) => b.efficiencyScore - a.efficiencyScore);
}

// Select the optimal army using dynamic programming
function selectOptimalArmy(codex: Codex, budget: number): Unit[] {
  const rankedUnits = rankUnitsByEfficiency(codex);
  const len = rankedUnits.length;
  const maxEfficiency: number[][] = Array.from({ length: len + 1 }, () => Array(budget + 1).fill(0));
  const selectedUnits: Unit[] = [];

  // Fill the DP array with maximum efficiency at each point cost
  for (let i = 1; i <= len; i++) {
    const { unit } = rankedUnits[i - 1];
    for (let j = 0; j <= budget; j++) {
      if (unit.pointCost <= j) {
        maxEfficiency[i][j] = Math.max(maxEfficiency[i - 1][j], maxEfficiency[i - 1][j - unit.pointCost] + calculateEfficiency(unit));
      } else {
        maxEfficiency[i][j] = maxEfficiency[i - 1][j];
      }
    }
  }

  // Backtracking to determine which units were selected
  let remainingBudget = budget;
  for (let i = len; i > 0 && remainingBudget > 0; i--) {
    if (maxEfficiency[i][remainingBudget] !== maxEfficiency[i - 1][remainingBudget]) {
      const { unit } = rankedUnits[i - 1];
      selectedUnits.push(unit);
      remainingBudget -= unit.pointCost;
    }
  }

  return selectedUnits;
}

//Codex Definitions
const speedDemons: Codex = {
  name: "Speed Demons",
  units: [
    { name: "Scout Trooper", speed: 10, wounds: 5, armor: 0.2, shootingAccuracy: 0.5, shootingDamage: 3, closeCombatAccuracy: 0.6, closeCombatDamage: 4, pointCost: 80, maxCount: 10 },
    { name: "Fast Attack Vehicle", speed: 12, wounds: 10, armor: 0.4, shootingAccuracy: 0.7, shootingDamage: 6, closeCombatAccuracy: 0.3, closeCombatDamage: 5, pointCost: 200, maxCount: 2 },
    { name: "Jetpack Infantry", speed: 14, wounds: 7, armor: 0.3, shootingAccuracy: 0.6, shootingDamage: 4, closeCombatAccuracy: 0.8, closeCombatDamage: 5, pointCost: 150, maxCount: 5 },
    { name: "Light Cavalry", speed: 15, wounds: 6, armor: 0.25, shootingAccuracy: 0.4, shootingDamage: 2, closeCombatAccuracy: 0.7, closeCombatDamage: 6, pointCost: 120, maxCount: 4 },
    { name: "Rapid Response Squad", speed: 13, wounds: 8, armor: 0.3, shootingAccuracy: 0.65, shootingDamage: 5, closeCombatAccuracy: 0.6, closeCombatDamage: 5, pointCost: 180, maxCount: 3 },
    { name: "Speedster Drone", speed: 18, wounds: 4, armor: 0.1, shootingAccuracy: 0.75, shootingDamage: 3, closeCombatAccuracy: 0.2, closeCombatDamage: 0, pointCost: 90, maxCount: 8 },
    { name: "Flanking Trooper", speed: 11, wounds: 5, armor: 0.2, shootingAccuracy: 0.55, shootingDamage: 4, closeCombatAccuracy: 0.6, closeCombatDamage: 4, pointCost: 100, maxCount: 6 },
  ]
};

const ironcladDefenders: Codex = {
  name: "Ironclad Defenders",
  units: [
    { name: "Heavy Infantry", speed: 4, wounds: 12, armor: 0.5, shootingAccuracy: 0.4, shootingDamage: 4, closeCombatAccuracy: 0.6, closeCombatDamage: 7, pointCost: 220, maxCount: 6 },
    { name: "Shield Wall Unit", speed: 3, wounds: 14, armor: 0.6, shootingAccuracy: 0.3, shootingDamage: 2, closeCombatAccuracy: 0.7, closeCombatDamage: 8, pointCost: 250, maxCount: 4 },
    { name: "Armored Tank", speed: 5, wounds: 15, armor: 0.8, shootingAccuracy: 0.75, shootingDamage: 12, closeCombatAccuracy: 0.1, closeCombatDamage: 0, pointCost: 300, maxCount: 1 },
    { name: "Fortress Sentinel", speed: 2, wounds: 16, armor: 0.7, shootingAccuracy: 0.85, shootingDamage: 10, closeCombatAccuracy: 0.2, closeCombatDamage: 6, pointCost: 280, maxCount: 1 },
    { name: "Sniper Team", speed: 6, wounds: 5, armor: 0.2, shootingAccuracy: 0.9, shootingDamage: 5, closeCombatAccuracy: 0.3, closeCombatDamage: 4, pointCost: 150, maxCount: 4 },
  ]
};

const spaceMarines: Codex = {
  name: "Space Marines",
  units: [
    { name: "Tactical Marine", speed: 6, wounds: 1, armor: 0.3, shootingAccuracy: 0.7, shootingDamage: 2, closeCombatAccuracy: 0.5, closeCombatDamage: 3, pointCost: 15, maxCount: 10 },
    { name: "Assault Marine", speed: 7, wounds: 1, armor: 0.3, shootingAccuracy: 0.6, shootingDamage: 2, closeCombatAccuracy: 0.7, closeCombatDamage: 4, pointCost: 20, maxCount: 10 },
    { name: "Devastator Marine", speed: 5, wounds: 1, armor: 0.3, shootingAccuracy: 0.8, shootingDamage: 3, closeCombatAccuracy: 0.4, closeCombatDamage: 2, pointCost: 18, maxCount: 8 },
    { name: "Land Raider", speed: 5, wounds: 14, armor: 0.5, shootingAccuracy: 0.8, shootingDamage: 10, closeCombatAccuracy: 0.6, closeCombatDamage: 8, pointCost: 250, maxCount: 1 },
    { name: "Dreadnought", speed: 4, wounds: 8, armor: 0.4, shootingAccuracy: 0.7, shootingDamage: 5, closeCombatAccuracy: 0.5, closeCombatDamage: 6, pointCost: 150, maxCount: 2 },
    { name: "Raven Guard", speed: 8, wounds: 2, armor: 0.3, shootingAccuracy: 0.75, shootingDamage: 4, closeCombatAccuracy: 0.6, closeCombatDamage: 5, pointCost: 25, maxCount: 8 },
  ]
};

// Function to calculate the total efficiency of a given codex within a specified budget
function calculateTotalEfficiency(codex: Codex, budget: number): number {
  const selectedUnits = selectOptimalArmy(codex, budget);
  return selectedUnits.reduce((total, unit) => total + calculateEfficiency(unit), 0);
}

// Function to select the more efficient codex based on total efficiency
function selectMoreEfficientCodex(codexes: Codex[], budget: number): Codex {
  let bestCodex: Codex | null = null;
  let highestEfficiency = -Infinity;

  for (const codex of codexes) {
    const totalEfficiency = calculateTotalEfficiency(codex, budget);
    console.log(`Total Efficiency for ${codex.name}: ${totalEfficiency}`);

    if (totalEfficiency > highestEfficiency) {
      highestEfficiency = totalEfficiency;
      bestCodex = codex;
    }
  }

  return bestCodex!;
}
const codexes = [speedDemons, ironcladDefenders, spaceMarines];
const budget = 1000;

// Select an optimal army from the Speed Demons codex with a budget of 1000 points
const optimalArmy = selectOptimalArmy(speedDemons, budget);

console.log("Optimal Army Units:");
optimalArmy.forEach(unit => console.log(unit.name));

// Example usage

const mostEfficientCodex = selectMoreEfficientCodex(codexes, budget);

console.log(`Most Efficient Codex: ${mostEfficientCodex.name}`);

