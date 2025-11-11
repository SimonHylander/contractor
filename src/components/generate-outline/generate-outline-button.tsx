"use client";

import { SparklesIcon } from "lucide-react";
import { Button } from "~/components/ui/button";

type GenerateOutlineButtonProps = {
  isGenerating: boolean;
  onGenerate: () => void;
  disabled?: boolean;
  className?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
};

export function GenerateOutlineButton({
  isGenerating,
  onGenerate,
  disabled,
  className,
  variant = "ghost",
}: GenerateOutlineButtonProps) {
  return (
    <Button
      type="button"
      variant={variant}
      className={`hover:text-primary cursor-pointer hover:bg-transparent disabled:opacity-50 ${className ?? ""}`}
      disabled={disabled ?? isGenerating}
      onClick={onGenerate}
    >
      {isGenerating ? (
        <SparklesIcon className="animate-pulse" />
      ) : (
        <SparklesIcon />
      )}
    </Button>
  );
}
