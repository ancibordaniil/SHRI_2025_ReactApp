import React, { useState } from 'react';
import styles from './MainBody.module.css';

const MainBody: React.FC = () => {
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const [isActive, setIsActive] = useState<boolean>(false);

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
        setIsActive(true);
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            setFileName(files[0].name);
        }
    };

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
                        <button className={styles.uploadFileBtn}>Загрузить файл</button>
                        или перетащите сюда
                    </div>
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
                        onClick={() => setIsActive(false)}
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
