"use client";

import { CampoTexto, CampoBilingue, Bloque, type Bilingue } from "./campos";
import CampoImagen from "./CampoImagen";
import { C, campo, etiqueta, esp } from "./ui";
import { L } from "@/lib/i18n";
import type { Tema } from "@/lib/tema";

export type Site = {
  hero: {
    pill: Bilingue;
    title: { es: string[]; en: string[] };
    body: Bilingue;
    phone: string;
    whatsapp: string;
    address: Bilingue;
    image: string;
    stat1: { number: string; label: Bilingue };
    stat2: { number: string; label: Bilingue };
    stat3: { number: string; label: Bilingue };
    heroNotice: { title: Bilingue; body: Bilingue };
  };
  history: {
    title: Bilingue; body1: Bilingue; body2: Bilingue;
    quote: Bilingue; caption: Bilingue; badge: Bilingue; image: string;
  };
  visit: {
    title: Bilingue; body: Bilingue;
    noticeTitle: Bilingue; noticeBody: Bilingue;
    address: Bilingue; hours: Bilingue;
    phone: string; phone2: string; whatsapp: string; email: string; mapsUrl: string;
  };
  catalog: { page1: string; page2: string };
  social: {
    instagram: string; facebook: string; whatsapp: string;
    tiktok: string; youtube: string; twitter: string; linkedin: string;
  };
  /** Encabezados de cada sección. Antes vivían en i18n.ts y no eran editables. */
  labels: Record<string, Bilingue>;
  /** Colores y tipografía. Vacío = los de siempre. */
  theme?: Tema;
};

type Props = { site: Site; set: (f: (s: Site) => Site) => void };

/* ───────────────────────── INICIO ───────────────────────── */

export function PanelInicio({ site, set }: Props) {
  const h = (c: keyof Site["hero"], v: unknown) =>
    set((s) => ({ ...s, hero: { ...s.hero, [c]: v } }));

  return (
    <>
      <Bloque titulo="Lo primero que se ve" nota="La portada, antes de bajar">
        <CampoBilingue rotulo="Etiqueta de arriba" valor={site.hero.pill} onChange={(v) => h("pill", v)} />

        <div style={{ marginBottom: esp.md }}>
          <span style={etiqueta}>Título grande</span>
          <div style={{ fontSize: 12, color: C.marronClaro, marginBottom: esp.xs }}>
            Cada renglón que escribas aquí es un renglón en la página.
          </div>
          <div className="admin-par">
            {(["es", "en"] as const).map((l) => (
              <div key={l}>
                <div style={{ fontSize: 10, color: C.gris, marginBottom: 3, letterSpacing: "0.08em" }}>
                  {l === "es" ? "ESPAÑOL" : "ENGLISH"}
                </div>
                <textarea
                  rows={4}
                  value={site.hero.title[l].join("\n")}
                  onChange={(e) => h("title", { ...site.hero.title, [l]: e.target.value.split("\n") })}
                  style={{ ...campo, resize: "vertical", lineHeight: 1.4 }}
                />
              </div>
            ))}
          </div>
        </div>

        <CampoBilingue rotulo="Texto de abajo" valor={site.hero.body} onChange={(v) => h("body", v)} largo />
        <CampoImagen etiqueta="Imagen principal" valor={site.hero.image} onChange={(v) => h("image", v)} />
      </Bloque>

      <Bloque titulo="Contacto en la portada">
        <div className="admin-par">
          <CampoTexto rotulo="Teléfono como se ve" valor={site.hero.phone} onChange={(v) => h("phone", v)} placeholder="55 4361 2880" />
          <CampoTexto
            rotulo="WhatsApp"
            nota="Solo números, con 52 al principio y sin el +."
            valor={site.hero.whatsapp}
            onChange={(v) => h("whatsapp", v)}
            placeholder="525543612880"
          />
        </div>
        <CampoBilingue rotulo="Dirección al pie de la portada" valor={site.hero.address} onChange={(v) => h("address", v)} />
      </Bloque>

      <Bloque titulo="Las tres cifras" nota="Los números grandes bajo la portada">
        {([["stat1", "Primera"], ["stat2", "Segunda"], ["stat3", "Tercera"]] as const).map(([k, n]) => (
          <div key={k} style={{ marginBottom: esp.md, paddingBottom: esp.sm, borderBottom: `1px solid ${C.lineaSuave}` }}>
            <CampoTexto rotulo={n + " — número"} valor={site.hero[k].number} onChange={(v) => h(k, { ...site.hero[k], number: v })} />
            <CampoBilingue
              rotulo={n + " — qué dice debajo"}
              valor={site.hero[k].label}
              onChange={(v) => h(k, { ...site.hero[k], label: v })}
            />
          </div>
        ))}
      </Bloque>

      <Bloque titulo="Tarjeta flotante" nota="El recuadro sobre la foto: horario, aviso, temporada">
        <CampoBilingue rotulo="Título de la tarjeta" valor={site.hero.heroNotice.title} onChange={(v) => h("heroNotice", { ...site.hero.heroNotice, title: v })} />
        <CampoBilingue rotulo="Mensaje" nota="Puedes usar varios renglones." valor={site.hero.heroNotice.body} onChange={(v) => h("heroNotice", { ...site.hero.heroNotice, body: v })} largo />
      </Bloque>
    </>
  );
}

