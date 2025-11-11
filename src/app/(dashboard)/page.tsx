import { ClientDashboard } from "~/components/dashboards/client";
import { ContractorDashboard } from "~/components/dashboards/contractor";
import { auth, signInDefault } from "~/server/auth";

export default function DashboardPage() {
  return <PageContent />;
}

async function PageContent() {
  const { user } = await auth();

  if (!user) {
    await signInDefault();
    return;
  }

  switch (user.role) {
    case "client":
      return <ClientDashboard userId={user.id} />;
    case "contractor":
      return <ContractorDashboard userId={user.id} />;
  }
}
