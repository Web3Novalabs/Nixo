export default function BalanceSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex justify-between items-center">
          <div className="h-4 w-12 bg-slate-700 rounded animate-pulse" />
          <div className="h-4 w-20 bg-slate-700 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}
