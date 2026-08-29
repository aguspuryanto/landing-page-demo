'use client';
// src/components/ScrollTopButton.tsx
import styles from './ScrollTopButton.module.css';
import { useScrollTop } from '@/hooks/useScrollTop';

export default function ScrollTopButton() {
  const { visible, scrollToTop } = useScrollTop();

  return (
    <button
      id="scrollTop"
      className={`${styles.btn} ${visible ? styles.visible : ''}`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
      title="Kembali ke atas"
      type="button"
    >
      <i className="bi bi-chevron-up" />
    </button>
  );
}
