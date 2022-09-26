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
