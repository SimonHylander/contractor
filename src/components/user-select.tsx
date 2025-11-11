"use client";

import { api } from "~/trpc/react";
import { Button } from "./ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { useUser } from "~/contexts/auth-context";
import { cn } from "~/lib/utils";
import { Skeleton } from "./ui/skeleton";
import { useRouter } from "next/navigation";

export function UserSelect() {
  const { user, signIn } = useUser();
  const router = useRouter();

  const { data: availableContractors, isLoading } =
    api.contractor.getAvailableContractors.useQuery(undefined, {
      enabled: !!user,
    });

  const setUser = (userId: string) => {
    signIn(userId);
    router.refresh();
  };

  if (!user || isLoading) {
    return (
      <Skeleton
        className={cn(
          "bg-background border-input h-10 w-[120px] animate-pulse border",
        )}
      />
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-10 min-w-[120px]">
          {user?.name ?? ""}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {availableContractors?.map((contractor) => (
          <DropdownMenuItem
            key={contractor.id}
            onClick={() => setUser(contractor.id)}
            className={user?.id === contractor.id ? "bg-accent" : ""}
          >
            <div className="flex flex-col">
              <span className="font-medium">{contractor.name}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
