import { Skeleton } from "@/components/ui/skeleton";

export function TutorialSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4">
      {/* Section heading */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Progress rail */}
      <div className="flex items-center gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="contents">
            <div className="flex flex-col items-center shrink-0 gap-1.5">
              <Skeleton className="size-6 sm:size-7 rounded-full" />
              <Skeleton className="h-3 w-8" />
            </div>
            {i < 3 && <Skeleton className="flex-1 h-0.5 min-w-2" />}
          </div>
        ))}
      </div>

      {/* Video player */}
      <Skeleton className="w-full aspect-video rounded-xl" />

      {/* Player controls */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-24 rounded-md" />
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>

      {/* Autoplay toggle */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-9 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Checklist */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
