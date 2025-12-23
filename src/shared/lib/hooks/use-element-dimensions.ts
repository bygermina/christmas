import { useEffect, useState } from 'react';

export type Dimensions = {
  width: number;
  height: number;
  bottomLeft: { x: number; y: number };
  scale: number;
};

const defaultDimensions: Dimensions = {
  width: 0,
  height: 0,
  bottomLeft: { x: 0, y: 0 },
  scale: 0,
};

const getElementDimensions = (
  element: HTMLElement,
  baseHeight: number,
  container: HTMLElement,
): Dimensions => {
  const rect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  return {
    width: rect.width,
    height: rect.height,
    bottomLeft: {
      x: rect.left - containerRect.left,
      y: rect.bottom - containerRect.top,
    },
    scale: rect.height / baseHeight,
  };
};

const EPSILON = 0.9;

const areEqual = (a: number, b: number): boolean => Math.abs(a - b) <= EPSILON;

const areDimensionsEqual = (a: Dimensions, b: Dimensions): boolean =>
  areEqual(a.width, b.width) &&
  areEqual(a.height, b.height) &&
  areEqual(a.scale, b.scale) &&
  areEqual(a.bottomLeft.x, b.bottomLeft.x) &&
  areEqual(a.bottomLeft.y, b.bottomLeft.y);

export const useElementDimensions = (
  elementRef: React.RefObject<HTMLElement | null>,
  baseHeight: number,
  containerRef: React.RefObject<HTMLElement | null>,
) => {
  const [dimensions, setDimensions] = useState<Dimensions>(defaultDimensions);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let rafId: number | null = null;

    const update = () => {
      rafId = null;
      const container = containerRef.current;
      if (!container) return;
      const next = getElementDimensions(element, baseHeight, container);
      setDimensions((prev) => (areDimensionsEqual(prev, next) ? prev : next));
    };

    const schedule = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(update);
    };

    update();

    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(element);

    window.addEventListener('resize', schedule, { passive: true });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', schedule);
    };
  }, [baseHeight, elementRef, containerRef]);

  return dimensions;
};
