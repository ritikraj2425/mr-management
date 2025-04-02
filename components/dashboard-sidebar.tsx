"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { GitMerge, Home, Users, Settings, PlusCircle, Building } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useContext } from "react"
import { AuthContext } from "@/hooks/use-context"

export default function DashboardSidebar() {
  const pathname = usePathname()
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("ThemeContext is not provided. Wrap your component inside <ThemeProvider>.");
  }
  const { isAuthenticated,userData,groupData,organizationData } = authContext;
  

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="flex h-16 justify-center items-center bg-white z-50 border-b px-4">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <GitMerge className="h-6 w-6 text-primary" />
            <span className="text-xl ">{organizationData?.orgName}</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/dashboard"}>
                <Link href="/dashboard">
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname?.startsWith("/dashboard/merge-requests")}>
                <Link href="/dashboard/merge-requests">
                  <GitMerge className="h-4 w-4" />
                  <span>MRs for Me to Merge</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname?.startsWith("/dashboard/my-merge-requests")}>
                <Link href="/dashboard/my-merge-requests">
                  <GitMerge className="h-4 w-4" />
                  <span>My Submitted MRs</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname?.startsWith("/dashboard/groups")}>
                <Link href="/dashboard/groups">
                  <Users className="h-4 w-4" />
                  <span>My Groups</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname?.startsWith("/dashboard/organization")}>
                <Link href="/dashboard/organization">
                  <Building className="h-4 w-4" />
                  <span>Organization</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/dashboard/merge-requests/new"}>
                <Link href="/dashboard/merge-requests/new">
                  <PlusCircle className="h-4 w-4" />
                  <span>Create MR/PR</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname?.startsWith("/dashboard/settings")}>
                <Link href="/dashboard/settings">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  )
}

