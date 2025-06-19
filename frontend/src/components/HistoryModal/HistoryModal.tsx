import React from 'react';
import styles from './HistoryModal.module.css';
import type { HistoryEntry } from '../../types/aggregate';

interface HistoryModalProps {
  entry: HistoryEntry;
  onClose: () => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ entry, onClose }) => {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>{entry.fileName}</h2>
        <p>Дата обработки: {new Date(entry.generatedAt).toLocaleString('ru-RU')}</p>
        <p>Общие расходы: {entry.totalSpendGalactic.toLocaleString()}</p>
        <p>Обработано записей: {entry.rowsAffected}</p>
        <p>День с минимальными расходами: {entry.lessSpentDate}</p>
        <p>Цивилизация с максимальными расходами: {entry.bigSpentCiv}</p>
        <p>Цивилизация с минимальными расходами: {entry.lessSpentCiv}</p>
        <p>День с максимальными расходами: {entry.bigSpentDate}</p>
        <p>Максимальная сумма расходов: {entry.bigSpentValue.toLocaleString()}</p>
        <p>Средние расходы: {entry.averageSpendGalactic.toLocaleString()}</p>
        <button className={styles.closeBtn} onClick={onClose}>
          Закрыть
        </button>
      </div>
    </div>
  );
};

export default HistoryModal;