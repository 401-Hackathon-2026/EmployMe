'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  children?: React.ReactNode; // This allows pages to inject buttons (like "Save")
}

export function Navbar({ children }: NavbarProps) {
  const pathname = usePathname();

  // Helper to style active links
  const getLinkClass = (path: string) => {
    const isActive = pathname?.startsWith(path);
    return isActive 
      ? "text-sm text-foreground font-medium text-black" 
      : "text-sm text-muted-foreground transition-colors hover:text-black";
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-300 shadow-sm z-50">
      <div className="flex items-center gap-6">
        <Link href="/dashboard" className="text-lg font-semibold">
          EmployMe
        </Link>
        
        <nav className="flex gap-4">
          <Link href="/dashboard" className={getLinkClass('/dashboard')}>
            Dashboard
          </Link>
          <Link href="/jobs" className={getLinkClass('/jobs')}>
            Jobs
          </Link>
          <Link href="/calendar" className={getLinkClass('/calendar')}>
            Calendar
          </Link>
          <Link href="/resume" className={getLinkClass('/resume')}>
            Resume
          </Link>
        </nav>
      </div>
      
      {/* Dynamic Right Side: The page determines what goes here */}
      <div className="flex items-center gap-3">
        {children}
      </div>
    </header>
  );
}