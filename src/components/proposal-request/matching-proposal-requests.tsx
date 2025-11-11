import { use } from "react";
import type { MatchingProposalRequest } from "~/server/data-access/proposal-request/proposal-request";
import { ProposalRequestCard } from "./proposal-request-card";

export function MatchingProposalRequests({
  proposalRequests: data,
}: {
  proposalRequests: Promise<MatchingProposalRequest[]>;
}) {
  const matchingProposals = use(data);

  if (matchingProposals.length === 0) {
    return (
      <div>
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          Opportunities for You
        </h2>
      </div>
    );
  }

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
        {matchingProposals.map((proposalRequest) => (
          <ProposalRequestCard
            key={proposalRequest.id}
            proposalRequest={proposalRequest}
          />
        ))}
      </div>
    </div>
  );
}
