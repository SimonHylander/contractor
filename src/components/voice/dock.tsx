"use client";

import { FloatingDock } from "~/components/ui/floating-dock";

import { MicIcon, StopCircle } from "lucide-react";
import { useMemo } from "react";

export function FloatingDockNavigation({
  recording,
  onVoiceControl,
}: {
  recording: boolean;
  onVoiceControl: () => void;
}) {
  const links = useMemo(
    () => [
      {
        id: "voice-control",
        title: recording ? "Stop Recording" : "Voice Control",
        icon: recording ? (
          <StopCircle className="text-background h-full w-full" />
        ) : (
          <MicIcon className="text-background h-full w-full" />
        ),
        onClick: onVoiceControl,
      },
    ],
    [recording],
  );

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 flex w-full items-center justify-center">
      <FloatingDock items={links} />
    </div>
  );
}
