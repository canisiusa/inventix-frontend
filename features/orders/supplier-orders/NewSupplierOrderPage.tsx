"use client";
import React from 'react';
import { CreateSupplierOrderParams } from '@/lib/api/supplierOrdersApi';
import { useCreateSupplierOrder } from './hooks/useSupplierOrders';
import SupplierOrderForm from './components/SupplierOrderForm';
import { useRouter } from 'next/navigation';

const NewSupplierOrderPage: React.FC = () => {
  const router = useRouter();
  const { createOrder, isSubmitting } = useCreateSupplierOrder();
  
  const handleSubmit = (data: CreateSupplierOrderParams) => {
    createOrder(data, {
      onSuccess: (newOrder) => {
        router.push(`/orders/supplier-orders/${newOrder.id}`);
      }
    });
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Nouvelle Commande Fournisseur</h1>
      <SupplierOrderForm
        isEditing={false}
        isSubmitting={isSubmitting}
        onSubmit={(data) => handleSubmit(data as CreateSupplierOrderParams)}
      />
    </div>
  );
};

export default NewSupplierOrderPage;
