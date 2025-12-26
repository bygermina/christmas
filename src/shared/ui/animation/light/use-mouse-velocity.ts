import { useRef, useCallback } from 'react';

import type { Velocity } from './light-follow.types';

export const useMouseVelocity = () => {
  const lastTimeRef = useRef(0);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef<Velocity>({ x: 0, y: 0 });

  const updateVelocity = useCallback((x: number, y: number) => {
    const now = Date.now();
    const dt = (now - lastTimeRef.current) / 1000;

    if (dt > 0) {
      const vx = (x - lastPosRef.current.x) / dt;
      const vy = (y - lastPosRef.current.y) / dt;
      velocityRef.current = { x: vx, y: vy };
    }

    lastPosRef.current = { x, y };
    lastTimeRef.current = now;

    return velocityRef.current;
  }, []);

  const getVelocity = useCallback(() => velocityRef.current, []);

  return { updateVelocity, getVelocity };
};

