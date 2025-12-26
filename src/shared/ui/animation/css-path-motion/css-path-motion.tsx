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
  speed?: number; //px/sec
  onCompleteEvent?: string;
  onComplete?: () => void;
}

const DEFAULT_DURATION = 3;

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

  const isVisible = useIntersectionObserver(motionRef, {
    threshold: 0,
    rootMargin: '0px',
  });

  useEffect(() => {
    const element = motionRef.current;
    if (!element) return;

    const length = getPathLength(path);
    const duration = speed ? getDurationFromSpeed(DEFAULT_DURATION, speed, length) : DEFAULT_DURATION;
    element.style.setProperty('--animation-duration', `${duration}s`);
    element.style.setProperty('--animation-delay', `${delay}s`);
    element.style.setProperty('--animation-timing', 'linear');
    element.style.setProperty('--animation-iterations', '1');
    element.style.setProperty('--animation-direction', 'normal');
    element.style.setProperty('--rotation-degrees', '1080deg');

    // Управляем состоянием анимации
    element.style.animationPlayState = isVisible ? 'running' : 'paused';

    // Таймер для события окончания
    const totalAnimationTime = (duration + delay) * 1000;
    const timer = setTimeout(() => {
      if (onCompleteEvent) {
        window.dispatchEvent(new CustomEvent(onCompleteEvent));
      }
      onComplete?.();
    }, totalAnimationTime);

    return () => clearTimeout(timer);
  }, [path, speed, delay, onCompleteEvent, onComplete, isVisible]);

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
