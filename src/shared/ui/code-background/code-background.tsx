import styles from './code-background.module.scss';

import { codeLines } from './code-background.constants';

const getStableOpacity = ({
  columnIndex,
  lineIndex,
}: {
  columnIndex: number;
  lineIndex: number;
}) => {
  const value = ((columnIndex + 1) * 37 + (lineIndex + 1) * 17) % 100;
  return 0.22 + (value / 100) * 0.28; // 0.22..0.5
};

export const CodeBackground = () => {
  const columns = [0, 1, 2] as const;

  return (
    <div className={styles.root} aria-hidden="true" role="presentation">
      <div className={styles.container}>
        <div className={styles.grid}>
          {columns.map((columnIndex) => (
            <div key={`column-${columnIndex}`} className={styles.column}>
              {codeLines.map((line, lineIndex) => (
                <div
                  key={`column-${columnIndex}-line-${lineIndex}`}
                  className={styles.line}
                  style={{ opacity: getStableOpacity({ columnIndex, lineIndex }) }}
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
};


