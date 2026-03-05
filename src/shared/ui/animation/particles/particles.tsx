import { useState, useEffect, useRef, memo } from 'react';
import { motion } from 'framer-motion';

import { useScreenSizeContext } from '@/shared/lib/providers/use-context';
import { usePrefersReducedMotion } from '@/shared/lib/hooks/use-prefers-reduced-motion';

import styles from './particles.module.scss';

const PARTICLE_PADDING = 100;

const randomInViewport = (viewportSize: number): number =>
  Math.random() * (viewportSize + PARTICLE_PADDING * 2) - PARTICLE_PADDING;

const createParticles = (
  count: number,
  screenWidth: number,
  screenHeight: number,
) =>
  Array.from({ length: count }).map(() => ({
    initialX: randomInViewport(screenWidth),
    initialY: randomInViewport(screenHeight),
    targetX: randomInViewport(screenWidth),
    targetY: randomInViewport(screenHeight),
    duration: Math.random() * 10 + 10,
  }));

export const Particles = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { isMobile, screenWidth, screenHeight } = useScreenSizeContext();

  const particleCount = isMobile ? 15 : 30;
  const viewportSizeRef = useRef({ width: screenWidth, height: screenHeight });

  const [particles, setParticles] = useState<
    ReturnType<typeof createParticles>
  >([]);

  useEffect(() => {
    viewportSizeRef.current = { width: screenWidth, height: screenHeight };
  }, [screenWidth, screenHeight]);

  useEffect(() => {
    const { width, height } = viewportSizeRef.current;
    setParticles(createParticles(particleCount, width, height));
  }, [particleCount]);

  if (prefersReducedMotion) return null;

  return (
    <div className={styles.container}>
      {particles.map((p, i) => (
        <ParticleItem key={i} {...p} />
      ))}
    </div>
  );
};

const ParticleItem = memo(({ initialX, initialY, targetX, targetY, duration }: {
  initialX: number;
  initialY: number;
  targetX: number;
  targetY: number;
  duration: number;
}) => (
  <motion.div
    className={styles.particleWrapper}
    initial={{ x: initialX, y: initialY }}
    animate={{ x: targetX, y: targetY }}
    transition={{
      duration,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    }}
  >
    <div className={styles.particle} />
  </motion.div>
));

ParticleItem.displayName = 'ParticleItem';
