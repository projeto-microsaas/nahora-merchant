import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import styles from "./DashboardLayout.module.css";

export function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <div className={styles.dashboardContainer} style={{ height: '100vh' }}> {/* Força altura total da viewport */}
        <AppSidebar />
        <main className={styles.mainContent}>
          <div className={styles.contentArea}>
            {children}
          </div>
        </main>
      </div>  
    </SidebarProvider>
  );
}

export default DashboardLayout;