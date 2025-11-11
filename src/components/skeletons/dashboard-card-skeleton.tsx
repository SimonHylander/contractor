import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { Skeleton } from "../ui/skeleton";

export function DashboardCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <Skeleton className="bg-muted-foreground mt-1 mb-2 h-4 w-[150px] rounded-lg border" />
        <CardTitle className="text-3xl">
          <Skeleton className="bg-muted-foreground h-5 w-[50px] rounded-lg border" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground text-sm">
          <Skeleton className="bg-muted-foreground mt-4 h-4 w-[100px] rounded-lg border" />
        </div>
      </CardContent>
    </Card>
  );
}
