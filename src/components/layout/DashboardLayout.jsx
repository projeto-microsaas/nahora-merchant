import React from 'react';
import { SidebarProvider } from "../ui/sidebar";
import { AppSidebar } from "./AppSidebar";

const DashboardLayout = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;