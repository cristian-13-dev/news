"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export type NavLink = { href: string; label: string };

const DEFAULT_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/posts", label: "Posts" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
];

export default function Navigation({ links }: { links?: NavLink[] }) {
  const navLinks = links ?? DEFAULT_LINKS;
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className="top-0 z-50 bg-white text-black border-b border-gray-200 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-3 items-center gap-4 h-12">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <span className="text-lg font-semibold tracking-tight text-black">News</span>
              <span className="sr-only">Home</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center justify-center gap-6" role="navigation" aria-label="Main navigation">
            {navLinks.map((l) => {
              const isActive = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`relative text-sm font-medium transition-colors after:block after:absolute after:-bottom-[15px] after:left-0 after:right-0 after:h-0.5 after:rounded-sm after:transition-all ${
                    isActive
                      ? "text-black after:h-0.5 after:bg-black"
                      : "text-black/70 hover:text-black after:h-0 after:bg-transparent"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center justify-end">
            {/* Search (desktop) - compact, expands on focus */}
            <form onSubmit={onSearch} className="hidden md:flex items-center ml-4">
              <label htmlFor="nav-search" className="sr-only">Search</label>
              <div className="relative group">
                <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                  <path fillRule="evenodd" d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.386-1.414 1.415-4.387-4.387zM8 14a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                </svg>
                <input
                  id="nav-search"
                  name="q"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search articles"
                  className="w-40 focus:w-64 transition-[width] duration-200 ease px-3 py-2 pl-10 pr-3 border border-gray-200 rounded-md text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            </form>

            
          </div>
        </div>
      </div>

        {/* Mobile toggle absolutely positioned inside header (visually centered) */}
        <button
          onClick={() => setOpen((s) => !s)}
          aria-expanded={open}
          aria-label="Toggle navigation"
          className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-md text-black hover:bg-black/5 z-50"
        >
          {open ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM4 15a1 1 0 100 2h12a1 1 0 100-2H4z" clipRule="evenodd" />
            </svg>
          )}
        </button>

      {/* Mobile panel (fixed overlay below header to avoid pushing header height) */}
      <div
        className={`md:hidden fixed left-0 right-0 top-12 z-40 transition-[max-height] duration-200 ease-in-out overflow-hidden ${
          open ? "max-h-72" : "max-h-0"
        } bg-white shadow-sm`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-4">
          {/* Mobile search */}
          <form onSubmit={onSearch} className="w-full">
            <label htmlFor="nav-search-mobile" className="sr-only">
              Search
            </label>
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.386-1.414 1.415-4.387-4.387zM8 14a6 6 0 100-12 6 6 0 000 12z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                id="nav-search-mobile"
                name="q"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles"
                className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-md text-base text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </form>

          <div className="flex flex-col">
            {navLinks.map((l) => {
            const isActive = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`text-base font-medium transition-colors ${
                  isActive
                    ? "text-black underline"
                    : "text-black/70 hover:text-black"
                }`}
              >
                {l.label}
              </Link>
            );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
