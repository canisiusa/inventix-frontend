import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash, Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCategoryStore } from '@/store/category.store';
import { getStockStatus } from '@/utils/get-stockstatus';
import { StockStatusBadge } from '@/components/misc/stock-status-badge';
import Link from 'next/link';
import { useUserStore } from '@/store/user.store';


/*  const categories: Category[] = [
  { id: 'c1', name: 'Viandes', color: '#EF4444' },
  { id: 'c2', name: 'Poissons', color: '#3B82F6' },
  { id: 'c3', name: 'Fruits', color: '#F59E0B' },
  { id: 'c4', name: 'Légumes', color: '#22C55E' },
  { id: 'c5', name: 'Produits laitiers', color: '#8B5CF6' },
  { id: 'c6', name: 'Épicerie', color: '#EC4899' },
  { id: 'c7', name: 'Boissons', color: '#06B6D4' },
] */

interface StockCardProps {
  product: Product;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAddStock: (stock: Stock) => void;
  onRemoveStock: (stock: Stock) => void;
}

const StockCard = ({ product, onEdit, onDelete, onAddStock, onRemoveStock }: StockCardProps) => {

  const categories = useCategoryStore(state => state.categories);

  const category = categories.find(cat => cat.id === product.category.id) as Category;

    const currentUser = useUserStore((state) => state.currentUser);
  

  // Determine stock status


  const stockStatus = getStockStatus(product.stock?.quantity || 0, product.stock?.minimumStock || 0, product.expiryDate);

  // Format expiry date if present
  const formatExpiryDate = () => {
    if (!product.expiryDate) return null;

    const expiryDate = new Date(product.expiryDate);
    const isExpired = expiryDate <= new Date();

    return {
      formatted: new Intl.DateTimeFormat('fr-FR').format(expiryDate),
      isExpired
    };
  };

  const expiryInfo = product.expiryDate ? formatExpiryDate() : null;

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <Badge
              className="mb-2"
              style={{ backgroundColor: category?.color, color: 'white' }}
            >
              {category?.name}
            </Badge>
            <CardTitle className="text-lg">{product.name}</CardTitle>
          </div>
          <Link href={`/inventory/warehouses/${product.stock.warehouseId}`}>
            <StockStatusBadge
              status={stockStatus}
              className="px-2 py-1 text-xs font-medium rounded-md hover:underline transition-all duration-200 ease-in-out cursor-pointer"
            />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex flex-col">
            <span className="text-gray-500">Stock actuel:</span>
            <span className="font-medium">{product.stock?.quantity} {product.unit}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500">Seuil minimum:</span>
            <span className="font-medium">{product.stock?.minimumStock} {product.unit}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500">Prix unitaire:</span>
            <span className="font-medium">{product.price} {currentUser?.company.currency}</span>
          </div>
          {expiryInfo && (
            <div className="flex flex-col">
              <span className="text-gray-500">Expiration:</span>
              <span className={cn(
                "font-medium",
                expiryInfo.isExpired ? "text-red-600" : ""
              )}>
                {expiryInfo.formatted}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between gap-2">
        <div className="flex space-x-1">
          <Button variant="outline" size="sm" onClick={() => onEdit(product.id)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDelete(product.id)}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onRemoveStock({ ...product.stock, product: { ...product, stock: {} } } as Stock);
            }}
            disabled={product.stock?.quantity <= 0}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => {
            onAddStock({ ...product.stock, product: { ...product, stock: {} } } as Stock);
          }}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default StockCard;
