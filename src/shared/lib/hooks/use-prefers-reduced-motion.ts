import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

const subscribe = (callback: () => void) => {
  const mediaQuery = window.matchMedia(QUERY);
  mediaQuery.addEventListener('change', callback);
  
  return () => mediaQuery.removeEventListener('change', callback);
};

const getSnapshot = () => window.matchMedia(QUERY).matches;

export const usePrefersReducedMotion = (): boolean =>
  useSyncExternalStore(subscribe, getSnapshot);
