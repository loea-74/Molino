"use client";

import { useRef, useState } from "react";
import { comprimirImagen } from "@/lib/comprimirImagen";

type Props = {
  etiqueta: string;
  valor: string;
  onChange: (ruta: string) => void;
  ayuda?: string;
};

const marco: React.CSSProperties = {
  border: "1.5px dashed #d4c4b0",
  borderRadius: 10,
  background: "#faf6f0",
  padding: 14,
  display: "flex",
  gap: 14,
  alignItems: "center",
};

export default function CampoImagen({ etiqueta, valor, onChange, ayuda }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");
  const [encima, setEncima] = useState(false);
  const [previa, setPrevia] = useState("");
  const [manual, setManual] = useState(false);

  async function procesar(file: File) {
    setError("");
    setSubiendo(true);
    try {
      const img = await comprimirImagen(file);
      // Vista previa inmediata desde el archivo local: no hay que esperar el
      // despliegue de Vercel para que el cliente vea qué subió.
      setPrevia(URL.createObjectURL(img.blob));

      const body = new FormData();
      body.append("archivo", new File([img.blob], img.nombre, { type: "image/webp" }));
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No se pudo subir la imagen.");
      onChange(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo subir la imagen.");
      setPrevia("");
    } finally {
      setSubiendo(false);
    }
  }

  const src = previa || valor;

  return (
    <div style={{ marginBottom: 18 }}>
      <div
        style={{
          fontSize: 11,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#9a6040",
          marginBottom: 6,
        }}
      >
        {etiqueta}
      </div>

      <div
        style={{ ...marco, borderColor: encima ? "#8b3e1f" : error ? "#c0392b" : "#d4c4b0" }}
        onDragOver={(e) => {
          e.preventDefault();
          setEncima(true);
        }}
        onDragLeave={() => setEncima(false)}
        onDrop={(e) => {
          e.preventDefault();
          setEncima(false);
          const f = e.dataTransfer.files?.[0];
          if (f) procesar(f);
        }}
      >
        <div
          style={{
            width: 82,
            height: 82,
            borderRadius: 8,
            flexShrink: 0,
            background: "#efe4d2",
            overflow: "hidden",
            display: "grid",
            placeItems: "center",
          }}
        >
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ fontSize: 24, color: "#c4a87a" }}>&#128247;</span>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <button
            type="button"
            onClick={() => input.current?.click()}
            disabled={subiendo}
            style={{
              padding: "9px 18px",
              borderRadius: 999,
              border: "none",
              background: subiendo ? "#c4a87a" : "#8b3e1f",
              color: "#f5ede0",
              fontSize: 13,
              fontWeight: 500,
              cursor: subiendo ? "default" : "pointer",
            }}
          >
            {subiendo ? "Subiendo..." : src ? "Cambiar foto" : "Subir foto"}
          </button>
          <div style={{ fontSize: 11.5, color: "#b08060", marginTop: 7 }}>
            {ayuda ?? "Arrastra la foto aquí o elige una. Se ajusta sola."}
          </div>
          {valor && !error && (
            <div
              style={{
                fontSize: 11,
                color: "#9a8570",
                marginTop: 4,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {valor}
            </div>
          )}
          {error && (
            <div style={{ fontSize: 12, color: "#c0392b", marginTop: 6 }}>{error}</div>
          )}
        </div>

        <input
          ref={input}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          style={{ display: "none" }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) procesar(f);
            e.target.value = "";
          }}
        />
      </div>

      <button
        type="button"
        onClick={() => setManual((m) => !m)}
        style={{
          background: "none",
          border: "none",
          padding: "6px 0 0",
          fontSize: 11.5,
          color: "#9a6040",
          cursor: "pointer",
          textDecoration: "underline",
        }}
      >
        {manual ? "Ocultar ruta manual" : "Escribir la ruta a mano"}
      </button>
      {manual && (
        <input
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/fotos/mi-foto.jpg"
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "9px 12px",
            borderRadius: 7,
            border: "1.5px solid #d4c4b0",
            fontSize: 14,
            outline: "none",
            background: "#fff",
            color: "#3a2010",
            marginTop: 6,
          }}
        />
      )}
    </div>
  );
}
