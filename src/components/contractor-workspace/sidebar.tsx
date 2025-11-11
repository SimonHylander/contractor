import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "../ui/separator";

export function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-[420px] border-l-2 p-4">
      <div className="grid w-full gap-6 lg:grid-cols-1">
        <ScrollArea className="max-h-[calc(100vh-10rem)]">
          <div className="w-full space-y-4">
            {children}

            <Separator />

            <div>
              <h2 className="flex items-center gap-2 text-xl font-semibold">
                Active Contracts
              </h2>
              <p className="text-muted-foreground text-sm">
                Your ongoing projects
              </p>
            </div>

            {/* <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="text-success h-5 w-5" />
                        Active Contracts
                      </CardTitle>
                      <CardDescription>Your ongoing projects</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {activeContracts.map((contract) => (
                        <div
                          key={contract.id}
                          className="hover:bg-secondary/50 rounded-lg border p-4 transition-colors"
                        >
                          <div className="mb-3 flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold">
                                {contract.project}
                              </h3>
                              <p className="text-muted-foreground text-sm">
                                {contract.contractor}
                              </p>
                              <p className="mt-1 text-sm font-medium">
                                {contract.scope}
                              </p>
                            </div>
                            <Badge variant="default">Active</Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Progress
                              </span>
                              <span className="font-medium">
                                {contract.progress}%
                              </span>
                            </div>
                            <div className="bg-secondary h-2 w-full rounded-full">
                              <div
                                className="bg-success h-2 rounded-full transition-all"
                                style={{ width: `${contract.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card> */}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
