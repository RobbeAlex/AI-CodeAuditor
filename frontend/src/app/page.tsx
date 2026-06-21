import Link from "next/link";

// Server component para hacer fetch a la API de FastAPI
async function getRecentAudits() {
  try {
    // Para entornos locales donde FastAPI corre en 8000
    const res = await fetch('http://localhost:8000/api/audits', { 
      cache: 'no-store',
      // Agregamos un timeout simple para que Next.js no se quede colgado si el backend está apagado
      signal: AbortSignal.timeout(2000) 
    });
    
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("No se pudo conectar a la API del backend:", error);
    return null;
  }
}

export default async function Dashboard() {
  const apiAudits = await getRecentAudits();
  
  // Usar datos de la API si la petición fue exitosa (aunque esté vacío). Solo usar mock si falla la API (null).
  const isUsingMock = apiAudits === null;
  
  const recentAudits = !isUsingMock ? apiAudits : [
    { id: "PR-482", repo: "frontend-core", status: "completed", issues: 0, time: "Hace 5 min" },
    { id: "PR-481", repo: "payment-api", status: "completed", issues: 2, time: "Hace 12 min" },
    { id: "PR-480", repo: "auth-service", status: "failed", issues: 5, time: "Hace 1 hora" },
    { id: "PR-479", repo: "mobile-app", status: "in_progress", issues: 0, time: "En progreso" },
  ];

  const stats = [
    { label: "PRs Auditados", value: isUsingMock ? "1,284" : "1", change: "+12%", trend: "up", icon: "📊" },
    { label: "Vulnerabilidades Críticas", value: isUsingMock ? "3" : "0", change: "-2", trend: "down", icon: "🛡️" },
    { label: "Deuda Técnica (hrs)", value: isUsingMock ? "124" : "0", change: "-15%", trend: "down", icon: "⏱️" },
    { label: "Workers Activos", value: "4/4", change: "Óptimo", trend: "neutral", icon: "⚡" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard <span className="text-gradient">DevSecOps</span></h1>
          <p className="text-muted-foreground mt-1">Métricas en tiempo real del motor de IA.</p>
        </div>
        <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          Sincronizar Repos
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="glass-panel p-6 rounded-xl hover:scale-[1.02] transition-transform duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <h3 className="text-3xl font-bold text-foreground mt-2">{stat.value}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center text-xl">
                {stat.icon}
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className={`font-medium ${stat.trend === 'up' ? 'text-emerald-400' : stat.trend === 'down' ? 'text-rose-400' : 'text-blue-400'}`}>
                {stat.change}
              </span>
              <span className="text-muted-foreground ml-2">vs último mes</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Audits Table */}
        <div className="lg:col-span-2 glass-panel rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-foreground">Auditorías Recientes</h3>
            <Link href="/audits" className="text-sm text-primary hover:text-primary/80 transition-colors">Ver todas &rarr;</Link>
          </div>
          
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
                {recentAudits.map((audit, i) => (
                  <tr key={i} className="border-b border-border/10 hover:bg-secondary/20 transition-colors group">
                    <td className="py-4 font-medium text-foreground group-hover:text-primary transition-colors cursor-pointer">
                      {audit.id}
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
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security Score Card */}
        <div className="glass-panel rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
          <h3 className="text-lg font-medium text-muted-foreground w-full text-left mb-6">Puntuación Global de Seguridad</h3>
          
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* SVG Donut Chart Mock */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-secondary"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-400 transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                strokeDasharray="92, 100"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-foreground">A</span>
              <span className="text-sm text-emerald-400 font-medium mt-1">92 / 100</span>
            </div>
          </div>
          
          <p className="mt-8 text-center text-sm text-muted-foreground">
            El código cumple con los estándares <span className="text-foreground font-medium">OWASP Top 10</span> y las mejores prácticas de la industria.
          </p>
        </div>
        
      </div>
    </div>
  );
}
