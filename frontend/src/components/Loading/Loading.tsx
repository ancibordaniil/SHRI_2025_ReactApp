import React from 'react';
import styles from './Loading.module.css';

const Loading: React.FC = () => (
  <div className={styles.container}>
    <div className={styles.loaderContainer}>
      <div className={styles.loader}></div>
    </div>
    <h1 className={styles.description}>идёт процесс генерации</h1>
  </div>
);

export default Loading;