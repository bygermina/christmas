import { memo } from 'react';

import styles from './code-background.module.scss';

import { codeLines } from './code-background.constants';

const COLUMN_COUNT = 3;

const getStableOpacity = (columnIndex: number, lineIndex: number): number => {
  const value = ((columnIndex + 1) * 37 + (lineIndex + 1) * 17) % 100;
  return 0.22 + (value / 100) * 0.28;
};

const opacityGrid = (() => {
  const grid: number[][] = [];
  for (let c = 0; c < COLUMN_COUNT; c++) {
    grid[c] = [];
    for (let r = 0; r < codeLines.length; r++) {
      grid[c][r] = getStableOpacity(c, r);
    }
  }
  return grid;
})();

const COLUMNS = [0, 1, 2] as const;

const CodeBackgroundComponent = () => (
  <div className={styles.root} aria-hidden="true" role="presentation">
    <div className={styles.container}>
      <div className={styles.grid}>
        {COLUMNS.map((columnIndex) => (
            <div key={`column-${columnIndex}`} className={styles.column}>
              {codeLines.map((line, lineIndex) => (
                <div
                  key={`column-${columnIndex}-line-${lineIndex}`}
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

export const CodeBackground = memo(CodeBackgroundComponent);


