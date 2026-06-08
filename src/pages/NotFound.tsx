import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
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
