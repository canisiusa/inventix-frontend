import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { MovementTypeBadge } from "../ui/movement-type-badge";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import EmptyStateUI from "@/components/misc/emptystate";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaginationControls } from "@/components/misc/pagination-controls";

interface MovementsTableProps {
  movements: StockMovement[];
  className?: string;
  paginationMeta: PaginationMeta;
  handlePageChange: (page: number, search: string) => void;
  handleLimitChange: (limit: number, search: string) => void;
  handleAddStockMovement: () => void;
}

export function MovementsTable({
  movements,
  className,
  paginationMeta,
  handlePageChange,
  handleLimitChange,
  handleAddStockMovement
}: MovementsTableProps) {
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
            placeholder="Rechercher un mouvement de stock..."
            value={search}
            onChange={(e) => setsearch(e.target.value)}
            className="border rounded-md px-2 py-1 max-w-96"
          />
        </div>
        {movements.length > 0 ?
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Produit</TableHead>
                <TableHead className="text-center">Quantité</TableHead>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell>
                    <MovementTypeBadge type={movement.type} />
                  </TableCell>
                  <TableCell>{movement.stock.product.name}</TableCell>
                  <TableCell className="text-center">{movement.quantity}</TableCell>
                  <TableCell>{movement.companyUser.name || "—"}</TableCell>
                  <TableCell>
                    {format(movement.createdAt, "dd/MM/yyyy HH:mm", { locale: fr })}
                  </TableCell>
                  <TableCell>
                    <span title={movement.notes || "—"} className="line-clamp-2 max-w-28 text-sm text-muted-foreground">
                      {movement.notes || "—"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {movements.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Aucun mouvement de stock enregistré.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table> :
          <EmptyStateUI
            title="Aucun produit en stock"
            description="Cet entrepôt ne contient actuellement aucun produit coreespondant aux critères spécifiés."
            action={
              <Button className="mt-4" onClick={handleAddStockMovement}>
                <PlusIcon className="mr-2 h-4 w-4" />
                Ajouter un mouvement
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

// Version mobile avec timeline
export function MovementsTimeline({ movements }: { movements: StockMovement[] }) {
  if (movements.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-muted-foreground">
          Aucun mouvement de stock enregistré.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {movements.map((movement) => (
        <Card key={movement.id} className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <MovementTypeBadge type={movement.type} className="mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">{movement.stock.product.name}</h4>
                <p className="text-xs text-muted-foreground">
                  {format(movement.createdAt, "dd MMMM yyyy à HH:mm", {
                    locale: fr,
                  })}
                </p>
              </div>
            </div>
            <span className="font-medium">
              {movement.type === "IN" ? "+" : movement.type === "OUT" ? "-" : "±"}
              {movement.quantity}
            </span>
          </div>
          {movement.notes && (
            <p className="mt-2 text-sm text-muted-foreground pl-10 whitespace-pre-line">
              {movement.notes}
            </p>
          )}
          {movement.companyUser.name && (
            <p className="mt-1 text-xs text-muted-foreground pl-10">
              Par {movement.companyUser.name}
            </p>
          )}
        </Card>
      ))}
    </div>
  );
}
