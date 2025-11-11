import { ScrollArea } from "~/components/ui/scroll-area";

export function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-[420px] border-l-2 p-4">
      <div className="grid w-full gap-6 lg:grid-cols-1">
        <ScrollArea className="max-h-[calc(100vh-10rem)]">
          <div className="w-full space-y-4">{children}</div>
        </ScrollArea>
      </div>
    </div>
  );
}
