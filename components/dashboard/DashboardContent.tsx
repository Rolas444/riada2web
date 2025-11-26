'use client';

import { Menu } from 'lucide-react';
import React from 'react';

interface DashboardContentProps {
  children: React.ReactNode;
  onToggleMobileSidebar: () => void;
}

const Header = ({ onToggleMobileSidebar }: { onToggleMobileSidebar: () => void }) => {
  return (
    <header className="flex h-16 items-center border-b bg-gray-50 px-4 dark:border-gray-800 dark:bg-gray-900 lg:hidden">
      <button
        onClick={onToggleMobileSidebar}
        className="rounded-md p-2 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
        aria-label="Abrir menú"
      >
        <Menu className="h-6 w-6" />
      </button>
    </header>
  );
};

const DashboardContent: React.FC<DashboardContentProps> = ({ children, onToggleMobileSidebar }) => {
  return (
    <div className="flex flex-1 flex-col min-w-0">
      <Header onToggleMobileSidebar={onToggleMobileSidebar} />
      <main className="flex-1 overflow-y-auto p-4 lg:p-8 min-w-0">{children}</main>
    </div>
  );
};

export default DashboardContent;