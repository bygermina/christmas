import { useEffect, useState, useCallback, type RefObject } from 'react';

import { TypeText } from '@/shared/ui/animation/text/type-text';
import { Typography } from '@/shared/ui/typography/typography';
import { cn } from '@/shared/lib/cn';
import { whenFontsReady } from '@/shared/lib/fonts-ready';
import { useEvent } from '@/shared/lib/hooks/use-event';

import { CodeUnderText } from './code-under-text';

import styles from './content.module.scss';
import typographyStyles from '@/shared/ui/typography/typography.module.scss';

const ANIMATION_CONFIG = {
  TITLE_SPEED: 0.1,
  TITLE_DELAY: 1.0,
  SUBTITLE_DELAY: 3.0,
  TARGET_LETTER_INDEX: 9,
} as const;

interface ContentProps {
  letterRef?: RefObject<HTMLSpanElement | null>;
  onContentReady?: (isReady: boolean) => void;
  isImageLoaded?: boolean;
}

export const Content = ({ letterRef, onContentReady, isImageLoaded = false }: ContentProps) => {
  const [isTextVisible, setIsTextVisible] = useState(false);
  const [isTitleComplete, setIsTitleComplete] = useState(false);
  const [isSubtitleComplete, setIsSubtitleComplete] = useState(false);

  const handleStarAnimationComplete = useCallback(() => {
    setIsTextVisible(true);
  }, []);

  useEvent('starAnimationComplete', handleStarAnimationComplete);

  useEffect(() => {
    if (!isImageLoaded || !isTitleComplete || !isSubtitleComplete) return;

    let cancelled = false;

    void whenFontsReady().then(() => {
      if (!cancelled) onContentReady?.(true);
    });

    return () => {
      cancelled = true;
      onContentReady?.(false);
    };
  }, [onContentReady, isImageLoaded, isTitleComplete, isSubtitleComplete]);

  return (
    <div className={styles.container}>
      <Typography
        variant="h1"
        className={cn(styles.heading, typographyStyles['typography-h1-hero'])}
      >
        {isImageLoaded && (
          <>
            <TypeText
              text="Merry Christmas &"
              ref={letterRef}
              targetLetterIndex={ANIMATION_CONFIG.TARGET_LETTER_INDEX}
              className={cn('glass-text-shine', styles.titleMain)}
              speed={ANIMATION_CONFIG.TITLE_SPEED}
              delay={ANIMATION_CONFIG.TITLE_DELAY}
              onComplete={() => setIsTitleComplete(true)}
            />

            <TypeText
              text="Happy new year"
              delay={ANIMATION_CONFIG.SUBTITLE_DELAY}
              onComplete={() => setIsSubtitleComplete(true)}
            />
          </>
        )}
      </Typography>
      <div className={cn(styles.subtitleWrapper, styles.subtitleWrapperAnimated)}>
        <Typography
          variant="subheading"
          className={typographyStyles['typography-subheading-responsive']}
          color="muted"
        >
          Wishing you a magical year ahead
        </Typography>
      </div>
      <div className={styles.codeSlot}>
        <div className={cn(!isTextVisible && styles.codeUnderTextHidden)}>
          <CodeUnderText />
        </div>
      </div>
    </div>
  );
};
