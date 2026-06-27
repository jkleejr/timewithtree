import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";

/**
 * UI-level guard for admin-only screens.
 * - Redirects unauthenticated users to /auth
 * - Shows a clear "access denied" screen for authenticated non-admins
 * - Renders children only when the caller is a verified admin
 *
 * Server-side enforcement is still required: every admin-only table has RLS
 * tied to public.has_role(auth.uid(), 'admin') and admin edge functions
 * re-verify the role with the service-role client.
 */
export const RequireAdmin = ({ children }: { children: ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useIsAdmin();

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center text-muted-foreground">
          로딩중...
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-semibold mb-2">접근 권한이 없습니다</h1>
            <p className="text-muted-foreground">
              이 페이지는 관리자만 접근할 수 있습니다. 권한이 필요하면 관리자에게 문의해 주세요.
            </p>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return <>{children}</>;
};
