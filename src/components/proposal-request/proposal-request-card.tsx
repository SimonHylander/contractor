"use client";

import type { MatchingProposalRequest } from "~/server/data-access/proposal-request/proposal-request";
import { useComposer } from "../contractor-workspace/context";

export function ProposalRequestCard({
  proposalRequest,
}: {
  proposalRequest: MatchingProposalRequest;
}) {
  const { actions } = useComposer();

  const handleClick = async () => {
    actions.setContent({
      type: "proposal-request",
      id: proposalRequest.id,
    });
  };

  return (
    <div
      key={proposalRequest.id}
      className={`bg-card hover:bg-secondary/50 cursor-pointer rounded-lg border p-4 transition-colors`}
      onClick={handleClick}
      role="button"
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold">{proposalRequest.project.name}</h3>

          <div className="flex items-center justify-between">
            <div className="text-muted-foreground flex gap-4 text-sm">
              <span>Value: {proposalRequest.project.value}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
