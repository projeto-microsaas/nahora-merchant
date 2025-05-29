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
  } from "../ui/sidebar";
  import { cn } from "../../lib/utils";
  
  const AppSidebar = () => {
    return (
      <Sidebar className="border-r">
        <SidebarHeader className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <Bike color="#FF7300" className="h-6 w-6 text-javai-purple" />
            <span className="text-xl font-bold text-javai-purple">Já Vai!</span>
          </div>
          <SidebarTrigger>
            <Menu color="#FF7300" className="h-5 w-5" />
          </SidebarTrigger>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/" className={cn(
                      "flex items-center space-x-3 rounded-md px-3 py-2",
                      "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      "w-full"
                    )}>
                      <Home color="#FF7300" className="h-5 w-5" />
                      <span>Visão Geral</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/deliveries" className={cn(
                      "flex items-center space-x-3 rounded-md px-3 py-2",
                      "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      "w-full"
                    )}>
                      <Package color="#FF7300" className="h-5 w-5" />
                      <span>Entregas Ativas</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/history" className={cn(
                      "flex items-center space-x-3 rounded-md px-3 py-2",
                      "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      "w-full"
                    )}>
                      <History color="#FF7300" className="h-5 w-5" />
                      <span>Histórico</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/new-delivery" className={cn(
                      "flex items-center space-x-3 rounded-md px-3 py-2",
                      "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      "w-full"
                    )}>
                      <PlusCircle color="#FF7300" className="h-5 w-5" />
                      <span>Nova Entrega</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/settings" className={cn(
                      "flex items-center space-x-3 rounded-md px-3 py-2",
                      "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      "w-full"
                    )}>
                      <Settings color="#FF7300" className="h-5 w-5" />
                      <span>Configurações</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        
        <SidebarFooter className="border-t p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <button className={cn(
                  "flex w-full items-center space-x-3 rounded-md px-3 py-2",
                  "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}>
                  <LogOut color="#FF7300" className="h-5 w-5" />
                  <span>Sair</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    );
  };
  
  export default AppSidebar;