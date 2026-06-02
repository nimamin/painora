import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMerge, getPainById, getProposals } from '@/lib/data';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Merge Festival — Painora',
};

export const dynamic = 'force-dynamic';

// The seeded Merge Festival is for the birthday-blindspot pain.
const MERGE_PAIN_ID = 'birthday-blindspot';

export default async function MergePage() {
  const [merge, pain, proposals] = await Promise.all([
    getMerge(MERGE_PAIN_ID),
    getPainById(MERGE_PAIN_ID),
    getProposals(MERGE_PAIN_ID),
  ]);

  if (!merge || !pain) notFound();

  const [first, second] = proposals;

  return (
    <div className={styles.page}>
      <header className={styles.nav}>
        <Link className={styles.back} href={`/pains/${pain.id}`}>← Back to pain</Link>
        <span className={styles.pill}>Merge festival · live</span>
      </header>

      <section className={styles.hero}>
        <p className={styles.eyebrow}>Ideas are converging</p>
        <h1>The Merge Festival</h1>
        <p className={styles.sub}>
          When proposals overlap, Painora invites them to become one. Contributors negotiate,
          AI maps compatibility, and the strongest idea emerges.
        </p>
      </section>

      <div className={styles.painRef}>
        <span className={styles.painLabel}>Pain being solved</span>
        <span className={styles.painTitle}>&ldquo;{pain.title}&rdquo;</span>
      </div>

      <div className={styles.arena}>
        {first && (
          <div className={`${styles.proposalCard} ${styles.cardA}`}>
            <div className={styles.cardAuthor}>{first.author}</div>
            <h3>{first.title}</h3>
            <p>{first.summary}</p>
            <div className={styles.cardVotes}>↑ {first.votes} votes</div>
          </div>
        )}

        <div className={styles.mergeZone}>
          <div className={`${styles.mergeRing} ${styles.ring1}`}></div>
          <div className={`${styles.mergeRing} ${styles.ring2}`}></div>
          <div className={`${styles.mergeRing} ${styles.ring3}`}></div>
          <div className={styles.mergeIcon}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M8 6H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3" />
              <path d="M16 6h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3" />
              <path d="M12 3v18" />
              <path d="M9 9l3-3 3 3" />
              <path d="M9 15l3 3 3-3" />
            </svg>
          </div>
          <div className={styles.mergeLabel}>Merging</div>
        </div>

        {second && (
          <div className={`${styles.proposalCard} ${styles.cardB}`}>
            <div className={styles.cardAuthor}>{second.author}</div>
            <h3>{second.title}</h3>
            <p>{second.summary}</p>
            <div className={styles.cardVotes}>↑ {second.votes} votes</div>
          </div>
        )}
      </div>

      <div className={styles.resultWrap}>
        <div className={styles.resultArrow}>
          <div className={styles.arrowLine}></div>
          <svg className={styles.arrowHead} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>

        <div className={styles.mergedCard}>
          <div className={styles.mergedBadge}>
            <span className={styles.badgeDot}></span>
            Merged result · v1
          </div>
          <h2>{merge.title}</h2>
          <p className={styles.mergedDesc}>{merge.description}</p>
          <div className={styles.mergedAttrs}>
            <div className={styles.attr}>
              <span className={styles.attrLabel}>Core IP</span>
              <span>{merge.coreIp.join(' · ')}</span>
            </div>
            <div className={styles.attr}>
              <span className={styles.attrLabel}>Compatibility</span>
              <span className={styles.compat}>{merge.compatibility}</span>
            </div>
            <div className={styles.attr}>
              <span className={styles.attrLabel}>Total votes</span>
              <span>{merge.totalVotes}</span>
            </div>
          </div>

          <div className={styles.mergedActions}>
            <Link className={styles.primary} href={`/pains/${pain.id}#propose`}>Join as builder</Link>
            <Link className={styles.ghost} href="/pains">See all pains</Link>
          </div>
        </div>
      </div>

      <blockquote className={styles.philosophy}>
        &ldquo;When ideas overlap, Painora helps them become one.&rdquo;
      </blockquote>

      <footer className={styles.footer}>
        <span>© 2026 Painora</span>
        <Link href="/pains">← Pain library</Link>
      </footer>
    </div>
  );
}
