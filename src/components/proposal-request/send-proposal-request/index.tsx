"use client";

import type { Project } from "~/server/data-access/project/project";
import { Composer } from "./composer";
import { SendProposalRequestProvider } from "./send-proposal-request-provider";
import { VoiceProvider } from "~/components/voice/voice-provider";

export function SendProposalRequest({ project }: { project: Project }) {
  return (
    <VoiceProvider>
      <SendProposalRequestProvider project={project}>
        <Composer.ProjectDetails />
        <Composer.Form>
          <Composer.Form.Fields />
          <Composer.Form.Actions>
            <Composer.Form.Submit />
          </Composer.Form.Actions>
        </Composer.Form>
      </SendProposalRequestProvider>
    </VoiceProvider>
  );
}
