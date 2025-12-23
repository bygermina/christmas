import styles from './code-under-text.module.scss';

const codeLines = [
  "const celebrate = () => {",
  "                return 'Merry Christmas!';",
  "};",
  "",
  "const wish = {",
  "                message: 'Happy New Year',",
  "  year: 2026",
  "};",
  "",
];

export const CodeUnderText = () => {
  return (
    <div className={styles.container}>
      <div className={styles.code}>
        {codeLines.map((line, index) => (
          <div key={index} className={styles.line}>
            {line || '\u00A0'}
          </div>
        ))}
      </div>
    </div>
  );
};


