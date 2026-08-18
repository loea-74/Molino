"use client";

import { C, campo, etiqueta, ayuda, esp } from "./ui";

export type Bilingue = { es: string; en: string };

function Rotulo({ texto, nota }: { texto: string; nota?: string }) {
  return (
    <>
      <span style={etiqueta}>{texto}</span>
      {nota && <div style={{ ...ayuda, marginTop: -2, marginBottom: esp.xs }}>{nota}</div>}
    </>
  );
}

/** Un solo valor, sin traducción: teléfonos, ligas, nombres de archivo. */
export function CampoTexto({
  rotulo, valor, onChange, nota, placeholder, tipo = "text",
}: {
  rotulo: string; valor: string; onChange: (v: string) => void;
  nota?: string; placeholder?: string; tipo?: string;
}) {
  return (
    <div style={{ marginBottom: esp.md }}>
      <Rotulo texto={rotulo} nota={nota} />
      <input
        type={tipo}
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={campo}
      />
    </div>
  );
}

/** Texto largo de un solo idioma. */
export function CampoArea({
  rotulo, valor, onChange, nota, filas = 3,
}: {
  rotulo: string; valor: string; onChange: (v: string) => void; nota?: string; filas?: number;
}) {
  return (
    <div style={{ marginBottom: esp.md }}>
      <Rotulo texto={rotulo} nota={nota} />
      <textarea
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        rows={filas}
        style={{ ...campo, resize: "vertical", lineHeight: 1.5 }}
      />
    </div>
  );
}

/**
 * Español e inglés lado a lado. En pantallas angostas se apilan: antes iban
 * siempre en dos columnas y en el celular quedaban dos campos de ~130 px.
 */
export function CampoBilingue({
  rotulo, valor, onChange, nota, largo = false, filas = 3,
}: {
  rotulo: string; valor: Bilingue; onChange: (v: Bilingue) => void;
  nota?: string; largo?: boolean; filas?: number;
}) {
  const props = {
    style: { ...campo, ...(largo ? { resize: "vertical" as const, lineHeight: 1.5 } : {}) },
  };
  return (
    <div style={{ marginBottom: esp.md }}>
      <Rotulo texto={rotulo} nota={nota} />
      <div className="admin-par">
        {(["es", "en"] as const).map((l) => (
          <div key={l}>
            <div style={{ fontSize: 10, color: C.gris, marginBottom: 3, letterSpacing: "0.08em" }}>
              {l === "es" ? "ESPAÑOL" : "ENGLISH"}
            </div>
            {largo ? (
              <textarea
                value={valor[l]}
                rows={filas}
                onChange={(e) => onChange({ ...valor, [l]: e.target.value })}
                {...props}
              />
            ) : (
              <input
                value={valor[l]}
                onChange={(e) => onChange({ ...valor, [l]: e.target.value })}
                {...props}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Lista de líneas (ingredientes, pasos). Filtra los renglones vacíos al guardar. */
export function CampoLista({
  rotulo, valor, onChange, nota,
}: {
  rotulo: string; valor: string[]; onChange: (v: string[]) => void; nota?: string;
}) {
  return (
    <CampoArea
      rotulo={rotulo}
      nota={nota ?? "Una por renglón."}
      valor={valor.join("\n")}
      filas={5}
      onChange={(v) => onChange(v.split("\n"))}
    />
  );
}

/** Encabezado de un bloque de campos dentro de una sección. */
export function Bloque({
  titulo, nota, children,
}: {
  titulo: string; nota?: string; children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: esp.xl }}>
      <div
        style={{
          display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap",
          paddingBottom: esp.sm, marginBottom: esp.md,
          borderBottom: `1.5px solid ${C.lineaSuave}`,
        }}
      >
        <h3 style={{ margin: 0, fontFamily: "Georgia, serif", fontSize: 19, fontWeight: 400, color: C.tinta }}>
          {titulo}
        </h3>
        {nota && <span style={{ fontSize: 12.5, color: C.marronClaro }}>{nota}</span>}
      </div>
      {children}
    </section>
  );
}
