import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PAINS, CATEGORY_COLOR, STATUS_LABEL } from '@/lib/pains';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Pain library — Painora',
};

const DELAY_CLASSES = [styles.delay1, styles.delay2, styles.delay3, styles.delay4];

export default function PainsIndexPage() {
  return (
    <div className={styles.page}>
      <header className={styles.nav}>
        <Link className={styles.logo} href="/">Painora</Link>
        <Link className={styles.ghost} href="/chat">Declare a pain</Link>
      </header>

      <section className={`${styles.hero} ${styles.reveal}`}>
        <p className={styles.eyebrow}>Pain library</p>
        <h1>Real problems. Waiting to be solved.</h1>
        <p className={styles.sub}>
          Every card is a structured human pain — clarified by AI, open for designers and builders
          to propose solutions.
        </p>
      </section>

      <div className={styles.grid}>
        {PAINS.map((pain, i) => {
          const href = pain.status === 'merging' ? '/merge' : `/pains/${pain.id}`;
          const classes = [
            styles.card,
            styles.reveal,
            DELAY_CLASSES[i % DELAY_CLASSES.length],
            pain.status === 'merging' ? styles.cardMerging : '',
          ]
            .filter(Boolean)
            .join(' ');
          const accentStyle = { '--accent': CATEGORY_COLOR[pain.category] } as CSSProperties;
          const statusClass =
            pain.status === 'merging'
              ? styles.statusMerging
              : pain.status === 'active'
                ? styles.statusActive
                : styles.statusNew;

          return (
            <Link key={pain.id} className={classes} href={href} style={accentStyle}>
              <div className={styles.cardTop}>
                <span className={`${styles.status} ${statusClass}`}>{STATUS_LABEL[pain.status]}</span>
                <div className={styles.votes}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 19V5M5 12l7-7 7 7" />
                  </svg>
                  {pain.votes.toLocaleString()}
                </div>
              </div>

              <h2 className={styles.cardTitle}>{pain.title}</h2>
              <p className={styles.cardSummary}>{pain.summary}</p>

              <div className={styles.cardFooter}>
                <div className={styles.tags}>
                  {pain.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
                <span className={styles.proposals}>{pain.proposals} proposals</span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className={`${styles.ctaStrip} ${styles.reveal}`}>
        <p>Have a pain that&apos;s not here?</p>
        <Link className={styles.primary} href="/chat">Declare yours →</Link>
      </div>

      <footer className={styles.footer}>
        <span>© 2026 Painora</span>
        <Link href="/">← Back to home</Link>
      </footer>
    </div>
  );
}
