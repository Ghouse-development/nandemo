import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * Reusable card component with Apple-like design
 */
export const Card = ({ children, className = '', onClick }: CardProps) => {
  const baseClasses = 'card';
  const clickableClasses = onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : '';
  
  return (
    <div 
      className={`${baseClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};