import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Merge Festival — Painora',
};

export default function MergePage() {
  return (
    <div className={styles.page}>
      <header className={styles.nav}>
        <Link className={styles.back} href="/pains/birthday-blindspot">← Back to pain</Link>
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
        <span className={styles.painTitle}>
          &ldquo;I always forget my friends&apos; birthdays until the day of&rdquo;
        </span>
      </div>

      <div className={styles.arena}>
        <div className={`${styles.proposalCard} ${styles.cardA}`}>
          <div className={styles.cardAuthor}>M. Reyes</div>
          <h3>Relationship graph with weighted reminders</h3>
          <p>
            Map contacts by closeness tier. Surface reminders 7, 3, and 1 day before — only for
            people who matter.
          </p>
          <div className={styles.cardTags}>
            <span>relationship model</span>
            <span>tiered alerts</span>
          </div>
          <div className={styles.cardVotes}>↑ 214 votes</div>
        </div>

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

        <div className={`${styles.proposalCard} ${styles.cardB}`}>
          <div className={styles.cardAuthor}>S. Nakamura</div>
          <h3>Native calendar sync + AI gift suggestions</h3>
          <p>
            Sync across all contact sources. One day before, surface a curated shortlist of
            meaningful gifts.
          </p>
          <div className={styles.cardTags}>
            <span>cross-platform sync</span>
            <span>gift intelligence</span>
          </div>
          <div className={styles.cardVotes}>↑ 189 votes</div>
        </div>
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
          <h2>Relationship-aware birthday OS with gift intelligence</h2>
          <p className={styles.mergedDesc}>
            A unified system that maps contact closeness, syncs across all calendar sources, and
            surfaces proactive reminders with curated gift ideas — weighted by how much you care
            about each person.
          </p>
          <div className={styles.mergedAttrs}>
            <div className={styles.attr}>
              <span className={styles.attrLabel}>Core IP</span>
              <span>M. Reyes · S. Nakamura</span>
            </div>
            <div className={styles.attr}>
              <span className={styles.attrLabel}>Compatibility</span>
              <span className={styles.compat}>98% overlap</span>
            </div>
            <div className={styles.attr}>
              <span className={styles.attrLabel}>Total votes</span>
              <span>403</span>
            </div>
          </div>

          <div className={styles.mergedActions}>
            <Link className={styles.primary} href="/pains/birthday-blindspot#propose">Join as builder</Link>
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
