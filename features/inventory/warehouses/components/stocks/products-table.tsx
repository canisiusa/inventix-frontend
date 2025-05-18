import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MovementTypeBadge } from "../ui/movement-type-badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { PlusCircle, PlusIcon } from "lucide-react";
import { getStockStatus } from "@/utils/get-stockstatus";
import { StockStatusBadge } from "../../../../../components/misc/stock-status-badge";
import { PaginationControls } from "@/components/misc/pagination-controls";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import EmptyStateUI from "@/components/misc/emptystate";

interface ProductsTableProps {
  stocks: Stock[];
  onAddMovement: (product: Stock) => void;
  className?: string;
  paginationMeta: PaginationMeta;
  handlePageChange: (page: number, search: string) => void;
  handleLimitChange: (limit: number, search: string) => void;
  handleAddProduct: () => void;
}

export function ProductsTable({
  stocks,
  onAddMovement,
  className,
  paginationMeta,
  handlePageChange
  , handleLimitChange,
  handleAddProduct
}: ProductsTableProps) {
  const [search, setsearch] = useState("")
  const debouncedSearch = useDebounce(search, 500);


  useEffect(() => {
    handlePageChange(1, debouncedSearch);
  }, [debouncedSearch]);






  return (
    <>
      <div className={`rounded-md border ${className}`}>
        <div className="flex items-center justify-end p-4">
          <h2 className="text-lg font-semibold"></h2>
          <Input
            type="text"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setsearch(e.target.value)}
            className="border rounded-md px-2 py-1 max-w-96"
          />
        </div>

        {stocks.length > 0 ?
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom du produit</TableHead>
                <TableHead className="text-center">Quantité actuelle</TableHead>
                <TableHead className="text-center">Stock minimum</TableHead>
                <TableHead className="text-center">Statut</TableHead>
                <TableHead>Dernier mouvement</TableHead>
                <TableHead className="w-[100px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stocks.map((product) => {
                const stockStatus = getStockStatus(product.quantity, product.minimumStock, product.product.expiryDate);
                const lastMovement = product.movements[0];

                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.product.name}</TableCell>
                    <TableCell className="text-center">
                      {product.quantity}
                    </TableCell>
                    <TableCell className="text-center">
                      {product.minimumStock}
                    </TableCell>
                    <TableCell className="text-center">
                      <StockStatusBadge status={stockStatus} />
                    </TableCell>
                    <TableCell>
                      {lastMovement ? (
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1">
                            <MovementTypeBadge
                              type={lastMovement.type}
                              showLabel={false}
                            />
                            <span className="text-sm">{lastMovement.quantity}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {format(lastMovement.createdAt, "dd/MM/yyyy HH:mm", {
                              locale: fr,
                            })}
                          </span>
                        </div>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => onAddMovement(product)}
                      >
                        <PlusCircle className="h-4 w-4" />
                        <span className="sr-only">
                          Ajouter un mouvement pour {product.product.name}
                        </span>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {stocks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Aucun produit trouvé dans cet entrepôt.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table> :
          <EmptyStateUI
            title="Aucun produit en stock"
            description="Cet entrepôt ne contient actuellement aucun produit coreespondant aux critères spécifiés."
            action={
              <Button className="mt-4" onClick={handleAddProduct}>
                <PlusIcon className="mr-2 h-4 w-4" />
                Ajouter un produit
              </Button>
            }
            className="mb-8"
          />
        }
      </div>
      <PaginationControls
        meta={paginationMeta}
        onPageChange={(page) => handlePageChange(page, debouncedSearch)}
        onLimitChange={(limit) => handleLimitChange(limit, debouncedSearch)}
        className="py-4"
      />
    </>
  );
}
