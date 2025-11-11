"use client";

import { VoiceProvider } from "../voice/voice-provider";
import { Composer } from "./composer";
import { ContractorWorkspaceProvider } from "./provider";

export function ContractorWorkspace({
  userId,
  children,
}: {
  userId: string;
  children: React.ReactNode;
}) {
  return (
    <VoiceProvider>
      <ContractorWorkspaceProvider userId={userId}>
        <Composer.Container>
          <Composer.Content />
          <Composer.Sidebar>{children}</Composer.Sidebar>
        </Composer.Container>
      </ContractorWorkspaceProvider>
    </VoiceProvider>
  );
}
