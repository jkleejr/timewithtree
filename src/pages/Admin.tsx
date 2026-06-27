import { useEffect, useMemo, useState } from "react";
import { Loader2, ShieldAlert } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { RequireAdmin } from "@/components/RequireAdmin";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Archive, ArchiveRestore } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

// Surfaces a server-side permission denial as a clear UI error instead of
// silently rendering empty data. RLS/grants enforce the real check; this is
// just a defense-in-depth signal in case a role is revoked mid-session.
const isPermissionError = (err: { code?: string; message?: string } | null) => {
  if (!err) return false;
  if (err.code === "42501" || err.code === "PGRST301" || err.code === "PGRST302") return true;
  const msg = (err.message || "").toLowerCase();
  return msg.includes("permission denied") || msg.includes("not authorized") || msg.includes("rls");
};

const PermissionDenied = ({ resource }: { resource: string }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <ShieldAlert className="h-10 w-10 text-destructive mb-3" />
    <h3 className="text-lg font-semibold mb-1">접근 권한이 없습니다</h3>
    <p className="text-sm text-muted-foreground max-w-sm">
      {resource} 데이터를 불러올 권한이 없습니다. 관리자 권한이 만료되었거나 해제되었을 수 있습니다.
    </p>
  </div>
);

type RangeKey = "1d" | "7d" | "30d" | "all";
const RANGE_LABELS: Record<RangeKey, string> = {
  "1d": "최근 24시간",
  "7d": "최근 7일",
  "30d": "최근 30일",
  "all": "전체 기간",
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
const STATUS_CLASSES: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-100",
  paid: "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-100",
  shipped: "bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-100",
  completed: "bg-green-100 text-green-800 border-green-300 hover:bg-green-100",
  cancelled: "bg-red-100 text-red-800 border-red-300 hover:bg-red-100",
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
  shipped_email_sent_at: string | null;
  created_at: string;
  archived_at: string | null;
};

