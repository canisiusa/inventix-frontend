import { FC } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfirmationIconProps {
  success: boolean;
  size?: number;
  className?: string;
}

const ConfirmationIcon: FC<ConfirmationIconProps> = ({ 
  success, 
  size = 60, 
  className 
}) => {
  return success ? (
    <div className={cn("success-indicator flex items-center justify-center", className)}>
      <CheckCircle2 
        size={size} 
        className="text-success animate-fade-in" 
      />
    </div>
  ) : (
    <div className={cn("error-indicator flex items-center justify-center", className)}>
      <XCircle 
        size={size} 
        className="text-error animate-fade-in" 
      />
    </div>
  );
};

export default ConfirmationIcon;