"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "../admin.css";

import { C, esp } from "./ui";
import { BarraSuperior, Menu, CabeceraSeccion, BarraGuardar, type Seccion } from "./Armazon";
import { useArchivo, useAvisoSinGuardar, type Archivo, type Estado } from "./useArchivo";
import {
  PanelInicio, PanelHistoria, PanelVisita, PanelFolleto, PanelRedes, type Site,
} from "./PanelesSitio";
import PanelRecetas, { type Recipe } from "./PanelRecetas";
import PanelCatalogo, { type Product } from "./PanelCatalogo";
import PanelTestimonios, { type Testimonial } from "./PanelTestimonios";

/**
 * El menú sigue el mismo orden que la página. Antes había cuatro pestañas y,
 * dentro de "Secciones", otras cinco: "Historia" quedaba enterrada y no había
 * forma de adivinar que Recetas era de primer nivel pero Historia no.
 */
const SECCIONES: (Seccion & { archivo: Archivo })[] = [
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
  const [menuAbierto, setMenuAbierto] = useState(false);

  /**
   * Los cuatro archivos se cargan aquí arriba y viven mientras dure la sesión.
   *
   * Antes recetas, catálogo y testimonios cargaban su propio archivo DENTRO de
   * su panel. Al cambiar de sección el componente se desmontaba y todo lo
   * escrito se perdía en silencio: ni aviso, ni forma de recuperarlo. Además
   * el punto de "sin publicar" nunca aparecía en esas tres entradas del menú,
   * porque el estado no llegaba hasta aquí.
   *
   * De paso, cambiar de sección ya no vuelve a pedirle el archivo a GitHub:
   * se acabó el "Cargando…" cada vez.
   */
  const sitio = useArchivo<Site>("site", "site");
  const recetas = useArchivo<Recipe[]>("recipes", "recipes");
  const productos = useArchivo<Product[]>("products", "products");
  const testimonios = useArchivo<Testimonial[]>("testimonials", "testimonials");

  const porArchivo: Record<Archivo, Estado> = {
    site: sitio,
    recipes: recetas,
    products: productos,
    testimonials: testimonios,
  };

  const seccion = SECCIONES.find((s) => s.id === activa)!;
  // Toda sección necesita site.json cargado: aunque su contenido salga de otro
  // archivo, su encabezado sale de ahí.
  const estado = porArchivo[seccion.archivo];
  const cargandoSeccion = estado.cargando || sitio.cargando;

  // Un punto por cada sección con cambios esperando. Se marcan varias a la vez
  // porque site.json es un solo archivo: no se puede saber qué parte cambió, y
  // toda sección lo toca al menos por su encabezado.
  const sucios: Record<string, boolean> = {};
  for (const s of SECCIONES) sucios[s.id] = porArchivo[s.archivo].sucio || sitio.sucio;

  // La barra nombra ARCHIVOS, no secciones: como site.json lo comparten las
  // ocho, listar secciones acabaría escupiendo los ocho nombres siempre.
  const pendientes = (
    [
      [sitio, "Textos del sitio"],
      [recetas, "Recetas y noticias"],
      [productos, "Catálogo"],
      [testimonios, "Testimonios"],
    ] as const
  )
    .filter(([a]) => a.sucio)
    .map(([, nombre]) => nombre);
  const todos = [sitio, recetas, productos, testimonios];
  const hayCambios = todos.some((a) => a.sucio);

  useAvisoSinGuardar(hayCambios);

  // El mensaje de la barra: si algo falló eso es lo urgente; si no, el último
  // resultado bueno.
  const conError = todos.find((a) => a.error && a.msg);
  const conMsg = conError ?? todos.find((a) => a.msg);

  async function guardarTodo() {
    // En serie a propósito: cada guardado es un commit a GitHub y hacerlos en
    // paralelo sobre el mismo repositorio provoca conflictos de SHA.
    for (const a of todos) if (a.sucio) await a.guardar();
  }

  async function salir() {
    if (hayCambios && !confirm("Tienes cambios sin publicar. ¿Salir de todos modos?")) return;
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="admin-raiz">
      <BarraSuperior
        onSalir={salir}
        onMenu={() => setMenuAbierto(true)}
        seccionActiva={seccion.nombre}
      />

      <div className="admin-cuerpo">
        <Menu
          secciones={SECCIONES}
          activa={activa}
          onCambiar={setActiva}
          sucios={sucios}
          abierto={menuAbierto}
          onCerrar={() => setMenuAbierto(false)}
          onSalir={salir}
        />

        <main className="admin-panel">
          <CabeceraSeccion titulo={seccion.nombre} explicacion={EXPLICACION[seccion.id]} />

          {cargandoSeccion ? (
            <Cargando />
          ) : (
            <>
              {sitio.datos && (
                <>
                  {activa === "inicio" && <PanelInicio site={sitio.datos} set={sitio.cambiar} />}
                  {activa === "historia" && <PanelHistoria site={sitio.datos} set={sitio.cambiar} />}
                  {activa === "visita" && <PanelVisita site={sitio.datos} set={sitio.cambiar} />}
                  {activa === "folleto" && <PanelFolleto site={sitio.datos} set={sitio.cambiar} />}
                  {activa === "redes" && <PanelRedes site={sitio.datos} set={sitio.cambiar} />}
                </>
              )}

              {/* Estas tres secciones editan su propio archivo, pero su
                  encabezado ("02 · Catálogo", "Lo que sale del molino"…) vive
                  en site.json, así que reciben los dos. */}
              {activa === "recetas" && (
                <PanelRecetas
                  datos={recetas.datos ?? []}
                  cambiar={recetas.cambiar}
                  site={sitio.datos}
                  setSite={sitio.cambiar}
                />
              )}
              {activa === "catalogo" && (
                <PanelCatalogo
                  datos={productos.datos ?? []}
                  cambiar={productos.cambiar}
                  site={sitio.datos}
                  setSite={sitio.cambiar}
                />
              )}
              {activa === "testimonios" && (
                <PanelTestimonios
                  datos={testimonios.datos ?? []}
                  cambiar={testimonios.cambiar}
                  site={sitio.datos}
                  setSite={sitio.cambiar}
                />
              )}
            </>
          )}
        </main>

      </div>

      <BarraGuardar
        pendientes={pendientes}
        guardando={todos.some((a) => a.guardando)}
        cargando={todos.some((a) => a.cargando)}
        msg={conMsg?.msg ?? ""}
        error={!!conError}
        onGuardar={guardarTodo}
      />
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
