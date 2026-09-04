"use client";

import { C, radio } from "./ui";

/**
 * Subir y bajar una tarjeta dentro de su lista.
 *
 * El orden del archivo es el orden en que salen en la página, y hasta ahora la
 * única forma de reordenar era borrar una entrada y volver a escribirla al
 * final. Se usan botones y no arrastrar-y-soltar a propósito: el cliente edita
 * desde el celular, donde arrastrar pelea con el desplazamiento de la página.
 */
export default function BotonesOrden({
  indice, total, onMover, que,
}: {
  indice: number;
  total: number;
  onMover: (destino: number) => void;
  /** Para el lector de pantalla, con su artículo: "esta receta", "este producto". */
  que: string;
}) {
  const primero = indice === 0;
  const ultimo = indice === total - 1;

  return (
    <span
      style={{
        display: "flex", alignItems: "center", gap: 2,
        paddingRight: 10, flexShrink: 0,
      }}
    >
      <Flecha
        hacia="arriba"
        inactivo={primero}
        etiqueta={`Subir ${que}`}
        onClick={() => onMover(indice - 1)}
      />
      <Flecha
        hacia="abajo"
        inactivo={ultimo}
        etiqueta={`Bajar ${que}`}
        onClick={() => onMover(indice + 1)}
      />
    </span>
  );
}

function Flecha({
  hacia, inactivo, etiqueta, onClick,
}: {
  hacia: "arriba" | "abajo";
  inactivo: boolean;
  etiqueta: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={inactivo}
      aria-label={etiqueta}
      title={etiqueta}
      style={{
        // 34 px: lo mínimo que se acierta con el pulgar sin tener que apuntar.
        width: 34, height: 34,
        display: "grid", placeItems: "center",
        background: "transparent",
        border: `1px solid ${inactivo ? "transparent" : C.linea}`,
        borderRadius: radio.chico,
        color: inactivo ? C.papelTenue : C.marron,
        cursor: inactivo ? "default" : "pointer",
        fontFamily: "inherit", fontSize: 13, lineHeight: 1,
        padding: 0,
      }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden focusable="false">
        <path
          d={hacia === "arriba" ? "M2 7.5 6 3.5 10 7.5" : "M2 4.5 6 8.5 10 4.5"}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

/** Mueve un elemento de una posición a otra. Fuera de rango, no hace nada. */
export function moverEnLista<T>(lista: T[], de: number, a: number): T[] {
  if (a < 0 || a >= lista.length || de === a) return lista;
  const copia = [...lista];
  const [movido] = copia.splice(de, 1);
  copia.splice(a, 0, movido);
  return copia;
}
