import { forwardRef } from 'react';

interface TextWithTargetLetterProps {
  text: string;
  targetLetterIndex?: number; // Index of the letter to create a reference
}

export const TextWithTargetLetter = forwardRef<HTMLSpanElement, TextWithTargetLetterProps>(
  ({ text, targetLetterIndex }, ref) => {
    if (
      targetLetterIndex === undefined ||
      targetLetterIndex < 0 ||
      targetLetterIndex >= text.length
    ) {
      return <span>{text}</span>;
    }

    const beforeTarget = text.slice(0, targetLetterIndex);
    const targetLetter = text[targetLetterIndex];
    const afterTarget = text.slice(targetLetterIndex + 1);

    return (
      <span>
        {beforeTarget}
        <span ref={ref}>{targetLetter}</span>
        {afterTarget}
      </span>
    );
  },
);
