import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PAINS, CATEGORY_COLOR, getPain } from '@/lib/pains';
import ProposeForm from './ProposeForm';
import styles from './page.module.css';

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return PAINS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const pain = getPain(id);
  return { title: pain ? `${pain.title} — Painora` : 'Pain — Painora' };
}

const MOCK_PROPOSALS = [
  {
    id: 1,
    author: 'M. Reyes',
    title: 'A relationship graph with weighted reminder cadences',
    summary:
      'Map contacts by closeness tier. Surface reminders 7, 3, and 1 day before — only for people who matter most.',
    votes: 214,
  },
  {
    id: 2,
    author: 'S. Nakamura',
    title: 'Native OS calendar + gift-suggestion AI layer',
    summary:
      'Sync across all contact sources. One day before, surface a curated shortlist of meaningful gifts based on past interactions.',
    votes: 189,
  },
  {
    id: 3,
    author: 'K. Osei',
    title: 'Community-shared birthday rituals',
    summary:
      'Let mutual friends coordinate on a shared gift or message. One platform entry, zero coordination overhead.',
    votes: 143,
  },
];

export default async function PainDetailPage({ params }: PageProps) {
  const { id } = await params;
  const pain = getPain(id);
  if (!pain) notFound();

  const accent = CATEGORY_COLOR[pain.category];
  const pageStyle = { '--accent': accent } as CSSProperties;
  const statusClass =
    pain.status === 'merging'
      ? styles.statusMerging
      : pain.status === 'active'
        ? styles.statusActive
        : styles.statusNew;

  return (
    <div className={styles.page} style={pageStyle}>
      <header className={styles.nav}>
        <Link className={styles.back} href="/pains">← Pain library</Link>
        <div className={styles.navRight}>
          {pain.status === 'merging' ? (
            <Link className={`${styles.status} ${styles.statusMerging}`} href="/merge">Merging now →</Link>
          ) : (
            <span className={`${styles.status} ${statusClass}`}>
              {pain.status === 'active' ? 'Active' : 'New'}
            </span>
          )}
          <a className={styles.primary} href="#propose">Propose a solution</a>
        </div>
      </header>

      <div className={styles.layout}>
        <main>
          <div className={`${styles.painHero} ${styles.reveal}`}>
            <div className={styles.tags}>
              {pain.tags.map((tag) => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
            <h1>{pain.title}</h1>
            <p className={styles.summary}>{pain.summary}</p>

            <div className={styles.meta}>
              <div className={styles.stat}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
                <strong>{pain.votes.toLocaleString()}</strong> votes
              </div>
              <div className={styles.stat}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="14" rx="2" />
                  <path d="M3 17l3-3 3 3 3-3 3 3 3-3" />
                </svg>
                <strong>{pain.proposals}</strong> proposals
              </div>
            </div>
          </div>

          <section className={`${styles.specSection} ${styles.reveal} ${styles.delay1}`}>
            <h2 className={styles.sectionTitle}>Problem specification</h2>
            <div className={styles.specGrid}>
              <div className={styles.specField}>
                <span className={styles.fieldLabel}>Pain title</span>
                <p className={styles.fieldValue}>{pain.spec.title}</p>
              </div>
              <div className={styles.specField}>
                <span className={styles.fieldLabel}>Context</span>
                <p className={styles.fieldValue}>{pain.spec.context}</p>
              </div>
              <div className={styles.specField}>
                <span className={styles.fieldLabel}>Root cause</span>
                <p className={styles.fieldValue}>{pain.spec.rootCause}</p>
              </div>
              <div className={styles.specField}>
                <span className={styles.fieldLabel}>Who feels it</span>
                <p className={styles.fieldValue}>{pain.spec.whoFeelsIt}</p>
              </div>
              <div className={styles.specField}>
                <span className={styles.fieldLabel}>Why it persists</span>
                <p className={styles.fieldValue}>{pain.spec.whyItPersists}</p>
              </div>
            </div>
          </section>

          <section className={`${styles.proposalsSection} ${styles.reveal} ${styles.delay2}`}>
            <div className={styles.proposalsHeader}>
              <h2 className={styles.sectionTitle}>Solution proposals</h2>
              <span className={styles.count}>{pain.proposals} submitted</span>
            </div>

            <div className={styles.proposalsList}>
              {MOCK_PROPOSALS.map((p) => (
                <div key={p.id} className={styles.proposalCard}>
                  <div className={styles.proposalTop}>
                    <div>
                      <span className={styles.proposalAuthor}>{p.author}</span>
                      <h3 className={styles.proposalTitle}>{p.title}</h3>
                    </div>
                    <div className={styles.proposalVotes}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 19V5M5 12l7-7 7 7" />
                      </svg>
                      {p.votes}
                    </div>
                  </div>
                  <p className={styles.proposalSummary}>{p.summary}</p>
                </div>
              ))}
            </div>
          </section>

          <section className={`${styles.proposeSection} ${styles.reveal} ${styles.delay3}`} id="propose">
            <h2 className={styles.sectionTitle}>Propose your solution</h2>
            <p className={styles.proposeSub}>
              Your proposal stays visible as its own IP. The community may invite it to merge.
            </p>
            <ProposeForm />
          </section>
        </main>

        <aside className={`${styles.lineageCol} ${styles.reveal} ${styles.delay2}`}>
          <div className={styles.lineageCard}>
            <p className={styles.lineageLabel}>Ownership lineage</p>
            <div className={styles.lineageSteps}>
              <div className={`${styles.lineageStep} ${styles.active}`}>
                <div className={styles.stepDot}></div>
                <div className={styles.stepBody}>
                  <strong>Pain declared</strong>
                  <span>Anonymous · 14 days ago</span>
                </div>
              </div>
              <div className={styles.lineageLine}></div>
              <div className={`${styles.lineageStep} ${styles.active}`}>
                <div className={styles.stepDot}></div>
                <div className={styles.stepBody}>
                  <strong>Spec v1</strong>
                  <span>AI-structured · validated</span>
                </div>
              </div>
              <div className={styles.lineageLine}></div>
              <div className={`${styles.lineageStep} ${pain.proposals > 0 ? styles.active : ''}`}>
                <div className={styles.stepDot}></div>
                <div className={styles.stepBody}>
                  <strong>{pain.proposals} proposals</strong>
                  <span>{pain.proposals > 0 ? 'Open for contribution' : 'None yet'}</span>
                </div>
              </div>
              <div className={styles.lineageLine}></div>
              <div className={`${styles.lineageStep} ${pain.status === 'merging' ? styles.active : ''}`}>
                <div className={styles.stepDot}></div>
                <div className={styles.stepBody}>
                  <strong>Merge festival</strong>
                  <span>{pain.status === 'merging' ? 'In progress' : 'Pending'}</span>
                </div>
              </div>
              <div className={styles.lineageLine}></div>
              <div className={styles.lineageStep}>
                <div className={styles.stepDot}></div>
                <div className={styles.stepBody}>
                  <strong>Build</strong>
                  <span>Not started</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.ipCard}>
            <p className={styles.lineageLabel}>IP ownership</p>
            <p className={styles.ipNote}>
              Every meaningful contribution is tracked. Designers who propose solutions retain
              authorship. Merge contributors receive attribution and revenue participation.
            </p>
            <div className={styles.ipPill}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2z" />
                <path d="M2 20c0-4 4.5-7 10-7s10 3 10 7" />
              </svg>
              IP stays with creators
            </div>
          </div>
        </aside>
      </div>

      <footer className={styles.footer}>
        <span>© 2026 Painora</span>
        <Link href="/pains">← Back to library</Link>
      </footer>
    </div>
  );
}
