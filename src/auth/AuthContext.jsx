import { createContext, useContext, useEffect, useState } from "react";
import { apiLogin, apiSignup, apiMe } from "./api.js";

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("edureach:token") || "");
  const [user, setUser] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    if (!token) return;
    apiMe(token).then(({ user }) => setUser(user))
      .catch(() => { localStorage.removeItem("edureach:token"); setToken(""); });
  }, [token]);

  const save = ({ token, user }) => { localStorage.setItem("edureach:token", token); setToken(token); setUser(user); };

  const value = {
    user, token, isLoggedIn: !!user,
    saveSession: save,
    login: async (email, password) => save(await apiLogin({ email, password })),
    signup: async (form) => save(await apiSignup(form)),
    logout: () => { localStorage.removeItem("edureach:token"); setToken(""); setUser(null); },
    loginOpen, openLogin: () => setLoginOpen(true), closeLogin: () => setLoginOpen(false),
    requireAuth: (fn) => (user ? fn && fn() : setLoginOpen(true)),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}