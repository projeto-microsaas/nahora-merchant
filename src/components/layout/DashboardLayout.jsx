import React from "react";
import { AppSidebar } from "./AppSidebar";
import styles from "./DashboardLayout.module.css";

export function DashboardLayout({ children }) {
  return (
    <div className={styles.dashboardContainer}>
      <AppSidebar />
      <main className={styles.mainContent}>
        <div className={styles.contentContainer}>
          {children}
        </div>
      </main>
    </div>  
  );
}

export default DashboardLayout;