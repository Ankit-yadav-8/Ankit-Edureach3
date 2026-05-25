/* ============================================================
   Shortlist.jsx — global context for "My Colleges" (saved) and
   the Compare tray. Persists to localStorage so it survives
   reloads. (localStorage works in a real Vite app.)
   ============================================================ */
import { createContext, useContext, useEffect, useState, useCallback } from "react";

const KEY_SAVED = "edureach:saved";
const KEY_COMPARE = "edureach:compare";
const MAX_COMPARE = 3;

const read = (k) => { try { return JSON.parse(localStorage.getItem(k)) || []; } catch { return []; } };

const ShortlistContext = createContext(null);

export function ShortlistProvider({ children }) {
  const [saved, setSaved] = useState(() => read(KEY_SAVED));
  const [compare, setCompare] = useState(() => read(KEY_COMPARE));

  useEffect(() => { try { localStorage.setItem(KEY_SAVED, JSON.stringify(saved)); } catch {} }, [saved]);
  useEffect(() => { try { localStorage.setItem(KEY_COMPARE, JSON.stringify(compare)); } catch {} }, [compare]);

  const toggleSaved = useCallback((slug) => {
    setSaved((s) => (s.includes(slug) ? s.filter((x) => x !== slug) : [...s, slug]));
  }, []);
  const isSaved = useCallback((slug) => saved.includes(slug), [saved]);

  const toggleCompare = useCallback((slug) => {
    setCompare((c) => {
      if (c.includes(slug)) return c.filter((x) => x !== slug);
      if (c.length >= MAX_COMPARE) return c; // cap
      return [...c, slug];
    });
  }, []);
  const inCompare = useCallback((slug) => compare.includes(slug), [compare]);
  const clearCompare = useCallback(() => setCompare([]), []);

  return (
    <ShortlistContext.Provider value={{ saved, toggleSaved, isSaved, compare, toggleCompare, inCompare, clearCompare, MAX_COMPARE }}>
      {children}
    </ShortlistContext.Provider>
  );
}

export function useShortlist() {
  const ctx = useContext(ShortlistContext);
  if (!ctx) throw new Error("useShortlist must be used inside ShortlistProvider");
  return ctx;
}
