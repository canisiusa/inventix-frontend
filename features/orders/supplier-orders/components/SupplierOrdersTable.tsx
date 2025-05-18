import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Edit, Eye, Trash } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from 'next/navigation';
import OrderStatusBadge from '@/components/misc/order-status-badge';
import { PaginationControls } from '@/components/misc/pagination-controls';
import AppTable from '@/components/misc/table';

interface SupplierOrdersTableProps {
  orders: SupplierOrder[] | undefined;
  isLoading: boolean;
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onDelete: (order: SupplierOrder) => void;
}

const SupplierOrdersTable: React.FC<SupplierOrdersTableProps> = ({
  orders,
  isLoading,
  meta,
  onPageChange,
  onLimitChange,
  onDelete,
}) => {

  const router = useRouter();

  const handleViewDetails = (orderId: string) => {
    router.push(`/orders/supplier-orders/${orderId}`);
  };

  const handleEdit = (orderId: string) => {
    router.push(`/orders/supplier-orders/${orderId}/edit`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fournisseur</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead>Produits</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(5).fill(0).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-6 w-40" /></TableCell>
                <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-10 w-24 ml-auto" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AppTable
        loading={isLoading}
        columnWidths={[160, 96, 128, 64, 96]}
        header={<TableRow>
          <TableHead>Fournisseur</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Date de création</TableHead>
          <TableHead>Produits</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>}
        body={
          <>
            {
              orders && orders.length > 0 ? (
                orders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{order.supplier.name}</TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell>
                      {format(new Date(order.createdAt), 'dd MMM yyyy HH:mm', { locale: fr })}
                    </TableCell>
                    <TableCell>{order.products.length}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="link" size="sm">
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(order.id)}>
                            <Eye className="mr-2 h-4 w-4" /> Détails
                          </DropdownMenuItem>
                          {
                            order.status === "DELIVERED" ? null :
                              <DropdownMenuItem onClick={() => handleEdit(order.id)}>
                                <Edit className="mr-2 h-4 w-4" /> Modifier
                              </DropdownMenuItem>
                          }
                          {order.status === "DELIVERED" ? null :
                            <DropdownMenuItem
                              onClick={() => onDelete(order)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash className="mr-2 h-4 w-4" /> Supprimer
                            </DropdownMenuItem>
                          }
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Aucune commande fournisseur trouvée
                  </TableCell>
                </TableRow>
              )
            }
          </>
        }
      />

      <PaginationControls
        meta={meta}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
        className="mt-4"
      />
    </div>
  );
};

export default SupplierOrdersTable;
