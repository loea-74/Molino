"use client";

import { useEffect, useState } from "react";

type Lang = { es: string; en: string };
type Site = {
  hero: {
    pill: Lang;
    title: { es: string[]; en: string[] };
    body: Lang;
    phone: string;
    whatsapp: string;
    address: Lang;
    image: string;
    stat1: { number: string; label: Lang };
    stat2: { number: string; label: Lang };
    stat3: { number: string; label: Lang };
    heroNotice: { title: Lang; body: Lang };
  };
  history: {
    title: Lang; body1: Lang; body2: Lang;
    quote: Lang; caption: Lang; badge: Lang; image: string;
  };
  visit: {
    title: Lang; body: Lang;
    noticeTitle: Lang; noticeBody: Lang;
    address: Lang; hours: Lang;
    phone: string; whatsapp: string; email: string;
  };
  catalog: { page1: string; page2: string };
};

const inputStyle: React.CSSProperties = {
  width: "100%", boxSizing: "border-box",
  padding: "9px 12px", borderRadius: 7,
  border: "1.5px solid #d4c4b0",
  fontSize: 14, outline: "none", background: "#faf6f0",
  color: "#3a2010",
};

const label = (text: string) => (
  <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9a6040", marginBottom: 6 }}>{text}</div>
);

function BiField({ lbl, value, onChange }: { lbl: string; value: Lang; onChange: (v: Lang) => void }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label(lbl)}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div>
          <div style={{ fontSize: 10, color: "#aaa", marginBottom: 3 }}>Español</div>
          <input value={value.es} onChange={(e) => onChange({ ...value, es: e.target.value })} style={inputStyle} />
        </div>
        <div>
          <div style={{ fontSize: 10, color: "#aaa", marginBottom: 3 }}>English</div>
          <input value={value.en} onChange={(e) => onChange({ ...value, en: e.target.value })} style={inputStyle} />
        </div>
      </div>
    </div>
  );
}

function BiTextarea({ lbl, value, onChange, rows = 3 }: { lbl: string; value: Lang; onChange: (v: Lang) => void; rows?: number }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label(lbl)}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div>
          <div style={{ fontSize: 10, color: "#aaa", marginBottom: 3 }}>Español</div>
          <textarea value={value.es} onChange={(e) => onChange({ ...value, es: e.target.value })} rows={rows} style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} />
        </div>
        <div>
          <div style={{ fontSize: 10, color: "#aaa", marginBottom: 3 }}>English</div>
          <textarea value={value.en} onChange={(e) => onChange({ ...value, en: e.target.value })} rows={rows} style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} />
        </div>
      </div>
    </div>
  );
}

function SingleField({ lbl, value, onChange, placeholder }: { lbl: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label(lbl)}
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={inputStyle} />
    </div>
  );
}

