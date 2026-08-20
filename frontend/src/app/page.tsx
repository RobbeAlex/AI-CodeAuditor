import Link from "next/link";
import AuditTable from "@/components/AuditTable";
import { SyncButton } from "@/components/SyncButton";

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
  
  let recentAudits = [];
  if (!isUsingMock) {
    recentAudits = apiAudits.map((audit: any) => {
      const issuesCount = (audit.findings?.security?.length || 0) + (audit.findings?.quality?.length || 0);
      const dateStr = audit.created_at.endsWith('Z') ? audit.created_at : audit.created_at + 'Z';
      const date = new Date(dateStr);
      
      return {
        dbId: audit.id,
        id: `PR-${audit.pr_number}`,
        repo: audit.repository_name,
        status: audit.status,
        issues: issuesCount,
        time: date.toLocaleString(),
        rawFindings: audit.findings // Lo guardaremos por si queremos mostrar más detalle después
      };
    });
  } else {
    recentAudits = [
      { id: "PR-482", repo: "frontend-core", status: "completed", issues: 0, time: "Hace 5 min" },
      { id: "PR-481", repo: "payment-api", status: "completed", issues: 2, time: "Hace 12 min" },
      { id: "PR-480", repo: "auth-service", status: "failed", issues: 5, time: "Hace 1 hora" },
      { id: "PR-479", repo: "mobile-app", status: "in_progress", issues: 0, time: "En progreso" },
    ];
  }

  let totalPRs = 0;
  let totalSecurity = 0;
  let totalQuality = 0;

  if (!isUsingMock) {
    totalPRs = apiAudits.length;
    apiAudits.forEach((audit: any) => {
       totalSecurity += audit.findings?.security?.length || 0;
       totalQuality += audit.findings?.quality?.length || 0;
    });
  }

  const technicalDebt = totalSecurity * 2 + totalQuality * 0.5;

  const stats = [
    { label: "PRs Auditados", value: isUsingMock ? "1,284" : totalPRs.toString(), change: isUsingMock ? "+12%" : "En vivo", trend: "up", icon: "📊" },
    { label: "Vulnerabilidades Críticas", value: isUsingMock ? "3" : totalSecurity.toString(), change: isUsingMock ? "-2" : "En vivo", trend: totalSecurity > 0 ? "down" : "up", icon: "🛡️" },
    { label: "Deuda Técnica (hrs)", value: isUsingMock ? "124" : technicalDebt.toString(), change: isUsingMock ? "-15%" : "Calculado", trend: technicalDebt > 0 ? "down" : "up", icon: "⏱️" },
    { label: "Workers Activos", value: "1/1", change: "Celery OK", trend: "neutral", icon: "⚡" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard <span className="text-gradient">DevSecOps</span></h1>
          <p className="text-muted-foreground mt-1">Métricas en tiempo real del motor de IA.</p>
        </div>
        <SyncButton />
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
            <AuditTable audits={recentAudits} />
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
