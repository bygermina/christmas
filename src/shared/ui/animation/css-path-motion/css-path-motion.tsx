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

export const CSSPathMotion = ({
  path,
  children,
  delay = 0,
  enableRotation = true,
  speed,
  onCompleteEvent,
  onComplete,
}: CSSPathMotionProps) => {
  const duration = 3;
  const motionRef = useRef<HTMLDivElement>(null);
  const computedDurationRef = useRef<number>(duration);

  const visibilityRef = motionRef;
  const isVisible = useIntersectionObserver(visibilityRef, {
    threshold: 0,
    rootMargin: '0px',
  });

  useEffect(() => {
    if (!speed || speed <= 0 || !path) {
      computedDurationRef.current = duration;
      return;
    }

    const length = getPathLength(path);
    computedDurationRef.current = getDurationFromSpeed(duration, speed, length);
  }, [path, speed, duration]);

  useEffect(() => {
    if (motionRef.current) {
      const seconds = computedDurationRef.current;
      motionRef.current.style.setProperty('--animation-duration', `${seconds}s`);
      motionRef.current.style.setProperty('--animation-delay', `${delay}s`);
      motionRef.current.style.setProperty('--animation-timing', 'linear');
      motionRef.current.style.setProperty('--animation-iterations', '1');
      motionRef.current.style.setProperty('--animation-direction', 'normal');
      motionRef.current.style.setProperty('--rotation-degrees', '1080deg');

      const totalAnimationTime = (seconds + delay) * 1000;

      const timer = setTimeout(() => {
        if (onCompleteEvent) {
          window.dispatchEvent(new CustomEvent(onCompleteEvent));
        }
        onComplete?.();
      }, totalAnimationTime);

      return () => clearTimeout(timer);
    }
  }, [
    duration,
    delay,
    path,
    speed,
    onCompleteEvent,
    onComplete,
  ]);

  useEffect(() => {
    if (motionRef.current) {
      motionRef.current.style.animationPlayState = isVisible ? 'running' : 'paused';
    }
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
