import { cn } from '@/lib/utils';
import { ReactNode } from 'react';


export interface AlertBadgeProps {
  className?: string;
  type?: 'normal' | 'low' | 'critical' | 'expired';
    children?: ReactNode;
}

const AlertBadge = ({ className, type, children }: AlertBadgeProps) => {
  const baseClasses = "px-2 py-1 text-xs font-medium rounded-md";
  
  // If a specific type is provided, use its styling
  if (type) {
    const typeClasses = {
      normal: "bg-green-100 text-green-800",
      low: "bg-amber-100 text-amber-800",
      critical: "bg-orange-100 text-orange-800",
      expired: "bg-red-100 text-red-800"
    };
    
    return (
      <span className={cn(baseClasses, typeClasses[type], className)}>
         {children}
      </span>
    );
  }
  
  // Otherwise just render with the provided className
  return (
    <span className={cn(baseClasses, className)}>
        {children}
    </span>
  );
};

export default AlertBadge;
