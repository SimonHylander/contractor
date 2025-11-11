const projects = [
  {
    id: "52f9f1be-61c4-43e1-8d90-3c0540558b6e",
    name: "Downtown Office Complex",
    status: "active",
    contracts: 3,
    value: "$2.5M",
    progress: 65,
    ownerId: "d22f302e-4231-466b-a0f7-dd75c4920869",
    startDate: "2026-01-01",
    endDate: "2026-08-01",
    sections: [
      {
        name: "Roofing",
        description:
          "Replace roof membrane, 40,000 sq ft, energy-efficient materials preferred",
      },
      {
        name: "Electrical",
        description:
          "Upgrade electrical system, 100,000 sq ft, 200 kW load capacity",
      },
    ],
  },
  {
    id: "1c5dc0ba-77d7-41e8-b5e6-cc1fbebe80d2",
    name: "Riverside Apartments",
    status: "pending",
    contracts: 1,
    value: "$1.8M",
    progress: 0,
    ownerId: "d22f302e-4231-466b-a0f7-dd75c4920869",
    startDate: "2026-01-01",
    endDate: "2026-08-01",
    sections: [
      {
        name: "Plumbing",
        description:
          "Replace plumbing system, 100,000 sq ft, 200 kW load capacity",
      },
      {
        name: "Flooring",
        description: "New flooring for the apartments, 450,000 sq ft",
      },
    ],
  },
  {
    id: "7d2ad74a-d815-4a58-8e62-f437988097e3",
    name: "Tech Campus Phase 2",
    status: "pending",
    contracts: 5,
    value: "$4.2M",
    progress: 40,
    ownerId: "d22f302e-4231-466b-a0f7-dd75c4920869",
    startDate: "2026-01-01",
    endDate: "2026-08-01",
    sections: [
      {
        name: "HVAC",
        description: "Install HVAC system, 100,000 sq ft, 200 kW load capacity",
      },
    ],
  },
];

export async function getProjects() {
  return Promise.resolve(projects);
}

export function getProject(id: string) {
  return projects.find((project) => project.id === id);
}

export type Project = (typeof projects)[number];
