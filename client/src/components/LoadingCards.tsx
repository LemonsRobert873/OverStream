export function LoadingCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="h-64 bg-slate-800/50 rounded-xl animate-pulse" data-testid="loading-card-1" />
      <div className="h-64 bg-slate-800/50 rounded-xl animate-pulse hidden md:block" data-testid="loading-card-2" />
      <div className="h-64 bg-slate-800/50 rounded-xl animate-pulse hidden lg:block" data-testid="loading-card-3" />
    </div>
  );
}
