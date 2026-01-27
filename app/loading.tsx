export default function RootLoading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-[#00ff88] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-zinc-400 font-mono text-sm">Carregando...</p>
      </div>
    </div>
  );
}
