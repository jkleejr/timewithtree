// Lightweight client-side SEO monitoring.
// Records the title/description rendered for each route and keeps a change log
// in localStorage so the admin screen can surface metadata drift and issues.

const SNAPSHOT_KEY = "seo-monitor:snapshots";
const LOG_KEY = "seo-monitor:log";
const MAX_LOG = 200;

export interface SeoSnapshot {
  path: string;
  title: string;
  description: string;
  canonical: string;
  noindex: boolean;
  seenAt: string;
}

export interface SeoChangeEntry {
  path: string;
  field: "title" | "description";
  from: string;
  to: string;
  changedAt: string;
}

function read<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, value: T[]) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — monitoring is best-effort */
  }
}

export function getSnapshots(): SeoSnapshot[] {
  return read<SeoSnapshot>(SNAPSHOT_KEY);
}

export function getChangeLog(): SeoChangeEntry[] {
  return read<SeoChangeEntry>(LOG_KEY);
}

export function clearSeoMonitor() {
  write(SNAPSHOT_KEY, []);
  write(LOG_KEY, []);
}

/** Record the metadata currently rendered for a route; logs any change. */
export function recordSeoSnapshot(next: Omit<SeoSnapshot, "seenAt">) {
  if (typeof window === "undefined") return;
  const snapshots = getSnapshots();
  const prev = snapshots.find((s) => s.path === next.path);
  const now = new Date().toISOString();

  if (prev) {
    const log = getChangeLog();
    let changed = false;
    (["title", "description"] as const).forEach((field) => {
      if (prev[field] !== next[field]) {
        changed = true;
        log.unshift({ path: next.path, field, from: prev[field], to: next[field], changedAt: now });
      }
    });
    if (changed) write(LOG_KEY, log.slice(0, MAX_LOG));
  }

  const rest = snapshots.filter((s) => s.path !== next.path);
  write(SNAPSHOT_KEY, [...rest, { ...next, seenAt: now }]);
}

export interface SeoIssue {
  path: string;
  severity: "error" | "warning";
  message: string;
}

const TITLE_MIN = 15;
const TITLE_MAX = 60;
const DESC_MIN = 70;
const DESC_MAX = 160;

export function analyzeSnapshots(snapshots: SeoSnapshot[]): SeoIssue[] {
  const issues: SeoIssue[] = [];
  const titles = new Map<string, string[]>();
  const descs = new Map<string, string[]>();

  for (const s of snapshots) {
    if (!s.title) {
      issues.push({ path: s.path, severity: "error", message: "제목(title)이 없습니다." });
    } else {
      if (s.title.length > TITLE_MAX)
        issues.push({ path: s.path, severity: "warning", message: `제목이 너무 깁니다 (${s.title.length}자 / 권장 ${TITLE_MAX}자 이하).` });
      if (s.title.length < TITLE_MIN)
        issues.push({ path: s.path, severity: "warning", message: `제목이 너무 짧습니다 (${s.title.length}자).` });
      titles.set(s.title, [...(titles.get(s.title) ?? []), s.path]);
    }

    if (!s.description) {
      issues.push({ path: s.path, severity: "error", message: "설명(meta description)이 없습니다." });
    } else {
      if (s.description.length > DESC_MAX)
        issues.push({ path: s.path, severity: "warning", message: `설명이 너무 깁니다 (${s.description.length}자 / 권장 ${DESC_MAX}자 이하).` });
      if (s.description.length < DESC_MIN)
        issues.push({ path: s.path, severity: "warning", message: `설명이 너무 짧습니다 (${s.description.length}자).` });
      descs.set(s.description, [...(descs.get(s.description) ?? []), s.path]);
    }

    if (!s.canonical)
      issues.push({ path: s.path, severity: "warning", message: "canonical URL이 없습니다." });
    if (s.noindex)
      issues.push({ path: s.path, severity: "warning", message: "이 페이지는 noindex 상태입니다 (검색 노출 제외)." });
  }

  titles.forEach((paths, title) => {
    if (paths.length > 1)
      issues.push({ path: paths.join(", "), severity: "warning", message: `중복된 제목: "${title}"` });
  });
  descs.forEach((paths, desc) => {
    if (paths.length > 1)
      issues.push({
        path: paths.join(", "),
        severity: "warning",
        message: `중복된 설명: "${desc.slice(0, 40)}…"`,
      });
  });

  return issues;
}

export interface CrawlFileStatus {
  file: string;
  ok: boolean;
  status: number | null;
  detail: string;
}

/** Fetch robots.txt / sitemap.xml / rss.xml and report their crawlability. */
export async function checkCrawlFiles(): Promise<{ files: CrawlFileStatus[]; sitemapPaths: string[] }> {
  const files: CrawlFileStatus[] = [];
  let sitemapPaths: string[] = [];

  const fetchText = async (file: string) => {
    try {
      const res = await fetch(file, { cache: "no-store" });
      const text = res.ok ? await res.text() : "";
      return { res, text };
    } catch {
      return { res: null as Response | null, text: "" };
    }
  };

  const robots = await fetchText("/robots.txt");
  const robotsBlocked = /^\s*disallow:\s*\/\s*$/im.test(robots.text) && !/allow:\s*\//i.test(robots.text);
  files.push({
    file: "/robots.txt",
    ok: !!robots.res?.ok && !robotsBlocked,
    status: robots.res?.status ?? null,
    detail: !robots.res?.ok
      ? "파일을 찾을 수 없습니다."
      : robotsBlocked
        ? "모든 크롤러가 차단되어 있습니다 (Disallow: /)."
        : robots.text.match(/sitemap:/i)
          ? "정상 — 사이트맵 경로 포함."
          : "정상 — 사이트맵 경로 없음(선택 사항).",
  });

  const sitemap = await fetchText("/sitemap.xml");
  sitemapPaths = Array.from(sitemap.text.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => {
    try {
      return new URL(m[1]).pathname;
    } catch {
      return m[1];
    }
  });
  files.push({
    file: "/sitemap.xml",
    ok: !!sitemap.res?.ok && sitemapPaths.length > 0,
    status: sitemap.res?.status ?? null,
    detail: !sitemap.res?.ok
      ? "파일을 찾을 수 없습니다."
      : `URL ${sitemapPaths.length}개 등록됨.`,
  });

  const rss = await fetchText("/rss.xml");
  const itemCount = (rss.text.match(/<item>/g) ?? []).length;
  files.push({
    file: "/rss.xml",
    ok: !!rss.res?.ok && itemCount > 0,
    status: rss.res?.status ?? null,
    detail: !rss.res?.ok ? "파일을 찾을 수 없습니다." : `항목 ${itemCount}개.`,
  });

  return { files, sitemapPaths };
}
