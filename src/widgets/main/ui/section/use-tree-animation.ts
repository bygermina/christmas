import { useEffect, useMemo, useRef, useState } from 'react';

import { useElementDimensions } from '@/shared/lib/hooks/use-element-dimensions';
import { pathTree, paths } from '@/shared/lib/svg-paths';
import { getImageOffset, getScaledPath } from '@/shared/lib/svg';
import { createSvgArc, getLastPointFromSvgPath } from '@/shared/lib/svg';
import { useScreenSizeContext } from '@/shared/lib/providers/use-context';

import type { MainPath, TreePath } from '../path-effects/types';

const IMAGE_BASE_HEIGHT = 1115;
const IMAGE_BASE_WIDTH = 1116;
const IMAGE_ASPECT_RATIO = IMAGE_BASE_HEIGHT / IMAGE_BASE_WIDTH;
const IMAGE_CENTER_PART = 0.5;
const DEFAULT_LETTER_TARGET_PART = 0.23;
const ARC_RADIUS = 250;

export const useTreeAnimation = (
  isContentReady: boolean,
  letterTargetPart: number = DEFAULT_LETTER_TARGET_PART,
) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const letterIRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const [targetPoint, setTargetPoint] = useState<{ x: number; y: number } | null>(null);
  
  const { isPortrait } = useScreenSizeContext();

  const imageDimensions = useElementDimensions(
    imageRef,
    true,
    IMAGE_BASE_HEIGHT,
    IMAGE_CENTER_PART,
    containerRef,
  );

  const letterIDimensions = useElementDimensions(letterIRef, true, 0, letterTargetPart, containerRef);

  useEffect(() => {
    if (!isContentReady || isPortrait) return;

    const container = containerRef.current;
    const el = letterIRef.current;
    if (!container || !el) return;

    let raf = 0;

    raf = window.requestAnimationFrame(() => {
      const containerRect = container.getBoundingClientRect();
      const rect = el.getBoundingClientRect();

      setTargetPoint({
        x: rect.left - containerRect.left + rect.width * 0.5,
        y: rect.top - containerRect.top + rect.height * letterTargetPart,
      });
    });

    return () => {
      window.cancelAnimationFrame(raf);
    };
  }, [isContentReady, isPortrait, letterTargetPart]);

  const dx = getImageOffset(imageDimensions, IMAGE_ASPECT_RATIO);

  const mainPath = useMemo((): MainPath => {
    const scaledPath = getScaledPath(imageDimensions, dx, pathTree);
    
    let curve = '';
    if (!isPortrait && scaledPath) {
      const lastPoint = getLastPointFromSvgPath(scaledPath);
      const targetPosition = targetPoint ?? letterIDimensions.center;

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
  }, [imageDimensions, dx, letterIDimensions, isPortrait, targetPoint]);

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
    isReady:
      isContentReady &&
      mainPath.path !== '' &&
      (isPortrait || (targetPoint !== null && targetPoint.x !== 0 && targetPoint.y !== 0)),
  };
};

