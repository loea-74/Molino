"use client";

import { useState } from "react";

// Borrar una receta o un producto tira mucho trabajo de golpe (una receta lleva
// ingredientes y pasos en dos idiomas). Por eso pide confirmar en dos pasos en
// lugar de borrar al primer clic, como sí hace el editor de testimonios.
export default function BotonEliminar({ que, onDelete }: { que: string; onDelete: () => void }) {
  const [confirmando, setConfirmando] = useState(false);

  if (!confirmando) {
    return (
      <button
        type="button"
        onClick={() => setConfirmando(true)}
        style={{
          fontSize: 12, color: "#c0392b", background: "none",
          border: "1px solid #c0392b", padding: "6px 16px",
          borderRadius: 999, cursor: "pointer",
        }}
      >
        Eliminar {que}
      </button>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
      <span style={{ fontSize: 13, color: "#c0392b" }}>
        ¿Seguro? Esto no se puede deshacer.
      </span>
      <button
        type="button"
        onClick={onDelete}
        style={{
          fontSize: 12, color: "#fff", background: "#c0392b", border: "none",
          padding: "6px 16px", borderRadius: 999, cursor: "pointer", fontWeight: 500,
        }}
      >
        Sí, eliminar
      </button>
      <button
        type="button"
        onClick={() => setConfirmando(false)}
        style={{
          fontSize: 12, color: "#9a6040", background: "none",
          border: "1px solid #d4c4b0", padding: "6px 16px",
          borderRadius: 999, cursor: "pointer",
        }}
      >
        Cancelar
      </button>
    </div>
  );
}
