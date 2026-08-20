"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SyncButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSync = () => {
    setLoading(true);
    router.refresh(); // Fuerza a Next.js a re-ejecutar el Server Component y fetchear datos
    setTimeout(() => {
      setLoading(false);
    }, 800); // Pequeño delay visual
  };

  return (
    <button 
      onClick={handleSync}
      disabled={loading}
      className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-70"
    >
      <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      {loading ? "Sincronizando..." : "Sincronizar Repos"}
    </button>
  );
}