// ===== Analytics sub-component =====
const AnalyticsSection = () => {
  const [views, setViews] = useState<PageView[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartRange, setChartRange] = useState<RangeKey>("30d");

  useEffect(() => {
    setLoading(true);
    supabase
      .from("page_views")
      .select("id, path, session_id, referrer, created_at")
      .order("created_at", { ascending: false })
      .limit(50000)
      .then(({ data }) => {
        setViews((data as PageView[]) || []);
        setLoading(false);
      });
  }, []);

  const buckets = useMemo(() => {
    const now = Date.now();
    const windows: { key: RangeKey; ms: number | null }[] = [
      { key: "1d", ms: 24 * 60 * 60 * 1000 },
      { key: "7d", ms: 7 * 24 * 60 * 60 * 1000 },
      { key: "30d", ms: 30 * 24 * 60 * 60 * 1000 },
      { key: "all", ms: null },
    ];
    return windows.map(({ key, ms }) => {
      const filtered = ms == null
        ? views
        : views.filter((v) => now - new Date(v.created_at).getTime() <= ms);
      const visitors = new Set(filtered.map((v) => v.session_id).filter(Boolean)).size;
      return { key, label: RANGE_LABELS[key], pageviews: filtered.length, visitors };
    });
  }, [views]);

  const chartData = useMemo(() => {
    const rangeMs: Record<RangeKey, number | null> = {
      "1d": 24 * 60 * 60 * 1000,
      "7d": 7 * 24 * 60 * 60 * 1000,
      "30d": 30 * 24 * 60 * 60 * 1000,
      "all": null,
    };
    const now = Date.now();
    const ms = rangeMs[chartRange];

    // Build day buckets
    const dayMap = new Map<string, { views: number; sessions: Set<string> }>();
    const days = chartRange === "1d" ? 1 : chartRange === "7d" ? 7 : chartRange === "30d" ? 30 : 30;
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(start.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      dayMap.set(key, { views: 0, sessions: new Set() });
    }

    for (const v of views) {
      if (ms != null && now - new Date(v.created_at).getTime() > ms) continue;
      const key = v.created_at.slice(0, 10);
      const entry = dayMap.get(key);
      if (!entry) continue;
      entry.views += 1;
      if (v.session_id) entry.sessions.add(v.session_id);
    }
    return [...dayMap.entries()].map(([day, e]) => ({
      day: day.slice(5), // MM-DD
      방문자: e.sessions.size,
      페이지뷰: e.views,
    }));
  }, [views, chartRange]);

  const chartTitle = useMemo(() => {
    const titles: Record<RangeKey, string> = {
      "1d": "최근 24시간 추이",
      "7d": "최근 7일 추이",
      "30d": "최근 30일 추이",
      "all": "전체 기간 추이",
    };
    return titles[chartRange];
  }, [chartRange]);

  const currentVisitors = useMemo(() => {
    const cutoff = Date.now() - 5 * 60 * 1000; // last 5 minutes
    const sessions = new Set(
      views
        .filter((v) => new Date(v.created_at).getTime() >= cutoff)
        .map((v) => v.session_id)
        .filter(Boolean)
    );
    return sessions.size;
  }, [views]);

  return (
    <div className="mt-6">
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between gap-4 border-b">
          <CardTitle className="text-xl">웹 트래픽</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className={`h-2 w-2 rounded-full ${currentVisitors > 0 ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/40"}`} />
            현재 방문자 {loading ? "—" : currentVisitors}명
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Inline metric cells */}
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-border">
            {buckets.map((b) => (
              <div key={b.key} className="p-6">
                <div className="text-sm text-muted-foreground">{b.label}</div>
                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-3xl font-semibold tracking-tight text-foreground">
                      {loading ? "—" : b.visitors.toLocaleString()}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">고유 방문자</div>
                  </div>
                  <div>
                    <div className="text-3xl font-semibold tracking-tight text-foreground">
                      {loading ? "—" : b.pageviews.toLocaleString()}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">총 페이지뷰</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="border-t p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="text-sm font-medium text-muted-foreground">{chartTitle}</div>
              <Select value={chartRange} onValueChange={(v) => setChartRange(v as RangeKey)}>
                <SelectTrigger className="h-9 w-36 bg-black text-white border-black hover:bg-black/90 focus:ring-0 focus:ring-offset-0 [&>svg]:text-white">
                  <SelectValue placeholder="기간 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">24시간</SelectItem>
                  <SelectItem value="7d">7일</SelectItem>
                  <SelectItem value="30d">30일</SelectItem>
                  <SelectItem value="all">전체 기간</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {loading ? (
              <p className="text-muted-foreground">로딩중...</p>
            ) : (
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="visitorFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} width={32} />
                    <Tooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                    <Area
                      type="monotone"
                      dataKey="방문자"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fill="url(#visitorFill)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ===== Orders sub-component =====
const OrdersSection = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [sendingShipId, setSendingShipId] = useState<string | null>(null);
  const [view, setView] = useState<"active" | "archived">("active");
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);

  const load = () => {
    setLoading(true);
    const query = supabase
      .from("orders")
      .select("id, order_number, customer_name, customer_phone, customer_email, shipping_address, postal_code, items, subtotal, currency, status, customer_note, shipped_email_sent_at, created_at, archived_at")
      .order("created_at", { ascending: false })
      .limit(500);
    const filtered = view === "archived"
      ? query.not("archived_at", "is", null)
      : query.is("archived_at", null);
    filtered.then(({ data }) => {
      setOrders((data as unknown as Order[]) || []);
      setLoading(false);
      setSelected(new Set());
    });
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [view]);

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

  const sendShippedEmail = async (id: string) => {
    setSendingShipId(id);
    const { data, error } = await supabase.functions.invoke("send-shipped-notification", {
      body: { order_id: id },
    });
    setSendingShipId(null);
    if (error) {
      toast.error("배송중 알림 메일 발송 실패");
      return;
    }
    if (data?.alreadySent) {
      toast.info("이미 배송중 알림이 발송된 주문입니다");
    } else {
      toast.success("배송중 알림 메일이 발송되었습니다");
    }
    const sentAt = data?.sentAt ?? new Date().toISOString();
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status: "shipped", shipped_email_sent_at: sentAt } : o,
      ),
    );
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selected.size === orders.length) setSelected(new Set());
    else setSelected(new Set(orders.map((o) => o.id)));
  };

  const bulkArchive = async () => {
    if (selected.size === 0) return;
    setBulkBusy(true);
    const ids = Array.from(selected);
    const { error } = await supabase
      .from("orders")
      .update({ archived_at: new Date().toISOString() })
      .in("id", ids);
    setBulkBusy(false);
    if (error) { toast.error("보관 처리 실패"); return; }
    toast.success(`${ids.length}개 주문을 보관함으로 이동했습니다`);
    setOrders((prev) => prev.filter((o) => !selected.has(o.id)));
    setSelected(new Set());
    setSelectMode(false);
  };

  const bulkRestore = async () => {
    if (selected.size === 0) return;
    setBulkBusy(true);
    const ids = Array.from(selected);
    const { error } = await supabase
      .from("orders")
      .update({ archived_at: null })
      .in("id", ids);
    setBulkBusy(false);
    if (error) { toast.error("복원 실패"); return; }
    toast.success(`${ids.length}개 주문을 복원했습니다`);
    setOrders((prev) => prev.filter((o) => !selected.has(o.id)));
    setSelected(new Set());
    setSelectMode(false);
  };

  const counts = useMemo(() => {
    const c = { all: orders.length, pending: 0, paid: 0, shipped: 0, completed: 0, cancelled: 0 };
    for (const o of orders) c[o.status] += 1;
    return c;
  }, [orders]);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  const isArchivedView = view === "archived";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={!isArchivedView ? "default" : "outline"}
            onClick={() => { setView("active"); setSelectMode(false); }}
          >
            활성 주문
          </Button>
          <Button
            size="sm"
            variant={isArchivedView ? "default" : "outline"}
            onClick={() => { setView("archived"); setSelectMode(false); }}
          >
            <Archive className="h-3.5 w-3.5 mr-1.5" />
            보관함
          </Button>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {selectMode ? (
            <>
              <Button size="sm" variant="ghost" onClick={selectAll}>
                {selected.size === orders.length && orders.length > 0 ? "전체 해제" : "전체 선택"}
              </Button>
              <Button
                size="sm"
                variant={isArchivedView ? "default" : "destructive"}
                disabled={selected.size === 0 || bulkBusy}
                onClick={isArchivedView ? bulkRestore : bulkArchive}
              >
                {bulkBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : (
                  <>
                    {isArchivedView ? <ArchiveRestore className="h-3.5 w-3.5 mr-1.5" /> : <Archive className="h-3.5 w-3.5 mr-1.5" />}
                    {isArchivedView ? `복원 (${selected.size})` : `보관 (${selected.size})`}
                  </>
                )}
              </Button>
              <Button size="sm" variant="outline" onClick={() => { setSelectMode(false); setSelected(new Set()); }}>
                취소
              </Button>
            </>
          ) : (
            <Button size="sm" variant="outline" onClick={() => setSelectMode(true)} disabled={orders.length === 0}>
              {isArchivedView ? "복원할 주문 선택" : "보관할 주문 선택"}
            </Button>
          )}
        </div>
      </div>

      {!isArchivedView && (
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
          {(["all", "pending", "paid", "shipped", "completed", "cancelled"] as const).map((k) => (
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
      )}

      {orders.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">
          {isArchivedView ? "보관된 주문이 없습니다." : "아직 주문이 없습니다."}
        </CardContent></Card>
      ) : (
        <>
        {!isArchivedView && (
          <p className="text-xs text-muted-foreground mb-3">
            * 상태를 변경해도 고객에게 자동 메일은 발송되지 않습니다. 배송을 시작하면 각 주문의 <strong>배송중 알림 메일</strong> 버튼을 눌러 고객에게 안내해 주세요.
          </p>
        )}
        <div className="space-y-4">
          {orders.map((o) => (
            <Card key={o.id} className={selected.has(o.id) ? "ring-2 ring-primary" : ""}>
              <CardContent className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div className="flex items-start gap-3">
                    {selectMode && (
                      <Checkbox
                        className="mt-1"
                        checked={selected.has(o.id)}
                        onCheckedChange={() => toggleSelect(o.id)}
                      />
                    )}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm">{o.order_number}</span>
                        <Badge variant="outline" className={STATUS_CLASSES[o.status]}>{STATUS_LABELS[o.status]}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(o.created_at).toLocaleString("ko-KR")}
                      </p>
                    </div>
                  </div>
                  {!selectMode && !isArchivedView && (
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      <Button
                        size="sm"
                        variant={o.shipped_email_sent_at ? "outline" : "default"}
                        disabled={!!o.shipped_email_sent_at || sendingShipId === o.id}
                        onClick={() => sendShippedEmail(o.id)}
                      >
                        {sendingShipId === o.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : o.shipped_email_sent_at ? (
                          "메일 발송됨 ✓"
                        ) : (
                          "배송중 알림 메일"
                        )}
                      </Button>
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
                  )}
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
