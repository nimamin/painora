import type { Metadata } from 'next';
import Link from 'next/link';
import ChatClient from './ChatClient';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Declare a pain — Painora',
};

// Render through the SSR compute (not static). Amplify serves statically
// prerendered pages from the CDN, which reject the POST that the publishPain
// Server Action sends to this route — causing a 404 / "action not found".
export const dynamic = 'force-dynamic';

export default function ChatPage() {
  return (
    <div className={styles.chatPage}>
      <header className={styles.chatHeader}>
        <Link className={styles.back} href="/">← Painora</Link>
        <span className={styles.pill}>AI intake — preview</span>
      </header>
      <ChatClient />
    </div>
  );
}
