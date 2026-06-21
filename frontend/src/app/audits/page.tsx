"use client";

import { useState } from "react";

export default function AuditsPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAudit = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("http://localhost:8000/api/audits/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code_content: code }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
      setResult({ summary: "Error al conectar con la API en el puerto 8000. Asegúrate de encender el backend (FastAPI).", security: [], quality: [] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-bold text-foreground">Playground de Auditoría</h1>
      <p className="text-muted-foreground">Pega un bloque de código aquí para evaluarlo en tiempo real usando el motor de IA.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-4 rounded-xl flex flex-col h-[600px]">
          <textarea 
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 bg-background/50 border border-border rounded-lg p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
            placeholder="Pega tu código Python, TS, Go aquí..."
          />
          <button 
            onClick={handleAudit}
            disabled={loading || !code.trim()}
            className="mt-4 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-medium py-3 rounded-lg flex justify-center items-center gap-2 transition-all"
          >
            {loading ? (
              <span className="animate-spin w-5 h-5 border-2 border-white/20 border-t-white rounded-full"></span>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            )}
            {loading ? "Analizando IA..." : "Auditar Código Ahora"}
          </button>
        </div>

        <div className="glass-panel p-6 rounded-xl h-[600px] overflow-auto">
          <h3 className="text-xl font-bold mb-4">Resultados de la IA</h3>
          
          {!result && !loading && (
             <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50">
               <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
               <p>Esperando código...</p>
             </div>
          )}

          {result && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="p-4 bg-secondary/30 rounded-lg border border-border">
                <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                  <span className="text-blue-400">📝</span> Resumen
                </h4>
                <p className="text-sm text-muted-foreground">{result.summary || "Sin resumen."}</p>
              </div>

              <div className="p-4 bg-rose-500/10 rounded-lg border border-rose-500/20">
                <h4 className="font-medium text-rose-400 mb-2 flex items-center gap-2">
                  <span>🛡️</span> Seguridad ({result.security?.length || 0})
                </h4>
                <ul className="list-disc list-inside text-sm text-rose-300/80 space-y-1">
                  {result.security?.length > 0 ? (
                    result.security.map((s: string, i: number) => <li key={i}>{s}</li>)
                  ) : (
                    <span className="text-emerald-400">¡Ninguna vulnerabilidad detectada!</span>
                  )}
                </ul>
              </div>

              <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
                <h4 className="font-medium text-amber-400 mb-2 flex items-center gap-2">
                  <span>💡</span> Calidad y Smells ({result.quality?.length || 0})
                </h4>
                <ul className="list-disc list-inside text-sm text-amber-300/80 space-y-1">
                  {result.quality?.length > 0 ? (
                    result.quality.map((q: string, i: number) => <li key={i}>{q}</li>)
                  ) : (
                    <span className="text-emerald-400">Código limpio.</span>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
