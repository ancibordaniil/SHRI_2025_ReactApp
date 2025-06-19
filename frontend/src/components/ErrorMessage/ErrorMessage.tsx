import React from 'react';
import styles from './ErrorMessage.module.css';
import { useGenerateStore } from '../../store/store';

interface ErrorProps {
  title?: string;
}

const ErrorMessage: React.FC<ErrorProps> = ({ title }) => {
  const setStatus = useGenerateStore((state) => state.setStatus);

  return (
    <div className={styles.container}>
      <div className={styles.buttons}>
        <div className={styles.errButton}>{ title }</div>
        <button
          className={styles.cancelBtn}
          onClick={() => setStatus('initial')}
        >
          <img src="/icons/X.png" alt="X" />
        </button>
      </div>
      <h1 className={styles.errorDescription}>упс, не то...</h1>
    </div>
  );
};

export default ErrorMessage;
