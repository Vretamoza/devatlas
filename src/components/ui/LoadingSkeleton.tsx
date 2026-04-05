export function LoadingSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-3 p-5 rounded-xl min-h-[180px]"
          style={{
            background: 'oklch(0.13 0.016 265)',
            border: '1px solid oklch(0.18 0.015 265)',
          }}
        >
          <div className="flex items-center gap-2">
            <div className="skeleton h-5 w-24 rounded-full" />
            <div className="skeleton h-4 w-16 rounded-md ml-2" />
          </div>
          <div className="skeleton h-5 w-4/5 rounded-md" />
          <div className="skeleton h-4 w-full rounded-md" />
          <div className="skeleton h-4 w-3/4 rounded-md" />
          <div className="flex gap-1.5 mt-auto">
            <div className="skeleton h-5 w-14 rounded-full" />
            <div className="skeleton h-5 w-14 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}
