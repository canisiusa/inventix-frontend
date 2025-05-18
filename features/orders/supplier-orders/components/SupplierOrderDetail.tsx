import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import OrderStatusBadge from '@/components/misc/order-status-badge';

interface SupplierOrderDetailProps {
  order: SupplierOrder | null;
  isLoading: boolean;
}


const ProductDetails = ({data}:{data:SupplierOrderProduct}) => {

  return (
    <>
      <span>{data.product?.name || 'Produit inconnu'}</span>
      <span className="font-medium text-right">{data.quantity}</span>
      <span className="font-medium text-right">{data.product?.price * data.quantity}</span>
    </>
  );
};

const SupplierOrderDetail: React.FC<SupplierOrderDetailProps> = ({ order, isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-64" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-48" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-48" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-48" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
          
          <Separator />
          
          <div>
            <Skeleton className="h-6 w-32 mb-4" />
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex justify-between py-2 border-b">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-5 w-10" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!order) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="text-center">
            <p className="text-muted-foreground">Commande introuvable</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Détails de la commande</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Fournisseur</p>
            <p className="text-lg font-semibold">{order.supplier.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Statut</p>
            <div className="mt-1">
              <OrderStatusBadge status={order.status} />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Date de création</p>
            <p className="text-base">
              {format(new Date(order.createdAt), 'dd MMMM yyyy à HH:mm', { locale: fr })}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Dernière mise à jour</p>
            <p className="text-base">
              {format(new Date(order.updatedAt), 'dd MMMM yyyy à HH:mm', { locale: fr })}
            </p>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-medium mb-4">Produits</h3>
          <div className="space-y-2">
            <div className="grid grid-cols-3 text-sm font-medium text-muted-foreground border-b pb-2">
              <span>Produit</span>
              <span className="text-right">Quantité</span>
              <span className="text-right">Total</span>
            </div>
            {order.products.map((product) => (
              <div key={product.id} className="grid grid-cols-3 py-2 border-b text-sm">
                <ProductDetails
                  data={product}
                />
              </div>
            ))}
            <div className="grid grid-cols-2 py-2 text-sm">
              <span className="font-medium">Total des produits</span>
              <span className="text-right font-medium">{order.products.length}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupplierOrderDetail;
