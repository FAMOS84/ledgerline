import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function Protected({ children }) {
  const { authed, checking } = useAuth();
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xs uppercase tracking-[0.3em] text-zinc-500 font-mono">
        Loading…
      </div>
    );
  }
  if (!authed) return <Navigate to="/login" replace />;
  return children;
}

function PublicOnly({ children }) {
  const { authed, checking } = useAuth();
  if (checking) return null;
  if (authed) return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route
              path="/login"
              element={
                <PublicOnly>
                  <Login />
                </PublicOnly>
              }
            />
            <Route
              path="/"
              element={
                <Protected>
                  <Dashboard />
                </Protected>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                borderRadius: 0,
                border: "1px solid rgb(228 228 231)",
                fontFamily: "'IBM Plex Sans', sans-serif",
              },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
