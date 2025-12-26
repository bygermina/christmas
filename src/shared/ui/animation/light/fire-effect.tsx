import { useState, useMemo } from 'react';

import { colorWithOpacity } from '@/shared/lib/colors';
import { useScreenSizeContext } from '@/shared/lib/providers/use-context';
import { cn } from '@/shared/lib/cn';

import styles from './fire-effect.module.scss';
import {
  SCALE_CONFIG,
  ANIMATION_CONFIG,
  SIZE_CONFIG,
  BEAM_DIRECTIONS,
  FILTER_CONFIG,
  GRADIENT_OPACITY,
  GRADIENT_POSITIONS,
  COLORS,
  STANDARD_STOPS,
  DIAGONAL_STOPS,
} from './fire-effect.constants';

interface FireEffectProps {
  variant?: 'white' | 'gold';
  size?: number;
}

const createBeamGradient = (color: string, direction: number, stops: number[]) => {
  const gradientStops = stops
    .map((opacity, index) => {
      const position = (index / (stops.length - 1)) * 100;
      return `${colorWithOpacity(color, opacity)} ${position}%`;
    })
    .join(', ');
  return `linear-gradient(${direction}deg, transparent 0%, ${gradientStops}, transparent 100%)`;
};

const createRadialGradient = (stops: string[]) => `radial-gradient(circle, ${stops.join(', ')})`;

const createGradientStop = (color: string, opacity: number, position: number) =>
  `${colorWithOpacity(color, opacity)} ${position}%`;

const createCentralCircleStops = (isGold: boolean) => {
  if (isGold) {
    return [
      createGradientStop(COLORS.white, GRADIENT_OPACITY.FULL, GRADIENT_POSITIONS.START),
      createGradientStop(COLORS.white, GRADIENT_OPACITY.HIGH, GRADIENT_POSITIONS.EARLY),
      createGradientStop(COLORS.goldLight, GRADIENT_OPACITY.MEDIUM_LOW, GRADIENT_POSITIONS.MID),
      createGradientStop(COLORS.gold, GRADIENT_OPACITY.LOW_MEDIUM, GRADIENT_POSITIONS.CENTER),
      createGradientStop(COLORS.goldDark, GRADIENT_OPACITY.MINIMAL, GRADIENT_POSITIONS.LATE_MID),
      `transparent ${GRADIENT_POSITIONS.END}%`,
    ];
  }
  return [
    createGradientStop(COLORS.white, GRADIENT_OPACITY.FULL, GRADIENT_POSITIONS.START),
    createGradientStop(COLORS.white, GRADIENT_OPACITY.HIGH, GRADIENT_POSITIONS.EARLY),
    createGradientStop(COLORS.white, GRADIENT_OPACITY.MEDIUM, GRADIENT_POSITIONS.MID),
    createGradientStop(COLORS.white, GRADIENT_OPACITY.LOW, GRADIENT_POSITIONS.CENTER),
    createGradientStop(COLORS.white, GRADIENT_OPACITY.MINIMAL, GRADIENT_POSITIONS.LATE_MID),
    `transparent ${GRADIENT_POSITIONS.END}%`,
  ];
};

const createInnerCenterStops = (isGold: boolean) => {
  if (isGold) {
    return [
      createGradientStop(COLORS.white, GRADIENT_OPACITY.FULL, GRADIENT_POSITIONS.START),
      createGradientStop(COLORS.white, GRADIENT_OPACITY.MEDIUM_HIGH, GRADIENT_POSITIONS.MID_EARLY),
      createGradientStop(COLORS.goldLight, GRADIENT_OPACITY.LOW, GRADIENT_POSITIONS.MID_LATE),
      createGradientStop(COLORS.gold, GRADIENT_OPACITY.VERY_LOW, GRADIENT_POSITIONS.LATE),
      `transparent ${GRADIENT_POSITIONS.END}%`,
    ];
  }
  return [
    createGradientStop(COLORS.white, GRADIENT_OPACITY.FULL, GRADIENT_POSITIONS.START),
    createGradientStop(COLORS.white, GRADIENT_OPACITY.MEDIUM_HIGH, GRADIENT_POSITIONS.MID_EARLY),
    createGradientStop(COLORS.white, GRADIENT_OPACITY.MEDIUM_LOW, GRADIENT_POSITIONS.MID_LATE),
    createGradientStop(COLORS.white, GRADIENT_OPACITY.LOW_MEDIUM, GRADIENT_POSITIONS.LATE),
    `transparent ${GRADIENT_POSITIONS.END}%`,
  ];
};

const createContainerFilter = (isGold: boolean, dropShadow: number) => {
  const { BRIGHTNESS, DROP_SHADOW_MULTIPLIERS } = FILTER_CONFIG;
  const baseShadow = `brightness(${BRIGHTNESS}) drop-shadow(0 0 ${dropShadow * DROP_SHADOW_MULTIPLIERS.BASE}px ${COLORS.white})`;

  if (!isGold) {
    return `${baseShadow} drop-shadow(0 0 ${dropShadow * DROP_SHADOW_MULTIPLIERS.WHITE}px ${COLORS.white})`;
  }

  return `${baseShadow} drop-shadow(0 0 ${dropShadow * DROP_SHADOW_MULTIPLIERS.GOLD_LIGHT}px ${COLORS.goldLight}) drop-shadow(0 0 ${dropShadow * DROP_SHADOW_MULTIPLIERS.GOLD}px ${COLORS.gold})`;
};

const generateRandomDelay = () => Math.random() * ANIMATION_CONFIG.MAX_DELAY;

