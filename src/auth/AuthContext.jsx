import { createContext, useContext, useEffect, useState } from "react";
import { apiLogin, apiSignup, apiMe, apiRefresh, apiLogoutAll } from "./api.js";

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
  // The dashboard caches the account's plans to paint before the API answers
  // (see Dashboard.jsx). It's account-scoped, but signing out should still not
  // leave the last user's purchases sitting in a shared browser.
  localStorage.removeItem("cp:plans");
}

// Sessions are deliberately short-lived (see server/utils/tokens.js), so an
// active user's token is renewed in the background before it lapses rather than
// bouncing them to the login screen mid-task.
const RENEW_WHEN_UNDER_MS = 3 * 24 * 60 * 60 * 1000; // 3 days

/* Reads `exp` out of the JWT body. This is a scheduling hint only — nothing is
   trusted from it, the server verifies every token on every request. */
function msUntilExpiry(token) {
  try {
    const body = JSON.parse(atob(token.split(".")[1]));
    return typeof body.exp === "number" ? body.exp * 1000 - Date.now() : null;
  } catch { return null; }
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
    let cancelled = false;

    // Background verify — update user silently; clear if the token is stale.
    // This is also where a REVOKED session lands: the server now rejects a token
    // whose version no longer matches the account (password reset, log-out-
    // everywhere), and that 401 signs this device out for real.
    apiMe(token)
      .then(async ({ user }) => {
        if (cancelled) return;
        setUser(user); writeCache(user);

        const left = msUntilExpiry(token);
        if (left !== null && left < RENEW_WHEN_UNDER_MS) {
          try {
            const { token: fresh } = await apiRefresh(token);
            if (cancelled || !fresh) return;
            localStorage.setItem(TOKEN_KEY, fresh);
            setToken(fresh); // re-runs this effect once with the new token
          } catch { /* keep the current token; it's still valid until it isn't */ }
        }
      })
      .catch(() => {
        if (cancelled) return;
        clearCache(); setToken(""); setUser(null);
      });

    return () => { cancelled = true; };
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
    // Ends the session on every other device too. Keeps this one signed in with
    // the fresh token the server hands back.
    logoutEverywhere: async () => {
      const { token: fresh } = await apiLogoutAll(token);
      localStorage.setItem(TOKEN_KEY, fresh);
      setToken(fresh);
    },
    loginOpen, loginMode,
    openLogin:   () => { setLoginMode("login");  setLoginOpen(true); },
    openSignup:  () => { setLoginMode("signup"); setLoginOpen(true); },
    openReset:   () => { setLoginMode("reset");  setLoginOpen(true); },
    closeLogin:  () => setLoginOpen(false),
    requireAuth: (fn) => (user ? fn?.() : setLoginOpen(true)),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}