/* ───────────────────────── HISTORIA ───────────────────────── */

export function PanelHistoria({ site, set }: Props) {
  const h = (c: keyof Site["history"], v: unknown) =>
    set((s) => ({ ...s, history: { ...s.history, [c]: v } }));

  return (
    <>
      <BloqueEncabezado site={site} set={set} seccion="historia" />

      <Bloque titulo="El texto">
        <CampoBilingue rotulo="Título" valor={site.history.title} onChange={(v) => h("title", v)} />
        <CampoBilingue rotulo="Primer párrafo" valor={site.history.body1} onChange={(v) => h("body1", v)} largo />
        <CampoBilingue rotulo="Segundo párrafo" valor={site.history.body2} onChange={(v) => h("body2", v)} largo />
      </Bloque>

      <Bloque titulo="La cita destacada">
        <CampoBilingue rotulo="Frase" valor={site.history.quote} onChange={(v) => h("quote", v)} largo filas={2} />
        <CampoBilingue rotulo="Quién la dijo" valor={site.history.caption} onChange={(v) => h("caption", v)} />
      </Bloque>

      <Bloque titulo="La foto">
        <CampoImagen etiqueta="Foto histórica" valor={site.history.image} onChange={(v) => h("image", v)} />
        <CampoBilingue rotulo="Etiqueta sobre la foto" valor={site.history.badge} onChange={(v) => h("badge", v)} />
      </Bloque>
    </>
  );
}

/* ───────────────────────── VISÍTANOS ───────────────────────── */

export function PanelVisita({ site, set }: Props) {
  const h = (c: keyof Site["visit"], v: unknown) =>
    set((s) => ({ ...s, visit: { ...s.visit, [c]: v } }));

  return (
    <>
      <BloqueEncabezado site={site} set={set} seccion="visita" />

      <Bloque titulo="El texto">
        <CampoBilingue rotulo="Título" valor={site.visit.title} onChange={(v) => h("title", v)} />
        <CampoBilingue rotulo="Descripción" valor={site.visit.body} onChange={(v) => h("body", v)} largo />
      </Bloque>

      <Bloque titulo="Aviso destacado" nota="El recuadro de un solo local, sin sucursales">
        <CampoBilingue rotulo="Título del aviso" valor={site.visit.noticeTitle} onChange={(v) => h("noticeTitle", v)} />
        <CampoBilingue rotulo="Texto del aviso" valor={site.visit.noticeBody} onChange={(v) => h("noticeBody", v)} largo />
      </Bloque>

      <Bloque titulo="Dónde y cuándo">
        <CampoBilingue rotulo="Dirección" nota="Cada renglón aparece en su propia línea." valor={site.visit.address} onChange={(v) => h("address", v)} largo />
        <CampoBilingue rotulo="Horario" nota="Cada renglón aparece en su propia línea." valor={site.visit.hours} onChange={(v) => h("hours", v)} largo />
        <CampoTexto
          rotulo="Liga de Google Maps"
          nota="La del botón Cómo llegar. Búscate en Google Maps, dale a Compartir y pega la liga corta tal cual — no la recortes."
          valor={site.visit.mapsUrl}
          onChange={(v) => h("mapsUrl", v)}
          placeholder="https://maps.app.goo.gl/..."
        />
      </Bloque>

      <Bloque titulo="Contacto">
        <div className="admin-par">
          <CampoTexto rotulo="Teléfono" valor={site.visit.phone} onChange={(v) => h("phone", v)} placeholder="55 4361 2880" />
          <CampoTexto rotulo="Segundo teléfono" valor={site.visit.phone2} onChange={(v) => h("phone2", v)} placeholder="55 5566 5817" />
        </div>
        <CampoTexto rotulo="WhatsApp" nota="Solo números, con 52 al principio y sin el +." valor={site.visit.whatsapp} onChange={(v) => h("whatsapp", v)} placeholder="525543612880" />
        <CampoTexto rotulo="Correo electrónico" valor={site.visit.email} onChange={(v) => h("email", v)} placeholder="contacto@..." tipo="email" />
      </Bloque>
    </>
  );
}

/* ───────────────────────── FOLLETO ───────────────────────── */

export function PanelFolleto({ site, set }: Props) {
  return (
    <Bloque titulo="Las dos páginas" nota="Se ven al pulsar Ver catálogo completo">
      <CampoImagen
        etiqueta="Página 1 — frente"
        valor={site.catalog.page1}
        onChange={(v) => set((s) => ({ ...s, catalog: { ...s.catalog, page1: v } }))}
      />
      <CampoImagen
        etiqueta="Página 2 — reverso"
        valor={site.catalog.page2}
        onChange={(v) => set((s) => ({ ...s, catalog: { ...s.catalog, page2: v } }))}
      />
    </Bloque>
  );
}

