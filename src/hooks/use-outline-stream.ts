"use client";

import { skipToken } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";

type SubscriptionHandlers = {
  onData: (event: { id: string; data: unknown }) => void;
  onComplete: () => void;
  onError: (error: unknown) => void;
};

type UseSubscription<TInput> = (
  input: TInput | typeof skipToken,
  handlers: SubscriptionHandlers,
) => void;

type UseTextStreamArgs<TInput> = {
  subscription: UseSubscription<TInput>;
  buildInput: (sessionId: string) => TInput;
  onChunk?: (chunk: string) => void;
  onComplete?: () => void;
  onError?: (error: unknown) => void;
};

export function useTextStream<TInput>({
  subscription,
  buildInput,
  onChunk,
  onComplete,
  onError,
}: UseTextStreamArgs<TInput>) {
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [firstChunkReceived, setFirstChunkReceived] = useState(false);

  const start = useCallback(() => {
    setFirstChunkReceived(false);
    setSessionId(crypto.randomUUID());
  }, []);

  const stop = useCallback(() => {
    setSessionId(undefined);
  }, []);

  subscription(!sessionId ? skipToken : buildInput(sessionId), {
    onData: ({ id, data }) => {
      if (id === "chunk" && typeof data === "string") {
        onChunk?.(data);

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

  return useMemo(
    () => ({
      firstChunkReceived,
      isStreaming: !!sessionId,
      start,
      stop,
    }),
    [firstChunkReceived, sessionId, start, stop],
  );
}
