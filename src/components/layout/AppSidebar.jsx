import React from 'react';
import { 
  Package, 
  History, 
  Home, 
  PlusCircle, 
  Settings, 
  LogOut, 
  Bike
} from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter
} from "@/components/ui/sidebar";
import styles from "./AppSidebar.module.css";
import { useNavigate } from "react-router-dom";

export function AppSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <Sidebar className={styles.sidebar}>
      {/* Cabeçalho */}
      <SidebarHeader className={styles.sidebarHeader}>
        <div className={styles.logoContainer}>
          <Bike className={styles.logoIcon} />
          <span className={styles.logoText}>NaHora!</span>
        </div>
      </SidebarHeader>
      
      {/* Conteúdo da Sidebar */}
      <SidebarContent className={styles.sidebarContent}>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className={styles.menu}>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/deliveries" className={styles.menuItem}>
                    <Home className={styles.menuIcon} />
                    Visão Geral
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/active-deliveries" className={styles.menuItem}>
                    <Package className={styles.menuIcon} />
                    Entregas Ativas
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/history" className={styles.menuItem}>
                    <History className={styles.menuIcon} />
                    Histórico
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/new-delivery" className={styles.menuItem}>
                    <PlusCircle className={styles.menuIcon} />
                    Nova Entrega
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/settings" className={styles.menuItem}>
                    <Settings className={styles.menuIcon} />
                    Configurações
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

             {/* Rodapé - Logout */}
      <SidebarFooter className={styles.sidebarFooter}>
        <button className={styles.logoutButton} onClick={handleLogout}>
          <LogOut className={styles.logoutIcon} />
          <span>Sair</span>
        </button>
      </SidebarFooter>

  
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

     
    </Sidebar>
  );
}

export default AppSidebar;