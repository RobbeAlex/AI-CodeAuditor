export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
      <p className="text-muted-foreground">Ajustes del sistema y motor IA.</p>
      <div className="glass-panel p-6 rounded-xl max-w-2xl space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-foreground">Modelo Local por Defecto</label>
          <select className="w-full bg-background border border-border rounded-lg p-2 text-foreground">
            <option>Llama 3 (Ollama)</option>
            <option>CodeQwen (vLLM)</option>
            <option>Mistral (Local)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-foreground">GitHub Webhook Secret</label>
          <input type="password" value="********" readOnly className="w-full bg-background/50 border border-border rounded-lg p-2 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}
