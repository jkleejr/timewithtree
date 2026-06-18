import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";

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

type OrderStatus = "pending" | "paid" | "shipped" | "completed" | "cancelled";
const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "입금대기",
  paid: "입금완료",
  shipped: "배송중",
  completed: "배송완료",
  cancelled: "취소",
};
const STATUS_VARIANTS: Record<OrderStatus, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "outline",
  paid: "default",
  shipped: "secondary",
  completed: "default",
  cancelled: "destructive",
};

type OrderItem = {
  product_title: string;
  variant_title?: string;
  quantity: number;
  unit_price: number;
  line_total: number;
};

type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  shipping_address: string;
  postal_code: string | null;
  items: OrderItem[];
  subtotal: number;
  currency: string;
  status: OrderStatus;
  customer_note: string | null;
  admin_note: string | null;
  created_at: string;
};

// ===== Analytics sub-component =====
const AnalyticsSection = () => {
  const [range, setRange] = useState<RangeKey>("7d");
  const [views, setViews] = useState<PageView[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, [range]);

  const stats = useMemo(() => {
    const totalViews = views.length;
    const uniqueVisitors = new Set(views.map((v) => v.session_id).filter(Boolean)).size;
    const pageCounts = new Map<string, number>();
    for (const v of views) pageCounts.set(v.path, (pageCounts.get(v.path) || 0) + 1);
    const topPages = [...pageCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
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

  return (
    <Tabs value={range} onValueChange={(v) => setRange(v as RangeKey)}>
      <TabsList>
        {(Object.keys(RANGE_LABELS) as RangeKey[]).map((k) => (
          <TabsTrigger key={k} value={k}>{RANGE_LABELS[k]}</TabsTrigger>
        ))}
      </TabsList>
      <div className="mt-6 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">총 페이지뷰</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-semibold">{loading ? "—" : stats.totalViews.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">방문자 수 (세션 기준)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-semibold">{loading ? "—" : stats.uniqueVisitors.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>일자별 방문 추이</CardTitle></CardHeader>
          <CardContent>
            {loading ? <p className="text-muted-foreground">로딩중...</p> :
              stats.dailyArr.length === 0 ? <p className="text-muted-foreground">데이터가 없습니다.</p> : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b">
                    <th className="text-left py-2 font-medium">날짜</th>
                    <th className="text-right py-2 font-medium">방문자</th>
                    <th className="text-right py-2 font-medium">페이지뷰</th>
                  </tr></thead>
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
          <CardHeader><CardTitle>인기 페이지 TOP 10</CardTitle></CardHeader>
          <CardContent>
            {loading ? <p className="text-muted-foreground">로딩중...</p> :
              stats.topPages.length === 0 ? <p className="text-muted-foreground">데이터가 없습니다.</p> : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b">
                    <th className="text-left py-2 font-medium">경로</th>
                    <th className="text-right py-2 font-medium">조회수</th>
                  </tr></thead>
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
      </div>
    </Tabs>
  );
};

// ===== Orders sub-component =====
const OrdersSection = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200)
      .then(({ data }) => {
        setOrders((data as unknown as Order[]) || []);
        setLoading(false);
      });
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: OrderStatus) => {
    setUpdatingId(id);
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    setUpdatingId(null);
    if (error) toast.error("상태 변경 실패");
    else {
      toast.success("주문 상태가 변경되었습니다");
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    }
  };

  const counts = useMemo(() => {
    const c = { all: orders.length, pending: 0, paid: 0, shipped: 0, cancelled: 0 };
    for (const o of orders) c[o.status] += 1;
    return c;
  }, [orders]);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {(["all", "pending", "paid", "shipped", "cancelled"] as const).map((k) => (
          <Card key={k}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">
                {k === "all" ? "전체" : STATUS_LABELS[k as OrderStatus]}
              </p>
              <p className="text-2xl font-semibold">{counts[k]}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {orders.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">아직 주문이 없습니다.</CardContent></Card>
      ) : (
        <>
        <p className="text-xs text-muted-foreground mb-3">
          * 주문 상태를 변경하면 고객에게 자동으로 안내 이메일이 발송됩니다 (입금 확인 / 배송 시작 / 주문 취소).
        </p>
        <div className="space-y-4">
          {orders.map((o) => (
            <Card key={o.id}>
              <CardContent className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm">{o.order_number}</span>
                      <Badge variant={STATUS_VARIANTS[o.status]}>{STATUS_LABELS[o.status]}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(o.created_at).toLocaleString("ko-KR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={o.status}
                      onValueChange={(v) => updateStatus(o.id, v as OrderStatus)}
                      disabled={updatingId === o.id}
                    >
                      <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((s) => (
                          <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">주문자</p>
                    <p>{o.customer_name}</p>
                    <p className="text-muted-foreground">{o.customer_phone}</p>
                    <p className="text-muted-foreground break-all">{o.customer_email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">배송지</p>
                    <p>{o.postal_code ? `(${o.postal_code}) ` : ""}{o.shipping_address}</p>
                    {o.customer_note && (
                      <p className="text-muted-foreground mt-1">메모: {o.customer_note}</p>
                    )}
                  </div>
                </div>

                <div className="border-t border-border pt-3">
                  <p className="text-xs text-muted-foreground mb-2">상품</p>
                  <div className="space-y-1 text-sm">
                    {o.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between gap-3">
                        <span>{it.product_title}{it.variant_title && it.variant_title !== "Default Title" ? ` (${it.variant_title})` : ""} × {it.quantity}</span>
                        <span className="tabular-nums">{formatPrice(it.line_total, o.currency)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between pt-3 mt-3 border-t border-border font-medium">
                    <span>합계</span>
                    <span className="tabular-nums">{formatPrice(Number(o.subtotal), o.currency)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        </>
      )}
    </div>
  );
};

// ===== Settings sub-component =====
const SettingsSection = () => {
  const [bankInfo, setBankInfo] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("store_settings").select("bank_info").limit(1).maybeSingle().then(({ data }) => {
      setBankInfo(data?.bank_info || "");
      setLoading(false);
    });
  }, []);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("store_settings")
      .update({ bank_info: bankInfo })
      .eq("singleton", true);
    setSaving(false);
    if (error) toast.error("저장 실패");
    else toast.success("계좌 정보가 저장되었습니다");
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>입금 계좌 정보</CardTitle>
        <p className="text-sm text-muted-foreground">
          체크아웃 페이지에 표시되는 계좌 정보입니다. 비워두면 안내 문구가 대신 표시됩니다.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          rows={5}
          value={bankInfo}
          onChange={(e) => setBankInfo(e.target.value)}
          placeholder={"예시:\n농협 123-4567-8901-23\n예금주: 홍길동"}
          className="font-mono text-sm"
        />
        <Button onClick={save} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "저장"}
        </Button>
      </CardContent>
    </Card>
  );
};

// ===== Main =====
const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useIsAdmin();

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
        <h1 className="font-display text-4xl md:text-5xl font-bold font-sans tracking-tight mb-8">관리자</h1>
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList>
            <TabsTrigger value="orders">주문 관리</TabsTrigger>
            <TabsTrigger value="analytics">방문자 통계</TabsTrigger>
            <TabsTrigger value="settings">계좌 설정</TabsTrigger>
          </TabsList>
          <TabsContent value="orders"><OrdersSection /></TabsContent>
          <TabsContent value="analytics"><AnalyticsSection /></TabsContent>
          <TabsContent value="settings"><SettingsSection /></TabsContent>
        </Tabs>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Admin;
