import { useState, useEffect } from 'react';

import { BREAKPOINTS } from '@/shared/lib/breakpoints';

interface ScreenSize {
  screenWidth: number;
  screenHeight: number;
  isPortrait: boolean;
  isMobile: boolean;
}

const readScreenSize = (): ScreenSize => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  return {
    screenWidth,
    screenHeight,
    isPortrait: screenHeight > screenWidth,
    isMobile: screenWidth < BREAKPOINTS.MD,
  };
};

const RESIZE_DEBOUNCE_MS = 100;

export const useScreenSize = (): ScreenSize => {
  const [size, setSize] = useState(readScreenSize);

  useEffect(() => {
    let timeoutId: number | undefined;

    const handleResize = () => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => setSize(readScreenSize()), RESIZE_DEBOUNCE_MS);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return size;
};
