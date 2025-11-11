"use client";

export function Header() {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-bold">Contractor Workspace</h1>
      <p className="text-muted-foreground animate-in fade-in slide-in-from-top-2 delay-150 duration-500">
        Manage proposals and active contracts
      </p>
    </div>
  );
}
