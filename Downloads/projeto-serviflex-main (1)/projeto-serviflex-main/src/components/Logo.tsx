import React from 'react';
interface LogoProps {
  className?: string;
  textColor?: string;
}
export function Logo({
  className = '',
  textColor = 'text-gray-900'
}: LogoProps) {
  return <div className={`flex items-center gap-3 ${className}`}>
      <img src="/logo.png" alt="ServeFlex Logo" className="w-10 h-10 object-contain" />
      <span className={`text-2xl font-semibold ${textColor}`}>ServiFlex</span>
    </div>;
}