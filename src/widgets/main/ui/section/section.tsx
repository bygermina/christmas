import { useState } from 'react';

import { useScreenSizeContext } from '@/shared/lib/providers/use-context';

import { TreeImage } from '../tree-section/tree-image';
import { Content } from '../content';
import { AnimatedPathEffects } from '../path-effects/animated-path-effects';
import { useTreeAnimation } from './use-tree-animation';

import styles from './section.module.scss';

export const Section = () => {
  const { screenWidth, screenHeight } = useScreenSizeContext();
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

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  return (
    <section ref={containerRef} className={styles.root}>
      <TreeImage ref={imageRef} onImageLoad={handleImageLoad} />
      
      <Content
        key={`${screenWidth}-${screenHeight}`}
        letterRef={letterIRef}
        onContentReady={setIsContentReady}
        isImageLoaded={isImageLoaded}
      />

      {isReady && isImageLoaded && (
        <AnimatedPathEffects
          key={`effects-${screenWidth}-${screenHeight}`}
          mainPath={mainPath}
          additionalPaths={additionalPaths}
        />
      )}
    </section>
  );
};
