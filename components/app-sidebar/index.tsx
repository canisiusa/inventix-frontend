/* eslint-disable @next/next/no-img-element */
"use client"

import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { NavProjects } from "./nav-projects"
import { NavMain } from "./nav-main"
import { Logo } from "../icons"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Logo  />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavProjects />
      </SidebarContent>
      <SidebarFooter className="flex items-end">
        <SidebarTrigger className=" text-white" />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
