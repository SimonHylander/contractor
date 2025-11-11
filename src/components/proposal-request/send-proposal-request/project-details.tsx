import { useComposer } from "./context";

export function ProjectDetails() {
  const { project } = useComposer();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">{project.name}</h2>
        <p className="text-muted-foreground text-sm">
          {project.startDate} {project.endDate ? `- ${project.endDate}` : ""}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {project.sections.map((section) => (
          <div key={section.name}>
            <h3 className="text-md font-bold">{section.name}</h3>
            <p className="text-muted-foreground text-sm">
              {section.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
