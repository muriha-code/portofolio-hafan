import React from 'react';
import * as Lucide from 'lucide-react';

interface LucideIconProps extends React.ComponentPropsWithoutRef<'svg'> {
  name: string;
  className?: string;
  size?: number;
}

export const LucideIcon: React.FC<LucideIconProps> = ({ name, className = '', size = 20, ...props }) => {
  // Map string to Lucide Component
  const IconComponent = (Lucide as any)[name];
  
  if (!IconComponent) {
    // Return a default icon if not found
    return <Lucide.HelpCircle className={className} size={size} {...props} />;
  }

  return <IconComponent className={className} size={size} {...props} />;
};
