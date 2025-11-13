import * as LucideIcons from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
}

export function DynamicIcon({ name, className = '', size = 24 }: DynamicIconProps) {
  // Tentar obter o ícone do Lucide
  const IconComponent = (LucideIcons as any)[name];
  
  // Se o ícone não existir, usar um ícone padrão
  if (!IconComponent) {
    const DefaultIcon = LucideIcons.Circle;
    return <DefaultIcon className={className} size={size} />;
  }
  
  return <IconComponent className={className} size={size} />;
}
