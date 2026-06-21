"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Repo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  private: boolean;
  language: string;
  updated_at: string;
}

export default function RepositoriesPage() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const fetchRepos = async () => {
      const token = localStorage.getItem("github_pat");
      if (!token) {
        setHasToken(false);
        setLoading(false);
        return;
      }
      
      setHasToken(true);
      try {
        const res = await fetch("https://api.github.com/user/repos?sort=updated&per_page=12", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
        });

        if (!res.ok) {
          throw new Error("Error al obtener los repositorios. Verifica tu token.");
        }

        const data = await res.json();
        setRepos(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Repositorios Conectados</h1>
        <div className="animate-pulse flex space-x-4">
          <div className="h-32 bg-secondary rounded-xl w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Repositorios Conectados</h1>
          <p className="text-muted-foreground">Tus proyectos más recientes en GitHub.</p>
        </div>
        {!hasToken && (
          <Link href="/settings" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
            Conectar Cuenta
          </Link>
        )}
      </div>

      {!hasToken ? (
        <div className="glass-panel p-12 rounded-xl flex flex-col items-center justify-center text-center space-y-4 border-dashed">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-2xl">
            🔗
          </div>
          <div>
            <h3 className="text-lg font-medium text-foreground">No hay cuenta conectada</h3>
            <p className="text-muted-foreground max-w-md mx-auto mt-2">Para ver tus repositorios, necesitas configurar tu Personal Access Token de GitHub en la sección de Configuración.</p>
          </div>
          <Link href="/settings" className="mt-4 bg-secondary text-secondary-foreground px-6 py-2 rounded-lg font-medium hover:bg-secondary/80 transition-colors">
            Ir a Configuración
          </Link>
        </div>
      ) : error ? (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {repos.map((repo) => (
            <a 
              key={repo.id} 
              href={repo.html_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="glass-panel p-6 rounded-xl hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 transition-all group border border-transparent hover:border-primary/20 block"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-bold text-lg text-foreground truncate pr-4 group-hover:text-primary transition-colors">
                  {repo.name}
                </h3>
                <span className={`text-xs px-2 py-1 rounded-full border ${repo.private ? 'bg-secondary border-border text-muted-foreground' : 'bg-primary/10 border-primary/20 text-primary'}`}>
                  {repo.private ? 'Privado' : 'Público'}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-6 line-clamp-2 min-h-[40px]">
                {repo.description || "Sin descripción"}
              </p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span>
                  <span>{repo.language || "Variado"}</span>
                </div>
                <span>Actualizado hace poco</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
