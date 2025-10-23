import type { ReactNode } from 'react';

export interface BusinessCardProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'gray' | 'accent';
  className?: string;
  onClick?: () => void;
}


