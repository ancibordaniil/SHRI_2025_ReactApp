import React, { useState } from 'react';
import styles from './HistoryList.module.css';
import { loadHistory, saveHistory } from '../../utils/historyStorage';
import type { HistoryEntry } from '../../types/aggregate';
import HistoryModal from '../HistoryModal/HistoryModal';
import { Link } from 'react-router-dom';

const HistoryList: React.FC = () => {
    const [history, setHistory] = useState<HistoryEntry[]>(loadHistory());
    const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);

    const handleRowClick = (entry: HistoryEntry) => {
        setSelectedEntry(entry);
    };

    const handleDeleteEntry = (id: string) => {
        const updatedHistory = history.filter((entry) => entry.id !== id);
        setHistory(updatedHistory);
        saveHistory(updatedHistory);
    };

    const handleCancelAll = () => {
        setHistory([]);
        saveHistory([]);
        setSelectedEntry(null);
    };

    return (
        <section className={styles.historyContainer}>
            <div className={styles.historyList}>
                {history.map((entry) => (
                    <div className={styles.rowContainer}>
                        <div
                            key={entry.id}
                            className={styles.historyItem}
                            onClick={() => handleRowClick(entry)}
                        >
                            <div className={styles.nameContainer}>
                                <img src="/icons/fileIcon.png" alt="fileIcon" />
                                <h1>{entry.fileName}</h1>
                            </div>
                            <h1 className={styles.date}>
                                {new Date(entry.generatedAt).toLocaleDateString('ru-RU')}
                            </h1>
                            <div
                                className={`${styles.successFlag} ${!entry.success ? styles.active : ''}`}
                            >
                                Обработан успешно
                                <img src="/icons/Smile.png" alt="Smile" />
                            </div>
                            <div
                                className={`${styles.successFlag} ${entry.success ? styles.active : ''}`}
                            >
                                Не удалось обработать
                                <img src="/icons/sadSmile.png" alt="sadSmile" />
                            </div>
                        </div>
                        <button
                            className={styles.deleteBtn}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteEntry(entry.id);
                            }}
                        >
                            <img src="/icons/Trash.png" alt="Trash" />
                        </button>
                    </div>
                ))}
            </div>
            <div className={styles.buttons}>
                <Link to="/generate" className={styles.processBtn}>
                    Сгенерировать больше
                </Link>
                <button className={styles.cancelBtn} onClick={handleCancelAll}>
                    Очистить все
                </button>
            </div>
            {selectedEntry && (
                    <HistoryModal entry={selectedEntry} onClose={() => setSelectedEntry(null)} />
            )}
        </section>
    );
};

export default HistoryList;
