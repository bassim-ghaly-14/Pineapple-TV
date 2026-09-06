"use client";

import { useState, type ReactNode } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { MobileNavigation } from "./MobileNavigation";
import { Footer } from "./Footer";

export function AppShell({ children }: { readonly children: ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg">
      <Header onMenuToggle={() => setMobileNavOpen((v) => !v)} />
      <div className="flex">
        <Sidebar
          mobileOpen={mobileNavOpen}
          onMobileClose={() => setMobileNavOpen(false)}
        />
        <main className="min-w-0 flex-1 pt-4">
          <div className="container-pad">{children}</div>
          <Footer />
        </main>
      </div>
      <MobileNavigation />
    </div>
  );
}
