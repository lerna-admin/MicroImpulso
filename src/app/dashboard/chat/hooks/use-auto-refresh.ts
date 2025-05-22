// src/hooks/use-auto-refresh.ts
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAutoRefresh(intervalMs = 20000) {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => {
      router.replace(window.location.href); // Reemplaza la ruta actual sin recargar la app
    }, intervalMs);

    return () => clearInterval(id);
  }, [router, intervalMs]);
}
