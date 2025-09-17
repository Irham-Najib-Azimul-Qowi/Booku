// src/app/(auth)/layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  // Layout ini tidak memiliki Navbar, hanya background gelap
  // dan menempatkan kontennya di tengah layar.
  return (
    <div className="h-full flex items-center justify-center">
      {children}
    </div>
  );
}