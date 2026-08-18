"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "../admin.css";

import { C, esp } from "./ui";
import { BarraSuperior, Menu, CabeceraSeccion, type Seccion } from "./Armazon";
import { useArchivo, useAvisoSinGuardar } from "./useArchivo";
import {
  PanelInicio, PanelHistoria, PanelVisita, PanelFolleto, PanelRedes, type Site,
} from "./PanelesSitio";
import PanelRecetas from "./PanelRecetas";
import PanelCatalogo from "./PanelCatalogo";
import PanelTestimonios from "./PanelTestimonios";

/**
 * El menú sigue el mismo orden que la página. Antes había cuatro pestañas y,
 * dentro de "Secciones", otras cinco: "Historia" quedaba enterrada y no había
 * forma de adivinar que Recetas era de primer nivel pero Historia no.
 */
const SECCIONES: (Seccion & { archivo: "site" | "recipes" | "products" | "testimonials" })[] = [
  { id: "inicio", nombre: "Inicio", donde: "Lo primero de la página", archivo: "site" },
  { id: "recetas", nombre: "Recetas y noticias", donde: "Las tarjetas con foto o video", archivo: "recipes" },
  { id: "catalogo", nombre: "Catálogo", donde: "Los productos", archivo: "products" },
  { id: "historia", nombre: "Historia", donde: "El texto sobre el molino", archivo: "site" },
  { id: "testimonios", nombre: "Testimonios", donde: "Lo que dicen los clientes", archivo: "testimonials" },
  { id: "visita", nombre: "Visítanos", donde: "Dirección, horario y mapa", archivo: "site" },
  { id: "folleto", nombre: "Folleto", donde: "Las dos páginas del catálogo", archivo: "site" },
  { id: "redes", nombre: "Redes sociales", donde: "Los íconos del pie", archivo: "site" },
];

const EXPLICACION: Record<string, string> = {
  inicio: "La portada: el título grande, la foto principal y la tarjeta que va encima.",
  recetas: "Cada entrada es una tarjeta en la página. Puedes ponerle foto o video.",
  catalogo: "Los productos que se muestran, con su descripción y su precio.",
  historia: "El texto y la foto antigua de la sección Historia.",
  testimonios: "Las frases de clientes que aparecen en la página.",
  visita: "Dirección, horario, teléfonos y el mapa de Google.",
  folleto: "Las dos imágenes que se abren al pulsar Ver catálogo completo.",
  redes: "Las ligas a tus redes. La que dejes vacía no aparece en el sitio.",
};

export default function AdminEditor() {
  const router = useRouter();
  const [activa, setActiva] = useState("inicio");

  // site.json lo comparten cuatro secciones del menú, así que se carga y se
  // guarda una sola vez aquí arriba.
  const sitio = useArchivo<Site>("site", "site");

  const seccion = SECCIONES.find((s) => s.id === activa)!;
  const esDeSitio = seccion.archivo === "site";

  useAvisoSinGuardar(sitio.sucio);

  // El punto de "sin publicar" aparece en todas las secciones que comparten
  // site.json, porque un cambio en Inicio también queda pendiente en Historia.
  const sucios: Record<string, boolean> = {};
  for (const s of SECCIONES) if (s.archivo === "site") sucios[s.id] = sitio.sucio;

  async function salir() {
    if (sitio.sucio && !confirm("Tienes cambios sin publicar. ¿Salir de todos modos?")) return;
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.refresh();
  }

  return (
    <div style={{ minHeight: "100vh", background: C.papel, color: C.tinta, fontSize: 15 }}>
      <BarraSuperior onSalir={salir} />

      <div className="admin-cuerpo">
        <Menu secciones={SECCIONES} activa={activa} onCambiar={setActiva} sucios={sucios} />

        <main className="admin-panel">
          {esDeSitio && (
            <CabeceraSeccion
              titulo={seccion.nombre}
              explicacion={EXPLICACION[seccion.id]}
              sucio={sitio.sucio}
              guardando={sitio.guardando}
              cargando={sitio.cargando}
              msg={sitio.msg}
              error={sitio.error}
              onGuardar={sitio.guardar}
            />
          )}

          {esDeSitio && sitio.cargando && <Cargando />}

          {esDeSitio && sitio.datos && (
            <>
              {activa === "inicio" && <PanelInicio site={sitio.datos} set={sitio.cambiar} />}
              {activa === "historia" && <PanelHistoria site={sitio.datos} set={sitio.cambiar} />}
              {activa === "visita" && <PanelVisita site={sitio.datos} set={sitio.cambiar} />}
              {activa === "folleto" && <PanelFolleto site={sitio.datos} set={sitio.cambiar} />}
              {activa === "redes" && <PanelRedes site={sitio.datos} set={sitio.cambiar} />}
            </>
          )}

          {activa === "recetas" && (
            <PanelRecetas titulo={seccion.nombre} explicacion={EXPLICACION.recetas} />
          )}
          {activa === "catalogo" && (
            <PanelCatalogo titulo={seccion.nombre} explicacion={EXPLICACION.catalogo} />
          )}
          {activa === "testimonios" && (
            <PanelTestimonios titulo={seccion.nombre} explicacion={EXPLICACION.testimonios} />
          )}
        </main>
      </div>
    </div>
  );
}

function Cargando() {
  return (
    <div style={{ textAlign: "center", color: C.marron, padding: esp.xl, fontSize: 14 }}>
      Cargando…
    </div>
  );
}
