import { Skeleton } from "../ui/skeleton";

export function MatchingProposalRequestsSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          Opportunities for You
        </h2>

        <p className="text-muted-foreground text-sm">
          Projects matching your specialties
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Skeleton className="bg-card h-20 w-full rounded-lg border" />
        <Skeleton className="bg-card h-20 w-full rounded-lg border" />
        <Skeleton className="bg-card h-20 w-full rounded-lg border" />
      </div>
    </div>
  );
}
