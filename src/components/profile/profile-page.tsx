"use client"

import { useState } from "react"
import { User, FileText, BookOpen } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import ProfileForm from "@/components/profile/profile-form"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar>
          <SidebarHeader className="border-b px-4 py-3">
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={activeTab === "profile"} onClick={() => setActiveTab("profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={activeTab === "templates"} onClick={() => setActiveTab("templates")}>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Templates</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={activeTab === "examples"} onClick={() => setActiveTab("examples")}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>Examples</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 p-6">
          <div className="flex items-center mb-6">
            <SidebarTrigger className="mr-4 md:hidden" />
            <h1 className="text-2xl font-bold">
              {activeTab === "profile" && "Profile"}
              {activeTab === "templates" && "Templates"}
              {activeTab === "examples" && "Examples"}
            </h1>
          </div>

          <div className="w-full">
            {activeTab === "profile" && <ProfileForm />}
            {activeTab === "templates" && <p className="text-muted-foreground">Templates section coming soon...</p>}
            {activeTab === "examples" && <p className="text-muted-foreground">Examples section coming soon...</p>}
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}
