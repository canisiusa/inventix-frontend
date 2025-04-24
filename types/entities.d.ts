type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

interface ApiResponseError {
  code: string;
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


interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  acceptTerms: boolean;
  createdAt: Date;
  updatedAt: Date;
  companiesUser: {
    id: string;
    userId: string;
    companyId: string;
    roleId: string;
    createdAt: Date;
    updatedAt: Date;
    company: {
      id: string;
      name: string;
      description: null;
      createdAt: Date;
      updatedAt: Date;
    };
    role: {
      id: string;
      name: string;
      permissions: string[];
      companyId: string;
      isOwner: boolean;
      isDefault: boolean;
      createdAt: Date;
      updatedAt: Date;
    };
  }[];
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


interface Company {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
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
  userId: string;
  stockId: string;
  stock: Stock;
  user: User;
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