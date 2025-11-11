import { use } from "react";
import type { Project } from "~/server/data-access/project/project";
import { ProjectCard } from "./project-card";

export function ProjectList({
  projects: data,
}: {
  projects: Promise<Project[]>;
}) {
  const projects = use(data);

  return (
    <div className="flex flex-col gap-2">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          Projects
        </h2>

        <p className="text-muted-foreground text-sm">Your projects</p>
      </div>

      {projects.length > 0 && (
        <div className="flex flex-col gap-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
