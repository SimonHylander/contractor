import { Skeleton } from "~/components/ui/skeleton";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export function ProposalRequestListSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Proposal Requests</CardTitle>
          <CardDescription>Your sent proposal requests</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton
              key={index}
              className="bg-muted-foreground h-20 w-full rounded-lg border"
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
