import { StockStatus } from "@/lib/schemas/warehouse.schemas";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: StockStatus;
  className?: string;
}

export function StockStatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    [StockStatus.CRITICAL]: {
      bgColor: "bg-amber-100",
      textColor: "text-amber-800",
      label: "Critique"
    },
    [StockStatus.MINIMUM_REACHED]: {
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
      label: "Normal"
    },
    [StockStatus.RUPTURE]: {
      bgColor: "bg-orange-100",
      textColor: "text-orange-800",
      label: "Rupture"
    },
    [StockStatus.EXPIRED]: {
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      label: "Rupture"
    },
    [StockStatus.NORMAL]: {
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      label: "Normal"
    }
  };

  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.bgColor,
        config.textColor,
        className
      )}
    >
      {config.label}
    </span>
  );
}
