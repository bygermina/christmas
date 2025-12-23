import { memo, useEffect, type RefObject } from 'react';

import { TypeText } from '@/shared/ui/animation/text';
import { Typography } from '@/shared/ui/typography';
import { cn } from '@/shared/lib/cn';
import { whenFontsReady } from '@/shared/lib/fonts-ready';

import { TEXT_ANIMATION } from '../../config';
import { useOrchestratorActions, useOrchestratorState } from '../../model';
import { CodeUnderText } from './code-under-text';

import styles from './content.module.scss';

interface ContentProps {
  letterRef: RefObject<HTMLSpanElement | null>;
  onContentReady: (isReady: boolean) => void;
  isImageLoaded: boolean;
}

const ContentComponent = ({
  letterRef,
  onContentReady,
  isImageLoaded,
}: ContentProps) => {
  const { starRevealed, titleCompleted, subtitleCompleted } = useOrchestratorState();
  const { notifyTitleCompleted, notifySubtitleCompleted } = useOrchestratorActions();

  useEffect(() => {
    if (!isImageLoaded || !titleCompleted || !subtitleCompleted) return;

    let cancelled = false;

    void whenFontsReady().then(() => {
      if (!cancelled) onContentReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [onContentReady, isImageLoaded, titleCompleted, subtitleCompleted]);

  return (
    <div className={styles.container}>
      <Typography
        variant="h1-hero"
        className={cn(styles.heading, titleCompleted && subtitleCompleted && styles.headingReady)}
      >
        {isImageLoaded && (
          <>
            <TypeText
              text="Merry Christmas &"
              ref={letterRef}
              targetLetterIndex={TEXT_ANIMATION.TARGET_LETTER_INDEX}
              className={cn('glass-text-shine', styles.titleMain)}
              speed={TEXT_ANIMATION.TITLE_SPEED}
              delay={TEXT_ANIMATION.TITLE_DELAY}
              onComplete={notifyTitleCompleted}
            />

            <TypeText
              text="Happy new year"
              className={styles.titleSecondary}
              delay={TEXT_ANIMATION.SUBTITLE_DELAY}
              onComplete={notifySubtitleCompleted}
            />
          </>
        )}
      </Typography>
      <div
        className={subtitleCompleted ? styles.subtitleWrapperVisible : styles.subtitleWrapperHidden}
      >
        <Typography variant="subheading-responsive">
          Wishing you a magical year ahead
        </Typography>
      </div>
      <div className={styles.codeSlot}>
        <div className={starRevealed ? styles.codeUnderTextVisible : styles.codeUnderTextHidden}>
          <CodeUnderText />
        </div>
      </div>
    </div>
  );
};

export const Content = memo(ContentComponent);
