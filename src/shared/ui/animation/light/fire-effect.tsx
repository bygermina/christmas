import { type CSSProperties } from 'react';

import { colorWithOpacity } from '@/shared/lib/colors';
import { useScreenSizeContext } from '@/shared/lib/providers/use-context';
import { cn } from '@/shared/lib/cn';

import styles from './fire-effect.module.scss';

interface FireEffectProps {
  style?: CSSProperties;
  variant?: 'white' | 'gold';
}

const colors = {
  blue: 'var(--color-blue-400)',
  blueLight: 'var(--color-blue-300)',
  blueDark: 'var(--color-blue-500)',
  white: 'var(--color-white)',
  gold: '#FFC107',
  goldLight: '#FFD54F',
  goldDark: '#FF8F00',
};

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

const centralCircleStops = {
  white: [
    `${colorWithOpacity(colors.white, 1)} 0%`,
    `${colorWithOpacity(colors.white, 0.95)} 20%`,
    `${colorWithOpacity(colors.white, 0.7)} 35%`,
    `${colorWithOpacity(colors.white, 0.5)} 50%`,
    `${colorWithOpacity(colors.white, 0.3)} 65%`,
    'transparent 80%',
  ],
  gold: [
    `${colorWithOpacity(colors.white, 1)} 0%`,
    `${colorWithOpacity(colors.white, 0.95)} 20%`,
    `${colorWithOpacity(colors.goldLight, 0.6)} 35%`,
    `${colorWithOpacity(colors.gold, 0.4)} 50%`,
    `${colorWithOpacity(colors.goldDark, 0.3)} 65%`,
    'transparent 80%',
  ],
};

const innerCenterStops = {
  white: [
    `${colorWithOpacity(colors.white, 1)} 0%`,
    `${colorWithOpacity(colors.white, 0.9)} 30%`,
    `${colorWithOpacity(colors.white, 0.6)} 45%`,
    `${colorWithOpacity(colors.white, 0.4)} 60%`,
    'transparent 80%',
  ],
  gold: [
    `${colorWithOpacity(colors.white, 1)} 0%`,
    `${colorWithOpacity(colors.white, 0.9)} 30%`,
    `${colorWithOpacity(colors.goldLight, 0.5)} 45%`,
    `${colorWithOpacity(colors.gold, 0.35)} 60%`,
    'transparent 80%',
  ],
};

const createContainerFilter = (isGold: boolean, dropShadow: number) => {
  const baseShadow = `brightness(1.6) drop-shadow(0 0 ${dropShadow * 1.5}px ${colors.white})`;

  if (!isGold) return `${baseShadow} drop-shadow(0 0 ${dropShadow * 1}px ${colors.white})`;

  return `${baseShadow} drop-shadow(0 0 ${dropShadow * 1.2}px ${colors.goldLight}) drop-shadow(0 0 ${dropShadow * 0.8}px ${colors.gold})`;
};

const standardStops = [
  0.01, 0.02, 0.04, 0.08, 0.15, 0.3, 0.5, 0.7, 0.9, 1, 1, 0.9, 0.7, 0.5, 0.3, 0.15, 0.08,
  0.04, 0.02, 0.01,
];

const diagonalStops = [
  0.01, 0.02, 0.05, 0.1, 0.2, 0.4, 0.6, 0.8, 1, 1, 1, 0.8, 0.6, 0.4, 0.2, 0.1, 0.05,
  0.02, 0.01,
];

const pingDelay = Math.random() * 2;


export const FireEffect = ({ style, variant = 'white' }: FireEffectProps) => {
  const { screenWidth } = useScreenSizeContext();

  const scale = Math.max(0.9, Math.min(1.5, screenWidth / 500));

  const sizes = {
    container: 40 * scale,
    horizontalBeam: { height: 0.5 * scale, width: 48 * scale },
    verticalBeam: { height: 48 * scale, width: 0.5 * scale },
    diagonalBeam: { height: 0.5 * scale, width: 40 * scale },
    centralCircle: 12 * scale,
    innerCenter: 8 * scale,
    dropShadow: 12 * scale,
  };

  const isGold = variant === 'gold';

  const beams = [
    {
      className: styles.beamHorizontal,
      color: colors.white,
      direction: 90,
      stops: standardStops,
      size: sizes.horizontalBeam,
    },
    {
      className: styles.beamVertical,
      color: isGold ? colors.goldLight : colors.white,
      direction: 180,
      stops: standardStops,
      size: sizes.verticalBeam,
    },
    {
      className: styles.beamDiagonal45,
      color: colors.white,
      direction: 90,
      stops: diagonalStops,
      size: sizes.diagonalBeam,
    },
    {
      className: styles.beamDiagonal135,
      color: isGold ? colors.gold : colors.white,
      direction: 90,
      stops: diagonalStops,
      size: sizes.diagonalBeam,
    },
  ];

  return (
    <div
      className={styles.container}
      style={{
        width: sizes.container,
        height: sizes.container,
        filter: createContainerFilter(isGold, sizes.dropShadow),
        ...style,
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
          }}
        />
      ))}

      <div
        className={styles.centralCircle}
        style={{
          height: sizes.centralCircle,
          width: sizes.centralCircle,
          background: createRadialGradient(
            isGold ? centralCircleStops.gold : centralCircleStops.white,
          ),
          animationDelay: `${pingDelay}s`,
        }}
      />

      <div
        className={styles.innerCenter}
        style={{
          height: sizes.innerCenter,
          width: sizes.innerCenter,
          background: createRadialGradient(
            isGold ? innerCenterStops.gold : innerCenterStops.white,
          ),
        }}
      />
    </div>
  );
};
