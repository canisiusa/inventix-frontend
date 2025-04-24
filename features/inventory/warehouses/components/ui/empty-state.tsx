import { Button } from "@/components/ui/button";
import { BoxIcon, PackageIcon, PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: "warehouse" | "product";
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon = "warehouse",
  action,
  className
}: EmptyStateProps) {
  const Icon = icon === "warehouse" ? BoxIcon : PackageIcon; 

  return (
    <div className={cn("flex flex-col items-center justify-center py-12", className)}>
      <div className="rounded-full bg-muted p-4">
        <Icon className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-medium text-foreground">{title}</h3>
      <p className="mt-2 text-center text-sm text-muted-foreground max-w-sm">
        {description}
      </p>
      {action && (
        <Button className="mt-4" onClick={action.onClick}>
          <PlusIcon className="mr-2 h-4 w-4" />
          {action.label}
        </Button>
      )}
    </div>
  );
}
