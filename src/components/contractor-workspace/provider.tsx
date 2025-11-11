"use client";

import { useState } from "react";
import { Composer } from "./composer";
import type { ContentType } from "./context";

export function ContractorWorkspaceProvider({
  userId,
  children,
}: {
  userId: string;
  children: React.ReactNode;
}) {
  const [content, setContent] = useState<ContentType>();

  return (
    <Composer.Provider
      userId={userId}
      content={content}
      actions={{
        setContent: (content?: ContentType) => {
          setContent(content);
        },
      }}
    >
      {children}
    </Composer.Provider>
  );
}
