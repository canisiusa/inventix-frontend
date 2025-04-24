import { useEffect, useState } from 'react';
import { getSuppliers, deleteSupplier } from '@/lib/api/supplierApi';
import { handleError } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';
import { toast } from '@/hooks/use-toast';
import { useLocalization } from '@/providers/localization-provider';

export function useSupplierData() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { t } = useLocalization()
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    loading: false,
  });

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoading(true);
      try {
        const resp = await getSuppliers({ search: debouncedSearch, page: 1, limit: 20 });

        setSuppliers(resp.data);
        setPagination({
          total: resp.meta.total,
          totalPages: resp.meta.totalPages,
          currentPage: 1,
          loading: false,
        });
      } catch (error) {
        handleError({ error, message: 'Erreur lors de la récupération des fournisseurs', dict: t });
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, [debouncedSearch]);

  const fetchNextPage = async (p?: number, l?: number) => {
    if (loading || pagination.loading || pagination.currentPage >= pagination.totalPages) return;
    setPagination((p) => ({ ...p, loading: true }));
    try {
      const { totalPages, currentPage } = pagination;
      if (!p && totalPages === currentPage && currentPage !== 0) return;

      const resp = await getSuppliers({
        search: debouncedSearch,
        limit: l ?? 100,
        page: p ? p : currentPage + 1,
      });

      setSuppliers((prev) => [...prev, ...resp.data]);
      setPagination((prev) => ({
        ...prev,
        ...resp.meta,
        loading: false,
      }));
    } catch (error) {
      handleError({ error, message: 'Erreur lors du chargement supplémentaire', dict: t });
    } finally {
      setPagination((prev) => ({ ...prev, loading: false }));
    }
  };

  const toggleSelection = (id: string, selected: boolean) => {
    setSelectedIds((prev) => selected ? [...prev, id] : prev.filter((s) => s !== id));
  };

  const deleteSelecteds = async () => {
    try {
      for (const id of selectedIds) {
        const resp = await deleteSupplier(id);
        if (resp.status === 'failure') throw resp.data;
      }
      setSuppliers((prev) => prev.filter((s) => !selectedIds.includes(s.id)));
      setSelectedIds([]);
    } catch (error) {
      handleError({ error, message: 'Erreur lors de la suppression groupée', dict: t });
    }
  };


  const deleteWithId = async (id: string) => {
    try {
      setLoading(true);
      const data = await deleteSupplier(id);
      if (data.status === "failure") throw data.data;
      setSuppliers((old) => old.filter((supplier) => supplier.id !== id));
      setPagination((old) => ({ ...old, total: old.total - 1 }))
      toast({
        title: "Fournisseur supprimé",
        description: `${data.data.name} a été supprimé avec succès`,
      });
      fetchNextPage(1);
    } catch (error) {
      handleError({ error, message: 'Erreur lors de la suppression du fournisseur', dict: t })
    } finally {
      setLoading(false);
    }
  };

  return {
    suppliers,
    loading,
    search,
    setSearch,
    selectedIds,
    toggleSelection,
    deleteSelecteds,
    fetchNextPage,
    pagination,
    deleteWithId
  };
}
