export default function RepositoriesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Repositorios Conectados</h1>
      <p className="text-muted-foreground">Aquí aparecerán los repositorios de GitHub sincronizados.</p>
      <div className="glass-panel p-12 rounded-xl flex items-center justify-center text-muted-foreground border-dashed">
        Conecta tu cuenta de GitHub para ver repositorios.
      </div>
    </div>
  );
}
