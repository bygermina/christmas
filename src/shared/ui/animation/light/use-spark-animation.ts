import { useRef, useEffect, useCallback } from 'react';

import type { Spark } from './light-follow.types';
import { updateSparkPhysics } from './light-follow.utils';
import { SPARK_CONFIG } from './light-follow.constants';

export const useSparkAnimation = (
  sparksRef: React.RefObject<Spark[]>,
  containerRef: React.RefObject<HTMLDivElement | null>,
  sparkClassName: string,
) => {
  const rafIdRef = useRef<number | null>(null);
  const animateRef = useRef<(() => void) | null>(null);

  const updateSparksDOM = useCallback(() => {
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
  }, [containerRef, sparkClassName, sparksRef]);

  useEffect(() => {
    const animate = () => {
      sparksRef.current = sparksRef.current
        .map(updateSparkPhysics)
        .filter((spark) => spark.life > 0);

      updateSparksDOM();

      rafIdRef.current =
        sparksRef.current.length > 0 ? requestAnimationFrame(animate) : null;
    };

    animateRef.current = animate;
  }, [sparksRef, updateSparksDOM]);

  const addSpark = useCallback(
    (spark: Spark) => {
      if (sparksRef.current.length >= SPARK_CONFIG.MAX_SPARKS) {
        sparksRef.current.shift();
      }
      sparksRef.current.push(spark);

      if (rafIdRef.current === null && animateRef.current) {
        rafIdRef.current = requestAnimationFrame(animateRef.current);
      }
    },
    [sparksRef],
  );

  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, []);

  return { addSpark };
};
