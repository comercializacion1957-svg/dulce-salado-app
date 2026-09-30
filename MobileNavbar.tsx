'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, UtensilsCrossed, ClipboardList, User } from 'lucide-react';

export default function MobileNavbar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'INICIO', href: '/', icon: Home },
    { label: 'MENÚ', href: '/menu', icon: UtensilsCrossed },
    { label: 'PEDIDOS', href: '/orders-history', icon: ClipboardList },
    { label: 'CUENTA', href: '/profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-brand-surface border-t border-brand-muted/60 px-4 py-2 shadow-lg">
      <div className="max-w-md mx-auto flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-bold tracking-wider ${
                isActive ? 'text-brand-primary scale-105' : 'text-brand-text-muted'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}