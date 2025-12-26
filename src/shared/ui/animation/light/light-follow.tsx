import { useEffect, useRef, useState } from 'react';

import { useScreenSizeContext } from '@/shared/lib/providers/use-context';

import { useMouseVelocity } from './use-mouse-velocity';
import { useSparkAnimation } from './use-spark-animation';
import { calculateSpeed, createSpark, shouldCreateSpark } from './light-follow.utils';
import type { Spark } from './light-follow.types';

import styles from './light-follow.module.scss';

export const LightFollowCursor = () => {
  const { isMobile } = useScreenSizeContext();
  const [isVisible, setIsVisible] = useState(false);

  const sparksRef = useRef<Spark[]>([]);
  const sparkIdRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { updateVelocity } = useMouseVelocity();
  const { addSpark } = useSparkAnimation(sparksRef, containerRef, styles.spark, !isMobile && isVisible);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);

      const velocity = updateVelocity(e.clientX, e.clientY);
      const speed = calculateSpeed(velocity);

      if (shouldCreateSpark(speed)) {
        const spark = createSpark(e.clientX, e.clientY, sparkIdRef.current++);
        addSpark(spark);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMobile, isVisible, updateVelocity, addSpark]);

  if (isMobile || !isVisible) return null;

  return <div ref={containerRef} className={styles.container} />;
};
