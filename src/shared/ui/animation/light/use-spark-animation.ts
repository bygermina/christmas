import { useRef, useEffect } from 'react';

import type { Spark } from './light-follow.types';
import { updateSparkPhysics, isSparkAlive } from './light-follow.utils';
import { SPARK_CONFIG } from './light-follow.constants';

export const useSparkAnimation = (
  sparksRef: React.RefObject<Spark[]>,
  containerRef: React.RefObject<HTMLDivElement | null>,
  sparkClassName: string,
  isActive: boolean,
) => {
  const rafIdRef = useRef<number | null>(null);

  const updateSparksDOM = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const children = container.children;

    sparksRef.current.forEach((spark, index) => {
      const element = children[index] as HTMLDivElement;
      if (element) {
        element.style.transform = `translate(${spark.x}px, ${spark.y}px) translate(-50%, -50%)`;
        element.style.opacity = String(spark.life);
      }
    });

    while (children.length > sparksRef.current.length) {
      container.removeChild(children[children.length - 1]);
    }

    while (children.length < sparksRef.current.length) {
      const div = document.createElement('div');
      div.className = sparkClassName;
      div.style.transform = 'translate(0px, 0px) translate(-50%, -50%)';
      container.appendChild(div);
    }
  };

  const animate = () => {
    if (sparksRef.current.length === 0) {
      rafIdRef.current = null;
      return;
    }

    sparksRef.current = sparksRef.current
      .map(updateSparkPhysics)
      .filter(isSparkAlive);

    updateSparksDOM();

    if (sparksRef.current.length > 0) {
      rafIdRef.current = requestAnimationFrame(animate);
    } else {
      rafIdRef.current = null;
    }
  };

  const startAnimation = () => {
    if (rafIdRef.current === null && sparksRef.current.length > 0) {
      rafIdRef.current = requestAnimationFrame(animate);
    }
  };

  const addSpark = (spark: Spark) => {
    if (sparksRef.current.length >= SPARK_CONFIG.MAX_SPARKS) {
      sparksRef.current.shift();
    }
    sparksRef.current.push(spark);
    startAnimation();
  };

  useEffect(() => {
    if (!isActive) {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    }

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [isActive]);

  return { addSpark };
};

