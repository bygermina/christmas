import { useRef, useMemo } from 'react';

import { useElementDimensions } from '@/shared/lib/hooks/use-element-dimensions';
import { pathTree, paths } from '@/shared/lib/svg-paths';
import { getImageOffset, getScaledPath } from '@/shared/lib/svg';
import { createSvgArc, getLastPointFromSvgPath } from '@/shared/lib/svg';
import { useScreenSizeContext } from '@/shared/lib/providers/use-context';

const IMAGE_BASE_HEIGHT = 1115;
const IMAGE_BASE_WIDTH = 1116;
const IMAGE_ASPECT_RATIO = IMAGE_BASE_HEIGHT / IMAGE_BASE_WIDTH;
const IMAGE_CENTER_PART = 0.5;
const LETTER_PART = 0.25;
const ARC_RADIUS = 250;

interface TreePath {
  path: string;
  start: { x: number; y: number };
  delay: number;
  duration: number;
  size?: number;
}

export const useTreeAnimation = (isContentReady: boolean) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const letterIRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  
  const { isPortrait } = useScreenSizeContext();

  const imageDimensions = useElementDimensions(
    imageRef,
    isContentReady,
    IMAGE_BASE_HEIGHT,
    IMAGE_CENTER_PART,
    containerRef,
  );

  const letterIDimensions = useElementDimensions(
    letterIRef,
    isContentReady,
    0,
    LETTER_PART,
  );

  const dx = getImageOffset(imageDimensions, IMAGE_ASPECT_RATIO);

  const mainPath = useMemo((): TreePath & { fullPath: string } => {
    const scaledPath = getScaledPath(imageDimensions, dx, pathTree);
    
    let curve = '';
    if (!isPortrait && scaledPath) {
      const lastPoint = getLastPointFromSvgPath(scaledPath);
      const targetPosition = letterIDimensions?.center;

      if (lastPoint && targetPosition && targetPosition.x !== 0 && targetPosition.y !== 0) {
        curve = createSvgArc(
          lastPoint.x,
          lastPoint.y,
          targetPosition.x,
          targetPosition.y,
          ARC_RADIUS,
        );
      }
    }

    return {
      ...pathTree,
      path: scaledPath,
      fullPath: `${scaledPath}${curve}`,
    };
  }, [imageDimensions, dx, letterIDimensions, isPortrait]);

  const additionalPaths = useMemo(
    (): TreePath[] =>
      paths.map((p) => ({
        ...p,
        path: getScaledPath(imageDimensions, dx, p),
      })),
    [imageDimensions, dx],
  );

  return {
    imageRef,
    letterIRef,
    containerRef,
    mainPath,
    additionalPaths,
    isReady: isContentReady && mainPath.path !== '',
  };
};

