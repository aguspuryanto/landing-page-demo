// src/components/StatsStrip.tsx
import styles from './StatsStrip.module.css';

const STATS = [
  { val: '11', lbl: 'Demo Halaman' },
  { val: '4',   lbl: 'Variasi Brand' },
  { val: '100%', lbl: 'Responsive' },
  { val: 'SEO',  lbl: 'Optimized' },
];

export default function StatsStrip() {
  return (
    <div className={styles.strip}>
      {STATS.map((s) => (
        <div key={s.lbl} className={styles.item}>
          <div className={styles.val}>{s.val}</div>
          <div className={styles.lbl}>{s.lbl}</div>
        </div>
      ))}
    </div>
  );
}
