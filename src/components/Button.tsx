// src/components/Button.tsx
import React from 'react';

// Menggunakan React.ComponentProps untuk mendapatkan semua atribut standar <button>
interface ButtonProps extends React.ComponentProps<'button'> {}

export default function Button({ children, className, ...props }: ButtonProps) {
  const baseClasses = "w-full bg-accent-main hover:bg-accent-secondary text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-main focus:ring-accent-secondary";
  return <button className={`${baseClasses} ${className}`} {...props}>{children}</button>;
}