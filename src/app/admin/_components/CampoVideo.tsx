"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";

type Props = {
  etiqueta: string;
  valor: string;
  onChange: (url: string) => void;
};

// Tope de peso. La portada reproduce estos videos en automático: hoy TAMALES.mp4
// y pozole.mp4 juntos son ~7 MB en cada visita desde celular. Sin un límite
// visible, esto se dispara sin que nadie se dé cuenta.
const AVISO_PESADO = 12 * 1024 * 1024;

function limpiarNombre(nombre: string) {
  const base = nombre
    .replace(/\.[^.]+$/, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return base || "video";
}

export default function CampoVideo({ etiqueta, valor, onChange }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [avance, setAvance] = useState(0);
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");
  const [manual, setManual] = useState(false);

  async function procesar(file: File) {
    setError("");
    setAviso("");
    if (!file.type.startsWith("video/")) {
      setError("Ese archivo no es un video. Usa MP4, WebM o MOV.");
      return;
    }
    if (file.size > AVISO_PESADO) {
      setAviso(
        `Pesa ${(file.size / 1048576).toFixed(1)} MB. Se va a subir, pero en celular tardará en cargar — mejor recórtalo a unos segundos.`
      );
    }
    setSubiendo(true);
    setAvance(0);
    try {
      // Sube del navegador DIRECTO a Vercel Blob, sin pasar por nuestra
      // función serverless: así se esquiva el tope de 4.5 MB.
      const blob = await upload(`videos/${limpiarNombre(file.name)}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/upload-video",
        contentType: file.type,
        onUploadProgress: (p) => setAvance(Math.round(p.percentage)),
      });
      onChange(blob.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo subir el video.");
    } finally {
      setSubiendo(false);
    }
  }

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
        style={{
          border: `1.5px dashed ${error ? "#c0392b" : "#d4c4b0"}`,
          borderRadius: 10,
          background: "#faf6f0",
          padding: 14,
          display: "flex",
          gap: 14,
          alignItems: "center",
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
          {valor ? (
            <video src={valor} muted playsInline preload="metadata" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ fontSize: 24, color: "#c4a87a" }}>&#127909;</span>
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
            {subiendo ? `Subiendo ${avance}%` : valor ? "Cambiar video" : "Subir video"}
          </button>

          {subiendo && (
            <div style={{ height: 5, background: "#e8dcc8", borderRadius: 999, marginTop: 9, overflow: "hidden" }}>
              <div style={{ width: `${avance}%`, height: "100%", background: "#8b3e1f", transition: "width 200ms" }} />
            </div>
          )}

          <div style={{ fontSize: 11.5, color: "#b08060", marginTop: 7 }}>
            Opcional. Si hay video, se usa en lugar de la imagen.
          </div>

          {valor && !error && (
            <div style={{ fontSize: 11, color: "#9a8570", marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {valor}
            </div>
          )}
          {aviso && <div style={{ fontSize: 12, color: "#9a6040", marginTop: 6 }}>{aviso}</div>}
          {error && <div style={{ fontSize: 12, color: "#c0392b", marginTop: 6 }}>{error}</div>}

          {valor && !subiendo && (
            <button
              type="button"
              onClick={() => { onChange(""); setAviso(""); setError(""); }}
              style={{ background: "none", border: "none", padding: "6px 0 0", fontSize: 11.5, color: "#c0392b", cursor: "pointer", textDecoration: "underline" }}
            >
              Quitar el video
            </button>
          )}
        </div>

        <input
          ref={input}
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
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
        style={{ background: "none", border: "none", padding: "6px 0 0", fontSize: 11.5, color: "#9a6040", cursor: "pointer", textDecoration: "underline" }}
      >
        {manual ? "Ocultar ruta manual" : "Escribir la ruta a mano"}
      </button>
      {manual && (
        <input
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/fotos/mi-video.mp4"
          style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px", borderRadius: 7, border: "1.5px solid #d4c4b0", fontSize: 14, outline: "none", background: "#fff", color: "#3a2010", marginTop: 6 }}
        />
      )}
    </div>
  );
}
