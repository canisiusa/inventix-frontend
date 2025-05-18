"use client"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"

export function NavAdmin() {

  type Item = {
    title: string
    url: string
    permission: string,
    isActive?: boolean
    items?: {
      title: string,
      icon?: React.ReactNode
      url: string,
      permission: string,
      isActive?: boolean
    }[]
  }
  const items: Item[] = [
    {
      title: "Administration",
      url: "/admin",
      permission: "view:admin",
      items: [
        { title: "Users", url: "/admin/users", permission: "manage:users", icon: <Image src="/users.png" width={20} height={20} alt="" /> },
        { title: "Roles & Permissions", url: "/admin/users", permission: "manage:roles", icon: <Image src="/authorization.png" width={20} height={20} alt="" /> },
        { title: "Audit Log", url: "/admin/audit", permission: "view:audit", icon: <Image src="/logs.png" width={20} height={20} alt="" /> },
        { title: "Billing", url: "/admin/billing", permission: "manage:billing", icon: <Image src="/billing.png" width={20} height={20} alt="" /> },],
    },
  ]

  return items.map((item, key) => (
    <SidebarGroup key={key} className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
      <SidebarMenu>
        {
          item.items && item.items.map((subItem) => (
            <SidebarMenuItem key={subItem.title}>
              <SidebarMenuButton asChild>
                <a href={subItem.url}>
                  {subItem.icon}
                  <span>{subItem.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))
        }
      </SidebarMenu>
    </SidebarGroup>
  ))
}
