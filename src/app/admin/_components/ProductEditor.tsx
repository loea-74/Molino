"use client";

import { useEffect, useState } from "react";

type LangContent = { es: string; en: string };

type Product = {
  slug: string;
  name: LangContent;
  tag: LangContent;
  description: LangContent;
  unit: LangContent;
  price: number | null;
  image: string;
  imageAlt: string;
  whatsappMessage: string;
};

const inputStyle: React.CSSProperties = {
  width: "100%", boxSizing: "border-box",
  padding: "9px 12px", borderRadius: 7,
  border: "1.5px solid #d4c4b0",
  fontSize: 14, outline: "none", background: "#faf6f0",
  color: "#3a2010",
};

function BilingualField({ label, value, onChange }: { label: string; value: LangContent; onChange: (v: LangContent) => void }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9a6040", marginBottom: 6 }}>{label}</div>
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

function ProductCard({ product, index, onChange }: { product: Product; index: number; onChange: (p: Product) => void }) {
  const [open, setOpen] = useState(false);
  const set = (field: keyof Product, val: unknown) => onChange({ ...product, [field]: val });

  return (
    <div style={{ border: "1.5px solid #e0d4c0", borderRadius: 12, marginBottom: 12, overflow: "hidden" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", padding: "16px 20px", background: open ? "#f0e6d8" : "#f5ede0", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left" }}
      >
        <div>
          <span style={{ fontSize: 11, color: "#9a6040", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {index + 1} · {product.tag.es}
          </span>
          <div style={{ fontSize: 16, color: "#3a2010", fontWeight: 500, marginTop: 2 }}>{product.name.es}</div>
        </div>
        <span style={{ fontSize: 18, color: "#9a6040" }}>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div style={{ padding: "24px 20px", background: "#fff" }}>
          <BilingualField label="Nombre" value={product.name} onChange={(v) => set("name", v)} />
          <BilingualField label="Etiqueta (tag)" value={product.tag} onChange={(v) => set("tag", v)} />
          <BilingualField label="Descripción" value={product.description} onChange={(v) => set("description", v)} />
          <BilingualField label="Unidad de venta" value={product.unit} onChange={(v) => set("unit", v)} />

          {/* Precio */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9a6040", marginBottom: 6 }}>
              Precio (dejar vacío = consultar)
            </div>
            <input
              type="number"
              value={product.price ?? ""}
              onChange={(e) => set("price", e.target.value === "" ? null : Number(e.target.value))}
              placeholder="Ej: 98"
              style={{ ...inputStyle, width: 160 }}
            />
          </div>

          {/* Imagen */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9a6040", marginBottom: 6 }}>
              Imagen (en <code style={{ background: "#f0e6d8", padding: "1px 5px", borderRadius: 4 }}>public/fotos/</code>)
            </div>
            <input value={product.image} onChange={(e) => set("image", e.target.value)} placeholder="/fotos/mi-foto.jpg" style={inputStyle} />
          </div>

          {/* Texto alternativo imagen */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9a6040", marginBottom: 6 }}>
              Texto alternativo de imagen (accesibilidad)
            </div>
            <input value={product.imageAlt} onChange={(e) => set("imageAlt", e.target.value)} style={inputStyle} />
          </div>

          {/* Mensaje WhatsApp */}
          <div style={{ marginBottom: 4 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9a6040", marginBottom: 6 }}>
              Mensaje de WhatsApp
            </div>
            <input value={product.whatsappMessage} onChange={(e) => set("whatsappMessage", e.target.value)} style={inputStyle} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductEditor() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then(({ products }) => { setProducts(products); setLoading(false); })
      .catch(() => { setMsg("Error al cargar productos"); setLoading(false); });
  }, []);

  const updateProduct = (i: number, p: Product) => setProducts((prev) => prev.map((x, j) => (j === i ? p : x)));

  async function handleSave() {
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ products }),
    });
    const data = await res.json();
    setSaving(false);
    if (res.ok) {
      setMsg("✓ Guardado. Vercel desplegará los cambios en ~1 minuto.");
    } else {
      setMsg(`Error: ${data.error}`);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ fontFamily: "serif", fontSize: 20, fontWeight: 400, color: "#3a2010", margin: 0 }}>Productos del catálogo</h2>
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
        <div style={{ textAlign: "center", color: "#9a6040", padding: 48 }}>Cargando productos...</div>
      ) : (
        products.map((p, i) => (
          <ProductCard key={p.slug} product={p} index={i} onChange={(updated) => updateProduct(i, updated)} />
        ))
      )}
    </div>
  );
}