/* ───────────────────────── REDES ───────────────────────── */

const REDES = [
  ["instagram", "Instagram", "https://instagram.com/tu_usuario"],
  ["facebook", "Facebook", "https://facebook.com/tu_pagina"],
  ["whatsapp", "WhatsApp", "525543612880"],
  ["tiktok", "TikTok", "https://tiktok.com/@tu_usuario"],
  ["youtube", "YouTube", "https://youtube.com/@tu_canal"],
  ["twitter", "X (Twitter)", "https://x.com/tu_usuario"],
  ["linkedin", "LinkedIn", "https://linkedin.com/company/tu_empresa"],
] as const;

export function PanelRedes({ site, set }: Props) {
  return (
    <>
      <BloqueEncabezado site={site} set={set} seccion="pie" titulo="Textos del pie de página" nota="Lo que se lee abajo del todo" />

      <Bloque titulo="Íconos del pie de página" nota="Deja vacía la que no uses y su ícono no aparece">
      {REDES.map(([k, nombre, ejemplo]) => (
        <CampoTexto
          key={k}
          rotulo={nombre}
          nota={k === "whatsapp" ? "Solo números, con 52 al principio y sin el +." : undefined}
          valor={site.social[k]}
          onChange={(v) => set((s) => ({ ...s, social: { ...s.social, [k]: v } }))}
          placeholder={ejemplo}
        />
      ))}
      </Bloque>
    </>
  );
}


/* ───────────────────── ENCABEZADOS DE SECCIÓN ───────────────────── */

type CampoEncabezado = { clave: string; rotulo: string; nota?: string; largo?: boolean };

/**
 * Qué encabezado corresponde a cada sección del panel.
 *
 * Las claves son las mismas de i18n.ts porque src/lib/textos.ts superpone
 * site.json → labels sobre los valores de ahí. Si un campo se deja vacío, la
 * página sigue mostrando el texto original en vez de quedarse en blanco.
 */
export const ENCABEZADOS: Record<string, CampoEncabezado[]> = {
  catalogo: [
    { clave: "productsEyebrow", rotulo: "Etiqueta chica de arriba", nota: "Va en letras chicas sobre el título. Hoy dice: 02 · Catálogo." },
    { clave: "productsTitle", rotulo: "Título de la sección" },
    { clave: "productsBody", rotulo: "Descripción", nota: "El párrafo a la derecha del título.", largo: true },
  ],
  recetas: [
    { clave: "recipesEyebrow", rotulo: "Etiqueta chica de arriba" },
    { clave: "recipesTitle", rotulo: "Título de la sección" },
    { clave: "recipesKicker", rotulo: "Texto junto al título", nota: "Hoy dice: Desliza · últimas entradas." },
  ],
  historia: [{ clave: "historyEyebrow", rotulo: "Etiqueta chica de arriba" }],
  testimonios: [{ clave: "testimonialsEyebrow", rotulo: "Etiqueta chica de arriba" }],
  visita: [{ clave: "visitEyebrow", rotulo: "Etiqueta chica de arriba" }],
  pie: [
    { clave: "footerTag", rotulo: "Frase bajo el logo" },
    { clave: "footerRights", rotulo: "Aviso de derechos", nota: "El año está escrito dentro del texto: si cambia, cámbialo aquí.", largo: true },
  ],
};

/** Los encabezados de una sección, listos para editar. */
export function BloqueEncabezado({
  site, set, seccion, titulo = "Encabezado de la sección", nota = "Lo que va arriba, antes del contenido. Si lo dejas vacío se usa el texto en gris.",
}: {
  site: Site;
  set: (f: (s: Site) => Site) => void;
  seccion: keyof typeof ENCABEZADOS;
  titulo?: string;
  nota?: string;
}) {
  const campos = ENCABEZADOS[seccion];
  const cambiar = (clave: string, v: Bilingue) =>
    set((s) => ({ ...s, labels: { ...s.labels, [clave]: v } }));

  return (
    <Bloque titulo={titulo} nota={nota}>
      {campos.map((c) => (
        <CampoBilingue
          key={c.clave}
          rotulo={c.rotulo}
          nota={c.nota}
          largo={c.largo}
          valor={site.labels?.[c.clave] ?? { es: "", en: "" }}
          // Un campo vacío no deja hueco en la página: se usa el texto de
          // siempre. Mostrarlo como guía evita que parezca que se borró.
          placeholder={{
            es: String(L.es[c.clave as keyof typeof L.es] ?? ""),
            en: String(L.en[c.clave as keyof typeof L.en] ?? ""),
          }}
          onChange={(v) => cambiar(c.clave, v)}
        />
      ))}
    </Bloque>
  );
}
