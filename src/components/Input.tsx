// src/components/Input.tsx
import React from 'react';

// Menggunakan React.ComponentProps untuk mendapatkan semua atribut standar <input>
interface InputProps extends React.ComponentProps<'input'> {}

export default function Input({ className, ...props }: InputProps) {
  const baseClasses = "w-full bg-background-secondary border border-gray-600 rounded-lg py-3 px-4 text-text-main placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-main";
  return <input className={`${baseClasses} ${className}`} {...props} />;
}