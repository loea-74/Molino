"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductEditor from "./ProductEditor";
import SiteEditor from "./SiteEditor";
import TestimonialsEditor from "./TestimonialsEditor";

type LangContent = { es: string; en: string };
type FullLang = { intro: string; ingredients: string[]; steps: string[]; tip: string };

type Recipe = {
  slug: string;
  kicker: LangContent;
  title: LangContent;
  body: LangContent;
  date: LangContent;
  cta: LangContent;
  image: string;
  video?: string;
  fullContent: { es: FullLang; en: FullLang };
};

const FIELD_LABEL: Record<string, string> = {
  kicker: "Etiqueta (kicker)",
  title: "Título",
  body: "Resumen (card)",
  date: "Fecha",
  cta: "Botón (CTA)",
};

function BilingualField({ label, value, onChange }: { label: string; value: LangContent; onChange: (v: LangContent) => void }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9a6040", marginBottom: 6 }}>{label}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div>
          <div style={{ fontSize: 10, color: "#aaa", marginBottom: 3 }}>Español</div>
          <input
            value={value.es}
            onChange={(e) => onChange({ ...value, es: e.target.value })}
            style={inputStyle}
          />
        </div>
        <div>
          <div style={{ fontSize: 10, color: "#aaa", marginBottom: 3 }}>English</div>
          <input
            value={value.en}
            onChange={(e) => onChange({ ...value, en: e.target.value })}
            style={inputStyle}
          />
        </div>
      </div>
    </div>
  );
}

function TextareaField({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9a6040", marginBottom: 5 }}>{label}</div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
      />
    </div>
  );
}

function ListField({ label, value, onChange }: { label: string; value: string[]; onChange: (v: string[]) => void }) {
  const text = value.join("\n");
  return (
    <TextareaField
      label={`${label} (una por línea)`}
      value={text}
      onChange={(v) => onChange(v.split("\n"))}
      rows={4}
    />
  );
}

