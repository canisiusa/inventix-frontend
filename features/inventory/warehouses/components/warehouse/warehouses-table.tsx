"use-client"
/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Edit,
  Eye,
  FileText,
  MoreHorizontal,
  PackageX,
  Trash,
} from "lucide-react";
import AppTable from "@/components/misc/table";

interface WarehousesTableProps {
  warehouses: Warehouse[];
  onView: (warehouse: Warehouse) => void;
  onEdit: (warehouse: Warehouse) => void;
  onDelete: (warehouse: Warehouse) => void;
  onAccessStock: (warehouse: Warehouse) => void;
}

const tableWidth = 900;
const columnWidths = [0.2 * tableWidth, ...Array(5).fill(0.16 * tableWidth)];

export function WarehousesTable({
  warehouses,
  onView,
  onEdit,
  onDelete,
  onAccessStock,
}: WarehousesTableProps) {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [warehouseToDelete, setWarehouseToDelete] = useState<Warehouse | null>(
    null
  );

  const handleDelete = (warehouse: Warehouse) => {
    setWarehouseToDelete(warehouse);
  };

  const confirmDelete = () => {
    if (warehouseToDelete) {
      onDelete(warehouseToDelete);
      setWarehouseToDelete(null);
    }
  };

  // Version mobile avec cartes
  if (isMobile) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {warehouses.map((warehouse) => (
          <div
            key={warehouse.id}
            className="rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{warehouse.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {warehouse.location || "Aucune localisation"}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onView(warehouse)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Voir
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(warehouse)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onAccessStock(warehouse)}>
                    <PackageX className="mr-2 h-4 w-4" />
                    Accéder au stock
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleDelete(warehouse)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="mt-4 text-sm">
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Produits</span>
                <span>{warehouse._count.stocks}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Stock faible</span>
                <span>
                  {warehouse.lowStockIndicator ? (
                    <span className="text-red-500 font-medium">Oui</span>
                  ) : (
                    "Non"
                  )}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Dernière MAJ</span>
                <span>
                  {format(warehouse.updatedAt, "dd/MM/yyyy", { locale: fr })}
                </span>
              </div>
            </div>
          </div>
        ))}

        <AlertDialog
          open={!!warehouseToDelete}
          onOpenChange={(open) => !open && setWarehouseToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer l'entrepôt "
                {warehouseToDelete?.name}" ? Tous les produits, stocks, etc... associés seront supprimés. Cette action est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // Version desktop avec tableau
  return (
    <>
      <div className="rounded-md border">
        <AppTable
          maxHeightClassName="max-h-[calc(100vh-14rem)]"
          columnWidths={columnWidths}
          tableWidth={tableWidth}
          header={<TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Localisation</TableHead>
            <TableHead className="text-center">Produits</TableHead>
            <TableHead className="text-center">Stock faible</TableHead>
            <TableHead>Dernière MAJ</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>}
          body={
            <>
              {warehouses.map((warehouse) => (
                <TableRow key={warehouse.id}>
                  <TableCell className="font-medium">{warehouse.name}</TableCell>
                  <TableCell>{warehouse.location || "—"}</TableCell>
                  <TableCell className="text-center">
                    {warehouse._count.stocks}
                  </TableCell>
                  <TableCell >
                    <div className="flex items-center !justify-center">
                    {warehouse.lowStockIndicator ? (
                      <span className="text-destructive">Oui</span>
                    ) : (
                      "Non"
                    )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(warehouse.updatedAt, "dd/MM/yyyy", { locale: fr })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(warehouse)}
                        title="Voir"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(warehouse)}
                        title="Modifier"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => onAccessStock(warehouse)}
                          >
                            <PackageX className="mr-2 h-4 w-4" />
                            Accéder au stock
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            toast({
                              title: "Export PDF",
                              description: "Le fichier PDF a été généré avec succès.",
                            });
                          }}>
                            <FileText className="mr-2 h-4 w-4" />
                            Export PDF
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(warehouse)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </>
          }
        />
      </div>

      <AlertDialog
        open={!!warehouseToDelete}
        onOpenChange={(open) => !open && setWarehouseToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer l'entrepôt "
              {warehouseToDelete?.name}" ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
