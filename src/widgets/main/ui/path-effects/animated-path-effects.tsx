import { useState, useMemo } from 'react';

import { FireEffect } from '@/shared/ui/animation/light/fire-effect';
import { CSSPathMotion } from '@/shared/ui/animation/css-path-motion/css-path-motion';
import { useScreenSizeContext } from '@/shared/lib/providers/use-context';
import { BREAKPOINTS } from '@/shared/lib/breakpoints';

import { BASE_SPEED, SPEED_MULTIPLIERS } from './constants';
import type { MainPath, PathEffectProps, TreePath } from './types';

interface AnimatedPathEffectsProps {
  mainPath: MainPath;
  additionalPaths: TreePath[];
}

interface StarWithColorChangeProps extends PathEffectProps {
  onCompleteEvent?: string;
}

const StarWithColorChange = ({
  path,
  delay,
  speed,
  enableRotation,
  onCompleteEvent,
  size,
}: StarWithColorChangeProps) => {
  const [variant, setVariant] = useState<'white' | 'gold'>('white');

  const handleComplete = () => {
    setVariant('gold');
  };

  return (
    <CSSPathMotion
      speed={speed}
      enableRotation={enableRotation}
      path={path}
      delay={delay}
      onComplete={handleComplete}
      onCompleteEvent={onCompleteEvent}
    >
      <FireEffect variant={variant} size={size} />
    </CSSPathMotion>
  );
};

const PathEffect = ({
  path,
  delay,
  speed,
  enableRotation,
  size,
}: PathEffectProps) => (
  <CSSPathMotion
    speed={speed}
    enableRotation={enableRotation}
    path={path}
    delay={delay}
  >
    <FireEffect variant="white" size={size} />
  </CSSPathMotion>
);

export const AnimatedPathEffects = ({
  mainPath,
  additionalPaths,
}: AnimatedPathEffectsProps) => {
  const { screenWidth, isMobile } = useScreenSizeContext();

  const speed = useMemo(() => {
    const screenSpeedMultiplier = isMobile
      ? SPEED_MULTIPLIERS.MOBILE
      : screenWidth < BREAKPOINTS.TABLET
        ? SPEED_MULTIPLIERS.TABLET
        : SPEED_MULTIPLIERS.DESKTOP;

    return BASE_SPEED * screenSpeedMultiplier;
  }, [isMobile, screenWidth]);

  return (
    <>
      <StarWithColorChange
        path={mainPath.fullPath}
        delay={mainPath.delay}
        speed={300}
        enableRotation
        onCompleteEvent="starAnimationComplete"
        size={mainPath.size}
      />
      {additionalPaths.map((p, index) => (
        <PathEffect
          key={index}
          path={p.path}
          delay={p.delay}
          speed={speed}
          enableRotation
          size={p.size}
        />
      ))}
    </>
  );
};
