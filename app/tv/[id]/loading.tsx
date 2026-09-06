import { HeroSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="space-y-8 animate-fade-in">
      <HeroSkeleton />
      <div className="grid gap-6 sm:grid-cols-[200px_1fr]">
        <div className="space-y-3">
          <div className="skeleton h-8 w-3/4" />
          <div className="skeleton h-4 w-1/2" />
        </div>
      </div>
    </div>
  );
}
