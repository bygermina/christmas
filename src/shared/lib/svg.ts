import type { Dimensions } from '@/shared/lib/hooks/use-element-dimensions';

type Point = { x: number; y: number };

const NUM = String.raw`[+-]?\d+(?:\.\d+)?`;
const COORD = new RegExp(`(${NUM}),(${NUM})`, 'g');
const FIRST_MOVE = new RegExp(`M\\s*(${NUM})\\s*,\\s*(${NUM})`);

export const createSvgArc = (
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  height: number = 100,
) => {
  const midX = (startX + endX) / 2;
  const midY = Math.min(startY, endY) - height;

  return `M ${startX},${startY} Q ${midX},${midY} ${endX},${endY}`;
};

export const getLastPointFromSvgPath = (svgPath: string): Point | null => {
  const last = [...svgPath.matchAll(COORD)].at(-1);
  if (!last) return null;

  return { x: parseFloat(last[1]), y: parseFloat(last[2]) };
};

const scaleSvgPath = (svgPath: string, startPoint: Point, scale: number): string => {
  if (scale <= 0) return '';

  const firstMove = svgPath.match(FIRST_MOVE);
  if (!firstMove) return svgPath;

  const offsetX = startPoint.x - parseFloat(firstMove[1]) * scale;
  const offsetY = startPoint.y - parseFloat(firstMove[2]) * scale;

  return svgPath.replace(COORD, (_, x, y) => {
    const scaledX = parseFloat(x) * scale + offsetX;
    const scaledY = parseFloat(y) * scale + offsetY;

    return `${Math.round(scaledX)},${Math.round(scaledY)}`;
  });
};

export const getImageOffset = (elDimensions: Dimensions, originalRatio: number) => {
  const widthExpected = elDimensions.height / originalRatio;
  const overflowX = elDimensions.width - widthExpected;

  return overflowX < 0 ? overflowX / 2 : 0;
};

export const getScaledPath = (
  elDimensions: Dimensions,
  dx: number,
  svgPath: { start: Point; path: string },
) => {
  const { bottomLeft, scale } = elDimensions;
  const startPoint: Point = {
    x: bottomLeft.x + svgPath.start.x * scale + dx,
    y: bottomLeft.y - svgPath.start.y * scale,
  };

  return scaleSvgPath(svgPath.path, startPoint, scale);
};

export const getPathLength = (svgPath: string): number => {
  const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  pathEl.setAttribute('d', svgPath);

  return pathEl.getTotalLength();
};
