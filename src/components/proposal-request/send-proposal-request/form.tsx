"use client";

import { useForm } from "@tanstack/react-form";
import { createContext, useContext, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

import { skipToken } from "@tanstack/react-query";
import { GenerateOutlineButton } from "~/components/generate-outline/generate-outline-button";
import { useTextStream } from "~/hooks/use-outline-stream";
import type { CreateProposalRequestSchema } from "~/server/api/schema/proposal-request-schema";
import { useVoiceStore } from "~/store/voice-store";
import { api } from "~/trpc/react";
import { useComposer } from "./context";

const FormContext = createContext<ReturnType<
  typeof useSendProposalRequestForm
> | null>(null);

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error(
      "Form components must be used within SendProposalRequestForm",
    );
  }
  return context;
};

function useSendProposalRequestForm() {
  const { project, actions: composerActions } = useComposer();

  const form = useForm({
    defaultValues: {
      description: "",
      email: "hylandersimon@gmail.com",
      projectId: project.id,
    } as CreateProposalRequestSchema,
    onSubmit: async ({ value }) => {
      await composerActions.submit({
        ...value,
        projectId: project.id,
      });

      form.reset();
    },
  });

  return form;
}

function SendProposalRequestForm({ children }: { children: React.ReactNode }) {
  const form = useSendProposalRequestForm();

  return (
    <FormContext.Provider value={form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        {children}
      </form>
    </FormContext.Provider>
  );
}

SendProposalRequestForm.Fields = () => {
  const { project, actions: composerActions } = useComposer();
  const form = useFormContext();

  const { intent, transcription, clear } = useVoiceStore();

  const stream = useTextStream({
    subscription: api.proposalRequest.generateOutline.useSubscription,
    buildInput: (sessionId) => ({
      projectId: project.id,
      lastEventId: sessionId,
    }),
    onChunk: (chunk) => {
      form.setFieldValue("description", (prev) => prev + chunk);
    },
    onComplete: () => {},
    onError: (error) => {
      console.error(error);
    },
  });

  const [intentId, setIntentId] = useState<string | undefined>(undefined);
  const [existingDescription, setExistingDescription] = useState<string>("");

  api.proposalRequest.generateOutlineForIntent.useSubscription(
    !intentId
      ? skipToken
      : {
          projectId: project.id,
          outline: existingDescription ?? "",
          userInstruction: transcription ?? "",
          lastEventId: intentId,
        },
    {
      onData: ({ id, data }) => {
        console.log(id);
        if (id === "chunk" && typeof data === "string") {
          form.setFieldValue("description", (prev) => prev + data);
        }
      },
      onComplete: () => {
        stop();
      },
      onError: (error) => {
        stop();
      },
    },
  );

  const handleGenerate = () => {
    stream.start();
  };

  useEffect(() => {
    if (intent === "edit-proposal-request-description" && transcription) {
      const outline = form.state.values.description;
      form.setFieldValue("description", "");

      setExistingDescription(outline);
      setIntentId(crypto.randomUUID());
      // intentStream.start(outline, transcription);
    }
  }, [intent, transcription]);

  return (
    <form.Field
      name="description"
      validators={{
        onChange: ({ value }) =>
          !value
            ? "Description is required"
            : value.length < 10
              ? "Description must be at least 10 characters"
              : undefined,
      }}
    >
      {(field) => (
        <div className="flex flex-col gap-4">
          <Label htmlFor={field.name} className="text-lg">
            Description
          </Label>

          <div className="relative">
            {stream.isStreaming && !stream.firstChunkReceived ? (
              <div className="bg-card border-input flex min-h-[280px] w-full resize-none gap-2 rounded-md border-2 p-6 text-sm">
                <div className="flex gap-1">
                  <div className="bg-foreground/40 h-2 w-2 animate-bounce rounded-full [animation-delay:-0.3s]"></div>
                  <div className="bg-foreground/40 h-2 w-2 animate-bounce rounded-full [animation-delay:-0.15s]"></div>
                  <div className="bg-foreground/40 h-2 w-2 animate-bounce rounded-full"></div>
                </div>
              </div>
            ) : (
              <Textarea
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter a description for the proposal request..."
                disabled={stream.isStreaming && !stream.firstChunkReceived}
                className="bg-card min-h-[280px] resize-none border-2 p-6"
              />
            )}

            {field.state.meta.errors && (
              <p className="text-destructive text-sm">
                {field.state.meta.errors[0]}
              </p>
            )}

            <div className="absolute top-2 right-2">
              <GenerateOutlineButton
                isGenerating={stream.isStreaming}
                onGenerate={handleGenerate}
              />
            </div>
          </div>
        </div>
      )}
    </form.Field>
  );
};

SendProposalRequestForm.Actions = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="flex justify-between gap-2">{children}</div>;
};

SendProposalRequestForm.Submit = () => {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) => (
        <Button type="submit" disabled={!canSubmit} className="cursor-pointer">
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </Button>
      )}
    </form.Subscribe>
  );
};

export { SendProposalRequestForm };
