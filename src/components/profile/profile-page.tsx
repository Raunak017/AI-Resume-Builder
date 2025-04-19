"use client";

import { useState, useEffect } from "react";
import { User as UserIcon, FileText, BookOpen, LogOut, FileSearch } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ProfileForm from "@/components/profile/profile-form";
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";

export default function ProfilePage({ user }: { user: User | null }) {
  const router = useRouter();
  const pathname = usePathname();

  const supabase = createClientComponentClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    redirect("/login");
  };

  const isActive = (path: string) => pathname === path;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background w-full">
        <Sidebar>
          <SidebarHeader className="border-b px-4 py-3">
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isActive("/dashboard")}
                  onClick={() => router.push("/dashboard")}
                >
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isActive("/your-resume")}
                  onClick={() => router.push("/your-resume")}
                >
                  <FileSearch className="mr-2 h-4 w-4" />
                  <span>GenResume</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname === "/templates"}
                  onClick={() => router.push("/templates")}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Templates</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname === "/examples"}
                  onClick={() => router.push("/examples")}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>Examples</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log Out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 p-6 w-full">
          <div className="flex items-center mb-6 w-full">
            <SidebarTrigger className="mr-4 md:hidden" />
            <h1 className="text-2xl font-bold capitalize">
              {pathname === "/dashboard" && "Profile"}
              {pathname === "/your-resume" && "GenResume"}
              {pathname === "/templates" && "Templates"}
              {pathname === "/examples" && "Examples"}
            </h1>
          </div>

          <div className="w-full flex justify-center">
            {pathname === "/dashboard" && <ProfileForm user={user} />}
            {pathname === "/your-resume" && (
              <p className="text-muted-foreground">GenResume UI goes here...</p>
            )}
            {pathname === "/templates" && (
              <p className="text-muted-foreground">Templates section coming soon...</p>
            )}
            {pathname === "/examples" && (
              <p className="text-muted-foreground">Examples section coming soon...</p>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
