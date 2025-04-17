import Image from "next/image"

export type SidebarItem = {
  title: string
  url: string
  icon?: React.ReactNode
  permission: string,
  isActive?: boolean
  items?: {
    title: string
    url: string
    permission: string,
    isActive?: boolean
  }[]
}

export const sidebarItems: SidebarItem[] = [
  {
    title: "Overview",
    url: "/overview",
    icon: <Image src="/overview.png" width={20} height={20} alt="" />,
    permission: "view:overview",
  },
  {
    title: "Inventory",
    url: "/inventory",
    icon: <Image src="/inventory.png" width={20} height={20} alt="" />,
    permission: "view:inventory",
    items: [
      { title: "Products", url: "/inventory/products", permission: "view:products" },
      { title: "Warehouses", url: "/inventory/warehouses", permission: "view:warehouses" },
      { title: "Categories", url: "/inventory/categories", permission: "view:categories" },
    ],
  },
  {
    title: "Reporting",
    url: "/reporting",
    icon: <Image src="/reports.png" width={20} height={20} alt="" />,
    permission: "view:reporting",
    items: [
      { title: "KPI", url: "/reporting/kpi", permission: "view:kpi" },
      { title: "Segmentation", url: "/reporting/segmentation", permission: "view:segmentation" },
    ],
  },
  {
    title: "Suppliers",
    url: "/suppliers",
    icon: <Image src="/suppliers.png" width={20} height={20} alt="" />,
    permission: "view:suppliers",
  },
  {
    title: "Orders",
    url: "/orders",
    icon: <Image src="/orders.png" width={20} height={20} alt="" />,
    permission: "view:orders",
    items: [
      { title: "Suppliers", url: "/orders/suppliers", permission: "view:order_suppliers" },
      { title: "Customers", url: "/orders/customers", permission: "view:order_customers" },
    ],
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: <Image src="/analytics.png" width={20} height={20} alt="" />,
    permission: "view:analytics",
    items: [
      { title: "Stock Insights", url: "/analytics/stock", permission: "view:analytics:stock" },
      { title: "Sales Insights", url: "/analytics/sales", permission: "view:analytics:sales" },
      { title: "Customer Insights", url: "/analytics/customers", permission: "view:analytics:customers" },
      { title: "Cost & Margins", url: "/analytics/costs", permission: "view:analytics:costs" },
    ],
  },
  {
    title: "Automations",
    url: "/automations",
    icon: <Image src="/automations.png" width={20} height={20} alt="" />,
    permission: "view:automations",
    items: [
      { title: "Reorder Rules", url: "/automations/reorder", permission: "view:automations:reorder" },
      { title: "Workflows", url: "/automations/workflows", permission: "view:automations:workflows" },
      { title: "Alerts & Thresholds", url: "/automations/alerts", permission: "view:automations:alerts" },
      { title: "Scheduled Reports", url: "/automations/reports", permission: "view:automations:reports" },
    ],
  },
  {
    title: "Integrations",
    url: "/integrations",
    icon: <Image src="/integrations.png" width={20} height={20} alt="" />,
    permission: "view:integrations",
    items: [
      { title: "ERP / CRM", url: "/integrations/erp-crm", permission: "view:integrations:erp" },
      { title: "E-commerce", url: "/integrations/ecommerce", permission: "view:integrations:ecommerce" },
      { title: "Accounting", url: "/integrations/accounting", permission: "view:integrations:accounting" },
    ],
  },
]


export function getSidebarItems(permissions: string[], pathname: string): SidebarItem[] {
  const hasAllAccess = permissions.includes("view:*")

  const hasPermission = (key: string) =>
    hasAllAccess || permissions.includes(key)

  return sidebarItems
    .filter((item) => hasPermission(item.permission))
    .map((item) => {
      const visibleSubItems = item.items
        ?.filter((sub) => hasPermission(sub.permission))
        .map((sub) => ({
          ...sub,
          isActive: pathname === sub.url,
        }))

      const isActive =
        pathname === item.url ||
        (visibleSubItems && visibleSubItems.some((sub) => sub.isActive))

      return {
        ...item,
        isActive,
        items: visibleSubItems,
      }
    })
}

