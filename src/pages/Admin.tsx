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
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Archive, ArchiveRestore } from "lucide-react";
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
  delivery_message: string | null;
  recipient_name: string | null;
  recipient_phone: string | null;
  recipient_address: string | null;
  recipient_postal_code: string | null;
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
  const [sendingShipId, setSendingShipId] = useState<string | null>(null);
  const [view, setView] = useState<"active" | "archived">("active");
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);

  const load = () => {
    setLoading(true);
    const query = supabase
      .from("orders")
      .select("id, order_number, customer_name, customer_phone, customer_email, shipping_address, postal_code, items, subtotal, currency, status, customer_note, shipped_email_sent_at, created_at, archived_at, delivery_message, recipient_name, recipient_phone, recipient_address, recipient_postal_code")
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
                    {o.recipient_name && (
                      <p>{o.recipient_name}{o.recipient_phone ? ` · ${o.recipient_phone}` : ""}</p>
                    )}
                    <p>{(o.recipient_postal_code || o.postal_code) ? `(${o.recipient_postal_code || o.postal_code}) ` : ""}{o.recipient_address || o.shipping_address}</p>
                    {o.delivery_message && (
                      <p className="text-muted-foreground mt-1">요청사항: {o.delivery_message}</p>
                    )}
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
                  <div className="mt-3 pt-3 border-t border-border space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">상품 금액</span>
                      <span className="tabular-nums">{formatPrice(Number(o.subtotal), o.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">용달배송비</span>
                      <span className="text-muted-foreground">별도 (기사님께 직접 지불)</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border font-medium">
                      <span>합계</span>
                      <span className="tabular-nums">
                        {formatPrice(Number(o.subtotal), o.currency)}
                        <span className="text-xs text-muted-foreground font-normal"> + 용달배송비</span>
                      </span>
                    </div>
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
