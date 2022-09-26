import {
  Enemy,
  Boo,
  Koopa,
  Goomba,
  EnemyFactory,
  BasicEnemyFactory,
  SpecificEnemyFactory,
  EnemyGetterWithProbability,
} from "./1-enemy-factory-example";

test("BasicEnemyFactory to create Boo, Koopa and Goomba evenly.", () => {
  const TOTAL_ENEMIES = 100_000;
  const EXPECTED_GROUP_ENEMIES = TOTAL_ENEMIES / 3;
  const MAX_ERROR: number = EXPECTED_GROUP_ENEMIES * 0.01;
  const basicEnemyArray: Enemy[] = [];
  const basicEnemyFactory: EnemyFactory = new BasicEnemyFactory();
  for (let i = 0; i < TOTAL_ENEMIES; i++) {
    const enemy: Enemy = basicEnemyFactory.createEnemy();
    basicEnemyArray.push(enemy);
  }
  const enemiesCount: Record<string, number> = {
    Boo: 0,
    Koopa: 0,
    Goomba: 0,
  };
  basicEnemyArray.forEach((enemy) => {
    const enemyName: string | undefined =
      enemy instanceof Boo
        ? "Boo"
        : enemy instanceof Koopa
        ? "Koopa"
        : enemy instanceof Goomba
        ? "Goomba"
        : undefined;
    if (!enemyName) {
      return;
    }
    enemiesCount[enemyName]++;
  });
  Object.values(enemiesCount).forEach((count) => {
    const error: number = Math.abs(count - EXPECTED_GROUP_ENEMIES);
    expect(error).toBeLessThan(MAX_ERROR);
  });
  expect(true).toBe(true);
});

describe("SpecificEnemyFactory with only 1 type of Enemy to create only that kind of Enemy", () => {
  const testSingleEnemyFactory = (
    getInstance: () => Enemy,
    check: (enemy: Enemy) => boolean
  ) => {
    const TOTAL_ENEMIES = 100_000;
    const specificEnemyFactory: SpecificEnemyFactory = new SpecificEnemyFactory(
      [{ getInstance, value: 1 }]
    );
    for (let i = 0; i < TOTAL_ENEMIES; i++) {
      const enemy: Enemy = specificEnemyFactory.createEnemy();
      expect(check(enemy)).toBe(true);
    }
  };

  it("Boo", () => {
    testSingleEnemyFactory(
      () => new Boo(),
      (e: Enemy) => e instanceof Boo
    );
  });

  it("Koopa", () => {
    testSingleEnemyFactory(
      () => new Koopa(),
      (e: Enemy) => e instanceof Koopa
    );
  });

  it("Goomba", () => {
    testSingleEnemyFactory(
      () => new Goomba(),
      (e: Enemy) => e instanceof Goomba
    );
  });
});

describe("SpecificEnemyFactory to Boo, Koopa and Goomba with the specified probability ratios", () => {
  const TOTAL_ENEMIES = 100_000;

  const testSpecificEnemyFactoryByRatios = (
    ratios: EnemyGetterWithProbability[]
  ) => {
    const enemiesRatiosSum: number = ratios.reduce((prev, el) => {
      return prev + el.value;
    }, 0);

    const expectedEnemiesAmount: Record<string, number> = {};
    ratios.forEach((el) => {
      const enemyName: string = el.getInstance().name;
      expectedEnemiesAmount[enemyName] =
        (TOTAL_ENEMIES * el.value) / enemiesRatiosSum;
    });

    const enemiesCount: Record<string, number> = {
      Boo: 0,
      Koopa: 0,
      Goomba: 0,
    };
    const specificEnemyFactory: SpecificEnemyFactory = new SpecificEnemyFactory(
      ratios
    );
    for (let i = 0; i < TOTAL_ENEMIES; i++) {
      const enemy: Enemy = specificEnemyFactory.createEnemy();
      const enemyName: string | undefined =
        enemy instanceof Boo
          ? "Boo"
          : enemy instanceof Koopa
          ? "Koopa"
          : enemy instanceof Goomba
          ? "Goomba"
          : undefined;
      if (!enemyName) {
        return;
      }
      enemiesCount[enemyName]++;
    }

    Object.entries(enemiesCount).forEach(([enemyName, enemyCount]) => {
      const maxError: number = expectedEnemiesAmount[enemyName] * 0.02;
      const error: number = Math.abs(
        enemyCount - expectedEnemiesAmount[enemyName]
      );
      // console.log({enemyName, maxError, error});
      expect(error).toBeLessThan(maxError);
    });
  };
  const ratiosArray: Record<string, number>[] = [
    { Boo: 1, Koopa: 2, Goomba: 2 },
    { Boo: 5, Koopa: 3, Goomba: 2 },
    { Boo: 8, Koopa: 1, Goomba: 4 },
    { Boo: 3, Koopa: 4, Goomba: 6 },
    { Boo: 7, Koopa: 5, Goomba: 1 },
  ];
  const getters: Record<string, () => Enemy> = {
    Boo: () => new Boo(),
    Koopa: () => new Koopa(),
    Goomba: () => new Goomba(),
  };
  ratiosArray.forEach((ratios, idx) => {
    // console.log(`testing group number ${idx}`)
    const enemiesProbabilities: EnemyGetterWithProbability[] = [];
    Object.entries(ratios).forEach(([name, ratio]) => {
      enemiesProbabilities.push({ getInstance: getters[name], value: ratio });
    });
    testSpecificEnemyFactoryByRatios(enemiesProbabilities);
  });
});
