"use client";

import { VoiceProvider } from "../voice/voice-provider";
import { Composer } from "./composer";
import { ClientWorkspaceProvider } from "./provider";

export function ClientWorkspace({
  userId,
  children,
}: {
  userId: string;
  children: React.ReactNode;
}) {
  return (
    <ClientWorkspaceProvider userId={userId}>
      <Composer.Container>
        <Composer.Content />
        <Composer.Sidebar>{children}</Composer.Sidebar>
      </Composer.Container>
    </ClientWorkspaceProvider>
  );
}
