import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { 
  GetSupplierOrderParams, 
  CreateSupplierOrderParams, 
  UpdateSupplierOrderParams,
  getSupplierOrders,
  getSupplierOrder,
  createSupplierOrder,
  updateSupplierOrder,
  deleteSupplierOrder
} from '@/lib/api/supplierOrdersApi';


// Hook pour récupérer la liste des commandes fournisseurs
export const useSupplierOrders = (initialParams: GetSupplierOrderParams = {}) => {
  const [orders, setOrders] = useState<SupplierOrder[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    currentPage: 1,
    perPage: 20,
    total: 0,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [params, setParams] = useState<GetSupplierOrderParams>(initialParams);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getSupplierOrders(params);
      setOrders(response.data);
      setMeta(response.meta);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
      toast.error(`Erreur lors du chargement des commandes: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateParams = (newParams: GetSupplierOrderParams) => {
    setParams(prev => ({ ...prev, ...newParams }));
  };

  return { 
    orders, 
    meta, 
    isLoading, 
    error, 
    params,
    updateParams,
    refetch: fetchOrders
  };
};

// Hook pour récupérer une commande spécifique
export const useSupplierOrder = (id: string) => {
  const [order, setOrder] = useState<SupplierOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!id) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const data = await getSupplierOrder(id);
      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
      toast.error(`Erreur lors du chargement de la commande: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  return { order, isLoading, error, refetch: fetchOrder };
};

// Hook pour créer une commande
export const useCreateSupplierOrder = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [createdOrder, setCreatedOrder] = useState<SupplierOrder | null>(null);
  
  const createOrder = async (data: CreateSupplierOrderParams, 
    callbacks?: { onSuccess?: (order: SupplierOrder) => void, onError?: (error: Error) => void }) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const newOrder = await createSupplierOrder(data);
      setCreatedOrder(newOrder);
      toast.success('Commande fournisseur créée avec succès');
      
      if (callbacks?.onSuccess) {
        callbacks.onSuccess(newOrder);
      }
      
      return newOrder;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Une erreur est survenue');
      setError(error);
      toast.error(`Erreur lors de la création: ${error.message}`);
      
      if (callbacks?.onError) {
        callbacks.onError(error);
      }
      
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return { createOrder, isSubmitting, error, createdOrder };
};

// Hook pour mettre à jour une commande
export const useUpdateSupplierOrder = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [updatedOrder, setUpdatedOrder] = useState<SupplierOrder | null>(null);
  
  const updateOrder = async (
    id: string, 
    data: UpdateSupplierOrderParams, 
    callbacks?: { onSuccess?: (order: SupplierOrder) => void, onError?: (error: Error) => void }
  ) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const updated = await updateSupplierOrder(id, data);
      setUpdatedOrder(updated);
      toast.success('Commande fournisseur mise à jour avec succès');
      
      if (callbacks?.onSuccess) {
        callbacks.onSuccess(updated);
      }
      
      return updated;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Une erreur est survenue');
      setError(error);
      toast.error(`Erreur lors de la mise à jour: ${error.message}`);
      
      if (callbacks?.onError) {
        callbacks.onError(error);
      }
      
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return { updateOrder, isSubmitting, error, updatedOrder };
};

// Hook pour supprimer une commande
export const useDeleteSupplierOrder = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const deleteOrder = async (
    id: string, 
    callbacks?: { onSuccess?: () => void, onError?: (error: Error) => void }
  ) => {
    setIsDeleting(true);
    setError(null);
    
    try {
      await deleteSupplierOrder(id);
      toast.success('Commande fournisseur supprimée avec succès');
      
      if (callbacks?.onSuccess) {
        callbacks.onSuccess();
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Une erreur est survenue');
      setError(error);
      toast.error(`Erreur lors de la suppression: ${error.message}`);
      
      if (callbacks?.onError) {
        callbacks.onError(error);
      }
      
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };
  
  return { deleteOrder, isDeleting, error };
};
