"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, User, LogOut, Settings } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";

const navigation = [
  { name: "Home", href: "/home", icon: Home },
  { name: "Explore", href: "/explore", icon: Search },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 md:border-r md:border-border md:bg-background">
      <div className="flex flex-col h-screen p-4">
        <div className="flex items-center justify-center mb-8">
          <h1 className="text-2xl font-bold text-accent">Flockr</h1>
        </div>

        <nav className="flex-1 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-full transition-colors",
                  isActive
                    ? "bg-background-card text-foreground font-semibold"
                    : "text-foreground-muted hover:bg-background-hover"
                )}
              >
                <item.icon className="w-6 h-6" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          {session?.user && (
            <Link
              href={`/profile/${session.user.id}`}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-full transition-colors",
                pathname?.includes("/profile/")
                  ? "bg-background-card text-foreground font-semibold"
                  : "text-foreground-muted hover:bg-background-hover"
              )}
            >
              <User className="w-6 h-6" />
              <span>Profile</span>
            </Link>
          )}
        </nav>

        {session?.user && (
          <div className="mt-auto pt-4 border-t border-border">
            <div className="flex items-center gap-3 px-4 py-3 rounded-full hover:bg-background-hover transition-colors">
              <Avatar
                src={session.user.avatar}
                alt={session.user.displayName || session.user.name || "User"}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {session.user.displayName || session.user.name}
                </p>
                <p className="text-xs text-foreground-muted truncate">
                  @{session.user.username || session.user.email?.split("@")[0]}
                </p>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-full text-foreground-muted hover:bg-background-hover transition-colors mt-2"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

