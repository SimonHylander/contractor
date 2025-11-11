import { Suspense } from "react";
import { getProjects } from "~/server/data-access/project/project";
import { ClientWorkspace } from "../client-workspace/client-workspace";
import { ProjectList } from "../project/project-list";
import { ProjectListSkeleton } from "../project/project-list-skeleton";

export function ClientDashboard({ userId }: { userId: string }) {
  const projects = getProjects();

  return (
    <div className="space-y-6">
      <ClientWorkspace userId={userId}>
        <Suspense fallback={<ProjectListSkeleton />}>
          <ProjectList projects={projects} />
        </Suspense>
      </ClientWorkspace>
    </div>
  );
}
