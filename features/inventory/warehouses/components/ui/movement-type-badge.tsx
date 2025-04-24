import { cn } from "@/lib/utils";
import { ArrowDownToLine, ArrowUpFromLine, RefreshCw } from "lucide-react";

interface MovementTypeBadgeProps {
  type: MovementType;
  className?: string;
  showLabel?: boolean;
}

export function MovementTypeBadge({ type, className, showLabel = true }: MovementTypeBadgeProps) {
  const typeConfig = {
    ["IN"]: {
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      label: "Entrée",
      icon: ArrowDownToLine
    },
    ["OUT"]: {
      bgColor: "bg-orange-100",
      textColor: "text-orange-800",
      label: "Sortie",
      icon: ArrowUpFromLine
    },
    ["ADJUSTMENT"]: {
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
      label: "Ajustement",
      icon: RefreshCw
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.bgColor,
        config.textColor,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {showLabel && config.label}
    </span>
  );
}
