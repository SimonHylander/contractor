"use client";

import { useForm } from "@tanstack/react-form";
import { skipToken } from "@tanstack/react-query";
import { SparklesIcon } from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";
import { useComposer } from "~/components/contractor-workspace/context";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import { Textarea } from "~/components/ui/textarea";
import { useVoiceStore } from "~/store/voice-store";
import { api } from "~/trpc/react";

const FormContext = createContext<ReturnType<typeof useProposalForm> | null>(
  null,
);

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error(
      "useFormContext must be used within a ProposalFormProvider",
    );
  }
  return context;
};

function useProposalForm(proposalRequestId: string) {
  const createProposal = api.proposal.create.useMutation();

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      productId: 0,
    },
    onSubmit: async ({ value }) => {
      const { title, description, productId } = value;

      await createProposal.mutateAsync({
        proposalRequestId,
        productId,
        title,
        description,
      });
    },
  });

  return form;
}

function useContent() {
  const { data: content } = api.content.list.useQuery();

  return content ?? [];
}

export function ProposalForm({
  proposalRequestId,
}: {
  proposalRequestId: string;
}) {
  const form = useProposalForm(proposalRequestId);

  if (!form) {
    return null;
  }

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
        <ProposalForm.Fields />

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <div>
              <Button type="submit" disabled={!canSubmit}>
                {isSubmitting ? "Submitting..." : "Submit Proposal"}
              </Button>
            </div>
          )}
        </form.Subscribe>
      </form>
    </FormContext.Provider>
  );
}

const useGenerateDescription = (onChunk: (chunk: string) => void) => {
  const { content } = useComposer();
  const [lastEventId, setLastEventId] = useState<string | undefined>(undefined);

  api.proposal.generateOutline.useSubscription(
    !lastEventId
      ? skipToken
      : { proposalRequestId: content?.id ?? "", lastEventId },
    {
      onData: ({ id, data }) => {
        if (id === "chunk" && typeof data === "string") {
          if (!lastEventId) {
            setLastEventId(undefined);
          }

          onChunk(data);
        }

        if (id === "complete") {
          if (!lastEventId) {
            setLastEventId(undefined);
          }
        }
      },
      onComplete: () => {
        setLastEventId(undefined);
      },
      onError: (error) => {
        console.error(error);

        if (!lastEventId) {
          setLastEventId(undefined);
        }
      },
    },
  );

  const startGenerate = () => {
    setLastEventId(crypto.randomUUID());
  };

  const stopGenerate = () => {
    setLastEventId(undefined);
  };

  return {
    startGenerate,
    stopGenerate,
    isGenerating: !!lastEventId,
  };
};

ProposalForm.Fields = () => {
  const form = useFormContext();
  const content = useContent();

  const handleChunk = (chunk: string) => {
    form.setFieldValue("description", (prev) => prev + chunk);
  };

  const { startGenerate, stopGenerate, isGenerating } =
    useGenerateDescription(handleChunk);

  const handleGenerateDescription = () => {
    startGenerate();
  };

  const { intent, transcription } = useVoiceStore();

  useEffect(() => {
    if (intent && transcription) {
      console.log("User wants:", intent, transcription);
    }
  }, [intent, transcription]);

  return (
    <div className="flex flex-col gap-4">
      <form.Field
        name="title"
        validators={{
          onChange: ({ value }) =>
            !value
              ? "Title is required"
              : value.length < 3
                ? "Title must be at least 3 characters"
                : undefined,
        }}
      >
        {(field) => (
          <div>
            <Label htmlFor={field.name}>Title</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Enter a title for the proposal..."
              className="bg-card border-2 p-6"
            />
            {field.state.meta.errors && (
              <div className="text-red-500">
                {field.state.meta.errors.map((error) => error ?? "")}
              </div>
            )}
          </div>
        )}
      </form.Field>

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
          <div className="relative">
            <Label htmlFor={field.name}>Description</Label>

            <div className="relative">
              {isGenerating ? (
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
                  placeholder="Enter a description for the proposal..."
                  className="bg-card min-h-[280px] resize-none border-2 p-6"
                />
              )}

              <div className="absolute top-2 right-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="hover:bg-background hover:text-foreground cursor-pointer"
                  onClick={handleGenerateDescription}
                >
                  {isGenerating ? (
                    <SparklesIcon className="h-4 w-4 animate-pulse" />
                  ) : (
                    <SparklesIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {field.state.meta.errors && (
              <div className="text-red-500">
                {field.state.meta.errors.map((error) => error ?? "")}
              </div>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="productId">
        {(field) => (
          <div>
            <Label htmlFor={field.name}>Product</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a product" />{" "}
              </SelectTrigger>
              <SelectContent>
                {content?.map((product) => (
                  <SelectItem
                    key={product.product_id}
                    value={product.variation_id.toString()}
                    onSelect={() => field.handleChange(product.variation_id)}
                  >
                    {product.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {field.state.meta.errors && (
              <div className="text-red-500">
                {field.state.meta.errors.map((error) => error ?? "")}
              </div>
            )}
          </div>
        )}
      </form.Field>
    </div>
  );
};
