import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css';

export default function Header() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={styles.header}>
      <div className={styles.imageContainer}>
        <img src="/images/summerSchoolImage.png" alt="summerSchoolImage" className={styles.schoolImage} />
        <img src="/images/galacticLogoImage.png" alt="galacticImage" className={styles.galacticImage} />
      </div>

      <nav className={styles.navContainer}>
        <Link
          to="/"
          className={`${styles.Link} ${isActive('/') ? styles.active : ''}`}
        >
          <img src="/icons/csvAnaliticsIcon.png" alt="1" />
          CSV Аналитик
        </Link>
        <Link
          to="/generate"
          className={`${styles.Link} ${isActive('/generate') ? styles.active : ''}`}
        >
          <img src="/icons/csvGeneratorIcon.png" alt="2" />
          CSV Генератор
        </Link>
        <Link
          to="/history"
          className={`${styles.Link} ${isActive('/history') ? styles.active : ''}`}
        >
          <img src="/icons/historyIcon.png" alt="3" />
          История
        </Link>
      </nav>
    </header>
  );
}
