"use client";

import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface LinkButtonProps extends React.ComponentProps<typeof Link> {
  children: React.ReactNode;
}

export function LinkButton({ href, children, ...rest }: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={cn(buttonVariants({ variant: "default" }))}
      {...rest}
    >
      {children}
    </Link>
  );
}
