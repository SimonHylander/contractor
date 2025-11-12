"use client";

import { skipToken } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "~/trpc/react";

type UseEditOutlineStreamArgs = {
  projectId: string;
  onChunk: (chunk: string) => void;
  onComplete?: () => void;
  onError?: (error: unknown) => void;
};

export function useEditOutlineStream({
  projectId,
  onChunk,
  onComplete,
  onError,
}: UseEditOutlineStreamArgs) {
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [firstChunkReceived, setFirstChunkReceived] = useState(false);
  const [outline, setOutline] = useState<string>("");
  const [userInstruction, setUserInstruction] = useState<string>("");

  const start = useCallback((outlineValue: string, instruction: string) => {
    setOutline(outlineValue);
    setUserInstruction(instruction);
    setFirstChunkReceived(false);
    setSessionId(crypto.randomUUID());
  }, []);

  const stop = useCallback(() => {
    setSessionId(undefined);
  }, []);

  const input = !sessionId
    ? skipToken
    : {
        projectId,
        outline,
        userInstruction,
        lastEventId: sessionId,
      };

  api.proposalRequest.generateOutlineForIntent.useSubscription(input, {
    onData: ({ id, data }) => {
      console.log(id);
      if (id === "chunk" && typeof data === "string") {
        onChunk(data);

        if (!firstChunkReceived) {
          setFirstChunkReceived(true);
        }
      }
    },
    onComplete: () => {
      stop();
      onComplete?.();
    },
    onError: (error) => {
      stop();
      onError?.(error);
    },
  });

  return {
    firstChunkReceived,
    isStreaming: !!sessionId,
    start,
    stop,
  };
}
