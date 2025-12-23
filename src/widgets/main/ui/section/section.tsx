import { useState } from 'react';

import { useScreenSizeContext } from '@/shared/lib/providers/use-context';

import { AnimationOrchestratorProvider } from '../../model';
import { TreeImage } from '../tree-section';
import { Content } from '../content';
import { AnimatedPathEffects } from '../path-effects';
import { useTreeAnimation } from './use-tree-animation';

import styles from './section.module.scss';

const SectionInner = () => {
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

  return (
    <section ref={containerRef} className={styles.root}>
      <TreeImage ref={imageRef} onImageLoad={() => setIsImageLoaded(true)} />
      <Content
        letterRef={letterIRef}
        onContentReady={setIsContentReady}
        isImageLoaded={isImageLoaded}
      />
      {isReady && isImageLoaded && (
        <AnimatedPathEffects mainPath={mainPath} additionalPaths={additionalPaths} />
      )}
    </section>
  );
};

export const Section = () => {
  const { screenWidth, screenHeight } = useScreenSizeContext();

  return (
    <AnimationOrchestratorProvider key={`${screenWidth}-${screenHeight}`}>
      <SectionInner />
    </AnimationOrchestratorProvider>
  );
};
