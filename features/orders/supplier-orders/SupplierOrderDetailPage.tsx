"use client";
import React, { useState } from 'react';
import { Edit, Trash, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  useSupplierOrder,
  useDeleteSupplierOrder
} from './hooks/useSupplierOrders';
import SupplierOrderDetail from './components/SupplierOrderDetail';
import ActivityLogList from './components/ActivityLogList';
import DeleteOrderDialog from './components/DeleteOrderDialog';
import { useParams, useRouter } from 'next/navigation';

const SupplierOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const orderId = id || '';
  const { order, isLoading: isLoadingOrder } = useSupplierOrder(orderId);
  const { deleteOrder, isDeleting } = useDeleteSupplierOrder();

  const handleEditClick = () => {
    router.push(`/orders/supplier-orders/${orderId}/edit`);
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    deleteOrder(orderId, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        router.push('/orders/supplier-orders');
      }
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push('/orders/supplier-orders')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            {isLoadingOrder ? 'Chargement...' : `Commande: ${order?.supplier.name || 'Détails'}`}
          </h1>
        </div>

        <div className="flex space-x-2">
          {order?.status === "DELIVERED" ? null : <Button
            variant="outline"
            onClick={handleEditClick}
            disabled={isLoadingOrder}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Modifier
          </Button>}
          {order?.status === "DELIVERED" ? null :
            <Button
              variant="destructive"
              onClick={handleDeleteClick}
              disabled={isLoadingOrder}
              className="flex items-center gap-2"
            >
              <Trash className="h-4 w-4" />
              Supprimer
            </Button>
          }
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <SupplierOrderDetail
          order={order}
          isLoading={isLoadingOrder}
        />

        <ActivityLogList
          logs={order?.activities || []}
          isLoading={false}
        />
      </div>

      <DeleteOrderDialog
        order={order || null}
        isOpen={showDeleteDialog}
        isDeleting={isDeleting}
        onCancel={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default SupplierOrderDetailPage;
