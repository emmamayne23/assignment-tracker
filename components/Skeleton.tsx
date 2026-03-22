export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-white/5 ${className}`}
    />
  )
}

export function AssignmentSkeleton() {
  return (
    <div className="bg-[#1a1d27] border border-white/10 rounded-xl px-5 py-4 flex items-center justify-between">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-28" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  )
}

export function StatSkeleton() {
  return (
    <div className="bg-[#1a1d27] border border-white/10 rounded-xl p-4">
      <Skeleton className="h-8 w-10 mb-2" />
      <Skeleton className="h-3 w-16" />
    </div>
  )
}