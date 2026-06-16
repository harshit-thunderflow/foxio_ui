import { Skeleton } from "@/components/ui/skeleton";

export function ChatbotSkeleton() {
  return (
    <div className="w-full max-w-3xl mx-auto px-3 py-5 space-y-4">
      {/* New chat button */}
      <Skeleton className="h-10 w-full rounded-xl" />

      {/* Recent divider */}
      <div className="flex items-center gap-3 py-2">
        <div className="flex-1 h-px bg-border" />
        <Skeleton className="h-3 w-12" />
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Conversation cards */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-lg">
          <Skeleton className="size-8 rounded-md shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="size-6 rounded" />
        </div>
      ))}
    </div>
  );
}
