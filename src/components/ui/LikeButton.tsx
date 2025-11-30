"use client";

import React, { useEffect, useRef, useState } from "react";
import { Heart } from "lucide-react";

type Props = {
  slug: string;
  initialCount?: number;
};

export default function LikeButton({ slug, initialCount = 0 }: Props) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState<number>(initialCount);
  const [showBorder, setShowBorder] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("liked_posts");
      const likedPosts: string[] = stored ? JSON.parse(stored) : [];
      setLiked(likedPosts.includes(slug));

      const storedCount = localStorage.getItem(`likes_${slug}`);
      if (storedCount) {
        setCount(Number(storedCount));
      } else {
        localStorage.setItem(`likes_${slug}`, String(initialCount));
        setCount(initialCount);
      }
    } catch (e) {
    }
  }, [slug, initialCount]);

  const toggle = async () => {
    try {
      const stored = localStorage.getItem("liked_posts");
      const likedPosts: string[] = stored ? JSON.parse(stored) : [];

      if (liked) {
        const next = likedPosts.filter((id) => id !== slug);
        localStorage.setItem("liked_posts", JSON.stringify(next));
        const nextCount = Math.max(0, count - 1);
        localStorage.setItem(`likes_${slug}`, String(nextCount));
        setCount(nextCount);
        setLiked(false);
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        setShowBorder(false);
      } else {
        likedPosts.push(slug);
        localStorage.setItem("liked_posts", JSON.stringify(likedPosts));
        const nextCount = count + 1;
        localStorage.setItem(`likes_${slug}`, String(nextCount));
        setCount(nextCount);
        setLiked(true);
         setShowBorder(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => {
          setShowBorder(false);
          timerRef.current = null;
        }, 1500);
      }
    } catch (e) {
    }

    
    try {
      const resp = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, action: liked ? 'decrement' : 'increment' }),
      })
      const json = await resp.json()
      if (json?.ok && typeof json?.likes === 'number') {
        setCount(json.likes)
      }
    } catch (e) {
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
    <div className="inline-flex items-center gap-2">
      <button
        onClick={toggle}
      aria-pressed={liked}
      aria-label={liked ? "Unlike post" : "Like post"}
      className={`inline-flex items-center text-sm font-medium transition-all duration-150 focus:outline-none rounded-full px-2 py-1 ${
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
      
    </div>
  );
}
