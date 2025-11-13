export function LogoIcon({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizes = {
    sm: 'w-8 h-8 text-xl',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-3xl'
  };

  return (
    <div className={`${sizes[size]} bg-gradient-to-br from-[#1E3A8A] to-[#1e40af] rounded-xl flex items-center justify-center shadow-lg ${className}`}>
      <span className="text-white">🔧</span>
    </div>
  );
}
