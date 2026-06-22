import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/contexts/AuthContext";

const emailSchema = z.string().trim().email({ message: "올바른 이메일을 입력해 주세요" }).max(255);
const passwordSchema = z.string().min(6, { message: "비밀번호는 최소 6자 이상이어야 합니다" }).max(72);
const nameSchema = z.string().trim().min(1, { message: "이름을 입력해 주세요" }).max(100);

const Auth = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">(
    params.get("mode") === "signup" ? "signup" : "signin"
  );
  const redirect = params.get("redirect") ?? "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    // Link any guest orders placed with this email to the now-signed-in user.
    supabase.rpc("claim_guest_orders").then(({ data }) => {
      const claimed = typeof data === "number" ? data : 0;
      if (claimed > 0) {
        toast.success(`이전 비회원 주문 ${claimed}건이 계정에 연결되었습니다`);
      }
      navigate(redirect, { replace: true });
    });
  }, [user, navigate, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validEmail = emailSchema.parse(email);
      const validPassword = passwordSchema.parse(password);
      if (mode === "signup") nameSchema.parse(fullName);

      setLoading(true);

      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: validEmail,
          password: validPassword,
          options: {
            emailRedirectTo: `${window.location.origin}${redirect}`,
            data: { full_name: fullName.trim() },
          },
        });
        if (error) throw error;
        toast.success("회원가입이 완료되었습니다");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: validEmail,
          password: validPassword,
        });
        if (error) throw error;
        toast.success("로그인되었습니다");
      }
    } catch (err) {
      const msg = err instanceof z.ZodError
        ? err.errors[0].message
        : err instanceof Error
          ? err.message
          : "오류가 발생했습니다";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}${redirect}`,
    });
    if (result.error) {
      toast.error("Google 로그인에 실패했습니다");
      setLoading(false);
    }
  };

  return (
    <SiteLayout>
      <section className="max-w-md mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-20">
        <h1 className="font-display text-4xl md:text-5xl mb-2 font-bold font-sans">
          {mode === "signin" ? "로그인" : "회원가입"}
        </h1>
        <p className="text-muted-foreground mb-8">
          {mode === "signin"
            ? "계정에 로그인하여 주문 내역을 확인하세요."
            : "회원가입 후 더 빠르게 주문하세요."}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === "signup" && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="fullName">이름</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                maxLength={100}
              />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              maxLength={255}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              maxLength={72}
            />
          </div>
          <Button type="submit" size="lg" className="rounded-none mt-2" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === "signin" ? "로그인" : "회원가입"}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground uppercase tracking-widest">또는</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full rounded-none"
          onClick={handleGoogle}
          disabled={loading}
        >
          Google로 계속하기
        </Button>

        <p className="text-sm text-center text-muted-foreground mt-8">
          {mode === "signin" ? "아직 계정이 없으신가요? " : "이미 계정이 있으신가요? "}
          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="underline hover:text-foreground"
          >
            {mode === "signin" ? "회원가입" : "로그인"}
          </button>
        </p>
      </section>
    </SiteLayout>
  );
};

export default Auth;
