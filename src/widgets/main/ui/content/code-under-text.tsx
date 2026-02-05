import { CodeText } from '@/shared/ui/typography/code-text';
import { useScreenSizeContext } from '@/shared/lib/providers/use-context';

import styles from './code-under-text.module.scss';

const celebrateLines = [
  "const celebrate = () => {",
  "                return 'Merry Christmas!';",
  "};",
  "",
];

const wishLines = [
  "const wish = {",
  "                message: 'Happy New Year',",
  "  year: 2026",
  "};",
  "",
];

const SHORT_MOBILE_HEIGHT_PX = 750;

export const CodeUnderText = () => {
  const { isMobile, screenHeight } = useScreenSizeContext();

  const isShortMobile = isMobile && screenHeight < SHORT_MOBILE_HEIGHT_PX;
  const lines = isShortMobile ? celebrateLines : [...celebrateLines, ...wishLines];

  return (
    <div className={styles.container}>
      <div className={styles.code}>
        {lines.map((line, index) => (
          <CodeText key={index} variant="gradient">
            {line || '\u00A0'}
          </CodeText>
        ))}
      </div>
    </div>
  );
};

