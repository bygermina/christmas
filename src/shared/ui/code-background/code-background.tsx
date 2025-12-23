import styles from './code-background.module.scss';

import { codeLines } from './code-background.constants';

const COLUMNS = [0, 1, 2] as const;

const getStableOpacity = (columnIndex: number, lineIndex: number): number => {
  const value = ((columnIndex + 1) * 37 + (lineIndex + 1) * 17) % 100;
  return 0.22 + (value / 100) * 0.28;
};

const opacityGrid = COLUMNS.map((c) => codeLines.map((_, r) => getStableOpacity(c, r)));

export const CodeBackground = () => (
  <div className={styles.root} aria-hidden="true" role="presentation">
    <div className={styles.container}>
      <div className={styles.grid}>
        {COLUMNS.map((columnIndex) => (
          <div key={columnIndex} className={styles.column}>
            {codeLines.map((line, lineIndex) => (
              <div
                key={lineIndex}
                className={styles.line}
                style={{ opacity: opacityGrid[columnIndex][lineIndex] }}
              >
                {line || '\u00A0'}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);
