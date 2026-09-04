"use client";

import { useCallback, useEffect, useState } from "react";
import { cargarDelAdmin, mensajeDeError } from "@/lib/adminFetch";

export type Archivo = "site" | "recipes" | "products" | "testimonials";

/** Lo que devuelve useArchivo. Se nombra para poder pasarlo entero como prop. */
export type Control<T> = {
  datos: T | null;
  cambiar: (nuevo: T | ((prev: T) => T)) => void;
  guardar: () => Promise<void>;
  cargando: boolean;
  guardando: boolean;
  sucio: boolean;
  msg: string;
  error: boolean;
};

/**
 * La parte de Control que no depende del tipo de datos. Sirve para tratar los
 * cuatro archivos como una lista homogénea (¿alguno tiene cambios sin
 * publicar?, ¿alguno está guardando?) sin pelearse con los genéricos.
 */
export type Estado = Omit<Control<never>, "datos" | "cambiar">;

/**
 * Carga y guarda uno de los archivos de contenido.
 *
 * Antes cada editor repetía este mismo bloque de load/save/loading/msg. Aquí
 * además se lleva la cuenta de si hay cambios sin guardar, que antes no existía:
 * se podía cerrar la pestaña y perder todo sin ningún aviso.
 */
export function useArchivo<T>(archivo: Archivo, clave: string): Control<T> {
  const [datos, setDatos] = useState<T | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [sucio, setSucio] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    let vivo = true;
    cargarDelAdmin<Record<string, unknown>>(`/api/admin/${archivo}`)
      .then((r) => {
        if (!vivo) return;
        setDatos((r[clave] ?? null) as T);
        setCargando(false);
      })
      .catch((e) => {
        if (!vivo) return;
        setMsg(mensajeDeError(e));
        setError(true);
        setCargando(false);
      });
    return () => {
      vivo = false;
    };
  }, [archivo, clave]);

  /** Toda modificación pasa por aquí, para no olvidar marcar los cambios. */
  const cambiar = useCallback((nuevo: T | ((prev: T) => T)) => {
    setDatos((prev) =>
      typeof nuevo === "function" ? (nuevo as (p: T) => T)(prev as T) : nuevo
    );
    setSucio(true);
    setMsg("");
    setError(false);
  }, []);

  const guardar = useCallback(async () => {
    if (datos == null) return;
    setGuardando(true);
    setMsg("");
    try {
      const res = await fetch(`/api/admin/${archivo}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [clave]: datos }),
      });
      const r = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(r.error ?? `Error ${res.status} al guardar.`);
      setSucio(false);
      setError(false);
      setMsg("Guardado. Los cambios aparecerán en el sitio en aproximadamente un minuto.");
    } catch (e) {
      setError(true);
      setMsg(mensajeDeError(e));
    } finally {
      setGuardando(false);
    }
  }, [archivo, clave, datos]);

  return { datos, cambiar, guardar, cargando, guardando, sucio, msg, error };
}

/** Avisa antes de cerrar la pestaña si quedan cambios sin publicar. */
export function useAvisoSinGuardar(hayCambios: boolean) {
  useEffect(() => {
    if (!hayCambios) return;
    const alSalir = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", alSalir);
    return () => window.removeEventListener("beforeunload", alSalir);
  }, [hayCambios]);
}
