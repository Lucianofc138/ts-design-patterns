export interface Enemy {
  speed: number;
  name: string;
}

export class Boo implements Enemy {
  speed = 2;
  name = "Boo";
  
}

export class Koopa implements Enemy {
  speed = 3;
  name = "Koopa";
}

export class Goomba implements Enemy {
  speed = 2;
  name = "Goomba";
}

export interface EnemyFactory {
  createEnemy(): Enemy;
}

/**
 * Creates enemies with evenly distributed probabilities between Boo,
 * Koopa and Goomba.
 */
export class BasicEnemyFactory implements EnemyFactory {
  createEnemy(): Enemy {
    const r: number = Math.random();
    return r < 1 / 3 ? new Boo() : r < 2 / 3 ? new Koopa() : new Goomba();
  }
}

/**
 * Creates enemies with specific probabilities for each enemy,
 * given an array of <EnemyGetterWithProbability>.
 */
export  class SpecificEnemyFactory implements EnemyFactory {
  constructor(
    readonly enemiesProbabilities: Array<EnemyGetterWithProbability>
  ) {}

  createEnemy(): Enemy {
    const total: number = this.enemiesProbabilities.reduce(
      (prev: number, curr: EnemyGetterWithProbability) => prev + curr.value,
      0
    );
    const accumulatedProbabilities: Array<EnemyGetterWithProbability> =
      this.enemiesProbabilities.reduce(
        (
          prev: Array<EnemyGetterWithProbability>,
          curr: EnemyGetterWithProbability
        ) => {
          const lastProbability: number = prev.at(-1)?.value || 0;
          const value: number = curr.value / total + lastProbability;
          return [...prev, { ...curr, value }];
        },
        []
      );
    const r: number = Math.random();
    const enemy: Enemy | null = accumulatedProbabilities.reduce(
      (prev: Enemy | null, curr: EnemyGetterWithProbability) => {
        if (!prev && curr.value > r && curr.getInstance) {
          return curr.getInstance();
        }
        return prev;
      },
      null
    );
    return enemy as Enemy;
  }
}

export interface EnemyGetterWithProbability {
  getInstance: () => Enemy;
  value: number;
}

if (require.main === module) {
  const ENEMY_GROUP_SIZE = 20;

  /*********************** Basic enemy factory example ***********************/

  const basicEnemyArray: Enemy[] = [];
  const basicEnemyFactory: EnemyFactory = new BasicEnemyFactory();
  for (let i = 0; i < ENEMY_GROUP_SIZE; i++) {
    const enemy: Enemy = basicEnemyFactory.createEnemy();
    basicEnemyArray.push(enemy);
  }
  console.log("-------------------------------------------------------------");
  console.log("BASIC ENEMY ARRAY WITH EVEN PROBABILITIES FOR EACH ENEMY TYPE");
  console.log(basicEnemyArray);

  /********************** Specific enemy factory example *********************/

  const specificEnemyArray: Enemy[] = [];
  const enemiesProbabilities: EnemyGetterWithProbability[] = [
    { getInstance: () => new Boo(), value: 1 },
    { getInstance: () => new Goomba(), value: 2 },
    { getInstance: () => new Koopa(), value: 2 },
  ];
  const specificEnemyFactory: SpecificEnemyFactory = new SpecificEnemyFactory(
    enemiesProbabilities
  );
  for (let i = 0; i < ENEMY_GROUP_SIZE; i++) {
    const enemy: Enemy = specificEnemyFactory.createEnemy();
    specificEnemyArray.push(enemy);
  }
  console.log("-------------------------------------------------------------");
  console.log(
    "SPECIFIC ENEMY ARRAY WITH PROBABILITY PROPORTIONS: ",
    enemiesProbabilities.map((x) => ({
      instance: x.getInstance(),
      value: x.value,
    }))
  );
  console.log(specificEnemyArray);
}
