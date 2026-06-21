"use client";

import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [token, setToken] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Cargar el token guardado al iniciar
    const savedToken = localStorage.getItem("github_pat");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("github_pat", token);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
      <p className="text-muted-foreground">Ajustes del sistema y conexión a GitHub.</p>
      
      <div className="glass-panel p-6 rounded-xl max-w-2xl space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1 text-foreground">Modelo Local por Defecto</label>
          <select className="w-full bg-background border border-border rounded-lg p-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all">
            <option>Llama 3 (Ollama)</option>
            <option>CodeQwen (vLLM)</option>
            <option>Mistral (Local)</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">GitHub Personal Access Token (PAT)</label>
          <p className="text-xs text-muted-foreground mb-2">Este token se guarda localmente en tu navegador y se usa para cargar tus repositorios.</p>
          <input 
            type="password" 
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="ghp_xxxxxxxxxxxxxxxxx" 
            className="w-full bg-background border border-border rounded-lg p-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" 
          />
        </div>

        <button 
          onClick={handleSave}
          className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          {saved ? "¡Guardado!" : "Guardar Configuración"}
        </button>
      </div>
    </div>
  );
}
