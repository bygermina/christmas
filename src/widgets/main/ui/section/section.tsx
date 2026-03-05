import { useState, useCallback } from 'react';

import { TreeImage } from '../tree-section/tree-image';
import { Content } from '../content';
import { AnimatedPathEffects } from '../path-effects/animated-path-effects';
import { useTreeAnimation } from './use-tree-animation';

import styles from './section.module.scss';
import { getLayoutKey } from '@/shared/lib/layout-key';
import { useScreenSizeContext } from '@/shared/lib/providers/use-context';

export const Section = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isContentReady, setIsContentReady] = useState(false);

  const { screenWidth, screenHeight } = useScreenSizeContext();
  const animationCycleKey = getLayoutKey(screenWidth, screenHeight);

  const {
    imageRef,
    letterIRef,
    containerRef,
    mainPath,
    additionalPaths,
    isReady,
  } = useTreeAnimation(isContentReady);

  const handleImageLoad = useCallback(() => setIsImageLoaded(true), []);

  return (
    <section ref={containerRef} className={styles.root}>
      <TreeImage ref={imageRef} onImageLoad={handleImageLoad} />
      <Content
        letterRef={letterIRef}
        onContentReady={setIsContentReady}
        isImageLoaded={isImageLoaded}
        animationCycleKey={animationCycleKey}
      />
      {isReady && isImageLoaded && (
        <AnimatedPathEffects
          key={animationCycleKey}
          mainPath={mainPath}
          additionalPaths={additionalPaths}
        />
      )}
    </section>
  );
};
