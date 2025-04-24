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

interface MovementsTableProps {
  movements: StockMovement[];
  className?: string;
}

export function MovementsTable({ movements, className }: MovementsTableProps) {
  return (
    <div className={`rounded-md border ${className}`}>
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
              <TableCell>{movement.user.name || "—"}</TableCell>
              <TableCell>
                {format(movement.createdAt, "dd/MM/yyyy HH:mm", { locale: fr })}
              </TableCell>
              <TableCell>
                <span className="line-clamp-2 text-sm text-muted-foreground">
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
      </Table>
    </div>
  );
}

// Version mobile avec timeline
export function MovementsTimeline({ movements }: MovementsTableProps) {
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
            <p className="mt-2 text-sm text-muted-foreground pl-10">
              {movement.notes}
            </p>
          )}
          {movement.user.name && (
            <p className="mt-1 text-xs text-muted-foreground pl-10">
              Par {movement.user.name}
            </p>
          )}
        </Card>
      ))}
    </div>
  );
}