export default function SiteEditor() {
  const [site, setSite] = useState<Site | null>(null);
  const [section, setSection] = useState<"hero" | "history" | "visit" | "catalog">("hero");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/site")
      .then((r) => r.json())
      .then(({ site }) => { setSite(site); setLoading(false); })
      .catch(() => { setMsg("Error al cargar contenido"); setLoading(false); });
  }, []);

  async function handleSave() {
    if (!site) return;
    setSaving(true); setMsg("");
    const res = await fetch("/api/admin/site", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ site }),
    });
    const data = await res.json();
    setSaving(false);
    setMsg(res.ok ? "✓ Guardado. Vercel desplegará los cambios en ~1 minuto." : `Error: ${data.error}`);
  }

  const setHero = (field: keyof Site["hero"], val: unknown) =>
    setSite((s) => s ? { ...s, hero: { ...s.hero, [field]: val } } : s);
  const setHistory = (field: keyof Site["history"], val: unknown) =>
    setSite((s) => s ? { ...s, history: { ...s.history, [field]: val } } : s);
  const setVisit = (field: keyof Site["visit"], val: unknown) =>
    setSite((s) => s ? { ...s, visit: { ...s.visit, [field]: val } } : s);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ fontFamily: "serif", fontSize: 20, fontWeight: 400, color: "#3a2010", margin: 0 }}>Contenido del sitio</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {msg && <span style={{ fontSize: 13, color: msg.startsWith("✓") ? "#2d7a3a" : "#c0392b" }}>{msg}</span>}
          <button onClick={handleSave} disabled={saving || loading}
            style={{ padding: "10px 24px", borderRadius: 999, border: "none", background: saving || loading ? "#c4a87a" : "#8b3e1f", color: "#f5ede0", fontSize: 14, fontWeight: 500, cursor: saving || loading ? "default" : "pointer" }}>
            {saving ? "Guardando..." : "Guardar y publicar"}
          </button>
        </div>
      </div>

      {/* Sub-tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 28, borderBottom: "1.5px solid #e0d4c0" }}>
        {([["hero", "01 · Inicio"], ["history", "03 · Historia"], ["visit", "06 · Visítanos"], ["catalog", "Folleto"]] as const).map(([key, lbl]) => (
          <button key={key} onClick={() => setSection(key)}
            style={{ padding: "8px 18px", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, background: "none",
              borderBottom: section === key ? "2.5px solid #8b3e1f" : "2.5px solid transparent",
              color: section === key ? "#8b3e1f" : "#9a6040", marginBottom: -1.5 }}>
            {lbl}
          </button>
        ))}
      </div>

      {loading && <div style={{ textAlign: "center", color: "#9a6040", padding: 48 }}>Cargando...</div>}

      {!loading && site && section === "hero" && (
        <div>
          <BiField lbl="Etiqueta superior (pill)" value={site.hero.pill} onChange={(v) => setHero("pill", v)} />
          <div style={{ marginBottom: 16 }}>
            {label("Título principal (una línea por renglón)")}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div>
                <div style={{ fontSize: 10, color: "#aaa", marginBottom: 3 }}>Español</div>
                <textarea value={site.hero.title.es.join("\n")} onChange={(e) => setHero("title", { ...site.hero.title, es: e.target.value.split("\n") })} rows={4} style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} />
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#aaa", marginBottom: 3 }}>English</div>
                <textarea value={site.hero.title.en.join("\n")} onChange={(e) => setHero("title", { ...site.hero.title, en: e.target.value.split("\n") })} rows={4} style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} />
              </div>
            </div>
          </div>
          <BiTextarea lbl="Texto de descripción" value={site.hero.body} onChange={(v) => setHero("body", v)} rows={3} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <SingleField lbl="Teléfono (visible)" value={site.hero.phone} onChange={(v) => setHero("phone", v)} placeholder="55 4361 2880" />
            <SingleField lbl="WhatsApp (solo números, sin +)" value={site.hero.whatsapp} onChange={(v) => setHero("whatsapp", v)} placeholder="525543612880" />
          </div>
          <BiField lbl="Dirección (en el pie del hero)" value={site.hero.address} onChange={(v) => setHero("address", v)} />
          <SingleField lbl="Imagen principal (en public/fotos/)" value={site.hero.image} onChange={(v) => setHero("image", v)} placeholder="/fotos/foto-frente.jpg" />

          <div style={{ borderTop: "1px solid #e0d4c0", paddingTop: 16, marginTop: 8, marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: "#9a6040", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>Estadísticas</div>
            {([["stat1", "Estadística 1"], ["stat2", "Estadística 2"], ["stat3", "Estadística 3"]] as const).map(([key, lbl]) => (
              <div key={key} style={{ display: "grid", gridTemplateColumns: "120px 1fr 1fr", gap: 8, marginBottom: 12, alignItems: "end" }}>
                <div>
                  {label(lbl + " · número")}
                  <input value={site.hero[key].number} onChange={(e) => setHero(key, { ...site.hero[key], number: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  {label("Etiqueta ES")}
                  <input value={site.hero[key].label.es} onChange={(e) => setHero(key, { ...site.hero[key], label: { ...site.hero[key].label, es: e.target.value } })} style={inputStyle} />
                </div>
                <div>
                  {label("Etiqueta EN")}
                  <input value={site.hero[key].label.en} onChange={(e) => setHero(key, { ...site.hero[key], label: { ...site.hero[key].label, en: e.target.value } })} style={inputStyle} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid #e0d4c0", paddingTop: 16, marginTop: 8 }}>
            <div style={{ fontSize: 12, color: "#9a6040", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>Tarjeta flotante (aviso / horario / temporada…)</div>
            <BiField lbl="Título de la tarjeta" value={site.hero.heroNotice.title} onChange={(v) => setHero("heroNotice", { ...site.hero.heroNotice, title: v })} />
            <BiTextarea lbl="Mensaje (saltos de línea permitidos)" value={site.hero.heroNotice.body} onChange={(v) => setHero("heroNotice", { ...site.hero.heroNotice, body: v })} rows={3} />
          </div>
        </div>
      )}

      {!loading && site && section === "history" && (
        <div>
          <BiField lbl="Título" value={site.history.title} onChange={(v) => setHistory("title", v)} />
          <BiTextarea lbl="Párrafo 1" value={site.history.body1} onChange={(v) => setHistory("body1", v)} />
          <BiTextarea lbl="Párrafo 2" value={site.history.body2} onChange={(v) => setHistory("body2", v)} />
          <BiField lbl="Cita (quote)" value={site.history.quote} onChange={(v) => setHistory("quote", v)} />
          <BiField lbl="Firma de la cita" value={site.history.caption} onChange={(v) => setHistory("caption", v)} />
          <BiField lbl="Etiqueta de la foto (badge)" value={site.history.badge} onChange={(v) => setHistory("badge", v)} />
          <SingleField lbl="Foto histórica (en public/fotos/)" value={site.history.image} onChange={(v) => setHistory("image", v)} placeholder="/fotos/antigua.png" />
        </div>
      )}

      {!loading && site && section === "visit" && (
        <div>
          <BiField lbl="Título" value={site.visit.title} onChange={(v) => setVisit("title", v)} />
          <BiTextarea lbl="Descripción" value={site.visit.body} onChange={(v) => setVisit("body", v)} />
          <BiField lbl="Título del aviso (¡ !)" value={site.visit.noticeTitle} onChange={(v) => setVisit("noticeTitle", v)} />
          <BiTextarea lbl="Texto del aviso" value={site.visit.noticeBody} onChange={(v) => setVisit("noticeBody", v)} />
          <BiTextarea lbl="Dirección (cada línea = un renglón)" value={site.visit.address} onChange={(v) => setVisit("address", v)} rows={3} />
          <BiTextarea lbl="Horario" value={site.visit.hours} onChange={(v) => setVisit("hours", v)} rows={2} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <SingleField lbl="Teléfono (visible)" value={site.visit.phone} onChange={(v) => setVisit("phone", v)} placeholder="55 4361 2880" />
            <SingleField lbl="WhatsApp (solo números, sin +)" value={site.visit.whatsapp} onChange={(v) => setVisit("whatsapp", v)} placeholder="525543612880" />
          </div>
          <SingleField lbl="Correo electrónico" value={site.visit.email} onChange={(v) => setVisit("email", v)} placeholder="contacto@..." />
        </div>
      )}

      {!loading && site && section === "catalog" && (
        <div>
          <p style={{ fontSize: 13, color: "#9a6040", marginBottom: 20 }}>
            Las dos imágenes se muestran en el modal al hacer clic en &ldquo;Ver catálogo completo&rdquo;. Usa nombres de archivo en <code style={{ background: "#f0e6d8", padding: "1px 5px", borderRadius: 4 }}>public/fotos/</code>.
          </p>
          <SingleField lbl="Página 1 — frente del folleto" value={site.catalog.page1}
            onChange={(v) => setSite((s) => s ? { ...s, catalog: { ...s.catalog, page1: v } } : s)}
            placeholder="/fotos/folletodelane.png" />
          <SingleField lbl="Página 2 — reverso del folleto" value={site.catalog.page2}
            onChange={(v) => setSite((s) => s ? { ...s, catalog: { ...s.catalog, page2: v } } : s)}
            placeholder="/fotos/folletotracera.png" />
        </div>
      )}
    </div>
  );
}
