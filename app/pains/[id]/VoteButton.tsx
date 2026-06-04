'use client';

import { useEffect, useState } from 'react';
import { votePain, voteProposal, type VoteResult } from './vote-actions';

type Kind = 'pain' | 'proposal';

const STORAGE_KEY = 'painora:votes';

function hasVoted(key: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    return (JSON.parse(raw) as string[]).includes(key);
  } catch {
    return false;
  }
}

function rememberVote(key: string) {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const list = raw ? (JSON.parse(raw) as string[]) : [];
    if (!list.includes(key)) {
      list.push(key);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }
  } catch {
    // localStorage unavailable — degrade gracefully (vote still records server-side).
  }
}

export default function VoteButton({
  kind,
  id,
  votes,
  className,
  iconSize = 13,
  label = false,
}: {
  kind: Kind;
  id: string;
  votes: number;
  className?: string;
  iconSize?: number;
  label?: boolean;
}) {
  const storageKey = `${kind}:${id}`;
  const [count, setCount] = useState(votes);
  const [voted, setVoted] = useState(false);
  const [pending, setPending] = useState(false);

  // Reflect prior votes from localStorage after hydration.
  useEffect(() => {
    if (hasVoted(storageKey)) setVoted(true);
  }, [storageKey]);

  // Keep in sync if the server re-renders with a newer count (e.g. router.refresh).
  useEffect(() => {
    setCount(votes);
  }, [votes]);

  async function onVote(e: React.MouseEvent) {
    // The button may live inside a card-level <Link>; don't navigate.
    e.preventDefault();
    e.stopPropagation();
    if (voted || pending) return;

    setPending(true);
    setVoted(true);
    setCount((c) => c + 1); // optimistic
    rememberVote(storageKey);

    const action = kind === 'pain' ? votePain : voteProposal;
    const result: VoteResult = await action(id);

    if (result.ok) {
      setCount(result.votes); // reconcile with authoritative count
    } else {
      // Roll back optimistic update on failure.
      setVoted(false);
      setCount((c) => Math.max(0, c - 1));
    }
    setPending(false);
  }

  return (
    <button
      type="button"
      onClick={onVote}
      disabled={voted || pending}
      aria-pressed={voted}
      aria-label={voted ? 'Voted' : 'Upvote'}
      className={className}
      data-voted={voted ? '' : undefined}
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
      {count.toLocaleString()}
      {label ? ' votes' : ''}
    </button>
  );
}
