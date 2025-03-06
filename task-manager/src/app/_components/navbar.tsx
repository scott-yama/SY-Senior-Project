import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  isActive?: boolean;
  children: React.ReactNode;
}

function NavLink({ href, isActive, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium transition-colors hover:text-emerald-600",
        isActive ? "text-emerald-600" : "text-muted-foreground"
      )}
    >
      {children}
    </Link>
  );
}

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="flex h-14 items-center px-6">
        <Link href="/" className="flex items-center space-x-1">
          <span className="text-xl font-bold text-emerald-600">Task</span>
          <span className="text-xl font-bold italic text-emerald-600">Max</span>
        </Link>
        <div className="ml-auto flex items-center space-x-6">
          <NavLink href="/" isActive>Tasks</NavLink>
        </div>
      </div>
    </nav>
  );
}