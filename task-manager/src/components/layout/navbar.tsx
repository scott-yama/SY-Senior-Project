'use client';

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium transition-colors hover:text-[#3D5A80]",
        isActive ? "text-[#3D5A80]" : "text-[#1E3D59]"
      )}
    >
      {children}
    </Link>
  );
}

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#5C7BA1] bg-[#E6EEF8]">
      <div className="flex h-14 items-center px-6">
        <Link href="/" className="flex items-center space-x-1">
          <span className="text-xl font-bold text-[#3D5A80]">Task</span>
          <span className="text-xl font-bold italic text-[#5C7BA1]">Max</span>
        </Link>
        <div className="ml-auto flex items-center space-x-6">
          <NavLink href="/">Tasks</NavLink>
          <NavLink href="/calendar">Calendar</NavLink>
        </div>
      </div>
    </nav>
  );
} 