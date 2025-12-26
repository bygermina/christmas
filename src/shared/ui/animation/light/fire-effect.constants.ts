export const SCALE_CONFIG = {
  MIN: 0.9,
  MAX: 1.5,
  BASE_WIDTH: 500,
} as const;

export const ANIMATION_CONFIG = {
  MAX_DELAY: 3,
  DURATION_BASE: {
    HORIZONTAL: 9,
    VERTICAL: 11,
    DIAGONAL_45: 12,
    DIAGONAL_135: 8,
    CENTRAL_CIRCLE: 5,
    INNER_CENTER: 13,
  },
  DURATION_VARIANCE: 4,
} as const;

export const SIZE_CONFIG = {
  CONTAINER: 40,
  BEAM_HEIGHT: 0.5,
  BEAM_WIDTH: 48,
  DIAGONAL_BEAM_WIDTH: 40,
  CENTRAL_CIRCLE: 12,
  INNER_CENTER: 8,
  DROP_SHADOW: 12,
} as const;

export const BEAM_DIRECTIONS = {
  HORIZONTAL: 90,
  VERTICAL: 180,
} as const;

export const FILTER_CONFIG = {
  BRIGHTNESS: 1.6,
  DROP_SHADOW_MULTIPLIERS: {
    BASE: 1.5,
    WHITE: 1,
    GOLD_LIGHT: 1.2,
    GOLD: 0.8,
  },
} as const;

export const GRADIENT_OPACITY = {
  FULL: 1,
  HIGH: 0.95,
  MEDIUM_HIGH: 0.9,
  MEDIUM: 0.7,
  MEDIUM_LOW: 0.6,
  LOW: 0.5,
  LOW_MEDIUM: 0.4,
  VERY_LOW: 0.35,
  MINIMAL: 0.3,
} as const;

export const GRADIENT_POSITIONS = {
  START: 0,
  EARLY: 20,
  MID_EARLY: 30,
  MID: 35,
  MID_LATE: 45,
  CENTER: 50,
  LATE: 60,
  LATE_MID: 65,
  END: 80,
  FULL: 100,
} as const;

export const COLORS = {
  blue: 'var(--color-blue-400)',
  blueLight: 'var(--color-blue-300)',
  blueDark: 'var(--color-blue-500)',
  white: 'var(--color-white)',
  gold: 'var(--color-gold-400)',
  goldLight: 'var(--color-gold-300)',
  goldDark: 'var(--color-gold-500)',
} as const;

export const STANDARD_STOPS = [
  0.01, 0.02, 0.04, 0.08, 0.15, 0.3, 0.5, 0.7, 0.9, 1, 1, 0.9, 0.7, 0.5, 0.3, 0.15, 0.08,
  0.04, 0.02, 0.01,
];

export const DIAGONAL_STOPS = [
  0.01, 0.02, 0.05, 0.1, 0.2, 0.4, 0.6, 0.8, 1, 1, 1, 0.8, 0.6, 0.4, 0.2, 0.1, 0.05,
  0.02, 0.01,
];

