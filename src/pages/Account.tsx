import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const profileSchema = z.object({
  full_name: z.string().trim().max(100).optional().or(z.literal("")),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  address: z.string().trim().max(500).optional().or(z.literal("")),
  postal_code: z.string().trim().max(20).optional().or(z.literal("")),
});

const Account = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ full_name: "", phone: "", address: "", postal_code: "" });

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("full_name, phone, address, postal_code")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) console.error("Profile load failed", error?.code);
        if (data) {
          setForm({
            full_name: data.full_name ?? "",
            phone: data.phone ?? "",
            address: data.address ?? "",
            postal_code: data.postal_code ?? "",
          });
        }
        setLoading(false);
      });
  }, [user]);

  if (authLoading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validated = profileSchema.parse(form);
      setSaving(true);
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: validated.full_name || null,
          phone: validated.phone || null,
          address: validated.address || null,
          postal_code: validated.postal_code || null,
        })
        .eq("id", user.id);
      if (error) throw error;
      toast.success("프로필이 저장되었습니다");
    } catch (err) {
      const msg = err instanceof z.ZodError
        ? err.errors[0].message
        : err instanceof Error
          ? err.message
          : "오류가 발생했습니다";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("로그아웃되었습니다");
    navigate("/");
  };

  return (
    <SiteLayout>
      <section className="max-w-2xl mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-20">
        <h1 className="font-display text-4xl md:text-5xl mb-2 font-bold font-sans">내 계정</h1>
        <p className="text-muted-foreground mb-10">{user.email}</p>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="full_name">이름</Label>
              <Input
                id="full_name"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                maxLength={100}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">전화번호</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                maxLength={30}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="address">주소</Label>
              <Input
                id="address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                maxLength={500}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="postal_code">우편번호</Label>
              <Input
                id="postal_code"
                value={form.postal_code}
                onChange={(e) => setForm({ ...form, postal_code: e.target.value })}
                maxLength={20}
              />
            </div>
            <div className="flex justify-between gap-4 mt-6">
              <Button type="button" variant="outline" className="rounded-none" onClick={handleSignOut}>
                로그아웃
              </Button>
              <Button type="submit" size="lg" className="rounded-none" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "저장"}
              </Button>
            </div>
          </form>
        )}
      </section>
    </SiteLayout>
  );
};

export default Account;
