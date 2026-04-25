import { memo, useState } from 'react';

import { FireEffect } from '@/shared/ui/animation/light';
import { CSSPathMotion } from '@/shared/ui/animation/css-path-motion';
import { useScreenSizeContext } from '@/shared/lib/providers/screen-size-context';
import { BREAKPOINTS } from '@/shared/lib/breakpoints';

import type { TreePath } from '@/shared/lib/svg-paths';

import { useOrchestratorActions } from '../../model/animation-orchestrator-context';

const STAR_ANIMATION = {
  MAIN_PATH_SPEED: 300,
} as const;
import { BASE_SPEED, SPEED_MULTIPLIERS } from './constants';
import type { MainPath } from './types';

interface AnimatedPathEffectsProps {
  mainPath: MainPath;
  additionalPaths: TreePath[];
}

interface PathEffectProps {
  path: string;
  delay: number;
  speed: number;
  enableRotation: boolean;
  performanceMode?: boolean;
  variant?: 'white' | 'gold';
  onComplete?: () => void;
}

const PathFireEffect = ({
  variant = 'white',
  performanceMode = false,
  ...motion
}: PathEffectProps) => (
  <CSSPathMotion {...motion}>
    <FireEffect variant={variant} performanceMode={performanceMode} />
  </CSSPathMotion>
);

const StarWithColorChange = ({ onComplete, ...rest }: PathEffectProps) => {
  const [variant, setVariant] = useState<'white' | 'gold'>('white');

  return (
    <PathFireEffect
      {...rest}
      variant={variant}
      onComplete={() => {
        setVariant('gold');
        onComplete?.();
      }}
    />
  );
};

const AnimatedPathEffectsComponent = ({
  mainPath,
  additionalPaths,
}: AnimatedPathEffectsProps) => {
  const { screenWidth, isMobile } = useScreenSizeContext();
  const { notifyStarRevealed } = useOrchestratorActions();

  const speedMultiplier = isMobile
    ? SPEED_MULTIPLIERS.MOBILE
    : screenWidth < BREAKPOINTS.LG
      ? SPEED_MULTIPLIERS.TABLET
      : SPEED_MULTIPLIERS.DESKTOP;
  const speed = BASE_SPEED * speedMultiplier;
  const isPerformanceMode = isMobile || screenWidth < BREAKPOINTS.MD;

  return (
    <>
      <StarWithColorChange
        path={mainPath.fullPath}
        delay={mainPath.delay}
        speed={STAR_ANIMATION.MAIN_PATH_SPEED}
        enableRotation
        onComplete={notifyStarRevealed}
        performanceMode={isPerformanceMode}
      />
      {additionalPaths.map((p, index) => (
        <PathFireEffect
          key={index}
          path={p.path}
          delay={p.delay}
          speed={speed}
          enableRotation
          performanceMode
        />
      ))}
    </>
  );
};

export const AnimatedPathEffects = memo(AnimatedPathEffectsComponent);
