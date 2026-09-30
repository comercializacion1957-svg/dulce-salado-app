'use client';

import Link from 'next/link';
import { useCartStore } from '@/lib/store/cartStore';
import { ShoppingBag, User } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Header() {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-brand-surface/95 backdrop-blur-md border-b border-brand-muted/50 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold text-lg shadow-sm">
            🎂
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight text-brand-text">Dulce & Salado</h1>
            <p className="text-[11px] text-brand-text-muted">Postres y Sánduches</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <button className="w-9 h-9 rounded-full bg-brand-muted/60 flex items-center justify-center text-brand-text">
            <User size={18} />
          </button>

          <Link
            href="/cart"
            className="relative w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-md active:scale-95 transition-transform"
          >
            <ShoppingBag size={20} />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-secondary text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}