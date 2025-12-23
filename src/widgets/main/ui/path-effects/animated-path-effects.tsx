import { useState } from 'react';

import { FireEffect } from '@/shared/ui/animation/light/fire-effect';
import { CSSPathMotion } from '@/shared/ui/animation/css-path-motion/css-path-motion';
import { useScreenSizeContext } from '@/shared/lib/providers/use-context';
import { BREAKPOINTS } from '@/shared/lib/breakpoints';

import { usePathData } from './use-path-data';
import { BASE_SPEED, SPEED_MULTIPLIERS } from './constants';
import type { PathEffectsProps } from './types';

interface StarWithColorChangeProps {
  path: string;
  delay: number;
  commonMotionProps: {
    speed: number;
    enableRotation: boolean;
  };
  containerRef: PathEffectsProps['containerRef'];
  onCompleteEvent?: string;
}

const StarWithColorChange = ({
  path,
  delay,
  commonMotionProps,
  containerRef,
  onCompleteEvent,
}: StarWithColorChangeProps) => {
  const [variant, setVariant] = useState<'white' | 'gold'>('white');

  const handleComplete = () => {
    setVariant('gold');
  };

  return (
    <CSSPathMotion
      {...commonMotionProps}
      path={path}
      delay={delay}
      containerRef={containerRef}
      onComplete={handleComplete}
      onCompleteEvent={onCompleteEvent}
    >
      <FireEffect variant={variant} />
    </CSSPathMotion>
  );
};

export const AnimatedPathEffects = (props: PathEffectsProps) => {
  const { containerRef, isContentReady } = props;
  const { scaledPathTree, scaledPaths, path } = usePathData(props);
  const { screenWidth, isMobile } = useScreenSizeContext();

  if (!scaledPathTree || !isContentReady) return null;

  const screenSpeedMultiplier = isMobile
    ? SPEED_MULTIPLIERS.MOBILE
    : screenWidth < BREAKPOINTS.TABLET
      ? SPEED_MULTIPLIERS.TABLET
      : SPEED_MULTIPLIERS.DESKTOP;

  const speed = BASE_SPEED * screenSpeedMultiplier;
  const commonMotionProps = {
    speed,
    enableRotation: true,
  };

  return (
    <>
      <StarWithColorChange
        path={path}
        delay={scaledPathTree.delay}
        commonMotionProps={commonMotionProps}
        containerRef={containerRef}
        onCompleteEvent="starAnimationComplete"
      />
      {scaledPaths?.map((p, index) => (
        <CSSPathMotion
          key={index}
          {...commonMotionProps}
          path={p.path}
          delay={p.delay}
          containerRef={containerRef}
        >
          <FireEffect variant="white" />
        </CSSPathMotion>
      ))}
    </>
  );
};
