import { 
  Package, 
  History, 
  Home, 
  PlusCircle, 
  Settings, 
  LogOut, 
  Menu,
  Bike
} from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger
} from "@/components/ui/sidebar";
import styles from "./AppSidebar.module.css";
import React from "react";
import { useNavigate } from "react-router-dom";



export function AppSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove o token de autenticação
    navigate("/login"); // Redireciona para a página de login
  };

  return (
    <Sidebar className="border-r" style={{ backgroundColor: '#1a202c', width: '260px', minHeight: '100vh', height: '100%' }}>
      <SidebarHeader className={styles.sidebarHeader}>
        <div className={styles.logoContainer}>
          <Bike color="#FF7300" className={styles.logoIcon} />
          <span className={styles.logoText}>NaHora!</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
         
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/" className={styles.menuItem}>
                    <Home color="#FF7300" className={styles.menuItemIcon} />
                    Visão Geral
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/active-deliveries" className={styles.menuItem}>
                    <Package color="#FF7300" className={styles.menuItemIcon} />
                    Entregas Ativas
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/history" className={styles.menuItem}>
                    <History color="#FF7300" className={styles.menuItemIcon} />
                    Histórico
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/new-delivery" className={styles.menuItem}>
                    <PlusCircle color="#FF7300" className={styles.menuItemIcon} />
                    Nova Entrega
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/settings" className={styles.menuItem}>
                    <Settings color="#FF7300" className={styles.menuItemIcon} />
                    Configurações
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className={styles.sidebarFooter}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button className={styles.logoutButton} onClick={handleLogout}>
                <LogOut color="#FF7300" className={styles.logoutIcon} />
                Sair
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}