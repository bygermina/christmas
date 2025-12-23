import { forwardRef } from 'react';

import { TextWithTargetLetter } from './displayed-text';

interface StaticTextProps {
  text: string;
  targetLetterIndex?: number;
  className?: string;
  delay?: number;
  speed?: number;
  opacity?: number;
  targetLetterClassName?: string; // Class name for the target letter
}

export const StaticText = forwardRef<HTMLSpanElement, StaticTextProps>(
  ({ text, targetLetterIndex, className = '', opacity = 100, targetLetterClassName }, ref) => {
    return (
      <div className={className}>
        <TextWithTargetLetter
          ref={ref}
          opacity={opacity}
          text={text}
          targetLetterIndex={targetLetterIndex}
          targetLetterClassName={targetLetterClassName}
        />
      </div>
    );
  },
);
