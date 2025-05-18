"use client";
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GetSupplierOrderParams } from '@/lib/api/supplierOrdersApi';
import { useSupplierOrders, useDeleteSupplierOrder } from './hooks/useSupplierOrders';
import SupplierOrderFilters from './components/SupplierOrderFilters';
import SupplierOrdersTable from './components/SupplierOrdersTable';
import DeleteOrderDialog from './components/DeleteOrderDialog';
import { useRouter } from 'next/navigation';

const SupplierOrdersPage: React.FC = () => {
  const [filters] = useState<GetSupplierOrderParams>({
    page: 1,
    limit: 50,
  });
  const [orderToDelete, setOrderToDelete] = useState<SupplierOrder | null>(null);
  
  // Fetch supplier orders with current filters
  const { 
    orders,
    meta,
    isLoading: isLoadingOrders,
    updateParams
  } = useSupplierOrders(filters);

  const router = useRouter();
  
  // Delete mutation
  const { deleteOrder, isDeleting } = useDeleteSupplierOrder();
  
  const handlePageChange = (page: number) => {
    updateParams({ page });
  };
  
  const handleFilterChange = (newFilters: GetSupplierOrderParams) => {
    updateParams({
      ...newFilters,
      page: 1, // Reset to first page when filters change
    });
  };
  
  const handleDeleteClick = (order: SupplierOrder) => {
    setOrderToDelete(order);
  };
  
  const handleConfirmDelete = () => {
    if (orderToDelete) {
      deleteOrder(orderToDelete.id, {
        onSuccess: () => {
          setOrderToDelete(null);
        }
      });
    }
  };
  
  const handleCancelDelete = () => {
    setOrderToDelete(null);
  };
    
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Commandes Fournisseurs</h1>
        <Button onClick={() => router.push('/orders/supplier-orders/new')} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle commande
        </Button>
      </div>
      
      <Card className="shadow-sm">
        <SupplierOrderFilters 
          initialFilters={filters} 
          onApplyFilters={handleFilterChange} 
        />
      </Card>
      
      <SupplierOrdersTable
        orders={orders}
        isLoading={isLoadingOrders}
        meta={meta}
        onPageChange={handlePageChange}
        onLimitChange={(limit) => updateParams({ limit, page: 1 })}
        onDelete={handleDeleteClick}
      />
      
      <DeleteOrderDialog
        order={orderToDelete}
        isOpen={!!orderToDelete}
        isDeleting={isDeleting}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default SupplierOrdersPage;
