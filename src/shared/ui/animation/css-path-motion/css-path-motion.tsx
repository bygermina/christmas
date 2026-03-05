import { useEffect, useRef, type ReactNode } from 'react';

import { getPathLength } from '@/shared/lib/svg';
import { useIntersectionObserver } from '@/shared/lib/hooks/use-intersection-observer';

import styles from './css-path-motion.module.scss';

const getDurationFromSpeed = (fallbackSeconds: number, speed?: number, length?: number): number => {
  if (!speed || speed <= 0 || !length || length <= 0) return fallbackSeconds;

  return Math.max(0.001, length / speed);
};

interface CSSPathMotionProps {
  path: string;
  children: ReactNode;
  delay?: number;
  enableRotation?: boolean;
  speed?: number;
  onCompleteEvent?: string;
  onComplete?: () => void;
}

const DEFAULT_DURATION = 3;
const MOTION_ANIMATION_NAME = 'css-path-motion-animation';

export const CSSPathMotion = ({
  path,
  children,
  delay = 0,
  enableRotation = true,
  speed,
  onCompleteEvent,
  onComplete,
}: CSSPathMotionProps) => {
  const motionRef = useRef<HTMLDivElement>(null);
  const hasCompletedRef = useRef(false);

  const isVisible = useIntersectionObserver(motionRef, {
    threshold: 0,
    rootMargin: '0px',
  });

  useEffect(() => {
    const element = motionRef.current;
    if (!element) return;
    hasCompletedRef.current = false;

    const duration = speed
      ? getDurationFromSpeed(DEFAULT_DURATION, speed, getPathLength(path))
      : DEFAULT_DURATION;
    element.style.setProperty('--animation-duration', `${duration}s`);
    element.style.setProperty('--animation-delay', `${delay}s`);
    element.style.setProperty('--animation-timing', 'linear');
    element.style.setProperty('--animation-iterations', '1');
    element.style.setProperty('--animation-direction', 'normal');
    element.style.setProperty('--rotation-degrees', '1080deg');

    const handleAnimationEnd = (event: AnimationEvent) => {
      if (!event.animationName.includes(MOTION_ANIMATION_NAME)) return;
      if (hasCompletedRef.current) return;
      hasCompletedRef.current = true;

      if (onCompleteEvent) {
        window.dispatchEvent(new CustomEvent(onCompleteEvent));
      }
      onComplete?.();
    };

    element.addEventListener('animationend', handleAnimationEnd);

    return () => element.removeEventListener('animationend', handleAnimationEnd);
  }, [path, speed, delay, onCompleteEvent, onComplete]);

  useEffect(() => {
    const element = motionRef.current;
    if (!element) return;
    
    element.style.animationPlayState = isVisible ? 'running' : 'paused';
  }, [isVisible]);

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
