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
import { usePathname, useRouter } from "next/navigation"

export function NavMain() {
  const pathname = usePathname();
  const router = useRouter();
  const items: {
    title: string
    url: string
    icon?: React.ReactNode
    isActive?: boolean
    items?: {
      title: string
      url: string,
      isActive?: boolean
    }[]
  }[] = [
      {
        title: "Overview",
        url: "/overview",
        icon: <Image src="/overview.png" width={20} height={20} alt="" />,
        isActive: pathname === "/overview",
      },
      {
        title: "Inventory",
        url: "/inventory",
        icon: <Image src="/inventory.png" width={20} height={20} alt="" />,
        isActive: pathname.startsWith("/inventory"),
        items: [
          {
            title: "Products",
            url: "/inventory/products",
            isActive: pathname === "/inventory/products",
          },
          {
            title: "Warehouses",
            url: "/inventory/warehouses",
            isActive: pathname === "/inventory/warehouses",
          },
          {
            title: "Categories",
            url: "/inventory/categories",
            isActive: pathname === "/inventory/categories",
          },
        ],
      },
      {
        title: "Reporting",
        url: "/reporting",
        icon: <Image src="/reports.png" width={20} height={20} alt="" />,
        isActive: pathname.startsWith("/reporting"),
        items: [
          {
            title: "KPI",
            url: "/reporting/kpi",
            isActive: pathname === "/reporting/kpi",
          },
          {
            title: "Segmentation",
            url: "/reporting/segmentation",
            isActive: pathname === "/reporting/segmentation",
          },
        ],
      },
      {
        title: "Suppliers",
        url: "/suppliers",
        icon: <Image src="/suppliers.png" width={20} height={20} alt="" />,
        isActive: pathname === "/suppliers",
      },
      {
        title: "Orders",
        url: "/orders",
        icon: <Image src="/orders.png" width={20} height={20} alt="" />,
        isActive: pathname.startsWith("/orders"),
        items: [
          {
            title: "Suppliers",
            url: "/orders/suppliers",
            isActive: pathname === "/orders/suppliers",
          },
          {
            title: "Customers",
            url: "/orders/customers",
            isActive: pathname === "/orders/customers",
          }
        ],
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
  )
}
