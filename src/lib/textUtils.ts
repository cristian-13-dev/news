export function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr as string;
  }
}

export function readingTime(text?: string | any) {
  if (!text) return "1 min read";
  const str = typeof text === "string" ? text : JSON.stringify(text);
  const words = str.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export function truncate(text?: string, n = 150) {
  if (!text) return "";
  if (text.length <= n) return text;
  return text.slice(0, n).trimEnd() + "…";
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
