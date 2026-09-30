import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dulce & Salado | Postres y Sánduches",
  description: "Ordena los mejores postres artesanales y sánduches.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased min-h-screen bg-[#FAF6F0] text-[#2D1E18]">
        {/* Encabezado Superior Fijo */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#F3EBE1] px-4 py-3 shadow-xs">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#5C3A21] flex items-center justify-center text-white font-bold text-xl shadow-sm">
                🎂
              </div>
              <div>
                <h1 className="font-bold text-base leading-tight text-[#2D1E18]">
                  Dulce & Salado
                </h1>
                <p className="text-[11px] text-[#7A685D] font-medium">Postres y Sánduches</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#F3EBE1] flex items-center justify-center text-[#2D1E18]">
                👤
              </div>
              <div className="w-10 h-10 rounded-full bg-[#5C3A21] text-white flex items-center justify-center shadow-md font-bold text-xs">
                🛍️
              </div>
            </div>
          </div>
        </header>

        {/* Contenido Principal de la Aplicación */}
        <main className="max-w-md w-full mx-auto px-4 py-4">
          {children}
        </main>
      </body>
    </html>
  );
}