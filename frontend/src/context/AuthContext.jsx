import { createContext, useContext, useEffect, useState } from "react";
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

  const logout = () => {
    setToken(null);
    setAuthed(false);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ authed, setAuthed, checking, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
