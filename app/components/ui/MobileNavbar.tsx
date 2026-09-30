"use client";

import Link from "next/link";
import { Home, UtensilsCrossed, ClipboardList, User } from "lucide-react";

export default function MobileNavbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#F3EBE1] px-4 py-2 shadow-lg">
      <div className="max-w-md mx-auto flex justify-around items-center">
        <Link
          href="/"
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-bold text-[#5C3A21]"
        >
          <Home size={20} />
          <span>INICIO</span>
        </Link>
        <Link
          href="/menu"
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-bold text-[#7A685D]"
        >
          <UtensilsCrossed size={20} />
          <span>MENU</span>
        </Link>
        <Link
          href="/orders-history"
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-bold text-[#7A685D]"
        >
          <ClipboardList size={20} />
          <span>PEDIDOS</span>
        </Link>
        <Link
          href="/profile"
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-bold text-[#7A685D]"
        >
          <User size={20} />
          <span>CUENTA</span>
        </Link>
      </div>
    </nav>
  );
}