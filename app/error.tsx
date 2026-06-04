'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import styles from './status.module.css';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <p className={styles.eyebrow}>Something broke</p>
        <h1>That didn&apos;t go as planned.</h1>
        <p className={styles.sub}>
          We hit an unexpected error loading this view. Try again, or head back to the library.
        </p>
        <div className={styles.actions}>
          <button className={styles.primary} onClick={reset}>Try again</button>
          <Link className={styles.ghost} href="/pains">Pain library</Link>
        </div>
      </div>
    </div>
  );
}
