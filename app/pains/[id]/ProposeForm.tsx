'use client';

import { useState, type FormEvent } from 'react';
import styles from './page.module.css';

export default function ProposeForm() {
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <form className={styles.proposeForm} onSubmit={onSubmit}>
      <label>
        <span>Title</span>
        <input type="text" placeholder="One-line description of your approach" disabled={submitted} />
      </label>
      <label>
        <span>Approach</span>
        <textarea rows={4} placeholder="How would you solve this? What's the key insight?" disabled={submitted} />
      </label>
      <button type="submit" className={submitted ? styles.submitted : ''} disabled={submitted}>
        {submitted ? 'Proposal submitted ✓' : 'Submit proposal'}
      </button>
    </form>
  );
}
