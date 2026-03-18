'use client';

import React, { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm text-[#A0A0A0] mb-1.5">{label}</label>
      )}
      <input
        className={`w-full px-4 py-2.5 bg-[#1A1A1A] border border-[#333] rounded-lg text-white placeholder-[#666] focus:outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35]/50 transition-all ${error ? 'border-[#FF4757]' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-[#FF4757]">{error}</p>}
    </div>
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, options, className = '', ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm text-[#A0A0A0] mb-1.5">{label}</label>
      )}
      <select
        className={`w-full px-4 py-2.5 bg-[#1A1A1A] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35]/50 transition-all appearance-none cursor-pointer ${error ? 'border-[#FF4757]' : ''} ${className}`}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-[#FF4757]">{error}</p>}
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm text-[#A0A0A0] mb-1.5">{label}</label>
      )}
      <textarea
        className={`w-full px-4 py-2.5 bg-[#1A1A1A] border border-[#333] rounded-lg text-white placeholder-[#666] focus:outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35]/50 transition-all resize-none ${error ? 'border-[#FF4757]' : ''} ${className}`}
        rows={3}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-[#FF4757]">{error}</p>}
    </div>
  );
}
