import { useState, useEffect, useMemo } from 'react';

import { BREAKPOINTS } from '@/shared/lib/breakpoints';

export const useScreenSize = () => {
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1920,
  );
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);

  const isPortrait = screenHeight > screenWidth;
  const isSquare = isPortrait && screenHeight / screenWidth < 1.3;

  useEffect(() => {
    let timeoutId: number | undefined;

    const updateScreenSize = () => {
      if (typeof window === 'undefined') return;
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      setScreenWidth((prevWidth) => (newWidth !== prevWidth ? newWidth : prevWidth));
      setScreenHeight((prevHeight) => (newHeight !== prevHeight ? newHeight : prevHeight));
    };

    const handleResize = () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (typeof window !== 'undefined') {
        timeoutId = window.setTimeout(updateScreenSize, 100);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize, { passive: true });
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const deviceInfo = useMemo(
    () => ({
      isMobile: screenWidth < BREAKPOINTS.MOBILE,
      isTablet: screenWidth >= BREAKPOINTS.MOBILE && screenWidth < BREAKPOINTS.TABLET,
      isDesktop: screenWidth >= BREAKPOINTS.TABLET,
    }),
    [screenWidth],
  );

  const screenMode = isPortrait ? 'Portrait' : 'Landscape';
  const containerScreenMode = isSquare ? 'Square' : screenMode;

  return {
    screenWidth,
    screenHeight,
    isPortrait,
    screenMode,
    containerScreenMode,
    ...deviceInfo,
  };
};
