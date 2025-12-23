import { useEffect, useRef, useState } from 'react';

import { useScreenSizeContext } from '@/shared/lib/providers/use-context';
import { usePrefersReducedMotion } from '@/shared/lib/hooks/use-prefers-reduced-motion';

import { useMouseVelocity } from './use-mouse-velocity';
import { useSparkAnimation } from './use-spark-animation';
import { createSpark } from './light-follow.utils';
import { SPARK_CONFIG } from './light-follow.constants';
import type { Spark } from './light-follow.types';

import styles from './light-follow.module.scss';

export const LightFollowCursor = () => {
  const { isMobile } = useScreenSizeContext();
  const prefersReducedMotion = usePrefersReducedMotion();
  const isDisabled = isMobile || prefersReducedMotion;
  const [isVisible, setIsVisible] = useState(false);

  const sparksRef = useRef<Spark[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const { updateVelocity } = useMouseVelocity();
  const { addSpark } = useSparkAnimation(sparksRef, containerRef, styles.spark, !isDisabled && isVisible);

  useEffect(() => {
    if (isDisabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);

      const { x, y } = updateVelocity(e.clientX, e.clientY);
      const speed = Math.hypot(x, y);

      if (
        speed > SPARK_CONFIG.MIN_SPEED_FOR_SPARK &&
        Math.random() > SPARK_CONFIG.SPARK_SKIP_CHANCE
      ) {
        addSpark(createSpark(e.clientX, e.clientY));
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDisabled, isVisible, updateVelocity, addSpark]);

  if (isDisabled || !isVisible) return null;

  return <div ref={containerRef} className={styles.container} />;
};
