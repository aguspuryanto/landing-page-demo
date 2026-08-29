'use client';
// src/components/FilterBar.tsx
import type { FilterKey } from '@/data/demos';
import styles from './FilterBar.module.css';

interface Option {
  readonly key: string;
  readonly label: string;
  readonly icon: string;
}

interface Props {
  options: readonly Option[];
  active: FilterKey;
  onChange: (key: FilterKey) => void;
}

export default function FilterBar({ options, active, onChange }: Props) {
  return (
    <div className={styles.wrap}>
      <div className={styles.bar} role="group" aria-label="Filter demos">
        {options.map((opt) => (
          <button
            key={opt.key}
            id={`btn-${opt.key}`}
            className={`${styles.btn} ${active === opt.key ? styles.active : ''}`}
            onClick={() => onChange(opt.key as FilterKey)}
            type="button"
          >
            <i className={`bi ${opt.icon}`} />
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
