const fs = require('fs');
const path = require('path');

// 1. Contenido UTF-8 limpio para app/layout.tsx
const layoutContent = `import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/ui/Header";
import MobileNavbar from "@/components/ui/MobileNavbar";

export const metadata: Metadata = {
  title: "Dulce & Salado | Postres y Sanduches",
  description: "Ordena los mejores postres artesanales y sanduches.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased min-h-screen flex flex-col pb-20">
        <Header />
        <main className="flex-1 max-w-md w-full mx-auto px-4 py-4">
          {children}
        </main>
        <MobileNavbar />
      </body>
    </html>
  );
}
`;

// 2. Contenido UTF-8 limpio para app/page.tsx
const pageContent = `import Link from "next/link";
import { ArrowRight, Star, Plus } from "lucide-react";

const CATEGORIES = [
  { name: "Postres", icon: "🍰", slug: "postres" },
  { name: "Sanduches", icon: "🥪", slug: "sanduches" },
  { name: "Galletas", icon: "🍪", slug: "galletas" },
  { name: "Bebidas", icon: "🥤", slug: "bebidas" },
  { name: "Combos", icon: "🎁", slug: "combos" },
  { name: "Especiales", icon: "⭐", slug: "especiales" }
];

const FEATURED = [
  { id: "f1", name: "Cheesecake de Maracuya", description: "Cremoso cheesecake con pulpa natural de maracuya.", price: 3.5, has_variants: true, image_url: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=400" },
  { id: "f2", name: "Sanduche Pollo Gourmet", description: "Pechuga desmenuzada, salsa artesanal y queso fundido.", price: 4.0, has_variants: true, image_url: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=400" },
  { id: "f3", name: "Brownie de Chocolate", description: "Intenso sabor a cacao 70% con trozos de nuez.", price: 2.5, has_variants: false, image_url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=400" }
];

export default function HomePage() {
  return (
    <div className="space-y-6">
      <section className="relative rounded-card overflow-hidden bg-gradient-to-r from-brand-primary to-brand-primary-hover text-white p-6 shadow-md">
        <div className="relative z-10 space-y-3 max-w-[75%]">
          <span className="inline-block px-2.5 py-1 bg-brand-accent/20 text-brand-accent rounded-full text-[11px] font-semibold">Hecho en casa con amor</span>
          <h2 className="text-2xl font-extrabold leading-tight">Un antojo para cada momento</h2>
          <p className="text-xs text-white/80 leading-relaxed">Postres, sanduches y bebidas preparados para disfrutar.</p>
          <Link href="/menu" className="inline-flex items-center gap-2 bg-brand-secondary text-white text-xs font-bold px-4 py-2.5 rounded-btn shadow-md active:scale-95 transition-transform">
            <span>ORDENAR AHORA</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
      <section className="space-y-3">
        <div className="flex items-center justify-between"><h3 className="font-bold text-base text-brand-text">Categorias</h3><Link href="/menu" className="text-xs font-semibold text-brand-secondary">Ver todas</Link></div>
        <div className="grid grid-cols-3 gap-2.5">
          {CATEGORIES.map((cat) => (
            <Link key={cat.slug} href={`/menu?category=${cat.slug}`} className="flex flex-col items-center justify-center p-3 rounded-card bg-brand-surface border border-brand-muted/40 shadow-sm active:scale-95">
              <span className="text-2xl mb-1">{cat.icon}</span>
              <span className="text-xs font-medium text-brand-text">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="space-y-3">
        <h3 className="font-bold text-base text-brand-text flex items-center gap-1.5"><Star size={16} className="text-brand-secondary fill-brand-secondary" /><span>Los Mas Pedidos</span></h3>
        <div className="space-y-3">
          {FEATURED.map((product) => (
            <div key={product.id} className="bg-brand-surface border border-brand-muted/50 rounded-card p-3 flex gap-3 items-center shadow-sm">
              <img src={product.image_url} alt={product.name} className="w-20 h-20 rounded-lg object-cover bg-brand-muted" />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-brand-text truncate">{product.name}</h4>
                <p className="text-[11px] text-brand-text-muted line-clamp-2 mt-0.5">{product.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-extrabold text-sm text-brand-primary">${product.price.toFixed(2)}</span>
                  <Link href={`/product/${product.id}`} className="inline-flex items-center gap-1 text-xs font-bold bg-brand-muted text-brand-primary px-2.5 py-1 rounded-btn hover:bg-brand-primary hover:text-white transition-colors">
                    {product.has_variants ? "Ver Opciones" : <><Plus size={14} /><span>Agregar</span></>}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
`;

// Escribir archivos estrictamente en UTF-8
fs.writeFileSync(path.join(__dirname, 'app', 'layout.tsx'), layoutContent, 'utf8');
fs.writeFileSync(path.join(__dirname, 'app', 'page.tsx'), pageContent, 'utf8');

// Eliminar carpeta .next si existe para borrar la caché
const nextDir = path.join(__dirname, '.next');
if (fs.existsSync(nextDir)) {
  fs.rmSync(nextDir, { recursive: true, force: true });
}

console.log("✅ Archivos reparados en UTF-8 y caché .next eliminada con éxito.");