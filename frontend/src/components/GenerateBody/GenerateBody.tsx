import React from 'react';
import { useGenerateStore } from '../../store/store';
import Loading from '../Loading/Loading';
import Error from '../ErrorMessage/ErrorMessage';
import styles from './GenerateBody.module.css';

const GenerateBody: React.FC = () => {
  const { status, setStatus } = useGenerateStore();

  const handleClick = () => {
    setStatus('loading');
    setTimeout(() => {
      setStatus(Math.random() > 0.5 ? 'done' : 'error');
    }, 2000);
  };

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
      {status === 'loading' && <Loading />}
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
      {status === 'error' && <Error />}
    </div>
  );
};

export default GenerateBody;