// src/components/Hero.tsx
import styles from './Hero.module.css';

const FEATURES = [
  { icon: 'bi-grid-3x3-gap-fill', label: '11 Halaman Demo' },
  { icon: 'bi-palette2',          label: '4 Variasi Brand'  },
  { icon: 'bi-phone',             label: '100% Responsive'  },
  { icon: 'bi-search',            label: 'SEO Optimized'    },
];

export default function Hero() {
  return (
    <header className={styles.hero} id="top">
      <div className={styles.inner}>
        <div className={styles.tag}>
          <span className={styles.dot} />
          Koleksi Landing Page Demo
        </div>

        <h1 className={styles.title}>
          Desain &amp; Variasi<br />
          <span>Landing Page Adira Finance</span>
        </h1>

        <p className={styles.desc}>
          Kumpulan 11 variasi desain halaman pembiayaan BPKB motor &amp; mobil &mdash;
          dari tampilan klasik Adira Finance hingga CRO-optimized modern.
          Klik kartu untuk membuka demo.
        </p>

        <div className={styles.features}>
          {FEATURES.map((f) => (
            <div key={f.label} className={styles.feat}>
              <i className={`bi ${f.icon} ${styles.featIcon}`} />
              <span className={styles.featLabel}>{f.label}</span>
            </div>
          ))}
        </div>

        <p className={styles.note}>
          <i className="bi bi-shield-check" />
          Semua file tersedia lokal &mdash; tidak ada dependensi server
        </p>
      </div>
    </header>
  );
}
