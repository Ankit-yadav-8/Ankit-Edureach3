import { createContext, useContext, useEffect, useState } from "react";
import { apiLogin, apiSignup, apiMe } from "./api.js";

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

// ── helpers ───────────────────────────────────────────────────
const TOKEN_KEY = "edureach:token";
const USER_KEY  = "edureach:user";

function readCache() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function writeCache(user) {
  try { localStorage.setItem(USER_KEY, JSON.stringify(user)); } catch {}
}
function clearCache() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// ── provider ──────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");

  // Only hydrate user from cache if a token also exists —
  // prevents a brief isLoggedIn=true flash when token is gone but cache isn't.
  const [user, setUser] = useState(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    return savedToken ? readCache() : null;
  });

  const [loginOpen, setLoginOpen] = useState(false);
  const [loginMode, setLoginMode] = useState("login");

  useEffect(() => {
    if (!token) { setUser(null); return; }

    // Background verify — update user silently; clear if token is stale
    apiMe(token)
      .then(({ user }) => { setUser(user); writeCache(user); })
      .catch(() => { clearCache(); setToken(""); setUser(null); });
  }, [token]);

  const save = ({ token, user }) => {
    localStorage.setItem(TOKEN_KEY, token);
    writeCache(user);
    setToken(token);
    setUser(user);
  };

  // Merge a partial profile patch into the cached user (used after the
  // dashboard "Edit info" save), preserving fields the patch doesn't return.
  const updateUser = (patch) => setUser((prev) => {
    const next = { ...(prev || {}), ...(patch || {}) };
    writeCache(next);
    return next;
  });

  const value = {
    user, token, isLoggedIn: !!user,
    saveSession: save,
    updateUser,
    login:  async (email, password) => save(await apiLogin({ email, password })),
    signup: async (form) => save(await apiSignup(form)),
    logout: () => { clearCache(); setToken(""); setUser(null); },
    loginOpen, loginMode,
    openLogin:   () => { setLoginMode("login");  setLoginOpen(true); },
    openSignup:  () => { setLoginMode("signup"); setLoginOpen(true); },
    closeLogin:  () => setLoginOpen(false),
    requireAuth: (fn) => (user ? fn?.() : setLoginOpen(true)),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}