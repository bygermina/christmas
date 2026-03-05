import { useEffect, useRef, useState, forwardRef } from 'react';

import { motion } from 'framer-motion';

import { TextWithTargetLetter } from './displayed-text';

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
    const [currentIndex, setCurrentIndex] = useState(0);
    const didCompleteRef = useRef(false);
    const displayedText = text.slice(0, currentIndex);

    useEffect(() => {
      didCompleteRef.current = false;
      setCurrentIndex(0);
    }, [text]);

    useEffect(() => {
      if (currentIndex >= text.length) return;

      const timer = setTimeout(
        () => setCurrentIndex((prevIndex) => prevIndex + 1),
        currentIndex === 0 ? delay * 1000 : speed * 1000,
      );

      return () => clearTimeout(timer);
    }, [currentIndex, text.length, delay, speed]);

    useEffect(() => {
      if (didCompleteRef.current) return;
      if (currentIndex < text.length) return;
      didCompleteRef.current = true;
      onComplete?.();
    }, [currentIndex, text.length, onComplete]);

    return (
      <div className={className}>
        <TextWithTargetLetter
          ref={ref}
          text={displayedText}
          targetLetterIndex={targetLetterIndex}
        />
        {currentIndex < text.length && displayedText && (
          <motion.span
            className={styles.cursor}
            transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
          />
        )}
      </div>
    );
  },
);

TypeText.displayName = 'TypeText';
