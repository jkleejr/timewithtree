import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  analyzeSnapshots,
  checkCrawlFiles,
  clearSeoMonitor,
  getChangeLog,
  getSnapshots,
  type CrawlFileStatus,
  type SeoChangeEntry,
  type SeoSnapshot,
} from "@/lib/seoMonitor";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("ko-KR", { dateStyle: "short", timeStyle: "short" });

export const SeoSection = () => {
  const [snapshots, setSnapshots] = useState<SeoSnapshot[]>([]);
  const [log, setLog] = useState<SeoChangeEntry[]>([]);
  const [files, setFiles] = useState<CrawlFileStatus[]>([]);
  const [sitemapPaths, setSitemapPaths] = useState<string[]>([]);
  const [checking, setChecking] = useState(true);

  const refresh = useCallback(async () => {
    setChecking(true);
    setSnapshots(getSnapshots());
    setLog(getChangeLog());
    const result = await checkCrawlFiles();
    setFiles(result.files);
    setSitemapPaths(result.sitemapPaths);
    setChecking(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const issues = useMemo(() => analyzeSnapshots(snapshots), [snapshots]);
  const missingFromSitemap = useMemo(
    () => snapshots.filter((s) => !s.noindex && sitemapPaths.length > 0 && !sitemapPaths.includes(s.path)),
    [snapshots, sitemapPaths],
  );

  const errorCount = issues.filter((i) => i.severity === "error").length;
  const warnCount = issues.filter((i) => i.severity === "warning").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant={errorCount ? "destructive" : "secondary"}>오류 {errorCount}</Badge>
          <Badge variant="secondary">경고 {warnCount}</Badge>
          <Badge variant="secondary">추적 중인 페이지 {snapshots.length}</Badge>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => void refresh()} disabled={checking}>
            {checking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            다시 검사
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              clearSeoMonitor();
              void refresh();
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            기록 삭제
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">크롤링 파일 상태</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {checking && files.length === 0 && <p className="text-sm text-muted-foreground">확인 중…</p>}
          {files.map((f) => (
            <div key={f.file} className="flex items-start gap-2 rounded-md border p-3 text-sm">
              {f.ok ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              ) : (
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              )}
              <div>
                <p className="font-medium">
                  {f.file} {f.status !== null && <span className="text-muted-foreground">({f.status})</span>}
                </p>
                <p className="text-muted-foreground">{f.detail}</p>
              </div>
            </div>
          ))}
          {missingFromSitemap.length > 0 && (
            <div className="rounded-md border border-destructive/40 p-3 text-sm">
              <p className="font-medium">사이트맵에 없는 페이지</p>
              <p className="text-muted-foreground">{missingFromSitemap.map((s) => s.path).join(", ")}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">메타데이터 문제</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {issues.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              발견된 문제가 없습니다. 방문한 페이지만 검사되므로, 각 페이지를 한 번씩 열어보면 더 정확합니다.
            </p>
          ) : (
            issues.map((issue, i) => (
              <div key={i} className="flex items-start gap-2 rounded-md border p-3 text-sm">
                <AlertTriangle
                  className={`mt-0.5 h-4 w-4 shrink-0 ${issue.severity === "error" ? "text-destructive" : "text-muted-foreground"}`}
                />
                <div>
                  <p className="font-medium">{issue.path}</p>
                  <p className="text-muted-foreground">{issue.message}</p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">현재 페이지 메타데이터</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {snapshots.length === 0 ? (
            <p className="text-sm text-muted-foreground">아직 기록된 페이지가 없습니다.</p>
          ) : (
            snapshots
              .slice()
              .sort((a, b) => a.path.localeCompare(b.path))
              .map((s) => (
                <div key={s.path} className="rounded-md border p-3 text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{s.path}</span>
                    {s.noindex && <Badge variant="destructive">noindex</Badge>}
                    <span className="text-xs text-muted-foreground">{formatDate(s.seenAt)}</span>
                  </div>
                  <p className="mt-1">
                    <span className="text-muted-foreground">제목 ({s.title.length}자): </span>
                    {s.title}
                  </p>
                  <p>
                    <span className="text-muted-foreground">설명 ({s.description.length}자): </span>
                    {s.description}
                  </p>
                </div>
              ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">변경 기록</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {log.length === 0 ? (
            <p className="text-sm text-muted-foreground">기록된 변경 사항이 없습니다.</p>
          ) : (
            log.map((entry, i) => (
              <div key={i} className="rounded-md border p-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{entry.path}</span>
                  <Badge variant="secondary">{entry.field === "title" ? "제목" : "설명"}</Badge>
                  <span className="text-xs text-muted-foreground">{formatDate(entry.changedAt)}</span>
                </div>
                <p className="mt-1 text-muted-foreground line-through">{entry.from}</p>
                <p>{entry.to}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
