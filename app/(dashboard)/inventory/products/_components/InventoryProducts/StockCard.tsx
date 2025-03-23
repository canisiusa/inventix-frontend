import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash, Plus, Minus } from 'lucide-react';
import AlertBadge from './AlertBadge';
import { cn } from '@/lib/utils';


 const categories: Category[] = [
  { id: 'c1', name: 'Viandes', color: '#EF4444' },
  { id: 'c2', name: 'Poissons', color: '#3B82F6' },
  { id: 'c3', name: 'Fruits', color: '#F59E0B' },
  { id: 'c4', name: 'Légumes', color: '#22C55E' },
  { id: 'c5', name: 'Produits laitiers', color: '#8B5CF6' },
  { id: 'c6', name: 'Épicerie', color: '#EC4899' },
  { id: 'c7', name: 'Boissons', color: '#06B6D4' },
]

interface StockCardProps {
  product: Product;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAddStock: (id: string) => void;
  onRemoveStock: (id: string) => void;
}

const StockCard = ({ product, onEdit, onDelete, onAddStock, onRemoveStock }: StockCardProps) => {
  const category = categories.find(cat => cat.id === product.category) as Category;
  
  // Determine stock status
  const getStockStatus = () => {
    if (product.expiryDate && new Date(product.expiryDate) <= new Date()) {
      return { type: 'expired' as const, text: 'Expiré' };
    }
    
    if (product.currentStock === 0) {
      return { type: 'critical' as const, text: 'Rupture' };
    }
    
    if (product.currentStock <= product.minimumStock * 0.5) {
      return { type: 'critical' as const, text: 'Critique' };
    }
    
    if (product.currentStock <= product.minimumStock) {
      return { type: 'low' as const, text: 'Bas' };
    }
    
    return { type: 'normal' as const, text: 'Normal' };
  };
  
  const stockStatus = getStockStatus();
  
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
              style={{ backgroundColor: category.color, color: 'white' }}
            >
              {category.name}
            </Badge>
            <CardTitle className="text-lg">{product.name}</CardTitle>
          </div>
          <AlertBadge type={stockStatus.type}>
            {stockStatus.text}
          </AlertBadge>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex flex-col">
            <span className="text-gray-500">Stock actuel:</span>
            <span className="font-medium">{product.currentStock} {product.unit}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500">Seuil minimum:</span>
            <span className="font-medium">{product.minimumStock} {product.unit}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500">Prix unitaire:</span>
            <span className="font-medium">{product.price.toFixed(2)} €</span>
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
            onClick={() => onRemoveStock(product.id)}
            disabled={product.currentStock <= 0}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onAddStock(product.id)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default StockCard;
