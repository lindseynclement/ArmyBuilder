class Unit{
  name:string;
  speed:number;
  wounds:number;
  armor:number;
  shootingAcc:number;
  shootingDmg:number;
  combatAcc:number;
  combatDmg:number;
  cost:number;
  maxAllowed:number;

  
  constructor(name:string, speed:number, wounds:number, armor:number, shootingAcc:number, shootingDmg:number, combatAcc:number, combatDmg:number, cost:number, maxAllowed:number) {
    this.name = name;
    this.speed = speed;
    this.wounds = wounds;
    this.armor = armor;
    this.shootingAcc = shootingAcc;
    this.shootingDmg = shootingDmg;
    this.combatAcc = combatAcc;
    this.combatDmg = combatDmg;
    this.cost = cost;
    this.maxAllowed = maxAllowed || Infinity;
  }

// Calculate the effectiveness score 
  getEffectivenessScore() {
      return (this.speed + this.wounds + this.armor + this.shootingAcc + this.shootingDmg + this.combatAcc + this.combatDmg) / this.cost;
  }
}

function greedyAlgorithm(units:Unit[], pointBudget:number){
  let chosenUnits: Unit[] = [];
  let cost:number = 0;
  let count = 0;

  // Sort units by their effectiveness score (high to low)
  units.sort((a, b) => b.getEffectivenessScore() - a.getEffectivenessScore());

  //for each unit add as many as can as long as meets requirements for maxAllowed and pointBudget
  for(let unit of units){
    count = 0;
    while(count < unit.maxAllowed && cost + unit.cost <= pointBudget){
      chosenUnits.push(unit);
      cost += unit.cost;
      count++;
    }
  }
return chosenUnits;
}

function knapsackAlgorithm(units:Unit[], pointsBudget:number) {
  let len = units.length;
  let maxEfficencicy  = Array.from({ length: len + 1 }, () => Array(pointsBudget + 1).fill(0));
  let selections = Array.from({ length: len + 1 }, () => Array(pointsBudget + 1).fill([]));

  for (let i = 1; i <= len; i++) {
      for (let w = 1; w <= pointsBudget; w++) {
          let unit = units[i - 1];
          let unitCost = unit.cost;
          let unitEffectiveness = unit.getEffectivenessScore();

          if (unitCost <= w) {
              if (maxEfficencicy [i - 1][w - unitCost] + unitEffectiveness > maxEfficencicy [i - 1][w]) {
                maxEfficencicy [i][w] = maxEfficencicy [i - 1][w - unitCost] + unitEffectiveness;
                  selections[i][w] = [...selections[i - 1][w - unitCost], unit];
              } else {
                maxEfficencicy [i][w] = maxEfficencicy [i - 1][w];
                  selections[i][w] = selections[i - 1][w];
              }
          } else {
            maxEfficencicy [i][w] = maxEfficencicy [i - 1][w];
              selections[i][w] = selections[i - 1][w];
          }
      }
  }

  return selections[len][pointsBudget];
}





//test cases
let units = [
  new Unit("Infantry", 5, 3, 4, 2, 2, 4, 3, 10, 5),
  new Unit("Cavalry", 10, 5, 3, 5, 4, 2, 5, 20, 3),
  new Unit("Artillery", 3, 4, 2, 7, 6, 1, 1, 30, 2)
];
let budget = 50;
console.log(greedyAlgorithm(units, budget));
console.log(knapsackAlgorithm(units, budget));
