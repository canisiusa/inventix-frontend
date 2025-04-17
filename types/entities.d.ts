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


interface PaginationAPIResponseData<T> {
  data: T[];
  meta: {
    total: number;
    currentPage: number;
    perPage: number;
    totalPages: number;
  };
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
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  minimumStock: number;
  price: number;
  expiryDate?: string;
  supplierId: string;
  stock: number; // Added for Reports page
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
