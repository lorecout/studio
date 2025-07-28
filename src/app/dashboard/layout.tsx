"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MoreVertical, LogOut, ArrowLeftRight, FileInput, Target, Bot } from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth"; // Changed

const Logo = () => (
    <Link href="/dashboard/transactions" className="flex items-center gap-2 font-semibold">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-primary"
        >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
        </svg>
        <span className="text-lg font-headline">CustoCerto</span>
    </Link>
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth(); // Changed

  if (loading) {
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
             <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith("/dashboard/transactions")}>
                <Link href="/dashboard/transactions">
                  <ArrowLeftRight />
                  <span>Transações</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith("/dashboard/goals")}>
                    <Link href="/dashboard/goals">
                        <Target/>
                        <span>Metas</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith("/dashboard/quick-add")}>
                <Link href="/dashboard/quick-add">
                  <FileInput />
                  <span>Importação Rápida</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith("/dashboard/analyst")}>
                    <Link href="/dashboard/analyst">
                        <Bot/>
                        <span>Análise IA</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-auto w-full justify-start gap-3 p-2 text-left">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={user?.photoURL || "https://placehold.co/36x36"} alt="User Avatar" />
                            <AvatarFallback>{user?.email?.[0].toUpperCase() || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col text-left">
                            <span className="text-sm font-medium truncate">{user?.displayName || user?.email || "Usuário"}</span>
                            <span className="text-xs text-sidebar-foreground/70 truncate">{user?.email || 'Não autenticado'}</span>
                        </div>
                        <MoreVertical className="ml-auto h-5 w-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mb-2 w-56" side="top" align="start">
                    <DropdownMenuItem onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="flex h-full flex-col bg-background">
            <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
