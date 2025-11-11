import { FileText } from "lucide-react";
import { APP_NAME } from "~/lib/constants";
import { UserSelect } from "./user-select";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-card sticky top-0 z-50 flex h-18 flex-col justify-center border-b">
      <div className="flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <FileText className="text-primary h-6 w-6" />
          <h1 className="text-xl font-bold">{APP_NAME}</h1>
        </Link>

        <div>
          <UserSelect />
        </div>
      </div>
    </header>
  );
}
