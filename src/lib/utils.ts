export function formatDate(dateString?: string): string {
  if (!dateString) return "";
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return String(dateString);
  }
}

export function getReadingTime(text: string): number {
  const wordsPerMinute = 200
  const words = text.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + '...'
}

export function plainTextFromPortableText(body: any): string {
  if (!body) return "";
  if (typeof body === "string") return body;
  if (!Array.isArray(body)) return String(body);
  const parts: string[] = [];
  for (const block of body) {
    if (!block) continue;
    if (typeof block === "string") {
      parts.push(block);
      continue;
    }
    if (Array.isArray(block.children)) {
      for (const child of block.children) {
        if (child && typeof child.text === "string") parts.push(child.text);
      }
    } else if (typeof block.text === "string") {
      parts.push(block.text);
    }
  }
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

// Convenience wrapper that returns a human readable string like "3 min read"
export function readingTime(text?: string | any): string {
  if (!text) return "1 min read";
  const str = typeof text === "string" ? text : JSON.stringify(text);
  const minutes = Math.max(1, Math.round(str.split(/\s+/).filter(Boolean).length / 200));
  return `${minutes} min read`;
}

export function estimateCharLimit(containerPx: number, avgCharPx = 7.0, lines = 3) {
  if (!containerPx || containerPx <= 0) return 150;
  const charsPerLine = Math.max(10, Math.floor(containerPx / avgCharPx));
  return charsPerLine * Math.max(1, lines);
}

export function timeAgo(dateString?: string): string {
  if (!dateString) return "";
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  const now = Date.now();
  const date = new Date(dateString).getTime();
  const seconds = Math.floor((date - now) / 1000);

  const divisions: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.34524, "week"],
    [12, "month"],
    [Number.POSITIVE_INFINITY, "year"],
  ];

  let duration = seconds;
  let i = 0;
  while (i < divisions.length) {
    const [div, unit] = divisions[i];
    if (Math.abs(duration) < div) {
      return rtf.format(Math.round(duration), unit as Intl.RelativeTimeFormatUnit);
    }
    duration = Math.round(duration / div);
    i++;
  }
  return new Date(dateString).toLocaleDateString();
}

export function isWithinDays(dateString?: string, days = 3): boolean {
  if (!dateString) return false;
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diff = now - then;
  return diff >= 0 && diff <= days * 24 * 60 * 60 * 1000;
}
