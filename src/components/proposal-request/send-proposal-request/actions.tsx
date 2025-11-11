"use client";

import { Button } from "~/components/ui/button";

export function Actions({
  canSubmit,
  isSubmitting,
}: {
  canSubmit: boolean;
  isSubmitting: boolean;
}) {
  return (
    <div className="flex justify-between gap-2">
      <Button type="submit" disabled={!canSubmit}>
        {isSubmitting ? "Submitting..." : "Submit Request"}
      </Button>
    </div>
  );
}
