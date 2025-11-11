import { use } from "react";
import type { Proposal } from "~/server/db/schema";
import { ProposalCard } from "./proposal-card";

export function Proposals({
  proposals: data,
}: {
  proposals: Promise<Proposal[]>;
}) {
  const proposals = use(data);

  if (proposals.length === 0) {
    return (
      <div>
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          Your Proposals
        </h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          Your Proposals
        </h2>

        <p className="text-muted-foreground text-sm">Proposals you have sent</p>
      </div>

      <div className="flex flex-col gap-2">
        {proposals.map((proposal) => (
          <ProposalCard key={proposal.id} proposal={proposal} />
        ))}
      </div>
    </div>
  );
}
