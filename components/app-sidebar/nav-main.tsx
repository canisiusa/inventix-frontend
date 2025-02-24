"use client"

import { ChevronRight, } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import Image from "next/image"

export function NavMain() {
  const  items:{
    title: string
    url: string
    icon?: React.ReactNode
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[] = [
    {
      title: "Overview",
      url: "/overview",
      icon: <Image src="/overview.png" width={20} height={20} alt="" />,
      isActive: true,
    },
    {
      title: "Inventory",
      url: "#",
      icon: <Image src="/inventory.png" width={20} height={20} alt="" />,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Reports",
      url: "#",
      icon: <Image src="/reports.png" width={20} height={20} alt="" />,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Suppliers",
      url: "#",
      icon: <Image src="/suppliers.png" width={20} height={20} alt="" />,
    },
    {
      title: "Orders",
      url: "#",
      icon: <Image src="/orders.png" width={20} height={20} alt="" />,
    },
  ]
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {
                    item.items ?
                      <>
                        {item.icon && item.icon}
                        <span>{item.title}</span>
                        {
                          item.items ?
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" /> : null
                        }
                      </> :
                      <>
                        {item.icon && item.icon}
                        <Link href={item.url}>
                          <span>{item.title}</span>
                        </Link>
                      </>
                  }
                </SidebarMenuButton>
              </CollapsibleTrigger>
              {item.items ? <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <Link href={subItem.url}>
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent> : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
