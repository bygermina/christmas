import breakpoints from './breakpoints.json';

export interface BreakpointsMap {
  xs: number;
  sm: number;
  md: number;
  lg: number;
}

const BREAKPOINTS_MAP: BreakpointsMap = breakpoints;

export const BREAKPOINTS = {
  XS: BREAKPOINTS_MAP.xs,
  SM: BREAKPOINTS_MAP.sm,
  MD: BREAKPOINTS_MAP.md,
  LG: BREAKPOINTS_MAP.lg,
} as const;

