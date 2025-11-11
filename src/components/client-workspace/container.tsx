export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-screen min-h-[calc(100vh-18rem)] flex-1 border-t-2">
      {children}
    </div>
  );
}
