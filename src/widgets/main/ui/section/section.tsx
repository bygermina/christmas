import { useScreenSizeContext } from '@/shared/lib/providers/use-context';
import { useState } from 'react';

import { TreeImage } from '../tree-section/tree-image';
import { Content } from '../content';
import { AnimatedPathEffects } from '../path-effects/animated-path-effects';
import { useTreeAnimation } from './use-tree-animation';

import styles from './section.module.scss';

export const Section = () => {
  const { screenWidth, screenHeight } = useScreenSizeContext();
  const [isContentReady, setIsContentReady] = useState(false);

  const {
    imageRef,
    letterIRef,
    containerRef,
    mainPath,
    additionalPaths,
    isReady,
  } = useTreeAnimation(isContentReady);

  return (
    <section ref={containerRef} className={styles.root}>
      <TreeImage ref={imageRef} />
      
      <Content
        key={`${screenWidth}-${screenHeight}`}
        letterRef={letterIRef}
        onContentReady={setIsContentReady}
      />

      {isReady && (
        <AnimatedPathEffects
          key={`effects-${screenWidth}-${screenHeight}`}
          mainPath={mainPath}
          additionalPaths={additionalPaths}
        />
      )}
    </section>
  );
};
