import React, { useEffect } from 'react';
import styles from './HistoryModal.module.css';
import type { HistoryEntry } from '../../types/aggregate';

interface HistoryModalProps {
    entry: HistoryEntry;
    onClose: () => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ entry, onClose }) => {
    const info = [
        {
            title: 'общие расходы в галактических кредитах',
            count: entry.totalSpendGalactic.toLocaleString(),
        },
        {
            title: 'количество обработанных записей',
            count: entry.rowsAffected.toString(),
        },
        {
            title: 'день года с минимальными расходами',
            count: entry.lessSpentDate,
        },
        {
            title: 'цивилизация с максимальными расходами',
            count: entry.bigSpentCiv,
        },
        {
            title: 'цивилизация с минимальными расходами',
            count: entry.lessSpentCiv,
        },
        {
            title: 'день года с максимальными расходами',
            count: entry.bigSpentDate,
        },
        {
            title: 'максимальная сумма расходов за день',
            count: entry.bigSpentValue.toLocaleString(),
        },
        {
            title: 'средние расходы в галактических кредитах',
            count: entry.averageSpendGalactic.toLocaleString(),
        },
    ];

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.container}>
                <button className={styles.cancelBtn} onClick={onClose}>
                    <img src="/icons/X.png" alt="X" />
                </button>
                <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                    {info.map((item, index) => (
                        <div key={index} className={styles.item}>
                            <h1 className={styles.count}>{item.count}</h1>
                            <h1 className={styles.title}>{item.title}</h1>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HistoryModal;
