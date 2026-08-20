"use client";

import { useState, Fragment } from "react";

export default function AuditTable({ audits }: { audits: any[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border/50 text-muted-foreground text-sm">
            <th className="pb-3 font-medium">Pull Request</th>
            <th className="pb-3 font-medium">Repositorio</th>
            <th className="pb-3 font-medium">Estado</th>
            <th className="pb-3 font-medium">Hallazgos</th>
            <th className="pb-3 font-medium text-right">Tiempo</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {audits.map((audit, i) => (
            <Fragment key={i}>
              <tr 
                onClick={() => toggleRow(audit.dbId)}
                className={`border-b border-border/10 hover:bg-secondary/20 transition-colors group cursor-pointer ${expandedId === audit.dbId ? 'bg-secondary/10' : ''}`}
              >
                <td className="py-4 font-medium text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                  <span className="text-xs">{expandedId === audit.dbId ? '▼' : '▶'}</span> {audit.id}
                </td>
                <td className="py-4 text-muted-foreground">{audit.repo}</td>
                <td className="py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                    ${audit.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                      audit.status === 'failed' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 
                      'bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse'}`}>
                    {audit.status}
                  </span>
                </td>
                <td className="py-4">
                  {audit.issues > 0 ? (
                    <span className="flex items-center gap-1 text-rose-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      {audit.issues}
                    </span>
                  ) : (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      Limpio
                    </span>
                  )}
                </td>
                <td className="py-4 text-right text-muted-foreground">{audit.time}</td>
              </tr>
              
              {expandedId === audit.dbId && audit.rawFindings && (
                <tr className="bg-background/50 border-b border-border/10">
                  <td colSpan={5} className="p-6">
                    <div className="space-y-4 animate-in fade-in duration-300">
                      {/* Resumen */}
                      <div className="p-4 bg-secondary/30 rounded-lg border border-border">
                        <h4 className="font-medium text-foreground mb-1 flex items-center gap-2">
                          <span className="text-blue-400">📝</span> Resumen del Análisis
                        </h4>
                        <p className="text-sm text-muted-foreground">{audit.rawFindings.summary || "Sin resumen detallado."}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Seguridad */}
                        <div className="p-4 bg-rose-500/5 rounded-lg border border-rose-500/20">
                          <h4 className="font-medium text-rose-400 mb-2 flex items-center gap-2">
                            <span>🛡️</span> Vulnerabilidades ({audit.rawFindings.security?.length || 0})
                          </h4>
                          <ul className="list-disc list-inside text-sm text-rose-300/80 space-y-1">
                            {audit.rawFindings.security?.length > 0 ? (
                              audit.rawFindings.security.map((s: string, idx: number) => <li key={idx}>{s}</li>)
                            ) : (
                              <span className="text-emerald-400">Ninguna vulnerabilidad detectada.</span>
                            )}
                          </ul>
                        </div>

                        {/* Calidad */}
                        <div className="p-4 bg-amber-500/5 rounded-lg border border-amber-500/20">
                          <h4 className="font-medium text-amber-400 mb-2 flex items-center gap-2">
                            <span>💡</span> Calidad y Smells ({audit.rawFindings.quality?.length || 0})
                          </h4>
                          <ul className="list-disc list-inside text-sm text-amber-300/80 space-y-1">
                            {audit.rawFindings.quality?.length > 0 ? (
                              audit.rawFindings.quality.map((q: string, idx: number) => <li key={idx}>{q}</li>)
                            ) : (
                              <span className="text-emerald-400">Código limpio.</span>
                            )}
                          </ul>
                        </div>

                        {/* Recomendaciones */}
                        <div className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/20">
                          <h4 className="font-medium text-blue-400 mb-2 flex items-center gap-2">
                            <span>🔧</span> Recomendaciones ({audit.rawFindings.recommendations?.length || 0})
                          </h4>
                          <ul className="list-disc list-inside text-sm text-blue-300/80 space-y-1">
                            {audit.rawFindings.recommendations?.length > 0 ? (
                              audit.rawFindings.recommendations.map((r: string, idx: number) => <li key={idx}>{r}</li>)
                            ) : (
                              <span className="text-muted-foreground">Sin recomendaciones.</span>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
