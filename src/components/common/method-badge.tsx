import { cn, getMethodColor } from '@/lib/utils';

interface MethodBadgeProps {
  method: string;
  className?: string;
}

export function MethodBadge({ method, className }: MethodBadgeProps) {
  const colorClass = getMethodColor(method);
  
  return (
    <span 
      className={cn(
        'method-badge',
        colorClass,
        className
      )}
    >
      {method.toUpperCase()}
    </span>
  );
} 