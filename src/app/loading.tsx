import { FileText } from "lucide-react";
import { APP_NAME } from "~/lib/constants";
import { cn } from "~/lib/utils";
import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="bg-background min-h-screen">
      <header className="bg-card sticky top-0 z-50 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="text-primary h-6 w-6" />
              <h1 className="text-xl font-bold">{APP_NAME}</h1>
            </div>

            <div>
              <Skeleton
                className={cn(
                  "bg-background border-input h-10 w-[70px] animate-pulse border",
                )}
              />
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8"></main>
    </div>
  );
}
