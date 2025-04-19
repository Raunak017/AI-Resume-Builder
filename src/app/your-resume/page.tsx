"use client";

import ResumeForm from "@/components/resume-form";
import {
  createClientComponentClient,
  User,
} from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from "react";
import {
  User as UserIcon,
  FileText,
  BookOpen,
  LogOut,
  FileSearch,
} from "lucide-react";
import { redirect, usePathname, useRouter } from "next/navigation";
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

export default function YourResumePage() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClientComponentClient();
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (user) setUser(user);
      else {
        redirect("/login");
      }
    };

    getUser();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

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
                  isActive={isActive("/templates")}
                  onClick={() => router.push("/templates")}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Templates</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isActive("/examples")}
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
              GenResume
            </h1>
          </div>

          <div className="w-full flex justify-center">
            <ResumeForm user={user}/>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}