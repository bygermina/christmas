import { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';

import { useScreenSizeContext } from '@/shared/lib/providers/use-context';
import { usePrefersReducedMotion } from '@/shared/lib/hooks/use-prefers-reduced-motion';

import styles from './particles.module.scss';

const PARTICLE_PADDING = 100;

interface Particle {
  id: number;
  initialX: number;
  initialY: number;
  targetX: number;
  targetY: number;
  duration: number;
}

const randomInViewport = (viewportSize: number): number =>
  Math.random() * (viewportSize + PARTICLE_PADDING * 2) - PARTICLE_PADDING;

export const Particles = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { isMobile, screenWidth, screenHeight } = useScreenSizeContext();

  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const count = isMobile ? 15 : 30;
    setParticles(
      Array.from({ length: count }, (_, id) => ({
        id,
        initialX: randomInViewport(screenWidth),
        initialY: randomInViewport(screenHeight),
        targetX: randomInViewport(screenWidth),
        targetY: randomInViewport(screenHeight),
        duration: Math.random() * 10 + 10,
      })),
    );
    // Particles are only regenerated when the mobile/desktop bucket flips —
    // resize within the same bucket keeps existing particle positions.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  if (prefersReducedMotion) return null;

  return (
    <div className={styles.container}>
      {particles.map((p) => (
        <ParticleItem key={p.id} {...p} />
      ))}
    </div>
  );
};

const ParticleItem = memo(({ initialX, initialY, targetX, targetY, duration }: Particle) => (
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
