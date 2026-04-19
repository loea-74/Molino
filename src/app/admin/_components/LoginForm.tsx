"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.refresh();
    } else {
      setError("Contraseña incorrecta");
      setPassword("");
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#1a1205", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "#f5ede0", borderRadius: 16, padding: "48px 40px", width: "100%", maxWidth: 380 }}>
        <div style={{ fontFamily: "serif", fontSize: 22, fontWeight: 400, color: "#3a2010", marginBottom: 6 }}>
          Molino la Jalisciense
        </div>
        <div style={{ fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9a6040", marginBottom: 32 }}>
          Panel de administración
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            autoFocus
            style={{
              width: "100%", boxSizing: "border-box",
              padding: "12px 16px", borderRadius: 8,
              border: error ? "1.5px solid #c0392b" : "1.5px solid #d4c4b0",
              fontSize: 15, outline: "none", background: "#fff",
              marginBottom: 12,
            }}
          />
          {error && (
            <div style={{ fontSize: 13, color: "#c0392b", marginBottom: 12 }}>{error}</div>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            style={{
              width: "100%", padding: "12px", borderRadius: 8,
              background: loading || !password ? "#c4a87a" : "#8b3e1f",
              color: "#f5ede0", border: "none", fontSize: 14,
              fontWeight: 500, cursor: loading || !password ? "default" : "pointer",
            }}
          >
            {loading ? "Verificando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
