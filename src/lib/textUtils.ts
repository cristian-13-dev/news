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

export function readingTime(
  text?: string | any,
  opts?: {
    charts?: number;
    tables?: number;
    images?: number;
    codeBlocks?: number;
    wordsPerMinute?: number;
  }
) {
  // Default fast-path
  if (!text && !opts) return "1 min read";

  const wordsPerMinute = opts?.wordsPerMinute ?? 80;

  function detectExtras(body: any) {
    let charts = 0,
      tables = 0,
      images = 0,
      codeBlocks = 0;

    if (!body) return { charts, tables, images, codeBlocks };

    if (Array.isArray(body)) {
      for (const block of body) {
        if (!block || typeof block !== "object") continue;
        const t = (block._type || block.type || "") as string;
        const tt = String(t).toLowerCase();
        if (tt.includes("chart")) charts++;
        if (tt.includes("table")) tables++;
        if (tt.includes("image")) images++;
        if (tt.includes("code") || tt === "code") codeBlocks++;
        // also inspect nested objects briefly
        if (Array.isArray(block.children)) {
          for (const child of block.children) {
            if (child && typeof child._type === "string") {
              const ct = child._type.toLowerCase();
              if (ct.includes("chart")) charts++;
              if (ct.includes("table")) tables++;
              if (ct.includes("image")) images++;
              if (ct.includes("code")) codeBlocks++;
            }
          }
        }
      }
    } else if (typeof body === "object") {
      const arr = Array.isArray((body as any).blocks)
        ? (body as any).blocks
        : Array.isArray((body as any).content)
        ? (body as any).content
        : null;
      if (arr) return detectExtras(arr);
      const s = JSON.stringify(body).toLowerCase();
      if (s.includes("chart")) charts++;
      if (s.includes("table")) tables++;
      if (s.includes("image")) images++;
      if (s.includes("```") || s.includes("\"code\"")) codeBlocks++;
    } else if (typeof body === "string") {
      const s = body.toLowerCase();
      if (s.includes("chart")) charts++;
      if (s.includes("table")) tables++;
      if (s.includes("image")) images++;
      if (s.includes("```")) codeBlocks++;
    }

    return { charts, tables, images, codeBlocks };
  }

  function extractText(body: any) {
    if (!body) return "";
    if (typeof body === "string") return body;
    if (Array.isArray(body)) return plainTextFromPortableText(body);
    if (typeof body === "object") {
      if (typeof (body as any).text === "string") return (body as any).text;
      if (Array.isArray((body as any).children)) return plainTextFromPortableText((body as any).children);
      if (Array.isArray((body as any).blocks)) return plainTextFromPortableText((body as any).blocks);
      try {
        return JSON.stringify(body);
      } catch {
        return String(body);
      }
    }
    return String(body);
  }

  const inferredExtras = detectExtras(text);
  const charts = opts?.charts ?? inferredExtras.charts;
  const tables = opts?.tables ?? inferredExtras.tables;
  const images = opts?.images ?? inferredExtras.images;
  const codeBlocks = opts?.codeBlocks ?? inferredExtras.codeBlocks;

  const str = extractText(text);
  const words = str.split(/\s+/).filter(Boolean).length;

  const baseSeconds = (words / wordsPerMinute) * 60;

  // Extra seconds per element (tunable): charts tend to need more time than a regular image.
  const extraSeconds = charts * 25 + tables * 20 + images * 7 + codeBlocks * 45;

  const totalSeconds = baseSeconds + extraSeconds;
  const minutes = Math.max(1, Math.ceil(totalSeconds / 60));
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
