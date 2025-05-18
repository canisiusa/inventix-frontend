"use client";
import React from 'react';
import { UpdateSupplierOrderParams } from '@/lib/api/supplierOrdersApi';
import { useSupplierOrder, useUpdateSupplierOrder } from './hooks/useSupplierOrders';
import SupplierOrderForm from './components/SupplierOrderForm';
import { Skeleton } from '@/components/ui/skeleton';
import { useParams, useRouter } from 'next/navigation';

const EditSupplierOrderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  
  const { order, isLoading } = useSupplierOrder(id || '');
  const { updateOrder, isSubmitting } = useUpdateSupplierOrder();
  
  const handleSubmit = (data: UpdateSupplierOrderParams) => {
    if (!id) return;
    
    updateOrder(id, data, {
      onSuccess: () => {
        router.push(`/orders/supplier-orders/${id}`);
      }
    });
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Skeleton className="h-10 w-72" />
        <div className="space-y-6">
          <Skeleton className="h-[500px] w-full" />
        </div>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold">Commande introuvable</h2>
          <p className="mt-2 text-muted-foreground">
            La commande que vous essayez de modifier n&apos;existe pas.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">
        Modifier la Commande Fournisseur
      </h1>
      <SupplierOrderForm
        isEditing={true}
        initialData={order}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default EditSupplierOrderPage;
