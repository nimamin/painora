'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { submitProposal } from './actions';
import styles from './page.module.css';

export default function ProposeForm({ painId }: { painId: string }) {
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting || submitted) return;
    setSubmitting(true);
    setError(null);

    const result = await submitProposal({ painId, author, title, summary });

    if (result.ok) {
      setSubmitted(true);
      // Reveal the freshly inserted proposal (server component re-fetches).
      router.refresh();
    } else {
      setError(result.error);
      setSubmitting(false);
    }
  }

  const disabled = submitting || submitted;
  const buttonLabel = submitted
    ? 'Proposal submitted ✓'
    : submitting
      ? 'Submitting…'
      : 'Submit proposal';

  return (
    <form className={styles.proposeForm} onSubmit={onSubmit}>
      <label>
        <span>Your name</span>
        <input
          type="text"
          placeholder="How you'd like to be credited"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          disabled={disabled}
        />
      </label>
      <label>
        <span>Title</span>
        <input
          type="text"
          placeholder="One-line description of your approach"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={disabled}
        />
      </label>
      <label>
        <span>Approach</span>
        <textarea
          rows={4}
          placeholder="How would you solve this? What's the key insight?"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          disabled={disabled}
        />
      </label>
      <button type="submit" className={submitted ? styles.submitted : ''} disabled={disabled}>
        {buttonLabel}
      </button>

      {error && <p className={styles.proposeError}>{error}</p>}
    </form>
  );
}
