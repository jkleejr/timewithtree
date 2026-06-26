import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const VISITOR_KEY = "visitor_id";

const getSessionId = (): string => {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return "unknown";
  }
};

export const usePageTracking = () => {
  const location = useLocation();
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    const path = location.pathname;
    if (lastTracked.current === path) return;
    lastTracked.current = path;

    const sessionId = getSessionId();
    void supabase
      .from("page_views")
      .insert({
        path,
        session_id: sessionId,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent.slice(0, 500),
      })
      .then(({ error }) => {
        if (error) console.warn("page_views insert failed:", error.message);
      });
  }, [location.pathname]);
};
