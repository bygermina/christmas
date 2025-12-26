import type { Spark } from './light-follow.types';
import { SPARK_CONFIG } from './light-follow.constants';

export const createSpark = (x: number, y: number): Spark => {
  const angle = Math.random() * Math.PI * 2;
  const sparkSpeed =
    SPARK_CONFIG.MIN_SPARK_SPEED +
    Math.random() * (SPARK_CONFIG.MAX_SPARK_SPEED - SPARK_CONFIG.MIN_SPARK_SPEED);

  return {
    x,
    y,
    vx: Math.cos(angle) * sparkSpeed,
    vy: Math.sin(angle) * sparkSpeed,
    life: 1,
  };
};

export const updateSparkPhysics = (spark: Spark): Spark => ({
  ...spark,
  x: spark.x + spark.vx * SPARK_CONFIG.PHYSICS_STEP,
  y: spark.y + spark.vy * SPARK_CONFIG.PHYSICS_STEP,
  life: spark.life - SPARK_CONFIG.LIFE_DECAY,
});

