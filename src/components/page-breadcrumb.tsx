"use client";

import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

export default function PageBreadcrumb({}: {}) {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>

          {paths.map((path) => (
            <>
              <BreadcrumbSeparator />

              <BreadcrumbItem key={path}>
                <BreadcrumbLink href={`/${path}`}>{path}</BreadcrumbLink>
              </BreadcrumbItem>
            </>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
