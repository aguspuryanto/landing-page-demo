'use client';
// src/components/DemoGrid.tsx
import { useState } from 'react';
import { DEMOS, FILTER_OPTIONS, FILTER_LABELS, type FilterKey } from '@/data/demos';
import FilterBar from './FilterBar';
import DemoCard from './DemoCard';
import styles from './DemoGrid.module.css';

export default function DemoGrid() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const filtered = activeFilter === 'all'
    ? DEMOS
    : DEMOS.filter((d) => d.categories.includes(activeFilter as never));

  const { lbl, title } = FILTER_LABELS[activeFilter];

  return (
    <>
      <FilterBar
        options={FILTER_OPTIONS}
        active={activeFilter}
        onChange={setActiveFilter}
      />

      <section className={styles.section} id="portfolio" aria-label="Portfolio demos">
        <div className={styles.header}>
          <div className={styles.badge}>Koleksi Demo</div>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.desc}>
            Klik kartu untuk membuka demo di tab baru.
            Gunakan filter di atas untuk menyaring berdasarkan kategori.
          </p>
        </div>

        <div className={styles.filterLabel}>{lbl}</div>

        <div className={styles.grid}>
          {filtered.map((demo, i) => (
            <DemoCard key={demo.id} demo={demo} delay={i} />
          ))}
        </div>
      </section>
    </>
  );
}
