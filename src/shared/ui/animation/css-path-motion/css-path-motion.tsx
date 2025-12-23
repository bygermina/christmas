import { useEffect, useRef, type ReactNode } from 'react';

import { getPathLength } from '@/shared/lib/svg';
import { useIntersectionObserver } from '@/shared/lib/hooks/use-intersection-observer';
import { usePrefersReducedMotion } from '@/shared/lib/hooks/use-prefers-reduced-motion';

import styles from './css-path-motion.module.scss';

const DEFAULT_DURATION = 3;
const MOTION_ANIMATION_NAME = 'css-path-motion-animation';

interface CSSPathMotionProps {
  path: string;
  children: ReactNode;
  delay?: number;
  enableRotation?: boolean;
  speed?: number;
  onComplete?: () => void;
}

export const CSSPathMotion = ({
  path,
  children,
  delay = 0,
  enableRotation = true,
  speed,
  onComplete,
}: CSSPathMotionProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const motionRef = useRef<HTMLDivElement>(null);
  const hasCompletedRef = useRef(false);

  const isVisible = useIntersectionObserver(motionRef);

  useEffect(() => {
    hasCompletedRef.current = false;
  }, [path, speed, delay]);

  useEffect(() => {
    if (!prefersReducedMotion || hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    onComplete?.();
  }, [prefersReducedMotion, onComplete]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const element = motionRef.current;
    if (!element) return;

    const length = speed && speed > 0 ? getPathLength(path) : 0;
    const duration = length > 0 && speed ? Math.max(0.001, length / speed) : DEFAULT_DURATION;

    element.style.setProperty('--animation-duration', `${duration}s`);
    element.style.setProperty('--animation-delay', `${delay}s`);
    element.style.setProperty('--animation-timing', 'linear');
    element.style.setProperty('--animation-iterations', '1');
    element.style.setProperty('--animation-direction', 'normal');

    const handleAnimationEnd = (event: AnimationEvent) => {
      if (!event.animationName.includes(MOTION_ANIMATION_NAME)) return;
      if (hasCompletedRef.current) return;
      hasCompletedRef.current = true;
      onComplete?.();
    };

    element.addEventListener('animationend', handleAnimationEnd);

    return () => element.removeEventListener('animationend', handleAnimationEnd);
  }, [path, speed, delay, onComplete, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const element = motionRef.current;
    if (!element) return;

    element.style.animationPlayState = isVisible ? 'running' : 'paused';
  }, [isVisible, prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <div className={styles.container}>
      <div
        ref={motionRef}
        className={enableRotation ? styles.motionWithRotation : styles.motion}
        style={{
          offsetPath: `path('${path}')`,
          offsetRotate: '0deg',
        }}
      >
        {children}
      </div>
    </div>
  );
};
