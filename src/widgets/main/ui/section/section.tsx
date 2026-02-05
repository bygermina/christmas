import { useState, useCallback } from 'react';

import { useLayoutKey } from '@/shared/lib/hooks/use-layout-key';

import { TreeImage } from '../tree-section/tree-image';
import { Content } from '../content';
import { AnimatedPathEffects } from '../path-effects/animated-path-effects';
import { useTreeAnimation } from './use-tree-animation';

import styles from './section.module.scss';

export const Section = () => {
  const layoutKey = useLayoutKey();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isContentReady, setIsContentReady] = useState(false);

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
        key={layoutKey}
        letterRef={letterIRef}
        onContentReady={setIsContentReady}
        isImageLoaded={isImageLoaded}
      />
      {isReady && isImageLoaded && (
        <AnimatedPathEffects
          key={`effects-${layoutKey}`}
          mainPath={mainPath}
          additionalPaths={additionalPaths}
        />
      )}
    </section>
  );
};
