"use client";

import React, { useEffect, useRef, useState } from "react";
import { Heart } from "lucide-react";

type Props = {
  postId: string;
  initialCount?: number;
};

export default function LikeButton({ postId, initialCount = 0 }: Props) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState<number>(initialCount);
  const [showBorder, setShowBorder] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("liked_posts");
      const likedPosts: string[] = stored ? JSON.parse(stored) : [];
      setLiked(likedPosts.includes(postId));

      const storedCount = localStorage.getItem(`likes_${postId}`);
      if (storedCount) {
        setCount(Number(storedCount));
      } else {
        localStorage.setItem(`likes_${postId}`, String(initialCount));
        setCount(initialCount);
      }
    } catch (e) {
    }
  }, [postId, initialCount]);

  const toggle = async () => {
    try {
      const stored = localStorage.getItem("liked_posts");
      const likedPosts: string[] = stored ? JSON.parse(stored) : [];

      if (liked) {
        const next = likedPosts.filter((id) => id !== postId);
        localStorage.setItem("liked_posts", JSON.stringify(next));
        const nextCount = Math.max(0, count - 1);
        localStorage.setItem(`likes_${postId}`, String(nextCount));
        setCount(nextCount);
        setLiked(false);
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        setShowBorder(false);
      } else {
        likedPosts.push(postId);
        localStorage.setItem("liked_posts", JSON.stringify(likedPosts));
        const nextCount = count + 1;
        localStorage.setItem(`likes_${postId}`, String(nextCount));
        setCount(nextCount);
        setLiked(true);
        // show a temporary red ring to give feedback, then hide after 1.5s
        setShowBorder(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => {
          setShowBorder(false);
          timerRef.current = null;
        }, 1500);
      }
    } catch (e) {
    }

    // Fire-and-forget server update to persist likes (use postId as the key)
    try {
      const resp = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, action: liked ? 'decrement' : 'increment' }),
      })
      const json = await resp.json()
      if (json?.ok && typeof json?.likes === 'number') {
        setCount(json.likes)
      }
    } catch (e) {
      console.error('Failed to persist like', e)
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <button
      onClick={toggle}
      aria-pressed={liked}
      aria-label={liked ? "Unlike post" : "Like post"}
      className={`inline-flex items-center gap-2 text-sm font-medium transition-all duration-150 focus:outline-none rounded-full px-2 py-1 ${
        liked ? "text-rose-600" : "text-black/60"
      } ${showBorder ? "ring-2 ring-rose-300 ring-offset-1" : ""}`}
    >
      <span
        className={`flex items-center justify-center rounded-full p-1 transition-transform ${
          liked ? "scale-105" : ""
        }`}
      >
        <Heart size={16} className={liked ? "fill-current" : ""} />
      </span>
      <span className="text-xs tabular-nums">{count}</span>
    </button>
  );
}
