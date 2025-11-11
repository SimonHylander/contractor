"use client";

import { Button } from "~/components/ui/button";
import { GenerateOutlineButton } from "../../generate-outline/generate-outline-button";

export function Actions({
  canSubmit,
  isSubmitting,
}: {
  canSubmit: boolean;
  isSubmitting: boolean;
}) {
  return (
    <div className="flex justify-between gap-2">
      <div className="flex gap-2">
        <GenerateOutlineButton />
      </div>

      <Button type="submit" disabled={!canSubmit}>
        {isSubmitting ? "Submitting..." : "Submit Request"}
      </Button>
    </div>
  );
}
