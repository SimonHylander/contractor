import { getMatchingProposalRequests } from "~/server/data-access/proposal-request/proposal-request";

import { Suspense } from "react";
import { ContractorWorkspace } from "~/components/contractor-workspace/contractor-workspace";
import { getProposals } from "~/server/data-access/proposal/proposal";
import { MatchingProposalRequests } from "../proposal-request/matching-proposal-requests";
import { Proposals } from "../proposal/proposal-list";
import { MatchingProposalRequestsSkeleton } from "../skeletons/matching-proposal-requests-skeleton";
import { VoiceRecorder } from "../voice/voice-recorder";

export async function ContractorDashboard({ userId }: { userId: string }) {
  const matchingProposalRequests = getMatchingProposalRequests(userId);
  const proposals = getProposals(userId);

  return (
    <ContractorWorkspace userId={userId}>
      <div className="relative">
        <VoiceRecorder />
      </div>

      <Suspense fallback={<MatchingProposalRequestsSkeleton />}>
        <MatchingProposalRequests proposalRequests={matchingProposalRequests} />
      </Suspense>

      <Suspense fallback={<MatchingProposalRequestsSkeleton />}>
        <Proposals proposals={proposals} />
      </Suspense>
    </ContractorWorkspace>
  );
}
