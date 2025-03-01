import { FC, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import ConfirmationIcon from './ConfirmationIcon';

interface StatusCardProps {
  success: boolean;
  title: string;
  message: string;
  children?: ReactNode;
  className?: string;
}

const StatusCard: FC<StatusCardProps> = ({ 
  success, 
  title, 
  message, 
  children,
  className 
}) => {
  return (
    <div 
      className={cn(
        "glass-card w-full max-w-md mx-auto rounded-2xl overflow-hidden transition-all duration-500 animate-fade-in",
        "shadow-card backdrop-blur-card p-8",
        success ? "border-success/20" : "border-error/20",
        className
      )}
    >
      <div className="flex flex-col items-center text-center space-y-6">
        <ConfirmationIcon success={success} />
        
        <div className="space-y-2">
          <h3 className="text-2xl font-medium text-appBlack dark:text-appWhite">
            {title}
          </h3>
          <p className="text-appGray-600 dark:text-appGray-300">
            {message}
          </p>
        </div>
        
        <div className="pt-2 w-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default StatusCard;