'use client';

import { ReactNode, useState, useEffect } from 'react';

interface HydrationBoundaryProps {
  children: ReactNode;
  className?: string;
  fallback?: ReactNode;
}

/**
 * HydrationBoundary component to handle hydration mismatches caused by browser extensions
 * that modify the DOM (like adding bis_skin_checked attributes).
 * 
 * This component suppresses hydration warnings for its entire subtree, making it safe
 * to use around components that might be affected by browser extensions.
 */
export function HydrationBoundary({ 
  children, 
  className, 
  fallback = null 
}: HydrationBoundaryProps) {
  return (
    <div className={className} suppressHydrationWarning>
      {children}
    </div>
  );
}

/**
 * Alternative approach: A hook to detect if we're in a browser environment
 * Useful for conditional rendering that might cause hydration mismatches
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
} 