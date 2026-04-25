import { CodeText } from '@/shared/ui/typography';
import { cn } from '@/shared/lib/cn';
import { useScreenSizeContext } from '@/shared/lib/providers/screen-size-context';

import styles from './code-under-text.module.scss';

type CodeLine = { text: string; indent: number };

const celebrateLines: CodeLine[] = [
  { text: "const celebrate = () => {", indent: 0 },
  { text: "return 'Merry Christmas!';", indent: 1 },
  { text: "};", indent: 0 },
];

const wishLines: CodeLine[] = [
  { text: "const wish = {", indent: 0 },
  { text: "message: 'Happy New Year',", indent: 1 },
  { text: 'year: 2026', indent: 1 },
  { text: "};", indent: 0 },
];

const SHORT_MOBILE_HEIGHT_PX = 750;

const Lines = ({ lines, lineClassName }: { lines: CodeLine[]; lineClassName: string }) =>
  lines.map((line, index) => (
    <CodeText
      key={index}
      className={cn(styles.line, lineClassName)}
      style={{ paddingInlineStart: `${line.indent * 2}ch` }}
    >
      {line.text}
    </CodeText>
  ));

export const CodeUnderText = () => {
  const { isMobile, screenHeight } = useScreenSizeContext();

  const isShortMobile = isMobile && screenHeight < SHORT_MOBILE_HEIGHT_PX;

  return (
    <div className={styles.container}>
      <div className={styles.code}>
        <div className={styles.codeGroup}>
          <Lines 
            lines={celebrateLines}
            lineClassName={styles.celebrateLine}
          />
        </div>
        {!isShortMobile && (
          <div className={styles.codeGroup}>
            <Lines 
              lines={wishLines}
              lineClassName={styles.wishLine}
            />
          </div>
        )}
      </div>
    </div>
  );
};
