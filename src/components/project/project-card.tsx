"use client";

import type { Project } from "~/server/data-access/project/project";
import { useComposer } from "../client-workspace/context";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export function ProjectCard({ project }: { project: Project }) {
  const { actions } = useComposer();

  const handleClick = async () => {
    actions.setContent({
      type: "project",
      id: project.id,
    });
  };

  return (
    <div
      key={project.id}
      className={`bg-card hover:bg-secondary/50 cursor-pointer rounded-lg border p-4 transition-colors`}
      onClick={handleClick}
      role="button"
    >
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="font-semibold">{project.name}</h3>
          <div className="text-muted-foreground mt-1 flex items-center gap-3 text-sm">
            <span>{project.contracts} contracts</span>
            <span>•</span>
            <span>{project.value}</span>
          </div>
        </div>
        <Badge variant={project.status === "active" ? "default" : "secondary"}>
          {project.status}
        </Badge>
      </div>
      {project.status === "active" && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <div className="bg-secondary h-2 w-full rounded-full">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
