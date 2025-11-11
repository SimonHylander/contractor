"use client";

import { useState } from "react";
import type { Proposal } from "~/server/db/schema";
import { useComposer } from "../contractor-workspace/context";

export function ProposalCard({ proposal }: { proposal: Proposal }) {
  const { actions } = useComposer();

  const handleClick = async () => {
    actions.setContent({
      type: "proposal",
      id: proposal.id,
    });
  };

  return (
    <div
      key={proposal.id}
      className={`bg-card hover:bg-secondary/50 cursor-pointer rounded-lg border p-4 transition-colors`}
      onClick={handleClick}
      role="button"
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold">{proposal.title}</h3>
        </div>
      </div>
    </div>
  );
}
