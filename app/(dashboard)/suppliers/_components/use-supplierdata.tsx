// ✅ useSupplierData.ts
import { useEffect, useState } from 'react';
import { getSuppliers, deleteSupplier } from '@/lib/api/supplierApi';
import { handleError } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';

export function useSupplierData(t: Translations) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    page: 1,
    loading: false,
  });

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoading(true);
      try {
        const resp = await getSuppliers({ search: debouncedSearch, page: 1, limit: 20 });
        if (resp.status === 'failure') throw resp.data;

        setSuppliers(resp.data.data);
        setPagination({
          total: resp.data.meta.total,
          totalPages: resp.data.meta.totalPages,
          page: 1,
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

  const fetchNextPage = async () => {
    if (loading || pagination.loading || pagination.page >= pagination.totalPages) return;
    setPagination((p) => ({ ...p, loading: true }));
    try {
      const nextPage = pagination.page + 1;
      const resp = await getSuppliers({ search: debouncedSearch, page: nextPage, limit: 20 });
      if (resp.status === 'failure') throw resp.data;

      setSuppliers((prev) => [...prev, ...resp.data.data]);
      setPagination((prev) => ({
        ...prev,
        ...resp.data.meta,
        page: nextPage,
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

  const deleteSelected = async () => {
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

  return {
    suppliers,
    loading,
    search,
    setSearch,
    selectedIds,
    toggleSelection,
    deleteSelected,
    fetchNextPage,
    pagination,
  };
}
