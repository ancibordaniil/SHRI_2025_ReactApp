import React, { useCallback } from 'react';
import { useGenerateStore } from '../../store/store';
import Loading from '../Loading/Loading';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import styles from './GenerateBody.module.css';

const GenerateBody: React.FC = () => {
  const { status, setStatus } = useGenerateStore();

  const handleClick = useCallback(async () => {
    setStatus('loading');
    try {
      const response = await fetch('http://localhost:3000/report?size=0.1&withErrors=off&maxSpend=1000', {
        method: 'GET',
        headers: {
          'Accept': 'text/csv, application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP err! Status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType?.includes('text/csv')) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'report.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        setStatus('done');
      } else if (contentType?.includes('application/json')) {
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setStatus('done');
      } else {
        throw new Error('content-type error');
      }
    } catch (error: unknown) {
      let errorMessage: string;
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else {
        errorMessage = 'Unknown error';
      }
      console.error('Error generating:', errorMessage);
      setStatus('error');
    }
  }, [setStatus]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Сгенерируйте готовый csv-файл нажатием одной кнопки</h1>
      {status === 'initial' && (
        <div className={styles.btnContainer}>
          <button onClick={handleClick} className={styles.startButton}>
            Начать генерацию
          </button>
        </div>
      )}
      {status === 'loading' && <Loading description='идёт процесс генерации'/>}
      {status === 'done' && (
        <div className={styles.btnContainer}>
          <div className={styles.buttons}>
            <div className={styles.doneButton}>Done</div>
            <button className={styles.cancelBtn} onClick={() => setStatus('initial')}>
              <img src="/icons/X.png" alt="X" />
            </button>
          </div>
          <h1 className={styles.description}>файл сгенерирован!</h1>
        </div>
      )}
      {status === 'error' && <ErrorMessage title='Ошибка' />}
    </div>
  );
};

export default GenerateBody;