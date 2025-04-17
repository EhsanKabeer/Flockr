"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Search, Menu } from "lucide-react";
import { useRecoilState } from "recoil";
import { uiState } from "@/lib/recoil/atoms";
import Avatar from "@/components/ui/Avatar";

export default function Header() {
  const { data: session } = useSession();
  const [ui, setUi] = useRecoilState(uiState);
  const router = useRouter();
  const pathname = usePathname();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUi({ ...ui, searchQuery: e.target.value });
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const query = e.currentTarget.value.trim();
      if (query) {
        // Navigate to the search page; it will read uiState.searchQuery
        router.push("/search");
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <button className="md:hidden p-2 rounded-full hover:bg-background-hover transition-colors">
            <Menu className="w-6 h-6 text-foreground" />
          </button>
          <Link href="/home" className="text-xl font-bold text-accent">
            Flockr
          </Link>
        </div>

        {pathname !== "/search" && (
          <div className="flex-1 max-w-xl mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground-muted" />
              <input
                type="text"
                placeholder="Search..."
                value={ui.searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                className="w-full pl-12 pr-4 py-2.5 bg-background-card border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-foreground placeholder:text-foreground-muted"
              />
            </div>
          </div>
        )}

        {session?.user && (
          <Link href={`/profile/${session.user.id}`}>
            <Avatar
              src={session.user.avatar}
              alt={session.user.displayName || session.user.name || "User"}
              size="sm"
            />
          </Link>
        )}
      </div>
    </header>
  );
}

