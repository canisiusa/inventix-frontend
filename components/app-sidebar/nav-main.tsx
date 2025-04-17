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
import { usePathname, useRouter } from "next/navigation"
import { getSidebarItems } from "./sidebar.config"

export function NavMain() {
  const pathname = usePathname();
  const router = useRouter();

  const items = getSidebarItems(
    ["view:*"], // ou une liste partielle comme ["view:overview", "view:products"]
    pathname
  )

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item, key) => (
            <Collapsible
              key={key}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title} isActive={item.isActive}>
                    {item.icon && item.icon}
                    {
                      item.items ?
                        <>
                          <span
                            onClick={() => {
                              router.push(item.url)
                            }}
                          >
                            {item.title}
                          </span>
                        </> :
                        <>
                          <Link href={item.url}>
                            <span>{item.title}</span>
                          </Link>
                        </>
                    }
                    {
                      item.items ?
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" /> : null
                    }
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                {item.items ? <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <Link
                            href={subItem.url}
                            className={subItem.isActive ? "!text-primary-500 hover:!text-primary-500 font-medium pointer-events-none hover:bg-transparent cursor-default" : ""}
                          >
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

    </>
  )
}
