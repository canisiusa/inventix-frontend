import React from 'react';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: OrderStatus;
}

const statusConfig = {
  ["PENDING"]: {
    label: 'En attente',
    variant: 'outline' as const,
    className: 'bg-yellow-50 text-yellow-800 border-yellow-300',
  },
  ["CONFIRMED"]: {
    label: 'Confirmée',
    variant: 'outline' as const,
    className: 'bg-blue-50 text-blue-800 border-blue-300',
  },
  ["CANCELLED"]: {
    label: 'Annulée',
    variant: 'outline' as const,
    className: 'bg-red-50 text-red-800 border-red-300',
  },
  ["DELIVERED"]: {
    label: 'Livrée',
    variant: 'outline' as const,
    className: 'bg-green-50 text-green-800 border-green-300',
  },
  ["RETURNED"]: {
    label: 'Retournée',
    variant: 'outline' as const,
    className: 'bg-purple-50 text-purple-800 border-purple-300',
  },
};

const OrderStatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status];
  
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};

export default OrderStatusBadge;
