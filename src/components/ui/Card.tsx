'use client';

import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export function Card({ children, className = '', onClick, hover = false }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-[#242424] rounded-xl p-4 shadow-lg ${hover ? 'hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

export function StatCard({ label, value, subValue, icon, trend }: StatCardProps) {
  const trendColors = {
    up: 'text-[#4ECDC4]',
    down: 'text-[#FF4757]',
    neutral: 'text-[#A0A0A0]',
  };

  return (
    <Card className="flex items-center gap-3">
      {icon && (
        <div className="w-10 h-10 rounded-lg bg-[#FF6B35]/20 flex items-center justify-center text-[#FF6B35]">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-[#666] uppercase tracking-wider">{label}</p>
        <p className={`text-lg font-semibold ${trend ? trendColors[trend] : 'text-white'}`}>
          {value}
        </p>
        {subValue && <p className="text-xs text-[#666]">{subValue}</p>}
      </div>
    </Card>
  );
}

export function HeroCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-[#FF6B35] to-[#F7931E] rounded-2xl p-6 ${className}`}>
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
