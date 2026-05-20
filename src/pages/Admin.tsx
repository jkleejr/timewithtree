import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type RangeKey = "1d" | "7d" | "30d";

const RANGE_LABELS: Record<RangeKey, string> = {
  "1d": "최근 24시간",
  "7d": "최근 7일",
  "30d": "최근 30일",
};

type PageView = {
  id: string;
  path: string;
  session_id: string | null;
  referrer: string | null;
  created_at: string;
};

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const [range, setRange] = useState<RangeKey>("7d");
  const [views, setViews] = useState<PageView[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) return;
    const days = range === "1d" ? 1 : range === "7d" ? 7 : 30;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    setLoading(true);
    supabase
      .from("page_views")
      .select("id, path, session_id, referrer, created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(5000)
      .then(({ data }) => {
        setViews((data as PageView[]) || []);
        setLoading(false);
      });
  }, [isAdmin, range]);

  const stats = useMemo(() => {
    const totalViews = views.length;
    const uniqueVisitors = new Set(views.map((v) => v.session_id).filter(Boolean)).size;
    const pageCounts = new Map<string, number>();
    for (const v of views) pageCounts.set(v.path, (pageCounts.get(v.path) || 0) + 1);
    const topPages = [...pageCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);

    // Daily breakdown
    const daily = new Map<string, { views: number; sessions: Set<string> }>();
    for (const v of views) {
      const day = v.created_at.slice(0, 10);
      const entry = daily.get(day) || { views: 0, sessions: new Set() };
      entry.views += 1;
      if (v.session_id) entry.sessions.add(v.session_id);
      daily.set(day, entry);
    }
    const dailyArr = [...daily.entries()]
      .map(([day, e]) => ({ day, views: e.views, visitors: e.sessions.size }))
      .sort((a, b) => b.day.localeCompare(a.day));

    return { totalViews, uniqueVisitors, topPages, dailyArr };
  }, [views]);

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center text-muted-foreground">로딩중...</main>
        <SiteFooter />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-2">접근 권한이 없습니다</h1>
            <p className="text-muted-foreground">관리자만 접근할 수 있는 페이지입니다.</p>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-10 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">관리자</h1>
        </div>

        <Tabs value={range} onValueChange={(v) => setRange(v as RangeKey)} className="mb-8">
          <TabsList>
            {(Object.keys(RANGE_LABELS) as RangeKey[]).map((k) => (
              <TabsTrigger key={k} value={k}>
                {RANGE_LABELS[k]}
              </TabsTrigger>
            ))}
          </TabsList>

          {(Object.keys(RANGE_LABELS) as RangeKey[]).map((k) => (
            <TabsContent key={k} value={k} className="mt-6 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      총 페이지뷰
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-semibold">
                      {loading ? "—" : stats.totalViews.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      방문자 수 (세션 기준)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-semibold">
                      {loading ? "—" : stats.uniqueVisitors.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>일자별 방문 추이</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <p className="text-muted-foreground">로딩중...</p>
                  ) : stats.dailyArr.length === 0 ? (
                    <p className="text-muted-foreground">데이터가 없습니다.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 font-medium">날짜</th>
                            <th className="text-right py-2 font-medium">방문자</th>
                            <th className="text-right py-2 font-medium">페이지뷰</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.dailyArr.map((d) => (
                            <tr key={d.day} className="border-b border-border/60">
                              <td className="py-2">{d.day}</td>
                              <td className="py-2 text-right">{d.visitors.toLocaleString()}</td>
                              <td className="py-2 text-right">{d.views.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>인기 페이지 TOP 10</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <p className="text-muted-foreground">로딩중...</p>
                  ) : stats.topPages.length === 0 ? (
                    <p className="text-muted-foreground">데이터가 없습니다.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 font-medium">경로</th>
                            <th className="text-right py-2 font-medium">조회수</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.topPages.map(([path, count]) => (
                            <tr key={path} className="border-b border-border/60">
                              <td className="py-2 font-mono text-xs sm:text-sm">{path}</td>
                              <td className="py-2 text-right">{count.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Admin;
