import Link from 'next/link';
import styles from './status.module.css';

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <p className={styles.eyebrow}>404</p>
        <h1>This page wandered off.</h1>
        <p className={styles.sub}>
          The pain you&apos;re looking for may have been merged, renamed, or never declared.
        </p>
        <div className={styles.actions}>
          <Link className={styles.primary} href="/pains">Browse the pain library</Link>
          <Link className={styles.ghost} href="/">Back home</Link>
        </div>
      </div>
    </div>
  );
}
