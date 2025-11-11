"use client";

import { XIcon } from "lucide-react";
import { useState } from "react";
import { api } from "~/trpc/react";
import { ProposalForm } from "../proposal/proposal-form/proposal-form";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { LinkButton } from "../ui/link-button";
import { useComposer } from "./context";

const useProposalRequest = (proposalRequestId: string | undefined) => {
  return api.proposalRequest.get.useQuery(
    {
      id: proposalRequestId ?? "",
    },
    {
      enabled: !!proposalRequestId,
    },
  );
};

const useProposal = (proposalId: string | undefined) => {
  return api.proposal.get.useQuery(
    {
      id: proposalId ?? "",
    },
    {
      enabled: !!proposalId,
    },
  );
};

export function Content() {
  const { content } = useComposer();

  if (!content) {
    return <NoContent />;
  }

  console.log(content);

  if (content.type === "proposal-request") {
    return <ProposalRequestContent id={content.id} />;
  }

  if (content.type === "proposal") {
    return <ProposalContent id={content.id} />;
  }
}

function CloseContent() {
  const { actions } = useComposer();

  const handleClose = () => {
    actions.setContent(undefined);
  };

  return (
    <div className="absolute top-0 right-0">
      <Button
        variant="ghost"
        size="icon"
        className="cursor-pointer"
        onClick={handleClose}
      >
        <XIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}

function NoContent() {
  return (
    <div className="relative flex h-full grow flex-col items-center justify-center gap-4 self-stretch">
      <div className="text-muted-foreground text-lg">
        Select an item to work on
      </div>
    </div>
  );
}

function ProposalRequestContent({ id }: { id: string | undefined }) {
  const { data: proposalRequest } = useProposalRequest(id);
  const [isCreatingProposal, setIsCreatingProposal] = useState(false);

  if (!proposalRequest) {
    return <NoContent />;
  }

  if (isCreatingProposal) {
    return (
      <div className="relative flex h-full grow flex-col gap-4 self-stretch p-4">
        <h2 className="text-2xl font-bold">Create Proposal</h2>
        <ProposalForm proposalRequestId={proposalRequest.id} />
      </div>
    );
  }

  return (
    <div className="relative flex h-full grow flex-col gap-4 self-stretch p-4">
      <CloseContent />

      {proposalRequest.project && (
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xl font-semibold">
              {proposalRequest.project.name}
            </span>
            {/* <Badge variant="secondary">Opportunity</Badge> */}
          </div>

          <div>
            <p className="text-muted-foreground text-sm">
              {proposalRequest?.project.startDate} -{" "}
              {proposalRequest?.project.endDate}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {proposalRequest.description && (
          <div>
            <p className="mb-2 font-semibold">Description</p>
            <p className="text-muted-foreground text-md max-w-2xl">
              {proposalRequest.description}
            </p>
          </div>
        )}

        {proposalRequest.project && (
          <>
            {proposalRequest.project.sections &&
              proposalRequest.project.sections.length > 0 && (
                <div>
                  <h3 className="mb-2 font-semibold">Project Sections</h3>
                  <div className="space-y-2">
                    {proposalRequest.project.sections.map(
                      (
                        section: { name: string; description: string },
                        index: number,
                      ) => (
                        <div
                          key={index}
                          className="bg-secondary/50 rounded-lg p-3"
                        >
                          <h4 className="font-medium">{section.name}</h4>
                          <p className="text-muted-foreground mt-1 text-sm">
                            {section.description}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
          </>
        )}
      </div>

      <div>
        <Button
          className="cursor-pointer"
          onClick={() => setIsCreatingProposal(true)}
        >
          Create Proposal
        </Button>
      </div>
    </div>
  );
}

function ProposalContent({ id }: { id: string | undefined }) {
  const { data: proposal } = useProposal(id);

  if (!proposal) {
    return <NoContent />;
  }

  return (
    <div className="relative flex h-full grow flex-col gap-4 self-stretch p-4">
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-semibold">{proposal.title}</span>
          <Badge variant="secondary">Opportunity</Badge>
        </div>
      </div>

      <div>
        {proposal.url && (
          <LinkButton
            href={proposal.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            View In Proposales
          </LinkButton>
        )}
      </div>
    </div>
  );
}
