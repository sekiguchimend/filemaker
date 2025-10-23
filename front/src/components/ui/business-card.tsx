'use client'

import { cn } from "@/lib/utils";
import type { BusinessCardProps } from '@/types/business-card';

export const BusinessCard = ({ 
  children, 
  variant = 'primary', 
  className,
  onClick 
}: BusinessCardProps) => {
  const variants = {
    primary: "bg-pink-primary text-primary-foreground shadow-pink hover:shadow-lg",
    secondary: "bg-pink-secondary text-secondary-foreground shadow-soft hover:shadow-pink",
    gray: "bg-gray-section text-gray-section-foreground shadow-soft hover:shadow-pink",
    accent: "bg-pink-light text-accent-foreground shadow-soft hover:shadow-pink"
  };

  return (
    <div 
      className={cn(
        "p-4 rounded-lg transition-all duration-200 cursor-pointer hover:scale-105",
        variants[variant],
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};