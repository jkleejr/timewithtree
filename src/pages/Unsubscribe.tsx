import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";

type State = "loading" | "valid" | "already" | "invalid" | "success" | "error";

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<State>("loading");
  const [submitting, setSubmitting] = useState(false);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

  useEffect(() => {
    if (!token) {
      setState("invalid");
      return;
    }
    fetch(`${supabaseUrl}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`, {
      headers: { apikey: supabaseAnonKey },
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setState("invalid");
          return;
        }
        if (data.valid) setState("valid");
        else if (data.reason === "already_unsubscribed") setState("already");
        else setState("invalid");
      })
      .catch(() => setState("error"));
  }, [token, supabaseUrl, supabaseAnonKey]);

  const confirm = async () => {
    if (!token) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${supabaseUrl}/functions/v1/handle-email-unsubscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: supabaseAnonKey },
        body: JSON.stringify({ token }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.success) setState("success");
      else if (data.reason === "already_unsubscribed") setState("already");
      else setState("error");
    } catch {
      setState("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center space-y-4">
          {state === "loading" && (
            <div className="flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          )}
          {state === "valid" && (
            <>
              <h1 className="text-2xl font-semibold tracking-tight">수신 거부 확인</h1>
              <p className="text-muted-foreground">
                앞으로 나무와 걷는 시간으로부터 이메일을 받지 않으시려면 아래 버튼을 눌러주세요.
              </p>
              <Button onClick={confirm} disabled={submitting} className="w-full">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "수신 거부하기"}
              </Button>
            </>
          )}
          {state === "success" && (
            <>
              <h1 className="text-2xl font-semibold tracking-tight">수신이 거부되었습니다</h1>
              <p className="text-muted-foreground">앞으로 이 이메일 주소로 메일을 보내지 않습니다.</p>
            </>
          )}
          {state === "already" && (
            <>
              <h1 className="text-2xl font-semibold tracking-tight">이미 수신 거부됨</h1>
              <p className="text-muted-foreground">이 이메일은 이미 수신 거부 처리되었습니다.</p>
            </>
          )}
          {state === "invalid" && (
            <>
              <h1 className="text-2xl font-semibold tracking-tight">잘못된 링크</h1>
              <p className="text-muted-foreground">링크가 유효하지 않거나 만료되었습니다.</p>
            </>
          )}
          {state === "error" && (
            <>
              <h1 className="text-2xl font-semibold tracking-tight">오류가 발생했습니다</h1>
              <p className="text-muted-foreground">잠시 후 다시 시도해주세요.</p>
            </>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Unsubscribe;
