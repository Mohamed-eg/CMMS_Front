export default function CalendarLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Statistics Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-6 border rounded-lg">
            <div className="space-y-2">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-12 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Filters Skeleton */}
      <div className="p-6 border rounded-lg">
        <div className="h-6 w-16 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>

      {/* Calendar Skeleton */}
      <div className="p-6 border rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="flex gap-2">
            <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Calendar Grid Skeleton */}
        <div className="grid grid-cols-7 gap-1">
          {[...Array(42)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}
