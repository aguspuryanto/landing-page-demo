'use client';
// src/components/DemoCard.tsx
import { useRef, useEffect } from 'react';
import type { Demo } from '@/data/demos';
import styles from './DemoCard.module.css';

const BADGE_CLASS: Record<string, string> = {
  yellow: styles.badgeYellow,
  white:  styles.badgeWhite,
  blue:   styles.badgeBlue,
  green:  styles.badgeGreen,
};

const TAG_CLASS: Record<string, string> = {
  default: styles.tag,
  blue:    `${styles.tag} ${styles.tagBlue}`,
  yellow:  `${styles.tag} ${styles.tagYellow}`,
  green:   `${styles.tag} ${styles.tagGreen}`,
  purple:  `${styles.tag} ${styles.tagPurple}`,
};

interface Props {
  demo: Demo;
  delay?: number;
}

export default function DemoCard({ demo, delay = 0 }: Props) {
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add('visible'), delay * 80);
          observer.unobserve(el);
        }
      },
      { threshold: 0.06 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  const cardClass = [
    styles.card,
    'reveal',
    demo.featured ? styles.featured : '',
  ].filter(Boolean).join(' ');

  const badgeClass = `${styles.badge} ${BADGE_CLASS[demo.badgeType] ?? styles.badgeWhite}`;

  // Handle whole-card click (opens demo link)
  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as Element).closest(`.${styles.cta}`)) return;
    window.open(demo.file, '_blank', 'noopener');
  };

  return (
    <article
      ref={cardRef as React.RefObject<HTMLElement>}
      className={cardClass}
      onClick={handleCardClick}
      aria-label={demo.title}
    >
      {/* Thumbnail */}
      <div className={styles.preview}>
        <div className={styles.thumb} style={{ background: demo.gradient }}>
          <div className={styles.pattern} />
          <i className={`bi ${demo.icon} ${styles.thumbIcon}`} />
        </div>
        <div className={styles.overlay} />
        <div className={badgeClass}>{demo.badgeLabel}</div>
      </div>

      {/* Body */}
      <div className={styles.body}>
        <div className={styles.num}>Demo &mdash; {String(demo.num).padStart(2, '0')}</div>
        <div className={styles.iconWrap}>
          <i className={`bi ${demo.icon}`} />
        </div>
        <h2 className={styles.title}>{demo.title}</h2>
        <p className={styles.desc}>{demo.desc}</p>
        <div className={styles.tags}>
          {demo.tags.map((t) => (
            <span key={t.label} className={TAG_CLASS[t.variant] ?? styles.tag}>
              {t.label}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <span className={styles.file}>
          <i className="bi bi-file-code" />
          &nbsp;{demo.id}.html
        </span>
        <a
          href={demo.file}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.cta}
          onClick={(e) => e.stopPropagation()}
        >
          Lihat Demo <i className="bi bi-arrow-right" />
        </a>
      </div>
    </article>
  );
}
