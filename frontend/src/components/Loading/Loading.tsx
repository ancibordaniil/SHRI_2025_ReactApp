import React from 'react';
import styles from './Loading.module.css';

interface LoadingProps {
    description?: string;
}

const Loading: React.FC<LoadingProps> = ({ description }) => (
    <div className={styles.container}>
        <div className={styles.loaderContainer}>
            <div className={styles.loader}></div>
        </div>
        <h1 className={styles.description}>{ description }</h1>
    </div>
);

export default Loading;
