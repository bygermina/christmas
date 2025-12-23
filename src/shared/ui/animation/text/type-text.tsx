import { useEffect, useRef, useState, forwardRef } from 'react';

import { usePrefersReducedMotion } from '@/shared/lib/hooks/use-prefers-reduced-motion';

import styles from './type-text.module.scss';

interface TypeTextProps {
  text: string;
  targetLetterIndex?: number;
  className?: string;
  delay?: number;
  speed?: number;
  onComplete?: () => void;
}

export const TypeText = forwardRef<HTMLSpanElement, TypeTextProps>(
  ({ text, targetLetterIndex, className = '', delay = 0, speed = 0.1, onComplete }, ref) => {
    const prefersReducedMotion = usePrefersReducedMotion();
    const [charsTyped, setCharsTyped] = useState(prefersReducedMotion ? text.length : 0);
    const didCompleteRef = useRef(false);

    useEffect(() => {
      if (charsTyped >= text.length) return;

      const isFirstChar = charsTyped === 0;
      const timer = window.setTimeout(
        () => setCharsTyped((n) => n + 1),
        (isFirstChar ? delay : speed) * 1000,
      );

      return () => window.clearTimeout(timer);
    }, [charsTyped, text.length, delay, speed]);

    useEffect(() => {
      if (didCompleteRef.current || charsTyped < text.length) return;
      didCompleteRef.current = true;
      onComplete?.();
    }, [charsTyped, text.length, onComplete]);

    const displayed = text.slice(0, charsTyped);
    const targetIdx =
      targetLetterIndex !== undefined && targetLetterIndex < displayed.length
        ? targetLetterIndex
        : null;
    const isTyping = charsTyped > 0 && charsTyped < text.length;

    return (
      <div className={className}>
        {targetIdx !== null ? (
          <span>
            {displayed.slice(0, targetIdx)}
            <span ref={ref}>{displayed[targetIdx]}</span>
            {displayed.slice(targetIdx + 1)}
          </span>
        ) : (
          <span>{displayed}</span>
        )}
        {isTyping && <span className={styles.cursor} aria-hidden="true" />}
      </div>
    );
  },
);

TypeText.displayName = 'TypeText';
