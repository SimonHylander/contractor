"use client";

import { XIcon } from "lucide-react";
import { useState } from "react";
import { api } from "~/trpc/react";
import { ProposalForm } from "../proposal/proposal-form/proposal-form";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { LinkButton } from "../ui/link-button";
import { useComposer } from "./context";
import { SendProposalRequest } from "../proposal-request/send-proposal-request";

const useProject = (projectId?: string) => {
  return api.project.get.useQuery(
    {
      projectId: projectId ?? "",
    },
    {
      enabled: !!projectId,
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

  if (content.type === "project") {
    return <ProposalRequestContent id={content.id} />;
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
  const { data: project } = useProject(id);
  const [isForm, setForm] = useState(false);

  if (!project) {
    return <NoContent />;
  }

  if (isForm) {
    return (
      <div className="relative flex h-full grow flex-col gap-4 self-stretch p-4">
        <CloseContent />
        <SendProposalRequest project={project} />
      </div>
    );
  }

  return (
    <div className="relative flex h-full grow flex-col gap-4 self-stretch p-4">
      <CloseContent />

      <div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-semibold">{project.name}</span>
        </div>

        <div>
          <p className="text-muted-foreground text-sm">
            {project.startDate} - {project.endDate}
          </p>
        </div>

        {project.sections && project.sections.length > 0 && (
          <div>
            <h3 className="mb-2 font-semibold">Project Sections</h3>
            <div className="space-y-2">
              {project.sections.map((section) => (
                <div
                  key={section.name}
                  className="bg-secondary/50 rounded-lg p-3"
                >
                  <h4 className="font-medium">{section.name}</h4>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {section.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <Button className="cursor-pointer" onClick={() => setForm(true)}>
          Request Proposal
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
