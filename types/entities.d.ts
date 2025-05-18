type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

interface ApiResponseError {
  code: Apicodes;
  message: string;
}

interface IpLocation {
  geoname_id: number;
  capital: string;
  languages: { code: string; name: string; native: string }[];
  country_flag: string;
  country_flag_emoji: string;
  country_flag_emoji_unicode: string;
  calling_code: string;
  is_eu: boolean;
}

interface PaginationMeta {
  total: number;
  currentPage: number;
  perPage: number;
  totalPages: number;
}

interface PaginationAPIResponseData<T> {
  data: T[];
  meta: PaginationMeta;
}

interface IpInfo {
  ip: string;
  type: 'ipv4' | 'ipv6';
  continent_code: string;
  continent_name: string;
  country_code: string;
  country_name: string;
  region_code: string;
  region_name: string;
  city: string;
  zip: string | null;
  latitude: number;
  longitude: number;
  msa: string | null;
  dma: string | null;
  radius: string | null;
  ip_routing_type: string;
  connection_type: string;
  location: IpLocation;
}

interface ActivityLog {
  id: string;
  orderId: string;
  companyUserId: string;
  supplierOrderId: string | null;
  companyUser: {
    id: string;
    name: string;
  };
  action: string;
  createdAt: string;
}

interface CompanyUser {
  id: string;
  name: string;
  userId: string;
  companyId: string;
  roleId: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  company: Company;
  role: Role;
}


interface Company {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  logo: string | null;
  country: string | null;
  currency: string;
  timezone: string | null;
  siret: string | null;
  tva: number | null;
  city: string | null;
  postalCode: string | null;
  language: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface Role {
  id: string;
  name: string;
  companyId: string;
  isOwner: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  permissions: Permission[];
}


interface Permission {
  roleId: string;
  permissionId: string;
  value: boolean;
  permission: {
    id: string;
    name: PermissionName;
  };
}

type PermissionName =
  | "view:overview"
  | "view:inventory"
  | "manage:order_suppliers"
  | "manage:orders"
  | "view:suppliers"
  | "view:products"
  | "manage:categories"
  | "manage:products"
  | "manage:analytics"
  | "manage:suppliers"
  | "view:orders"
  | "manage:overview"
  | "manage:warehouses"
  | "manage:inventory"
  | "view:order_suppliers"
  | "manage:analytics:sales"
  | "view:analytics:costs"
  | "view:order_customers"
  | "view:warehouses"
  | "manage:order_customers"
  | "view:automations"
  | "manage:automations"
  | "view:analytics"
  | "view:automations:reorder"
  | "manage:analytics:costs"
  | "manage:automations:workflows"
  | "manage:automations:reorder"
  | "manage:automations:reports"
  | "manage:automations:alerts"
  | "view:categories"
  | "view:automations:alerts"
  | "view:automations:reports"
  | "view:integrations"
  | "view:automations:workflows"
  | "view:integrations:ecommerce"
  | "view:integrations:accounting"
  | "manage:integrations"
  | "view:analytics:stock"
  | "manage:analytics:stock"
  | "manage:integrations:accounting"
  | "view:integrations:erp"
  | "manage:integrations:erp"
  | "view:analytics:customers"
  | "manage:analytics:customers"
  | "view:analytics:sales"
  | "manage:integrations:ecommerce"
  | "view:admin"
  | "view:users"
  | "manage:users"
  | "manage:roles"
  | "view:audit"
  | "manage:billing"
  | "manage:settings";


interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  acceptTerms: boolean;
  createdAt: Date;
  updatedAt: Date;
}


interface Overview {
  salesOverview: SalesOverview;
  inventorySummary: InventorySummary;
  purchaseOverview: PurchaseOverview;
  productSummary: ProductSummary;
}

interface InventorySummary {
  quantityInHand: number;
  toBeReceived: number;
}

interface ProductSummary {
  numberOfSuppliers: number;
  numberOfCategories: number;
}

interface PurchaseOverview {
  totalPurchases: number;
  cost: number;
  cancelled: number;
  returned: number;
}

interface SalesOverview {
  totalSales: number;
  revenue: number;
  profit: number;
  cost: number;
}

interface Product {
  id: string;
  companyId: string;
  company: Company;
  name: string;
  description?: string;
  sku: string;
  expiryDate?: Date;
  price: number;
  image?: string;
  unit?: string;
  categoryId: string;
  supplierId?: string;
  supplier?: Supplier | null;
  stock: Stock;
  createdAt: Date;
  updatedAt: Date;
  category: Category;
  stockMovements: StockMovement[];
}

type OrderStatus =
  'PENDING' |
  'CONFIRMED' |
  'CANCELLED' |
  'DELIVERED' |
  'RETURNED';

interface Category {
  id: string;
  name: string;
  color: string;
  _count: {
    products: number;
  };
}

interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  companyId: string;
  createdAt: string; // ISO string (Date)
  updatedAt: string; // ISO string (Date)
  deletedAt?: string | null; // si soft deleted
  products?: Product[];
  orders?: SupplierOrder[];
}

interface Warehouse {
  id: string;
  name: string;
  location: string | null;
  companyId: string;
  _count: {
    stocks: number;
  }
  lowStockIndicator: boolean;
  updatedAt: Date;
  createdAt: Date;
}

type MovementType = "IN" | "OUT" | "ADJUSTMENT";

interface StockMovement {
  id: string;
  type: MovementType;
  quantity: number;
  companyUserId: string;
  stockId: string;
  stock: Stock;
  companyUser: CompanyUser;
  createdAt: Date;
  notes: string | null;
}


interface Stock {
  id: string;
  productId: string;
  product: Product;
  quantity: Int;
  minimumStock: Int;
  location: string | null;
  alerts: boolean;
  movements: StockMovement[];
  warehouse: Warehouse;
  warehouseId: string;
  createdAt: Date;
  updatedAt: Date;
}

type OrderStatus =
  "PENDING" |
  "CONFIRMED" |
  "CANCELLED" |
  "DELIVERED" |
  "RETURNED";


interface SupplierOrder {
  id: string;
  companyId: string;
  supplierId: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  pdfUrl: string | null;
  orderNumber: string;
  products: SupplierOrderProduct[];
  supplier: Supplier;
  activities: ActivityLog[];
}

interface SupplierOrderProduct {
  id: string;
  orderId: string;
  productId: string;
  unitPrice: number | null;
  product: {
    id: string;
    name: string;
    sku: string;
    price: number;
  }
  quantity: number;
}
