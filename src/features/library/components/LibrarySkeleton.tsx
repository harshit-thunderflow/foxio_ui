import { Skeleton } from "@/components/ui/skeleton";

export function LibrarySkeleton() {
  return (
    <div className="space-y-4">
      {/* Search bar */}
      <Skeleton className="h-9 sm:h-10 w-full rounded-md" />

      {/* Category pills */}
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-14 sm:w-16 rounded-full shrink-0" />
        ))}
      </div>

      {/* Video card grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="w-full aspect-video rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <div className="flex gap-1">
              <Skeleton className="h-4 w-12 rounded-full" />
              <Skeleton className="h-4 w-10 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
