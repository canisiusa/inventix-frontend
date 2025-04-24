"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ProductsTable } from "./components/stocks/products-table";
import { MovementsTable, MovementsTimeline } from "./components/stocks/movements-table";
import { AddStockMovementModalProps, showAddStockMovementModal } from "../../../components/modals/add-movement-modal";
import { ArrowLeft, Box, Calendar, Clock, LayoutGrid, Plus } from "lucide-react";
import { EmptyState } from "./components/ui/empty-state";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams, useRouter } from "next/navigation";
import { getWarehouse, getWarehouseMovements, getWarehouseStock } from "@/lib/api/warehouseApi";
import { handleError } from "@/lib/utils";
import { useLocalization } from "@/providers/localization-provider";
import { ProductFormProps, showProductFormModal } from "@/components/modals/ProductForm";

const WarehouseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const isMobile = useIsMobile();

  const [warehouse, setwarehouse] = useState<Warehouse>()
  const [stocks, setstocks] = useState<Stock[]>([])
  const [movements, setmovements] = useState([])
  const [loading, setloading] = useState(true)

  const [isTimelineView, setIsTimelineView] = useState(false);

  const t = useLocalization();


  const fetchWarehouse = async () => {
    try {
      setloading(true);
      const resp = await getWarehouse(id);
      if (resp.status === "failure") {
        throw resp.data;
      }
      setwarehouse(resp.data);
    } catch (error) {
      handleError({ error, message: "Impossible de charger l'entrepôt.", dict: t })
    } finally {
      setloading(false);
    }
  };

  const fetchStocks = async () => {
    try {
      const resp = await getWarehouseStock(id);
      if (resp.status === "failure") {
        throw resp.data;
      }
      setstocks(resp.data);
    } catch (error) {
      handleError({ error, message: "Impossible de charger les stocks.", dict: t })
    };
  }

  const fetchStockMouvements = async () => {
    try {
      const resp = await getWarehouseMovements(id);
      if (resp.status === "failure") {
        throw resp.data;
      }
      setmovements(resp.data);
    } catch (error) {
      handleError({ error, message: "Impossible de charger les mouvements de stocks.", dict: t })
    };
  }
  useEffect(() => {
    fetchWarehouse();
    fetchStocks();
    fetchStockMouvements()
  }, [id]);


  async function handleAddStockMovement(stock?: Stock) {
    try {
      await showAddStockMovementModal({
        isOpen: true,
        stock: stock
      } as AddStockMovementModalProps);
      fetchStocks();
      fetchStockMouvements();
    } catch {
      //
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <EmptyState
          title="Chargement..."
          description="Veuillez patienter pendant que nous chargeons les données."
          icon="warehouse"
          className="my-12"
        />
      </div>
    );
  } else if (!warehouse) {
    return (
      <div className="container mx-auto px-4 py-6">
        <EmptyState
          title="Entrepôt non trouvé"
          description="L'entrepôt que vous cherchez n'existe pas ou a été supprimé."
          icon="warehouse"
          action={{
            label: "Retour à la liste",
            onClick: () => router.back(),
          }}
          className="my-12"
        />
      </div>
    );
  }

  const handleAddProduct = async () => {
    try {
      await showProductFormModal({
        isOpen: true,
        warehouse: warehouse,
      } as ProductFormProps);
      fetchWarehouse();
      fetchStocks();
    } catch {
      //
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col gap-6">
        {/* En-tête */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="mb-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
            <h1 className="text-2xl font-semibold">{warehouse.name}</h1>
            <div className="text-muted-foreground">
              {warehouse.location && (
                <div className="mt-1">{warehouse.location}</div>
              )}
            </div>
          </div>
          <Button
            onClick={() => handleAddStockMovement()}
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un mouvement
          </Button>
        </div>

        <Separator />

        {/* Informations générales */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Nombre de produits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium">{warehouse._count.stocks}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Date de création
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium">
                {format(warehouse.createdAt, "dd/MM/yyyy", { locale: fr })}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Dernière mise à jour
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium">
                {format(warehouse.updatedAt, "dd/MM/yyyy", { locale: fr })}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contenu principal */}
        <Tabs defaultValue="inventory">
          <TabsList>
            <TabsTrigger value="inventory">
              <Box className="mr-2 h-4 w-4" />
              Inventaire
            </TabsTrigger>
            <TabsTrigger value="movements">
              <Calendar className="mr-2 h-4 w-4" />
              Mouvements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inventory">
            <div className="mt-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Stock disponible</h2>
              </div>

              {stocks.length > 0 ? (
                <ProductsTable
                  stocks={stocks}
                  onAddMovement={handleAddStockMovement}
                />
              ) : (
                <EmptyState
                  title="Aucun produit en stock"
                  description="Cet entrepôt ne contient actuellement aucun produit."
                  icon="product"
                  action={{
                    label: "Ajouter un produit",
                    onClick: () => handleAddProduct(),
                  }}
                  className="my-8"
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="movements">
            <div className="mt-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Historique des mouvements</h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsTimelineView(!isTimelineView)}
                    className="hidden sm:flex"
                  >
                    {isTimelineView ? (
                      <>
                        <LayoutGrid className="mr-2 h-4 w-4" />
                        Vue tableau
                      </>
                    ) : (
                      <>
                        <Clock className="mr-2 h-4 w-4" />
                        Vue timeline
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {movements.length > 0 ? (
                isMobile || isTimelineView ? (
                  <MovementsTimeline movements={movements} />
                ) : (
                  <MovementsTable movements={movements} />
                )
              ) : (
                <EmptyState
                  title="Aucun mouvement enregistré"
                  description="Cet entrepôt n'a pas encore d'historique de mouvements de stock."
                  action={{
                    label: "Ajouter un mouvement",
                    onClick: handleAddStockMovement,
                  }}
                  className="my-8"
                />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WarehouseDetail;
