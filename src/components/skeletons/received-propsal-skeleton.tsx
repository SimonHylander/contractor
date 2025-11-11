import { Clock } from "lucide-react";

import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
  CardContent,
} from "~/components/ui/card";

import { Skeleton } from "../ui/skeleton";

export function ReceivedProposalSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Pending Proposals
        </CardTitle>
        <CardDescription>Respond to proposal requests</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton
            key={index}
            className="bg-muted-foreground h-20 w-full rounded-lg border"
          />
        ))}
      </CardContent>
    </Card>
  );
}
