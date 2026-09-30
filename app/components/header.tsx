"use client";

import Link from "next/link";
import { ShoppingBag, User } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#F3EBE1] px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-[#5C3A21] flex items-center justify-center text-white font-bold text-lg shadow-sm">
            🎂
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight text-[#2D1E18]">
              Dulce & Salado
            </h1>
            <p className="text-[11px] text-[#7A685D]">Postres y Sanduches</p>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 rounded-full bg-[#F3EBE1] flex items-center justify-center text-[#2D1E18]">
            <User size={18} />
          </button>
          <Link
            href="/cart"
            className="relative w-10 h-10 rounded-full bg-[#5C3A21] text-white flex items-center justify-center shadow-md"
          >
            <ShoppingBag size={20} />
          </Link>
        </div>
      </div>
    </header>
  );
}
