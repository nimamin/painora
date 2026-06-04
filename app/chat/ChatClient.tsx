'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { publishPain } from './actions';
import styles from './page.module.css';

type Role = 'user' | 'ai';
type Bubble = { role: Role; text: string };

type Spec = {
  title: string | null;
  context: string | null;
  rootCause: string | null;
  whoFeelsIt: string | null;
  whyItPersists: string | null;
};

const SPEC_KEYS: Array<keyof Spec> = ['title', 'context', 'rootCause', 'whoFeelsIt', 'whyItPersists'];

const SPEC_LABELS: Record<keyof Spec, string> = {
  title: 'Pain title',
  context: 'Context',
  rootCause: 'Root cause',
  whoFeelsIt: 'Who feels it',
  whyItPersists: 'Why it persists',
};

const EMPTY_SPEC: Spec = {
  title: null,
  context: null,
  rootCause: null,
  whoFeelsIt: null,
  whyItPersists: null,
};

export default function ChatClient() {
  const [bubbles, setBubbles] = useState<Bubble[]>([
    {
      role: 'ai',
      text: "What pain are you experiencing? Describe it however feels natural — no need for technical language.",
    },
  ]);
  const [history, setHistory] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [spec, setSpec] = useState<Spec>(EMPTY_SPEC);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  const router = useRouter();
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    windowRef.current?.scrollTo({ top: windowRef.current.scrollHeight });
  }, [bubbles, sending]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending || done) return;

    setInput('');
    setSending(true);

    const userBubble: Bubble = { role: 'user', text };
    setBubbles((b) => [...b, userBubble]);
    const nextHistory = [...history, { role: 'user' as const, content: text }];
    setHistory(nextHistory);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextHistory }),
      });
      const data: { reply: string; spec?: Partial<Spec>; done?: boolean } = await res.json();

      setBubbles((b) => [...b, { role: 'ai', text: data.reply }]);
      setHistory((h) => [...h, { role: 'assistant', content: JSON.stringify(data) }]);

      if (data.spec) {
        setSpec((prev) => {
          const merged = { ...prev };
          for (const key of SPEC_KEYS) {
            const value = data.spec?.[key];
            if (value) merged[key] = value;
          }
          return merged;
        });
      }

      if (data.done) setDone(true);
    } catch {
      setBubbles((b) => [...b, { role: 'ai', text: 'Something went wrong. Please try again.' }]);
    } finally {
      setSending(false);
    }
  }

  async function onPublish() {
    if (!done || publishing || published) return;
    setPublishing(true);
    setPublishError(null);

    try {
      const result = await publishPain({
        title: spec.title ?? '',
        context: spec.context ?? '',
        rootCause: spec.rootCause ?? '',
        whoFeelsIt: spec.whoFeelsIt ?? '',
        whyItPersists: spec.whyItPersists ?? '',
      });

      if (result.ok) {
        setPublished(true);
        router.push(`/pains/${result.id}`);
      } else {
        setPublishError(result.error);
        setPublishing(false);
      }
    } catch (err) {
      // A thrown Server Action (e.g. blocked Origin, network failure) would
      // otherwise vanish silently. Surface it so publishing never looks like a no-op.
      setPublishError(
        err instanceof Error ? err.message : 'Publishing failed. Please try again.',
      );
      setPublishing(false);
    }
  }

  const filled = SPEC_KEYS.filter((k) => spec[k]).length;
  const pct = Math.round((filled / SPEC_KEYS.length) * 100);
  const statusLabel = done || filled === SPEC_KEYS.length ? 'Complete' : `${pct}% complete`;
  const statusDone = done || filled === SPEC_KEYS.length;

  const validateClass = [
    styles.validateBtn,
    done && !published ? styles.validateBtnReady : '',
    published ? styles.validateBtnPublished : '',
  ]
    .filter(Boolean)
    .join(' ');

  const buttonLabel = published
    ? 'Published! Redirecting…'
    : publishing
      ? 'Publishing…'
      : 'Validate & publish';

  return (
    <div className={styles.shell}>
      <main className={styles.chatCol}>
        <div className={styles.chatHero}>
          <h1>Declare your pain</h1>
          <p>Describe what&apos;s hurting. AI will help you make it precise.</p>
        </div>

        <div className={styles.chatWindow} ref={windowRef}>
          {bubbles.map((b, i) => (
            <div key={i} className={`${styles.bubble} ${b.role === 'user' ? styles.user : styles.ai}`}>
              {b.text}
            </div>
          ))}
          {sending && (
            <div className={`${styles.bubble} ${styles.ai} ${styles.typing}`}>
              <span></span><span></span><span></span>
            </div>
          )}
        </div>

        <form className={styles.chatInputBar} onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Describe your pain..."
            autoComplete="off"
            autoFocus
            value={input}
            disabled={sending || done}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" disabled={sending || done || input.trim().length === 0}>
            Send
          </button>
        </form>
      </main>

      <aside className={styles.specCol}>
        <div className={styles.specCard}>
          <div className={styles.specHeader}>
            <span className={styles.specLabel}>Problem Specification</span>
            <span className={`${styles.specStatus} ${statusDone ? styles.specStatusDone : ''}`}>
              {statusLabel}
            </span>
          </div>

          <div className={styles.specFields}>
            {SPEC_KEYS.map((key) => {
              const value = spec[key];
              return (
                <div key={key} className={`${styles.field} ${value ? styles.fieldFilled : ''}`}>
                  <span className={styles.fieldLabel}>{SPEC_LABELS[key]}</span>
                  <span className={`${styles.fieldValue} ${value ? '' : styles.fieldValueEmpty}`}>
                    {value ?? '—'}
                  </span>
                </div>
              );
            })}
          </div>

          <button
            className={validateClass}
            disabled={!done || publishing || published}
            onClick={onPublish}
          >
            {buttonLabel}
          </button>

          {publishError && (
            <p className={styles.publishError}>{publishError}</p>
          )}
        </div>
      </aside>
    </div>
  );
}
