"use client";

import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface FeedLayoutProps {
  children: ReactNode;
}

export default function FeedLayout({ children }: FeedLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 max-w-2xl mx-auto border-x border-border min-h-screen bg-background">
          {children}
        </main>
        <aside className="hidden lg:block lg:w-80 border-l border-border p-4 bg-background">
          <div className="sticky top-20">
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">
                What&apos;s happening
              </h3>
              <p className="text-foreground-muted text-sm">
                Trending topics and suggestions will appear here
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

