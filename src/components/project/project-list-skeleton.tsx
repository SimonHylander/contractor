import { Skeleton } from "~/components/ui/skeleton";

export function ProjectListSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <div>
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            Projects
          </h2>

          <p className="text-muted-foreground text-sm">Your projects</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Skeleton className="bg-card h-20 w-full rounded-lg border" />
        <Skeleton className="bg-card h-20 w-full rounded-lg border" />
        <Skeleton className="bg-card h-20 w-full rounded-lg border" />
      </div>
    </div>
  );
}
