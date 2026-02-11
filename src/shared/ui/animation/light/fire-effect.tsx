import { useMemo } from 'react';

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
  COLORS,
  STANDARD_STOPS,
  DIAGONAL_STOPS,
} from './fire-effect.constants';

type BeamId = 'horizontal' | 'vertical' | 'diagonal45' | 'diagonal135';

interface BeamBaseConfig {
  id: BeamId;
  className: string;
  direction: number;
  stops: number[];
  sizeKey: 'horizontalBeam' | 'verticalBeam' | 'diagonalBeam';
  getColor: (params: { isGold: boolean }) => string;
}

interface AnimationConfig {
  horizontal: number;
  vertical: number;
  diagonal45: number;
  diagonal135: number;
  centralCircle: number;
  innerCenter: number;
}

const BEAM_BASE_CONFIG: BeamBaseConfig[] = [
  {
    id: 'horizontal',
    className: styles.beamHorizontal,
    direction: BEAM_DIRECTIONS.HORIZONTAL,
    stops: STANDARD_STOPS,
    sizeKey: 'horizontalBeam',
    getColor: () => COLORS.white,
  },
  {
    id: 'vertical',
    className: styles.beamVertical,
    direction: BEAM_DIRECTIONS.VERTICAL,
    stops: STANDARD_STOPS,
    sizeKey: 'verticalBeam',
    getColor: ({ isGold }) => (isGold ? COLORS.goldLight : COLORS.white),
  },
  {
    id: 'diagonal45',
    className: styles.beamDiagonal45,
    direction: BEAM_DIRECTIONS.HORIZONTAL,
    stops: DIAGONAL_STOPS,
    sizeKey: 'diagonalBeam',
    getColor: () => COLORS.white,
  },
  {
    id: 'diagonal135',
    className: styles.beamDiagonal135,
    direction: BEAM_DIRECTIONS.HORIZONTAL,
    stops: DIAGONAL_STOPS,
    sizeKey: 'diagonalBeam',
    getColor: ({ isGold }) => (isGold ? COLORS.gold : COLORS.white),
  },
];

const createBeamGradient = (color: string, direction: number, stops: number[]) => {
  const gradientStops = stops
    .map((opacity, index) => {
      const position = (index / (stops.length - 1)) * 100;
      return `${colorWithOpacity(color, opacity)} ${position}%`;
    })
    .join(', ');
  return `linear-gradient(${direction}deg, transparent 0%, ${gradientStops}, transparent 100%)`;
};

interface FireEffectProps {
  variant?: 'white' | 'gold';
  size?: number;
}

const createContainerFilter = (isGold: boolean, dropShadow: number) => {
  const { BRIGHTNESS, DROP_SHADOW_MULTIPLIERS } = FILTER_CONFIG;
  const baseShadow = `brightness(${BRIGHTNESS}) drop-shadow(0 0 ${dropShadow * DROP_SHADOW_MULTIPLIERS.BASE}px ${COLORS.white})`;

  if (!isGold) {
    return `${baseShadow} drop-shadow(0 0 ${dropShadow * DROP_SHADOW_MULTIPLIERS.WHITE}px ${COLORS.white})`;
  }

  return `${baseShadow} drop-shadow(0 0 ${dropShadow * DROP_SHADOW_MULTIPLIERS.GOLD}px ${COLORS.gold})`;
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

  const animationDelays = useMemo(
    () =>
      ({
      horizontal: generateRandomDelay(),
      vertical: generateRandomDelay(),
      diagonal45: generateRandomDelay(),
      diagonal135: generateRandomDelay(),
      centralCircle: generateRandomDelay(),
      innerCenter: generateRandomDelay(),
      }) as AnimationConfig,
    [],
  );

  const animationDurations = useMemo(
    () =>
      ({
      horizontal: generateRandomDuration(ANIMATION_CONFIG.DURATION_BASE.HORIZONTAL),
      vertical: generateRandomDuration(ANIMATION_CONFIG.DURATION_BASE.VERTICAL),
      diagonal45: generateRandomDuration(ANIMATION_CONFIG.DURATION_BASE.DIAGONAL_45),
      diagonal135: generateRandomDuration(ANIMATION_CONFIG.DURATION_BASE.DIAGONAL_135),
      centralCircle: generateRandomDuration(ANIMATION_CONFIG.DURATION_BASE.CENTRAL_CIRCLE),
      innerCenter: generateRandomDuration(ANIMATION_CONFIG.DURATION_BASE.INNER_CENTER),
      }) as AnimationConfig,
    [],
  );

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
    () =>
      BEAM_BASE_CONFIG.map(baseConfig => ({
        id: baseConfig.id,
        className: baseConfig.className,
        color: baseConfig.getColor({ isGold }),
        direction: baseConfig.direction,
        stops: baseConfig.stops,
        size: sizes[baseConfig.sizeKey],
        delay: animationDelays[baseConfig.id],
        duration: animationDurations[baseConfig.id],
      })),
    [sizes, animationDelays, animationDurations, isGold],
  );

  return (
    <div
      className={cn(styles.container, isGold ? styles.variantGold : styles.variantWhite)}
      style={{
        width: sizes.container,
        height: sizes.container,
        filter: createContainerFilter(isGold, sizes.dropShadow),
      }}
    >
      {beams.map(beam => (
        <div
          key={beam.id}
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
          animationDelay: `${animationDelays.centralCircle}s`,
          animationDuration: `${animationDurations.centralCircle}s`,
        }}
      />

      <div
        className={styles.innerCenter}
        style={{
          height: sizes.innerCenter,
          width: sizes.innerCenter,
          animationDelay: `${animationDelays.innerCenter}s`,
          animationDuration: `${animationDurations.innerCenter}s`,
        }}
      />
    </div>
  );
};
