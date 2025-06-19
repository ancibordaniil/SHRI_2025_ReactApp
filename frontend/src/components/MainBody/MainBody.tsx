import React, { useRef, useEffect } from 'react';
import styles from './MainBody.module.css';
import type { AggregateResponse } from '../../types/aggregate';
import { buildHistoryEntry } from '../../utils/aggregateHelpers';
import { useHistoryStore } from '../../store/historyStore';
import { useGenerateStore } from '../../store/store';
import Loading from '../Loading/Loading';
import { dayOfYearToDateString } from '../../utils/aggregateHelpers';
import { useLocation } from 'react-router-dom';

const MainBody: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const location = useLocation()

    const status = useGenerateStore((state) => state.status);
    const setStatus = useGenerateStore((state) => state.setStatus);

    const [fileName, setFileName] = React.useState<string | undefined>(undefined);
    const [isDragging, setIsDragging] = React.useState<boolean>(false);
    const [lastItem, setLastItem] = React.useState<AggregateResponse | string | null>(null);
    const [file, setFile] = React.useState<File | null>(null);
    const [inputKey, setInputKey] = React.useState(0);

    const isLoading = status === 'loading';
    const isActive = Boolean(fileName);

    const addHistory = useHistoryStore((state) => state.add);

    const isCsvFile = (file: File) => file.name.endsWith('.csv');

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile && isCsvFile(selectedFile)) {
            setFileName(selectedFile.name);
            setFile(selectedFile);
            setStatus('load');
            event.target.value = '';
        } else {
            alert('Пожалуйста, выберите CSV-файл');
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
        const droppedFile = event.dataTransfer.files[0];
        if (droppedFile && isCsvFile(droppedFile)) {
            setFileName(droppedFile.name);
            setFile(droppedFile);
            setStatus('load');
        } else {
            alert('Пожалуйста, выберите CSV-файл');
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleChangeFromDone = () => {
        setStatus('initial');
        setFileName(undefined);
        setFile(null);
        setLastItem(null)
        setInputKey((k) => k + 1);
    };

    const handleAggregate = async () => {
        if (!fileName || !file) return;

        setStatus('loading');
        setLastItem(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:3000/aggregate?rows=10000', {
                method: 'POST',
                body: formData,
                headers: {
                    Accept: 'application/json',
                },
            });

            const rawText = await response.text();
            console.log('Raw response:', rawText);

            let aggregateResp: AggregateResponse | null = null;

            try {
                const lines = rawText
                    .trim()
                    .split('\n')
                    .filter((line) => line.trim() !== '');
                aggregateResp =
                    lines.length > 0
                        ? (JSON.parse(lines[lines.length - 1]) as AggregateResponse)
                        : null;
            } catch (e) {
                console.warn('Не удалось распарсить JSON:', e);
                aggregateResp = null;
            }

            if (aggregateResp) {
                setLastItem(aggregateResp);
                addHistory(buildHistoryEntry(aggregateResp, fileName, true));
                setStatus('done');
            } else {
                console.log('[aggregateResp is null]', rawText);
                throw new Error('Не удалось разобрать ответ сервера');
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            setLastItem(`Ошибка запроса: ${message}`);
            setStatus('error');
            addHistory(
                buildHistoryEntry(
                    {
                        total_spend_galactic: 0,
                        rows_affected: 0,
                        less_spent_at: 0,
                        big_spent_at: 0,
                        less_spent_value: 0,
                        big_spent_value: 0,
                        average_spend_galactic: 0,
                        big_spent_civ: '',
                        less_spent_civ: '',
                    },
                    fileName,
                    false,
                ),
            );
        }
    };

    useEffect(() => {
        if (lastItem && typeof lastItem !== 'string') {
            setStatus('done');
        }
    }, [lastItem]);

    useEffect(() => {
        setStatus('initial')
    }, [location.pathname])

    return (
        <section className={styles.container}>
            <div className={styles.upperPartContainer}>
                <h1 className={styles.title}>
                    Загрузите <span>csv</span> файл и получите <span>полную информацию</span> о нём
                    за сверхнизкое время
                </h1>

                <div
                    className={`${styles.dropZone} ${isDragging ? styles.dragging : ''} ${fileName && status != 'initial' ? styles.changeBackgroundOuter : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div
                        className={`${styles.instructions} ${isDragging ? styles.dragging : ''} ${fileName && status != 'initial' ? styles.changeBackgroundInner : ''}`}
                    >
                        {status === 'initial' ? (
                            <>
                                <button
                                    className={styles.uploadFileBtn}
                                    onClick={handleUploadClick}
                                >
                                    Загрузить файл
                                </button>
                                или перетащите сюда
                            </>
                        ) : status === 'loading' ? (
                            <Loading description='идёт парсинг файла'/>
                        ) : status === 'load' ? (
                            <div className={styles.fileContainer}>
                                <div className={styles.buttons}>
                                    <div className={styles.text}>{fileName}</div>
                                    <button
                                        className={styles.cancelBtn}
                                        onClick={() => handleChangeFromDone()}
                                    >
                                        <img src="/icons/X.png" alt="X" />
                                    </button>
                                </div>
                                <h1 className={styles.description}>файл загружен!</h1>
                            </div>
                        ) : status === 'done' ? (
                            <div className={styles.fileContainer}>
                                <div className={styles.buttons}>
                                    <div className={`${styles.text} ${status === 'done' ? styles.greenBack : ''}`}>{fileName}</div>
                                    <button
                                        className={styles.cancelBtn}
                                        onClick={() => handleChangeFromDone()}
                                    >
                                        <img src="/icons/X.png" alt="X" />
                                    </button>
                                </div>
                                <h1 className={styles.description}>готово!</h1>
                            </div>
                        ) : status === 'error' ? (
                            <div className={styles.fileContainer}>
                                <div className={styles.buttons}>
                                    <div
                                        className={`${styles.text} ${status === 'error' ? styles.errText : ''}`}
                                    >
                                        {fileName}
                                    </div>
                                    <button
                                        className={styles.cancelBtn}
                                        onClick={() => handleChangeFromDone()}
                                    >
                                        <img src="/icons/X.png" alt="X" />
                                    </button>
                                </div>
                                <h1
                                    className={`${styles.description} ${status == 'error' ? styles.errorDescription : ''}`}
                                >
                                    упс, не то...
                                </h1>
                            </div>
                        ) : (
                            ''
                        )}
                    </div>
                    <input
                        key={inputKey}
                        type="file"
                        accept=".csv"
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />
                </div>

                {isActive && !isLoading && lastItem == null ? (
                    <button
                        className={`${styles.sendButton} ${styles.active}`}
                        onClick={handleAggregate}
                    >
                        Отправить
                    </button>
                ) : !isActive && !isLoading ? (
                    <div className={styles.sendButton}>Отправить</div>
                ) : ''}
            </div>
            <div className={styles.result}>
                {lastItem && typeof lastItem !== 'string' ? (
                    <div className={styles.gridContainer}>
                        {[
                            {
                                key: 'total_spend_galactic',
                                label: 'общие расходы в галактических кредитах',
                                value: Math.round(lastItem.total_spend_galactic).toLocaleString(),
                            },
                            {
                                key: 'rows_affected',
                                label: 'количество обработанных записей',
                                value: lastItem.rows_affected,
                            },
                            {
                                key: 'less_spent_date',
                                label: 'день года с минимальными расходами',
                                value: dayOfYearToDateString(lastItem.less_spent_at),
                            },
                            {
                                key: 'big_spent_civ',
                                label: 'цивилизация с максимальными расходами',
                                value: lastItem.big_spent_civ,
                            },
                            {
                                key: 'less_spent_civ',
                                label: 'цивилизация с минимальными расходами',
                                value: lastItem.less_spent_civ,
                            },
                            {
                                key: 'big_spent_date',
                                label: 'день года с максимальными расходами',
                                value: dayOfYearToDateString(lastItem.big_spent_at),
                            },
                            {
                                key: 'big_spent_value',
                                label: 'максимальная сумма расходов за день',
                                value: Math.round(lastItem.big_spent_value).toLocaleString(),
                            },
                            {
                                key: 'average_spend_galactic',
                                label: 'средние расходы в галактических кредитах',
                                value: Math.round(lastItem.average_spend_galactic).toLocaleString(),
                            },
                        ].map((item, index) => (
                            <div key={index} className={styles.gridItem}>
                                <h1>{item.value}</h1>
                                <p>{item.label}</p>
                            </div>
                        ))}
                    </div>
                ) : lastItem == null ? (
                    <>
                        Здесь
                        <br />
                        появятся результаты
                    </>
                ) : (
                    <pre className={styles.preResult}>{lastItem}</pre>
                )}
            </div>
        </section>
    );
};

export default MainBody;
