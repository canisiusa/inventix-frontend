"use client"
import { useEffect, useState } from "react";
import { EmptyState } from "./components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { WarehouseFilters } from "./components/warehouse/warehouse-filters";
import { WarehousesTable } from "./components/warehouse/warehouses-table";
import { PaginationControls } from "../../../components/misc/pagination-controls";
import { QueryWarehousesDto } from "@/lib/schemas/warehouse.schemas";
import { useRouter } from "next/navigation";
import { showWarehouseForm, WarehouseFormProps } from "./components/warehouse/warehouse-form";
import { deleteWarehouse, getWarehouses } from "@/lib/api/warehouseApi";
import { handleError } from "@/lib/utils";
import { useLocalization } from "@/providers/localization-provider";
import { toast } from "@/hooks/use-toast";

const WarehousesPage = () => {
  const router = useRouter();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setloading] = useState(true)
  const { t } = useLocalization();

  // Pagination
  const [paginationMeta, setPaginationMeta] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    perPage: 10,
  });

  const handlePageChange = (page: number) => {
    setPaginationMeta((prev) => ({ ...prev, currentPage: page }));
  };

  const handleLimitChange = (limit: number) => {
    setPaginationMeta((prev) => ({ ...prev, perPage: limit, currentPage: 1 }));
  };

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        setloading(true);
        // Simulons un appel API pour récupérer les entrepôts
        const response = await getWarehouses({limit: paginationMeta.perPage, page: 1});
        if (response.status === "failure") {
          throw response.data.data;
        }
        setWarehouses(response.data.data);
        setPaginationMeta(response.data.meta);
      } catch (error) {
        handleError({ error, message: "Impossible de charger les entrepôts.", dict: t })
      } finally {
        setloading(false);
      }
    };

    fetchWarehouses();
  }, [])


  const handleFilterChange = (filters: QueryWarehousesDto) => {
    console.log("Filters applied:", filters);
    // Dans une vraie application, cela déclencherait un appel API avec les filtres
    // Simulons une recherche simple ici
    if (filters.search) {
      const filtered = warehouses.filter(w =>
        w.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
        (w.location && w.location.toLowerCase().includes(filters.search!.toLowerCase()))
      );
      setWarehouses(filtered);
      setPaginationMeta(prev => ({ ...prev, totalItems: filtered.length }));
    } else {
      setWarehouses(warehouses);
      setPaginationMeta(prev => ({ ...prev, totalItems: warehouses.length }));
    }
  };

  const handleCreateWarehouse = async () => {
    try {
      const resp = await showWarehouseForm({
        isOpen: true,
      } as WarehouseFormProps)
      if (resp) {
        setWarehouses((prev) => [resp, ...prev]);
      }
    } catch {
    }

  };

  const handleViewWarehouse = (warehouse: Warehouse) => {
    router.push(`/inventory/warehouses/${warehouse.id}`);
  };

  const handleEditWarehouse = async (warehouse: Warehouse) => {
    try {

      const resp = await showWarehouseForm({
        isOpen: true,
        warehouse,
      } as WarehouseFormProps);
      if (resp) {
        setWarehouses((prev) =>
          prev.map((w) => (w.id === resp.id ? resp : w))
        );
      }
    } catch {

    }
  };

  const handleDeleteWarehouse = async (warehouse: Warehouse) => {
    try {
      const resp = await deleteWarehouse(warehouse.id);
      if (resp.status === "failure") throw resp.data;
      const updatedWarehouses = warehouses.filter(w => w.id !== warehouse.id);
      setWarehouses(updatedWarehouses);
      toast({
        title: "Entrepôt supprimé",
        description: `L'entrepôt "${warehouse.name}" a été supprimé avec succès.`,
      });
    } catch (error) {
      handleError({ error, message: "Impossible de charger les entrepôts.", dict: t })
    }
  };

  const handleAccessStock = (warehouse: Warehouse) => {
    router.push(`/inventory/warehouses/${warehouse.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Gestion des entrepôts</h1>
          <Button onClick={() => {
            handleCreateWarehouse()
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un entrepôt
          </Button>
        </div>

        {/* Filtres */}
        <WarehouseFilters
          companies={[]}
          locations={[]}
          onFilterChange={handleFilterChange}
        />

        {/* Liste des entrepôts */}
        {warehouses.length > 0 ? (
          <>
            <WarehousesTable
              warehouses={warehouses}
              onView={handleViewWarehouse}
              onEdit={handleEditWarehouse}
              onDelete={handleDeleteWarehouse}
              onAccessStock={handleAccessStock}
            />

            <PaginationControls
              meta={paginationMeta}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
              className="mt-4"
            />
          </>
        ) : loading ? (
          <div className="flex items-center justify-center h-64">
            <p>Chargement des entrepôts...</p>
          </div>
        ) : (
          <EmptyState
            title="Aucun entrepôt trouvé"
            description="Il n'y a actuellement aucun entrepôt dans votre catalogue, ou aucun ne correspond à vos critères de recherche."
            action={{
              label: "Ajouter un entrepôt",
              onClick: () => {
                handleCreateWarehouse();
              },
            }}
            className="my-12"
          />
        )}
      </div>
    </div>
  );
};

export default WarehousesPage;
