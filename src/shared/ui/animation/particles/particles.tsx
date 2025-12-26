import { useMemo } from 'react';
import { motion } from 'framer-motion';

import { useScreenSizeContext } from '@/shared/lib/providers/use-context';

import styles from './particles.module.scss';

export const Particles = () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const { isMobile } = useScreenSizeContext();

  const particleCount = isMobile ? 15 : 30;

  const particles = useMemo(
    () =>
      Array.from({ length: particleCount }).map(() => ({
        initialX: Math.random() * 1200,
        initialY: Math.random() * 800,
        targetX: Math.random() * 1200,
        targetY: Math.random() * 800,
        duration: Math.random() * 10 + 10,
      })),
    [particleCount],
  );

  if (prefersReducedMotion) return null;

  return (
    <div className={styles.container}>
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className={styles.particle}
          initial={{ x: p.initialX, y: p.initialY }}
          animate={{ x: p.targetX, y: p.targetY }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};
