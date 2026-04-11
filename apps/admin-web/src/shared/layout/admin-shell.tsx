'use client';

import { useState } from 'react';

import { appConfig } from '@rh-ponto/config';

import { SidebarNav } from './sidebar-nav';
import { Topbar } from './topbar';

export const AdminShell = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div
      className="min-h-screen bg-[var(--background)] text-[var(--foreground)]"
      style={{ ['--admin-sidebar-width' as string]: appConfig.admin.sidebarWidth }}
    >
      <SidebarNav mobileOpen={isSidebarOpen} onCloseMobile={() => setIsSidebarOpen(false)} />
      <div className="min-h-screen lg:pl-[var(--admin-sidebar-width)]">
        <Topbar onOpenSidebar={() => setIsSidebarOpen(true)} />
        <main className="px-4 pb-8 pt-20 sm:px-5 md:px-6 lg:px-8 lg:pb-10 lg:pt-24">
          <div className="mx-auto w-full max-w-[1440px]">{children}</div>
        </main>
      </div>
    </div>
  );
};
