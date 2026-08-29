// src/components/Footer.tsx
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.copy}>
          &copy; 2026 Adira Finance &middot; Landing Page Portfolio
        </span>
        <div className={styles.links}>
          <Link href="#top">
            <i className="bi bi-arrow-up-circle" /> Back to Top
          </Link>
          <a href="/demos/demo.html" target="_blank" rel="noopener noreferrer">
            <i className="bi bi-eye" /> Demo Utama
          </a>
          <a href="/demos/demo8.html" target="_blank" rel="noopener noreferrer">
            <i className="bi bi-bank" /> AdiraKilat
          </a>
        </div>
      </div>
    </footer>
  );
}
