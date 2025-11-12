"use client";

import { skipToken } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
  const buildInputOverrideRef = useRef<((sessionId: string) => TInput) | null>(
    null,
  );

  const start = useCallback(() => {
    setFirstChunkReceived(false);
    setSessionId(crypto.randomUUID());
  }, []);

  const startWith = useCallback((override: (sessionId: string) => TInput) => {
    buildInputOverrideRef.current = override;
    setFirstChunkReceived(false);
    setSessionId(crypto.randomUUID());
  }, []);

  const stop = useCallback(() => {
    setSessionId(undefined);
  }, []);

  // Use override if present for the next start, then clear it
  const input = !sessionId
    ? skipToken
    : (buildInputOverrideRef.current?.(sessionId) ?? buildInput(sessionId));

  useEffect(() => {
    if (sessionId && buildInputOverrideRef.current) {
      // Clear after first use so subsequent renders use the base builder
      buildInputOverrideRef.current = null;
    }
  }, [sessionId]);

  subscription(input, {
    onData: ({ id, data }) => {
      console.log(id);
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
      startWith,
      stop,
    }),
    [buildInput, firstChunkReceived, sessionId, start, startWith, stop],
  );
}
