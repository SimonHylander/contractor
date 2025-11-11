"use client";

import Link from "next/link";
import { cn } from "~/lib/utils";
import { buttonVariants } from "~/components/ui/button";

export function ProposalRequestButton({ projectId }: { projectId: string }) {
  return (
    <Link
      href={`/projects/${projectId}/proposal-request`}
      className={cn(buttonVariants({ variant: "default" }))}
    >
      Request Proposal
    </Link>
  );
}
