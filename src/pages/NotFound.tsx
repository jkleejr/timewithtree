import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Seo } from "@/components/Seo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <Seo
        title="페이지를 찾을 수 없습니다 (404) — 나무와 걷는 시간"
        description="요청하신 페이지가 존재하지 않거나 이동되었습니다. 홈으로 돌아가 잭큐몬티 자작나무 농장의 다른 페이지를 둘러보세요."
        path={location.pathname}
        noindex
      />
      <div className="text-center">
        <h1 className="font-display font-bold font-sans text-4xl md:text-5xl mb-4">404</h1>
        <p className="mb-6 text-base md:text-lg text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-sm text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
