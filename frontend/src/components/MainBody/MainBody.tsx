import React, { useRef, useState } from 'react';
import styles from './MainBody.module.css';

const MainBody: React.FC = () => {
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const [isActive, setIsActive] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isCsvFile = (file: File) => file.name.endsWith('.csv');

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
        const files = event.dataTransfer.files;
        if (files.length > 0 && isCsvFile(files[0])) {
            setFileName(files[0].name);
            setIsActive(true);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && isCsvFile(file)) {
            setFileName(file.name);
            setIsActive(true);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleReturnChanges = () => {
        setIsActive(false)
        setFileName(null)
    }

    return (
        <section className={styles.container}>
            <div className={styles.upperPartContainer}>
                <h1 className={styles.title}>
                    Загрузите <span>csv</span> файл и получите <span>полную информацию</span> о нём
                    за сверхнизкое время
                </h1>

                <div
                    className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div className={`${styles.instructions} ${isDragging ? styles.dragging : ''}`}>
                        {fileName ? (
                            <div className={styles.fileName}>{fileName}</div>
                        ) : (
                            <>
                                <button className={styles.uploadFileBtn} onClick={handleUploadClick}>
                                    Загрузить файл
                                </button>
                                или перетащите сюда
                            </>
                        )}
                    </div>
                    <input
                        type="file"
                        accept=".csv"
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />
                </div>

                {isActive ? (
                    <button
                        className={`${styles.sendButton} ${isActive ? styles.active : ''}`}
                        onClick={() => setIsActive(false)}
                    >
                        Отправить
                    </button>
                ) : (
                    <div
                        className={styles.sendButton}
                        onClick={() => handleReturnChanges()}
                    >
                        Отправить
                    </div>
                )}
            </div>

            <div className={styles.result}>
                Здесь
                <br />
                появятся результаты
            </div>
        </section>
    );
};

export default MainBody;
