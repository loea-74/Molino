"use client";

import { useEffect, useState } from "react";

type Testimonial = {
  quote: { es: string; en: string };
  name: string;
  meta: { es: string; en: string };
};

const inputStyle: React.CSSProperties = {
  width: "100%", boxSizing: "border-box",
  padding: "9px 12px", borderRadius: 7,
  border: "1.5px solid #d4c4b0",
  fontSize: 14, outline: "none", background: "#faf6f0",
  color: "#3a2010",
};

function TestimonialCard({ t, index, onChange, onDelete }: {
  t: Testimonial; index: number;
  onChange: (v: Testimonial) => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: "1.5px solid #e0d4c0", borderRadius: 12, marginBottom: 12, overflow: "hidden" }}>
      <button onClick={() => setOpen(!open)}
        style={{ width: "100%", padding: "16px 20px", background: open ? "#f0e6d8" : "#f5ede0", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left" }}>
        <div>
          <div style={{ fontSize: 11, color: "#9a6040", letterSpacing: "0.1em", textTransform: "uppercase" }}>{index + 1} · Testimonio</div>
          <div style={{ fontSize: 16, color: "#3a2010", fontWeight: 500, marginTop: 2 }}>{t.name}</div>
        </div>
        <span style={{ fontSize: 18, color: "#9a6040" }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div style={{ padding: "24px 20px", background: "#fff" }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9a6040", marginBottom: 6 }}>Cita (quote)</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div>
                <div style={{ fontSize: 10, color: "#aaa", marginBottom: 3 }}>Español</div>
                <textarea value={t.quote.es} onChange={(e) => onChange({ ...t, quote: { ...t.quote, es: e.target.value } })} rows={3} style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} />
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#aaa", marginBottom: 3 }}>English</div>
                <textarea value={t.quote.en} onChange={(e) => onChange({ ...t, quote: { ...t.quote, en: e.target.value } })} rows={3} style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} />
              </div>
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9a6040", marginBottom: 6 }}>Nombre</div>
            <input value={t.name} onChange={(e) => onChange({ ...t, name: e.target.value })} style={inputStyle} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9a6040", marginBottom: 6 }}>Meta (descripción breve)</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div>
                <div style={{ fontSize: 10, color: "#aaa", marginBottom: 3 }}>Español</div>
                <input value={t.meta.es} onChange={(e) => onChange({ ...t, meta: { ...t.meta, es: e.target.value } })} style={inputStyle} />
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#aaa", marginBottom: 3 }}>English</div>
                <input value={t.meta.en} onChange={(e) => onChange({ ...t, meta: { ...t.meta, en: e.target.value } })} style={inputStyle} />
              </div>
            </div>
          </div>
          <button onClick={onDelete}
            style={{ fontSize: 12, color: "#c0392b", background: "none", border: "1px solid #c0392b", padding: "6px 16px", borderRadius: 999, cursor: "pointer" }}>
            Eliminar testimonio
          </button>
        </div>
      )}
    </div>
  );
}

export default function TestimonialsEditor() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/testimonials")
      .then((r) => r.json())
      .then(({ testimonials }) => { setItems(testimonials); setLoading(false); })
      .catch(() => { setMsg("Error al cargar"); setLoading(false); });
  }, []);

  async function handleSave() {
    setSaving(true); setMsg("");
    const res = await fetch("/api/admin/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ testimonials: items }),
    });
    const data = await res.json();
    setSaving(false);
    setMsg(res.ok ? "✓ Guardado. Vercel desplegará los cambios en ~1 minuto." : `Error: ${data.error}`);
  }

  function addNew() {
    setItems((prev) => [...prev, { quote: { es: "", en: "" }, name: "", meta: { es: "", en: "" } }]);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ fontFamily: "serif", fontSize: 20, fontWeight: 400, color: "#3a2010", margin: 0 }}>Testimonios de clientes</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {msg && <span style={{ fontSize: 13, color: msg.startsWith("✓") ? "#2d7a3a" : "#c0392b" }}>{msg}</span>}
          <button onClick={handleSave} disabled={saving || loading}
            style={{ padding: "10px 24px", borderRadius: 999, border: "none", background: saving || loading ? "#c4a87a" : "#8b3e1f", color: "#f5ede0", fontSize: 14, fontWeight: 500, cursor: saving || loading ? "default" : "pointer" }}>
            {saving ? "Guardando..." : "Guardar y publicar"}
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", color: "#9a6040", padding: 48 }}>Cargando...</div>
      ) : (
        <>
          {items.map((t, i) => (
            <TestimonialCard key={i} t={t} index={i}
              onChange={(v) => setItems((prev) => prev.map((x, j) => j === i ? v : x))}
              onDelete={() => setItems((prev) => prev.filter((_, j) => j !== i))}
            />
          ))}
          <button onClick={addNew}
            style={{ width: "100%", padding: "14px", borderRadius: 12, border: "1.5px dashed #c4a87a", background: "transparent", color: "#9a6040", fontSize: 14, cursor: "pointer", marginTop: 4 }}>
            + Agregar testimonio
          </button>
        </>
      )}
    </div>
  );
}
