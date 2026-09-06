import { cn } from "@/lib/utils";

interface SkeletonProps {
  readonly className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("skeleton", className)} aria-hidden="true" />;
}

export function CardSkeleton() {
  return (
    <div className="w-[150px] shrink-0 sm:w-[180px]">
      <Skeleton className="aspect-[2/3] w-full" />
      <Skeleton className="mt-2 h-3.5 w-3/4" />
      <Skeleton className="mt-1.5 h-3 w-1/2" />
    </div>
  );
}

export function RowSkeleton({ cards = 6 }: { readonly cards?: number }) {
  const skeletonIds = Array.from({ length: cards }, (_, i) => `skeleton-card-${i}`);
  return (
    <div className="flex gap-3 overflow-hidden">
      {skeletonIds.map((id) => (
        <CardSkeleton key={id} />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return <Skeleton className="aspect-[16/9] w-full lg:aspect-[21/9]" />;
}

export function TextLines({ lines = 3, className }: { readonly lines?: number; readonly className?: string }) {
  const lineIds = Array.from({ length: lines }, (_, i) => `text-line-${i}`);
  return (
    <div className={cn("space-y-2", className)}>
      {lineIds.map((id, i) => (
        <Skeleton key={id} className={`h-3 ${i === lines - 1 ? "w-2/3" : "w-full"}`} />
      ))}
    </div>
  );
}