const generateRandomDuration = (base: number) =>
  base + Math.random() * ANIMATION_CONFIG.DURATION_VARIANCE;

export const FireEffect = ({ variant = 'white', size }: FireEffectProps) => {
  const { screenWidth } = useScreenSizeContext();
  const isGold = variant === 'gold';

  const scale = useMemo(() => {
    const baseScale = Math.max(
      SCALE_CONFIG.MIN,
      Math.min(SCALE_CONFIG.MAX, screenWidth / SCALE_CONFIG.BASE_WIDTH),
    );
    return baseScale * (size ?? 1);
  }, [screenWidth, size]);

  const animationDelays = useState(() => ({
    horizontal: generateRandomDelay(),
    vertical: generateRandomDelay(),
    diagonal45: generateRandomDelay(),
    diagonal135: generateRandomDelay(),
    centralCircle: generateRandomDelay(),
    innerCenter: generateRandomDelay(),
  }))[0];

  const animationDurations = useState(() => ({
    horizontal: generateRandomDuration(ANIMATION_CONFIG.DURATION_BASE.HORIZONTAL),
    vertical: generateRandomDuration(ANIMATION_CONFIG.DURATION_BASE.VERTICAL),
    diagonal45: generateRandomDuration(ANIMATION_CONFIG.DURATION_BASE.DIAGONAL_45),
    diagonal135: generateRandomDuration(ANIMATION_CONFIG.DURATION_BASE.DIAGONAL_135),
    centralCircle: generateRandomDuration(ANIMATION_CONFIG.DURATION_BASE.CENTRAL_CIRCLE),
    innerCenter: generateRandomDuration(ANIMATION_CONFIG.DURATION_BASE.INNER_CENTER),
  }))[0];

  const sizes = useMemo(
    () => ({
      container: SIZE_CONFIG.CONTAINER * scale,
      horizontalBeam: {
        height: SIZE_CONFIG.BEAM_HEIGHT * scale,
        width: SIZE_CONFIG.BEAM_WIDTH * scale,
      },
      verticalBeam: {
        height: SIZE_CONFIG.BEAM_WIDTH * scale,
        width: SIZE_CONFIG.BEAM_HEIGHT * scale,
      },
      diagonalBeam: {
        height: SIZE_CONFIG.BEAM_HEIGHT * scale,
        width: SIZE_CONFIG.DIAGONAL_BEAM_WIDTH * scale,
      },
      centralCircle: SIZE_CONFIG.CENTRAL_CIRCLE * scale,
      innerCenter: SIZE_CONFIG.INNER_CENTER * scale,
      dropShadow: SIZE_CONFIG.DROP_SHADOW * scale,
    }),
    [scale],
  );

  const beams = useMemo(
    () => [
      {
        className: styles.beamHorizontal,
        color: COLORS.white,
        direction: BEAM_DIRECTIONS.HORIZONTAL,
        stops: STANDARD_STOPS,
        size: sizes.horizontalBeam,
        delay: animationDelays.horizontal,
        duration: animationDurations.horizontal,
      },
      {
        className: styles.beamVertical,
        color: isGold ? COLORS.goldLight : COLORS.white,
        direction: BEAM_DIRECTIONS.VERTICAL,
        stops: STANDARD_STOPS,
        size: sizes.verticalBeam,
        delay: animationDelays.vertical,
        duration: animationDurations.vertical,
      },
      {
        className: styles.beamDiagonal45,
        color: COLORS.white,
        direction: BEAM_DIRECTIONS.HORIZONTAL,
        stops: DIAGONAL_STOPS,
        size: sizes.diagonalBeam,
        delay: animationDelays.diagonal45,
        duration: animationDurations.diagonal45,
      },
      {
        className: styles.beamDiagonal135,
        color: isGold ? COLORS.gold : COLORS.white,
        direction: BEAM_DIRECTIONS.HORIZONTAL,
        stops: DIAGONAL_STOPS,
        size: sizes.diagonalBeam,
        delay: animationDelays.diagonal135,
        duration: animationDurations.diagonal135,
      },
    ],
    [sizes, animationDelays, animationDurations, isGold],
  );

  const centralCircleStops = useMemo(() => createCentralCircleStops(isGold), [isGold]);
  const innerCenterStops = useMemo(() => createInnerCenterStops(isGold), [isGold]);

  return (
    <div
      className={styles.container}
      style={{
        width: sizes.container,
        height: sizes.container,
        filter: createContainerFilter(isGold, sizes.dropShadow),
      }}
    >
      {beams.map((beam, index) => (
        <div
          key={index}
          className={cn(styles.beam, beam.className)}
          style={{
            height: beam.size.height,
            width: beam.size.width,
            background: createBeamGradient(beam.color, beam.direction, beam.stops),
            animationDelay: `${beam.delay}s`,
            animationDuration: `${beam.duration}s`,
          }}
        />
      ))}

      <div
        className={styles.centralCircle}
        style={{
          height: sizes.centralCircle,
          width: sizes.centralCircle,
          background: createRadialGradient(centralCircleStops),
          animationDelay: `${animationDelays.centralCircle}s`,
          animationDuration: `${animationDurations.centralCircle}s`,
        }}
      />

      <div
        className={styles.innerCenter}
        style={{
          height: sizes.innerCenter,
          width: sizes.innerCenter,
          background: createRadialGradient(innerCenterStops),
          animationDelay: `${animationDelays.innerCenter}s`,
          animationDuration: `${animationDurations.innerCenter}s`,
        }}
      />
    </div>
  );
};
