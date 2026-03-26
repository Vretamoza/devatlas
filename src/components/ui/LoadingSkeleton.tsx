export function LoadingSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card bg-base-100 border-2 border-base-200 rounded-2xl">
          <div className="card-body gap-3 p-5">
            <div className="flex gap-2">
              <div className="skeleton h-5 w-20 rounded-md" />
              <div className="skeleton h-5 w-16 rounded-md" />
            </div>
            <div className="skeleton h-5 w-3/4" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-2/3" />
            <div className="flex gap-2 mt-1">
              <div className="skeleton h-4 w-12 rounded-full" />
              <div className="skeleton h-4 w-14 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
