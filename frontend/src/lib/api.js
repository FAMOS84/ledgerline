import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API_BASE = `${BACKEND_URL}/api`;

export const TOKEN_KEY = "ibs_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export const api = axios.create({ baseURL: API_BASE, timeout: 300_000 }); // 5 min for analyze

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      setToken(null);
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export async function loginWithPin(pin) {
  const res = await api.post("/auth/pin", { pin });
  setToken(res.data.token);
  return res.data;
}

export async function analyzeFiles(files, onProgress) {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  const res = await api.post("/analyze", form, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: onProgress,
  });
  return res.data;
}

export async function listAnalyses() {
  const res = await api.get("/analyses");
  return res.data;
}

export async function getAnalysis(id) {
  const res = await api.get(`/analyses/${id}`);
  return res.data;
}

export async function deleteAnalysis(id) {
  const res = await api.delete(`/analyses/${id}`);
  return res.data;
}

export function exportUrl(id) {
  const token = getToken();
  return `${API_BASE}/analyses/${id}/export?token=${encodeURIComponent(token || "")}`;
}