function RecipeCard({ recipe, index, onChange }: { recipe: Recipe; index: number; onChange: (r: Recipe) => void }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"es" | "en">("es");

  const setField = (field: keyof Recipe, val: unknown) => onChange({ ...recipe, [field]: val });
  const setFull = (lang: "es" | "en", field: keyof FullLang, val: string | string[]) =>
    onChange({ ...recipe, fullContent: { ...recipe.fullContent, [lang]: { ...recipe.fullContent[lang], [field]: val } } });

  return (
    <div style={{ border: "1.5px solid #e0d4c0", borderRadius: 12, marginBottom: 12, overflow: "hidden" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", padding: "16px 20px", background: open ? "#f0e6d8" : "#f5ede0", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left" }}
      >
        <div>
          <span style={{ fontSize: 11, color: "#9a6040", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {index + 1} · {recipe.kicker.es}
          </span>
          <div style={{ fontSize: 16, color: "#3a2010", fontWeight: 500, marginTop: 2 }}>{recipe.title.es}</div>
        </div>
        <span style={{ fontSize: 18, color: "#9a6040" }}>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div style={{ padding: "24px 20px", background: "#fff" }}>

          {/* Campos bilingüe simples */}
          {(Object.keys(FIELD_LABEL) as (keyof Recipe)[]).map((field) => (
            <BilingualField
              key={field}
              label={FIELD_LABEL[field as string]}
              value={recipe[field] as LangContent}
              onChange={(v) => setField(field, v)}
            />
          ))}

          {/* Imagen */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9a6040", marginBottom: 6 }}>
              Imagen (nombre de archivo en <code style={{ background: "#f0e6d8", padding: "1px 5px", borderRadius: 4 }}>public/fotos/</code>)
            </div>
            <input
              value={recipe.image}
              onChange={(e) => setField("image", e.target.value)}
              placeholder="/fotos/mi-foto.jpg"
              style={inputStyle}
            />
          </div>

          {/* Video */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9a6040", marginBottom: 4 }}>
              Video (opcional — se usa solo si no hay imagen)
            </div>
            <div style={{ fontSize: 11, color: "#b08060", marginBottom: 6 }}>
              Archivo local: <code style={{ background: "#f0e6d8", padding: "1px 5px", borderRadius: 4 }}>public/fotos/</code> · o URL externa
            </div>
            <input
              value={recipe.video ?? ""}
              onChange={(e) => setField("video", e.target.value)}
              placeholder="/fotos/mi-video.mp4"
              style={inputStyle}
            />
          </div>

          {/* Contenido completo — tabs es/en */}
          <div style={{ borderTop: "1px solid #e0d4c0", paddingTop: 20, marginTop: 4 }}>
            <div style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9a6040", marginBottom: 14 }}>
              Contenido completo (modal)
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {(["es", "en"] as const).map((l) => (
                <button key={l} onClick={() => setTab(l)}
                  style={{ padding: "5px 16px", borderRadius: 999, border: "1.5px solid", fontSize: 12, cursor: "pointer", fontWeight: 500,
                    borderColor: tab === l ? "#8b3e1f" : "#d4c4b0",
                    background: tab === l ? "#8b3e1f" : "transparent",
                    color: tab === l ? "#fff" : "#9a6040" }}>
                  {l === "es" ? "Español" : "English"}
                </button>
              ))}
            </div>

            <TextareaField
              label="Introducción"
              value={recipe.fullContent[tab].intro}
              onChange={(v) => setFull(tab, "intro", v)}
              rows={3}
            />
            <ListField
              label="Ingredientes"
              value={recipe.fullContent[tab].ingredients}
              onChange={(v) => setFull(tab, "ingredients", v)}
            />
            <ListField
              label="Pasos / Steps"
              value={recipe.fullContent[tab].steps}
              onChange={(v) => setFull(tab, "steps", v)}
            />
            <TextareaField
              label="Consejo del molino / Tip"
              value={recipe.fullContent[tab].tip}
              onChange={(v) => setFull(tab, "tip", v)}
              rows={2}
            />
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", boxSizing: "border-box",
  padding: "9px 12px", borderRadius: 7,
  border: "1.5px solid #d4c4b0",
  fontSize: 14, outline: "none", background: "#faf6f0",
  color: "#3a2010",
};

export default function AdminEditor() {
  const router = useRouter();
  const [tab, setTab] = useState<"recetas" | "catalogo" | "secciones" | "testimonios">("recetas");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [sha, setSha] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/recipes")
      .then((r) => r.json())
      .then(({ recipes, sha }) => { setRecipes(recipes); setSha(sha); setLoading(false); })
      .catch(() => { setMsg("Error al cargar recetas"); setLoading(false); });
  }, []);

  const updateRecipe = (i: number, r: Recipe) => setRecipes((prev) => prev.map((x, j) => (j === i ? r : x)));

  async function handleSave() {
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/admin/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipes, sha }),
    });
    const data = await res.json();
    setSaving(false);
    if (res.ok) {
      setMsg("✓ Guardado. Vercel desplegará los cambios en ~1 minuto.");
    } else {
      setMsg(`Error: ${data.error}`);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.refresh();
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5ede0", padding: "0 0 80px" }}>
      {/* Header */}
      <div style={{ background: "#3a2010", padding: "18px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: "serif", fontSize: 18, color: "#f5ede0" }}>Molino la Jalisciense</div>
          <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#c4a07a" }}>Panel de administración</div>
        </div>
        <button
          onClick={handleLogout}
          style={{ fontSize: 12, color: "#c4a07a", background: "none", border: "1px solid #6a4030", padding: "6px 14px", borderRadius: 999, cursor: "pointer" }}
        >
          Cerrar sesión
        </button>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px" }}>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 32, borderBottom: "1.5px solid #e0d4c0", paddingBottom: 0 }}>
          {([["recetas", "Recetas y noticias"], ["catalogo", "Catálogo"], ["secciones", "Secciones"], ["testimonios", "Testimonios"]] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => { setTab(key); setMsg(""); }}
              style={{
                padding: "10px 22px", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500,
                background: "none", borderBottom: tab === key ? "2.5px solid #8b3e1f" : "2.5px solid transparent",
                color: tab === key ? "#8b3e1f" : "#9a6040",
                marginBottom: -1.5,
                transition: "all 150ms",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Recetas */}
        {tab === "recetas" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
              <h1 style={{ fontFamily: "serif", fontSize: 24, fontWeight: 400, color: "#3a2010", margin: 0 }}>Recetas y noticias</h1>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                {msg && <span style={{ fontSize: 13, color: msg.startsWith("✓") ? "#2d7a3a" : "#c0392b" }}>{msg}</span>}
                <button
                  onClick={handleSave}
                  disabled={saving || loading}
                  style={{
                    padding: "10px 24px", borderRadius: 999, border: "none",
                    background: saving || loading ? "#c4a87a" : "#8b3e1f",
                    color: "#f5ede0", fontSize: 14, fontWeight: 500,
                    cursor: saving || loading ? "default" : "pointer",
                  }}
                >
                  {saving ? "Guardando..." : "Guardar y publicar"}
                </button>
              </div>
            </div>
            {loading ? (
              <div style={{ textAlign: "center", color: "#9a6040", padding: 48 }}>Cargando recetas...</div>
            ) : (
              recipes.map((r, i) => (
                <RecipeCard key={r.slug} recipe={r} index={i} onChange={(updated) => updateRecipe(i, updated)} />
              ))
            )}
          </>
        )}

        {/* Catálogo */}
        {tab === "catalogo" && <ProductEditor />}

        {/* Secciones */}
        {tab === "secciones" && <SiteEditor />}

        {/* Testimonios */}
        {tab === "testimonios" && <TestimonialsEditor />}
      </div>
    </div>
  );
}
