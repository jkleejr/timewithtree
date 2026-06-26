import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "visitor_session_id";

const getSessionId = (): string => {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
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
