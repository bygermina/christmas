import { useEffect, useMemo, useRef, useState } from 'react';

import { useElementDimensions } from '@/shared/lib/hooks/use-element-dimensions';
import { pathTree, paths, portraitPathTree, type TreePath } from '@/shared/lib/svg-paths';
import { getImageOffset, getScaledPath, createSvgArc, getLastPointFromSvgPath } from '@/shared/lib/svg';
import { useScreenSizeContext } from '@/shared/lib/providers/screen-size-context';

const TREE_GEOMETRY = {
  IMAGE_BASE_HEIGHT: 1115,
  IMAGE_ASPECT_RATIO: 1115 / 1116,
  DEFAULT_LETTER_TARGET_PART: 0.23,
  ARC_RADIUS: 250,
} as const;
import type { MainPath } from '../path-effects/types';

type Point = { x: number; y: number };

export const useTreeAnimation = (isContentReady: boolean) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const letterIRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const [targetPoint, setTargetPoint] = useState<Point | null>(null);

  const { isPortrait, screenWidth, screenHeight } = useScreenSizeContext();

  const imageDimensions = useElementDimensions(
    imageRef,
    TREE_GEOMETRY.IMAGE_BASE_HEIGHT,
    containerRef,
  );

  useEffect(() => {
    if (!isContentReady || isPortrait) return;

    const container = containerRef.current;
    const el = letterIRef.current;
    if (!container || !el) return;

    const raf = window.requestAnimationFrame(() => {
      const containerRect = container.getBoundingClientRect();
      const rect = el.getBoundingClientRect();

      setTargetPoint({
        x: rect.left - containerRect.left + rect.width * 0.5,
        y: rect.top - containerRect.top + rect.height * TREE_GEOMETRY.DEFAULT_LETTER_TARGET_PART,
      });
    });

    return () => window.cancelAnimationFrame(raf);
  }, [isContentReady, isPortrait, screenWidth, screenHeight]);

  const dx = getImageOffset(imageDimensions, TREE_GEOMETRY.IMAGE_ASPECT_RATIO);

  const mainPath = useMemo((): MainPath => {
    const basePath = isPortrait ? portraitPathTree : pathTree;
    const scaledPath = getScaledPath(imageDimensions, dx, basePath);
    const lastPoint = getLastPointFromSvgPath(scaledPath);

    const curve = !isPortrait && scaledPath && lastPoint && targetPoint
      ? createSvgArc(lastPoint.x, lastPoint.y, targetPoint.x, targetPoint.y, TREE_GEOMETRY.ARC_RADIUS)
      : '';

    return {
      ...basePath,
      path: scaledPath,
      fullPath: `${scaledPath}${curve}`,
    };
  }, [imageDimensions, dx, isPortrait, targetPoint]);

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
      (isPortrait || targetPoint !== null),
  };
};
