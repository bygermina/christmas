import type { Spark, Velocity } from './light-follow.types';
import { SPARK_CONFIG } from './light-follow.constants';

export const calculateSpeed = (velocity: Velocity): number => {
  return Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
};

export const createSpark = (x: number, y: number, id: number): Spark => {
  const angle = Math.random() * Math.PI * 2;
  const sparkSpeed =
    SPARK_CONFIG.MIN_SPARK_SPEED +
    Math.random() * (SPARK_CONFIG.MAX_SPARK_SPEED - SPARK_CONFIG.MIN_SPARK_SPEED);

  return {
    id,
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

export const isSparkAlive = (spark: Spark): boolean => spark.life > 0;

export const shouldCreateSpark = (speed: number): boolean => {
  return speed > SPARK_CONFIG.MIN_SPEED_FOR_SPARK && Math.random() > SPARK_CONFIG.SPARK_CHANCE;
};

