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
  useSidebar,
} from "@/components/ui/sidebar"
import { NavAdmin } from "./nav-admin"
import { NavMain } from "./nav-main"
import { Logo } from "../icons"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar()
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {
          state === 'expanded' ?
            <Logo /> :
            null
        }
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavAdmin />
      </SidebarContent>
      <SidebarFooter className="flex items-end">
        <SidebarTrigger className=" text-white" />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
