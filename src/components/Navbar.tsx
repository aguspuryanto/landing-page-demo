// src/components/Navbar.tsx
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar} role="navigation" aria-label="Main navigation">
      <div className={styles.brand}>
        <div className={styles.logoFallback}>
          <span>Landing Page Demo</span>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.count}>
          <i className="bi bi-collection-fill" />
          <span>11 Demo</span>
        </div>
        <Link href="#portfolio" className={styles.cta}>
          <span>Lihat Semua Demo</span>
          <i className="bi bi-arrow-right" />
        </Link>
      </div>
    </nav>
  );
}
