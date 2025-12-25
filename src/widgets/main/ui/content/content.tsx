import { useEffect, useState, useCallback, type RefObject } from 'react';

import { TypeText } from '@/shared/ui/animation/text/type-text';
import { Typography } from '@/shared/ui/typography/typography';
import { cn } from '@/shared/lib/cn';
import { useEvent } from '@/shared/lib/hooks/use-event';

import { CodeUnderText } from './code-under-text';

import styles from './content.module.scss';

const CONTENT_READY_DELAY = 5800;
const ANIMATION_CONFIG = {
  TITLE_SPEED: 0.1,
  TITLE_DELAY: 1.0,
  SUBTITLE_DELAY: 3.0,
  TARGET_LETTER_INDEX: 9,
} as const;

interface ContentProps {
  letterRef?: RefObject<HTMLSpanElement | null>;
  onContentReady?: (isReady: boolean) => void;
}

export const Content = ({ letterRef, onContentReady }: ContentProps) => {
  const [isTextVisible, setIsTextVisible] = useState(false);

  const handleStarAnimationComplete = useCallback(() => {
    setIsTextVisible(true);
  }, []);

  useEvent('starAnimationComplete', handleStarAnimationComplete);

  useEffect(() => {

    const timer = setTimeout(() => {
      onContentReady?.(true);
    }, CONTENT_READY_DELAY);

    return () => {
      clearTimeout(timer);
      onContentReady?.(false);
    };
  }, [onContentReady]);

  return (
    <div className={styles.container}>
      
      <Typography variant="h1" className={styles.heading}>
        <TypeText
          text="Merry Christmas &"
          ref={letterRef}
          targetLetterIndex={ANIMATION_CONFIG.TARGET_LETTER_INDEX}
          className={cn('glass-text-shine', styles.titleMain)}
          speed={ANIMATION_CONFIG.TITLE_SPEED}
          delay={ANIMATION_CONFIG.TITLE_DELAY}
        />

        <TypeText text="Happy new year" delay={ANIMATION_CONFIG.SUBTITLE_DELAY} />
      </Typography>
      <div className={cn(styles.subtitleWrapper, styles.subtitleWrapperAnimated)}>
        <Typography variant="subheading" className={styles.subheading} color="muted">
          Wishing you a magical year ahead
        </Typography>
      </div>
      {isTextVisible && <CodeUnderText />}
      
    </div>
  );
};
