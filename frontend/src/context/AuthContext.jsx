import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, getToken, setToken } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authed, setAuthed] = useState(!!getToken());
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setChecking(false);
      setAuthed(false);
      return;
    }
    api
      .get("/auth/me")
      .then(() => setAuthed(true))
      .catch(() => {
        setToken(null);
        setAuthed(false);
      })
      .finally(() => setChecking(false));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setAuthed(false);
    window.location.href = "/login";
  }, []);

  const value = useMemo(
    () => ({ authed, setAuthed, checking, logout }),
    [authed, checking, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
