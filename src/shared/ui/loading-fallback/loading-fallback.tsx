import styles from './loading-fallback.module.scss';

export const LoadingFallback = () => {
  return (
    <div className={styles.container}>
      <div className={styles.text}>Loading...</div>
    </div>
  );
};

