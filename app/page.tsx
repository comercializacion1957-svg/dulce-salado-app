'use client';

import { useState, useMemo, useEffect } from 'react';
import { 
  ArrowRight, Star, Plus, Search, Check, X, 
  Home, UtensilsCrossed, ClipboardList, User, Shield, Trash2, FolderPlus, PackagePlus, Upload,
  ShoppingBag, Send, MapPin, Phone, CreditCard
} from 'lucide-react';

// --- CONFIGURACIÓN DEL NEGOCIO ---
const WHATSAPP_NUMBER = '593991234567'; // Cambia por el número de WhatsApp de tu local (con código de país, ej. 593 para Ecuador)

// --- DATOS INICIALES POR DEFECTO ---
const DEFAULT_CATEGORIES = [
  { id: 'postres', name: 'Postres', icon: '🍰' },
  { id: 'sanduches', name: 'Sánduches', icon: '🥪' },
  { id: 'galletas', name: 'Galletas', icon: '🍪' },
  { id: 'bebidas', name: 'Bebidas', icon: '🥤' },
  { id: 'combos', name: 'Combos', icon: '🎁' },
];

const DEFAULT_PRODUCTS = [
  {
    id: 'p1',
    category: 'postres',
    name: 'Cheesecake de Maracuyá',
    description: 'Cremoso cheesecake artesanal sobre base crujiente de galleta y cobertura de maracuyá natural.',
    base_price: 3.50,
    image_url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=400',
    variants: [
      { id: 'v1', name: 'Porción Personal', price_adjustment: 0 },
      { id: 'v2', name: 'Para Compartir (2 pers)', price_adjustment: 3.00 },
    ],
    extras: [
      { id: 'e1', name: 'Extra Salsa de Maracuyá', price: 0.50 },
      { id: 'e2', name: 'Bola de Helado Vainilla', price: 1.00 },
    ],
  },
  {
    id: 'p2',
    category: 'sanduches',
    name: 'Sánduche Pollo Gourmet',
    description: 'Pechuga desmenuzada, salsa especial de la casa, queso mozzarella fundido y vegetales en pan artesanal.',
    base_price: 4.00,
    image_url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=400',
    variants: [
      { id: 'v3', name: 'Pan Focaccia', price_adjustment: 0 },
      { id: 'v4', name: 'Pan Baguette', price_adjustment: 0.50 },
    ],
    extras: [
      { id: 'e3', name: 'Queso Extra', price: 0.75 },
      { id: 'e4', name: 'Tocineta Crujiente', price: 1.25 },
    ],
  },
  {
    id: 'p3',
    category: 'postres',
    name: 'Brownie de Chocolate Cacao 70%',
    description: 'Brownie meloso de chocolate oscuro con nueces picadas.',
    base_price: 2.50,
    image_url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=400',
    variants: [],
    extras: [{ id: 'e2', name: 'Bola de Helado Vainilla', price: 1.00 }],
  },
];

export default function MainPage() {
  const [activeTab, setActiveTab] = useState<'home' | 'menu' | 'orders' | 'profile'>('home');
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal de Producto
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<any | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<any[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  // ESTADO DEL CARRITO
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // FORMULARIO DE CHECKOUT
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');

  // Estados de Administración
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [adminSubTab, setAdminSubTab] = useState<'list' | 'add_product' | 'add_category'>('list');

  // Formulario Nuevo Producto
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImage, setNewProdImage] = useState('');

  // Formulario Nueva Categoría
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('');

  // Cargar/Guardar en localStorage
  useEffect(() => {
    const savedCats = localStorage.getItem('ds_categories');
    const savedProds = localStorage.getItem('ds_products');
    const savedCart = localStorage.getItem('ds_cart');
    if (savedCats) setCategories(JSON.parse(savedCats));
    if (savedProds) setProducts(JSON.parse(savedProds));
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  const saveCartToStorage = (updatedCart: any[]) => {
    setCart(updatedCart);
    localStorage.setItem('ds_cart', JSON.stringify(updatedCart));
  };

  const saveCategoriesToStorage = (updatedCats: any[]) => {
    setCategories(updatedCats);
    localStorage.setItem('ds_categories', JSON.stringify(updatedCats));
  };

  const saveProductsToStorage = (updatedProds: any[]) => {
    setProducts(updatedProds);
    localStorage.setItem('ds_products', JSON.stringify(updatedProds));
  };

  // Filtrado de productos
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, products]);

  const handleOpenProduct = (product: any) => {
    setSelectedProduct(product);
    setSelectedVariant(product.variants && product.variants.length > 0 ? product.variants[0] : null);
    setSelectedExtras([]);
    setQuantity(1);
    setNotes('');
  };

  const handleExtraToggle = (extra: any) => {
    if (selectedExtras.some((e) => e.id === extra.id)) {
      setSelectedExtras(selectedExtras.filter((e) => e.id !== extra.id));
    } else {
      setSelectedExtras([...selectedExtras, extra]);
    }
  };

  const currentUnitPrice = useMemo(() => {
    if (!selectedProduct) return 0;
    let price = selectedProduct.base_price;
    if (selectedVariant) price += selectedVariant.price_adjustment;
    selectedExtras.forEach((e) => { price += e.price; });
    return price;
  }, [selectedProduct, selectedVariant, selectedExtras]);

  // AGREGAR PRODUCTO AL CARRITO
  const handleAddToCart = () => {
    if (!selectedProduct) return;

    const itemPrice = currentUnitPrice;
    const newItem = {
      cartItemId: 'item_' + Date.now(),
      product: selectedProduct,
      variant: selectedVariant,
      extras: selectedExtras,
      quantity,
      notes,
      unitPrice: itemPrice,
      totalPrice: itemPrice * quantity,
    };

    const updatedCart = [...cart, newItem];
    saveCartToStorage(updatedCart);
    setSelectedProduct(null);
  };

  // MANEJO DE CANTIDADES EN EL CARRITO
  const handleUpdateCartQuantity = (cartItemId: string, delta: number) => {
    const updated = cart.map((item) => {
      if (item.cartItemId === cartItemId) {
        const newQty = item.quantity + delta;
        if (newQty <= 0) return null;
        return {
          ...item,
          quantity: newQty,
          totalPrice: item.unitPrice * newQty,
        };
      }
      return item;
    }).filter(Boolean);

    saveCartToStorage(updated);
  };

  // REMOVER ITEM
  const handleRemoveFromCart = (cartItemId: string) => {
    const updated = cart.filter((item) => item.cartItemId !== cartItemId);
    saveCartToStorage(updated);
  };

  // CÁLCULO TOTALES
  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.totalPrice, 0);
  }, [cart]);

  const totalItemsCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // SUBIR IMAGEN DESDE PC
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProdImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // ENVÍO DE PEDIDO A WHATSAPP
  const handleSendOrderToWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!customerName || !customerPhone || !deliveryAddress) {
      alert('Por favor completa todos los datos de entrega.');
      return;
    }

    let message = `*¡NUEVO PEDIDO - DULCE & SALADO!* 🎂🥪\n\n`;
    message += `👤 *Cliente:* ${customerName}\n`;
    message += `📞 *Teléfono:* ${customerPhone}\n`;
    message += `📍 *Dirección:* ${deliveryAddress}\n`;
    message += `💳 *Método de Pago:* ${paymentMethod}\n\n`;
    message += `*--- DETALLE DEL PEDIDO ---*\n`;

    cart.forEach((item, idx) => {
      message += `\n*${idx + 1}. ${item.product.name}* (x${item.quantity})\n`;
      if (item.variant) {
        message += `   • Opción: ${item.variant.name}\n`;
      }
      if (item.extras && item.extras.length > 0) {
        message += `   • Extras: ${item.extras.map((e: any) => e.name).join(', ')}\n`;
      }
      if (item.notes) {
        message += `   • Nota: "${item.notes}"\n`;
      }
      message += `   • Subtotal: $${item.totalPrice.toFixed(2)}\n`;
    });

    message += `\n💰 *TOTAL A PAGAR: $${cartTotal.toFixed(2)}*\n\n`;
    message += `¡Gracias por su preferencia! Quedo a la espera de la confirmación.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    // Vaciar carrito
    saveCartToStorage([]);
    setIsCartOpen(false);

    // Abrir WhatsApp
    window.open(whatsappUrl, '_blank');
  };

  // Login Admin PIN
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1234') {
      setIsAdminAuthenticated(true);
      setPinError('');
      if (categories.length > 0) setNewProdCategory(categories[0].id);
    } else {
      setPinError('PIN incorrecto. Prueba con 1234');
    }
  };

  // Crear Producto
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice || !newProdCategory) return;

    const newProduct = {
      id: 'p_' + Date.now(),
      name: newProdName,
      category: newProdCategory,
      base_price: parseFloat(newProdPrice),
      description: newProdDesc || 'Delicioso producto recién preparado.',
      image_url: newProdImage || 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=400',
      variants: [],
      extras: [],
    };

    saveProductsToStorage([...products, newProduct]);
    setNewProdName('');
    setNewProdPrice('');
    setNewProdDesc('');
    setNewProdImage('');
    setAdminSubTab('list');
  };

  // Crear Categoría
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;

    const catId = newCatName.toLowerCase().replace(/\s+/g, '_');
    const newCategory = {
      id: catId,
      name: newCatName,
      icon: newCatIcon || '🍽️',
    };

    saveCategoriesToStorage([...categories, newCategory]);
    setNewCatName('');
    setNewCatIcon('');
    setAdminSubTab('list');
  };

  // Eliminar Producto
  const handleDeleteProduct = (id: string) => {
    if (confirm('¿Seguro que deseas eliminar este producto?')) {
      const updated = products.filter(p => p.id !== id);
      saveProductsToStorage(updated);
    }
  };

  return (
    <div className="space-y-6 min-h-screen pb-24">

      {/* PESTAÑA 1: INICIO */}
      {activeTab === 'home' && (
        <div className="space-y-6">
          <section className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#5C3A21] to-[#4A2E1A] text-white p-5 shadow-lg">
            <div className="space-y-2.5 max-w-[80%]">
              <span className="inline-block px-2.5 py-0.5 bg-[#E8A87C]/20 text-[#E8A87C] rounded-full text-[11px] font-semibold tracking-wide">
                Hecho en casa con amor ✨
              </span>
              <h2 className="text-xl font-extrabold leading-tight text-white">
                Un antojo para cada momento
              </h2>
              <p className="text-xs text-white/80 leading-relaxed">
                Postres, sánduches y bebidas preparados al instante.
              </p>
              <div className="pt-1">
                <button
                  onClick={() => setActiveTab('menu')}
                  className="inline-flex items-center gap-2 bg-[#C87D55] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md active:scale-95 transition-transform hover:bg-[#b56d47]"
                >
                  <span>ORDENAR AHORA</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-[#2D1E18]">Categorías</h3>
              <button 
                onClick={() => { setSelectedCategory('all'); setActiveTab('menu'); }} 
                className="text-xs font-bold text-[#C87D55]"
              >
                Ver todas
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); setActiveTab('menu'); }}
                  className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white border border-[#F3EBE1] shadow-xs active:scale-95 hover:border-[#C87D55]/50 transition-all text-center"
                >
                  <span className="text-2xl mb-1">{cat.icon}</span>
                  <span className="text-xs font-semibold text-[#2D1E18]">{cat.name}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="font-bold text-base text-[#2D1E18] flex items-center gap-1.5">
              <Star size={16} className="text-[#C87D55] fill-[#C87D55]" />
              <span>Los Más Pedidos</span>
            </h3>

            <div className="space-y-3">
              {products.slice(0, 3).map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleOpenProduct(product)}
                  className="bg-white border border-[#F3EBE1] rounded-2xl p-3 flex gap-3 items-center shadow-xs cursor-pointer"
                >
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-20 h-20 rounded-xl object-cover bg-[#F3EBE1]"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-[#2D1E18] truncate">
                      {product.name}
                    </h4>
                    <p className="text-[11px] text-[#7A685D] line-clamp-2 mt-0.5">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-extrabold text-sm text-[#5C3A21]">
                        ${product.base_price.toFixed(2)}
                      </span>
                      <button className="inline-flex items-center gap-1 text-xs font-bold bg-[#F3EBE1] text-[#5C3A21] px-3 py-1.5 rounded-xl hover:bg-[#5C3A21] hover:text-white transition-colors">
                        <Plus size={14} />
                        <span>Agregar</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* PESTAÑA 2: MENÚ / CATÁLOGO */}
      {activeTab === 'menu' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A685D]" size={18} />
            <input
              type="text"
              placeholder="Buscar un postre, sánduche o bebida..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#F3EBE1] pl-10 pr-4 py-2.5 rounded-xl text-xs text-[#2D1E18] focus:outline-none focus:border-[#C87D55] shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A685D]"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#5C3A21] text-white shadow-sm'
                  : 'bg-white text-[#7A685D] border border-[#F3EBE1] hover:bg-[#F3EBE1]/50'
              }`}
            >
              <span>🍽️</span>
              <span>Todos</span>
            </button>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#5C3A21] text-white shadow-sm'
                      : 'bg-white text-[#7A685D] border border-[#F3EBE1] hover:bg-[#F3EBE1]/50'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          <div className="space-y-3 pt-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-[#F3EBE1] p-6 space-y-2">
                <span className="text-3xl">🔍</span>
                <p className="font-bold text-sm text-[#2D1E18]">No encontramos productos</p>
                <p className="text-xs text-[#7A685D]">Agrega un nuevo producto desde el Panel Admin.</p>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleOpenProduct(product)}
                  className="bg-white border border-[#F3EBE1] rounded-2xl p-3 flex gap-3 items-center shadow-xs cursor-pointer active:scale-[0.98] transition-transform"
                >
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-22 h-22 rounded-xl object-cover bg-[#F3EBE1]"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-[#2D1E18] truncate">{product.name}</h4>
                    <p className="text-[11px] text-[#7A685D] line-clamp-2 mt-0.5">{product.description}</p>
                    <div className="flex items-center justify-between mt-2.5">
                      <span className="font-extrabold text-sm text-[#5C3A21]">
                        ${product.base_price.toFixed(2)}
                      </span>
                      <button className="inline-flex items-center gap-1 text-xs font-bold bg-[#F3EBE1] text-[#5C3A21] px-3 py-1.5 rounded-xl hover:bg-[#5C3A21] hover:text-white transition-colors">
                        <Plus size={14} />
                        <span>Agregar</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* PESTAÑA 3: HISTORIAL DE PEDIDOS */}
      {activeTab === 'orders' && (
        <div className="text-center py-12 bg-white rounded-2xl border border-[#F3EBE1] p-6 space-y-3">
          <span className="text-4xl">📋</span>
          <h3 className="font-bold text-base text-[#2D1E18]">Historial de Pedidos</h3>
          <p className="text-xs text-[#7A685D]">Tus pedidos confirmados aparecerán aquí.</p>
          <button
            onClick={() => setActiveTab('menu')}
            className="bg-[#5C3A21] text-white text-xs font-bold px-4 py-2 rounded-xl"
          >
            Ir al Menú
          </button>
        </div>
      )}

      {/* PESTAÑA 4: CUENTA Y PANEL DE ADMINISTRACIÓN */}
      {activeTab === 'profile' && (
        <div className="space-y-4">
          {!isAdminAuthenticated ? (
            <div className="bg-white rounded-2xl border border-[#F3EBE1] p-6 space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-[#FAF6F0] flex items-center justify-center mx-auto text-[#5C3A21]">
                <Shield size={24} />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#2D1E18]">Acceso Administrador</h3>
                <p className="text-xs text-[#7A685D] mt-1">Ingresa el PIN de seguridad para gestionar productos y categorías.</p>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-3 max-w-xs mx-auto pt-2">
                <input
                  type="password"
                  placeholder="PIN de acceso (Ej: 1234)"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full bg-[#FAF6F0] border border-[#F3EBE1] px-4 py-2.5 rounded-xl text-center text-sm font-bold tracking-widest focus:outline-none focus:border-[#C87D55]"
                />
                {pinError && <p className="text-xs text-red-500 font-medium">{pinError}</p>}
                <button
                  type="submit"
                  className="w-full bg-[#5C3A21] text-white font-bold text-xs py-3 rounded-xl shadow-md active:scale-95 transition-transform"
                >
                  INGRESAR AL PANEL
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-[#5C3A21] text-white p-4 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2">
                  <Shield size={20} className="text-[#E8A87C]" />
                  <div>
                    <h3 className="font-bold text-sm">Panel de Gestión</h3>
                    <p className="text-[10px] text-white/80">Dulce & Salado Admin</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAdminAuthenticated(false)}
                  className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-white font-semibold"
                >
                  Salir
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setAdminSubTab('list')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold ${
                    adminSubTab === 'list' ? 'bg-[#5C3A21] text-white' : 'bg-white text-[#7A685D] border border-[#F3EBE1]'
                  }`}
                >
                  Productos ({products.length})
                </button>
                <button
                  onClick={() => setAdminSubTab('add_product')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1 ${
                    adminSubTab === 'add_product' ? 'bg-[#5C3A21] text-white' : 'bg-white text-[#7A685D] border border-[#F3EBE1]'
                  }`}
                >
                  <PackagePlus size={14} />
                  <span>+ Producto</span>
                </button>
                <button
                  onClick={() => setAdminSubTab('add_category')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1 ${
                    adminSubTab === 'add_category' ? 'bg-[#5C3A21] text-white' : 'bg-white text-[#7A685D] border border-[#F3EBE1]'
                  }`}
                >
                  <FolderPlus size={14} />
                  <span>+ Categoría</span>
                </button>
              </div>

              {adminSubTab === 'list' && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase text-[#C87D55]">Gestión de Productos Existentes</h4>
                  {products.map((p) => (
                    <div key={p.id} className="bg-white p-3 rounded-xl border border-[#F3EBE1] flex items-center justify-between gap-3 shadow-xs">
                      <img src={p.image_url} alt={p.name} className="w-12 h-12 rounded-lg object-cover bg-[#F3EBE1]" />
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-xs text-[#2D1E18] truncate">{p.name}</h5>
                        <p className="text-[10px] text-[#7A685D]">${p.base_price.toFixed(2)} | Categoría: {p.category}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar producto"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {adminSubTab === 'add_product' && (
                <form onSubmit={handleCreateProduct} className="bg-white p-4 rounded-2xl border border-[#F3EBE1] space-y-3">
                  <h4 className="font-bold text-sm text-[#2D1E18]">Crear Nuevo Producto</h4>
                  
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#7A685D]">Nombre del Producto *</label>
                    <input
                      type="text"
                      placeholder="Ej. Tarta de Manzana Especial"
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      required
                      className="w-full bg-[#FAF6F0] border border-[#F3EBE1] p-2.5 rounded-xl text-xs text-[#2D1E18] focus:outline-none focus:border-[#C87D55]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#7A685D]">Precio ($) *</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="3.50"
                        value={newProdPrice}
                        onChange={(e) => setNewProdPrice(e.target.value)}
                        required
                        className="w-full bg-[#FAF6F0] border border-[#F3EBE1] p-2.5 rounded-xl text-xs text-[#2D1E18] focus:outline-none focus:border-[#C87D55]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#7A685D]">Categoría *</label>
                      <select
                        value={newProdCategory}
                        onChange={(e) => setNewProdCategory(e.target.value)}
                        className="w-full bg-[#FAF6F0] border border-[#F3EBE1] p-2.5 rounded-xl text-xs text-[#2D1E18] focus:outline-none focus:border-[#C87D55]"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#7A685D]">Descripción</label>
                    <textarea
                      placeholder="Ingredientes principales o detalle relevante..."
                      value={newProdDesc}
                      onChange={(e) => setNewProdDesc(e.target.value)}
                      rows={2}
                      className="w-full bg-[#FAF6F0] border border-[#F3EBE1] p-2.5 rounded-xl text-xs text-[#2D1E18] focus:outline-none focus:border-[#C87D55]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#7A685D]">Imagen del Producto (Subir desde PC)</label>
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#F3EBE1] hover:border-[#C87D55] p-3 rounded-xl bg-[#FAF6F0] transition-colors cursor-pointer relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      {newProdImage ? (
                        <div className="flex items-center gap-3">
                          <img src={newProdImage} alt="Vista previa" className="w-12 h-12 rounded-lg object-cover border" />
                          <span className="text-xs text-[#5C3A21] font-bold">¡Imagen seleccionada! (Haz clic para cambiar)</span>
                        </div>
                      ) : (
                        <div className="text-center space-y-1">
                          <Upload className="mx-auto text-[#7A685D]" size={20} />
                          <p className="text-xs font-semibold text-[#5C3A21]">Haz clic aquí para seleccionar imagen</p>
                          <p className="text-[10px] text-[#7A685D]">Formatos soportados: JPG, PNG, WEBP</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#5C3A21] text-white font-bold text-xs py-3 rounded-xl shadow-md active:scale-95 transition-transform"
                  >
                    GUARDAR PRODUCTO
                  </button>
                </form>
              )}

              {adminSubTab === 'add_category' && (
                <form onSubmit={handleCreateCategory} className="bg-white p-4 rounded-2xl border border-[#F3EBE1] space-y-3">
                  <h4 className="font-bold text-sm text-[#2D1E18]">Crear Nueva Categoría</h4>
                  
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#7A685D]">Nombre de Categoría *</label>
                    <input
                      type="text"
                      placeholder="Ej. Jugos Naturales, Ensaladas..."
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      required
                      className="w-full bg-[#FAF6F0] border border-[#F3EBE1] p-2.5 rounded-xl text-xs text-[#2D1E18] focus:outline-none focus:border-[#C87D55]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#7A685D]">Ícono / Emoji</label>
                    <input
                      type="text"
                      placeholder="Ej. 🧃, 🥗, 🥞..."
                      value={newCatIcon}
                      onChange={(e) => setNewCatIcon(e.target.value)}
                      className="w-full bg-[#FAF6F0] border border-[#F3EBE1] p-2.5 rounded-xl text-xs text-[#2D1E18] focus:outline-none focus:border-[#C87D55]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#5C3A21] text-white font-bold text-xs py-3 rounded-xl shadow-md active:scale-95 transition-transform"
                  >
                    GUARDAR CATEGORÍA
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      )}

      {/* MODAL DE PERSONALIZACIÓN DE PRODUCTO */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
            <div className="relative h-44 bg-[#F3EBE1]">
              <img
                src={selectedProduct.image_url}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-md"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              <div>
                <h3 className="text-lg font-bold text-[#2D1E18]">{selectedProduct.name}</h3>
                <p className="text-xs text-[#7A685D] mt-1 leading-relaxed">{selectedProduct.description}</p>
              </div>

              {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#C87D55]">
                    Elige una opción
                  </h4>
                  <div className="space-y-1.5">
                    {selectedProduct.variants.map((variant: any) => {
                      const isSelected = selectedVariant?.id === variant.id;
                      return (
                        <div
                          key={variant.id}
                          onClick={() => setSelectedVariant(variant)}
                          className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer ${
                            isSelected
                              ? 'border-[#5C3A21] bg-[#FAF6F0] font-bold text-[#5C3A21]'
                              : 'border-[#F3EBE1] text-[#2D1E18]'
                          }`}
                        >
                          <span>{variant.name}</span>
                          <span className="text-[#7A685D]">
                            {variant.price_adjustment > 0 ? `+$${variant.price_adjustment.toFixed(2)}` : 'Incluido'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedProduct.extras && selectedProduct.extras.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#C87D55]">
                    Extras (Opcional)
                  </h4>
                  <div className="space-y-1.5">
                    {selectedProduct.extras.map((extra: any) => {
                      const isChecked = selectedExtras.some((e) => e.id === extra.id);
                      return (
                        <div
                          key={extra.id}
                          onClick={() => handleExtraToggle(extra)}
                          className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer ${
                            isChecked
                              ? 'border-[#5C3A21] bg-[#FAF6F0] font-bold text-[#5C3A21]'
                              : 'border-[#F3EBE1] text-[#2D1E18]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                              isChecked ? 'bg-[#5C3A21] border-[#5C3A21] text-white' : 'border-[#7A685D]'
                            }`}>
                              {isChecked && <Check size={12} />}
                            </div>
                            <span>{extra.name}</span>
                          </div>
                          <span>+${extra.price.toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#C87D55]">
                  Notas para la cocina
                </h4>
                <input
                  type="text"
                  placeholder="Ej: Sin cebolla, extra caliente, servilletas..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#FAF6F0] border border-[#F3EBE1] p-2.5 rounded-xl text-xs text-[#2D1E18] focus:outline-none focus:border-[#C87D55]"
                />
              </div>
            </div>

            <div className="p-4 border-t border-[#F3EBE1] bg-white flex items-center gap-3">
              <div className="flex items-center border border-[#F3EBE1] rounded-xl bg-[#FAF6F0] p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-bold text-[#5C3A21] shadow-xs active:scale-95"
                >
                  -
                </button>
                <span className="w-8 text-center font-bold text-xs text-[#2D1E18]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-bold text-[#5C3A21] shadow-xs active:scale-95"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#5C3A21] text-white font-bold text-xs py-3.5 px-4 rounded-xl shadow-md active:scale-95 transition-transform flex items-center justify-between"
              >
                <span>AGREGAR AL PEDIDO</span>
                <span>${(currentUnitPrice * quantity).toFixed(2)}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BARRA FLOTANTE DEL CARRITO (CUANDO HAY ITEMS) */}
      {cart.length > 0 && !isCartOpen && (
        <div className="fixed bottom-16 left-4 right-4 z-40 max-w-md mx-auto">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-[#5C3A21] text-white p-3.5 rounded-2xl shadow-xl flex items-center justify-between active:scale-98 transition-transform"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#C87D55] flex items-center justify-center text-xs font-bold">
                {totalItemsCount}
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">Ver Mi Pedido</span>
            </div>
            <span className="text-sm font-extrabold">${cartTotal.toFixed(2)}</span>
          </button>
        </div>
      )}

      {/* MODAL/PANTALLA DE CHECKOUT Y CARRITO */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
            {/* Header del Carrito */}
            <div className="p-4 border-b border-[#F3EBE1] flex items-center justify-between bg-[#FAF6F0]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-[#5C3A21]" size={20} />
                <h3 className="font-bold text-base text-[#2D1E18]">Tu Pedido ({totalItemsCount})</h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full bg-white text-[#7A685D] flex items-center justify-center shadow-xs"
              >
                <X size={18} />
              </button>
            </div>

            {/* Contenido del Carrito */}
            <div className="p-4 overflow-y-auto space-y-4 flex-1">
              {cart.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <span className="text-3xl">🛒</span>
                  <p className="font-bold text-xs text-[#2D1E18]">Tu carrito está vacío</p>
                </div>
              ) : (
                <>
                  {/* Lista de Ítems */}
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.cartItemId} className="bg-[#FAF6F0] p-3 rounded-2xl border border-[#F3EBE1] space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-bold text-xs text-[#2D1E18]">{item.product.name}</h4>
                            {item.variant && (
                              <p className="text-[10px] text-[#7A685D]">• Opción: {item.variant.name}</p>
                            )}
                            {item.extras && item.extras.length > 0 && (
                              <p className="text-[10px] text-[#7A685D]">
                                • Extras: {item.extras.map((e: any) => e.name).join(', ')}
                              </p>
                            )}
                            {item.notes && (
                              <p className="text-[10px] text-[#C87D55] italic">Nota: "{item.notes}"</p>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemoveFromCart(item.cartItemId)}
                            className="text-red-400 hover:text-red-600 p-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-[#F3EBE1]">
                          <div className="flex items-center border border-[#F3EBE1] rounded-lg bg-white">
                            <button
                              onClick={() => handleUpdateCartQuantity(item.cartItemId, -1)}
                              className="w-6 h-6 flex items-center justify-center font-bold text-[#5C3A21] text-xs"
                            >
                              -
                            </button>
                            <span className="w-6 text-center font-bold text-xs text-[#2D1E18]">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateCartQuantity(item.cartItemId, 1)}
                              className="w-6 h-6 flex items-center justify-center font-bold text-[#5C3A21] text-xs"
                            >
                              +
                            </button>
                          </div>
                          <span className="font-extrabold text-xs text-[#5C3A21]">
                            ${item.totalPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* FORMULARIO DE DATOS DE ENTREGA */}
                  <form id="whatsapp-form" onSubmit={handleSendOrderToWhatsApp} className="space-y-3 pt-3 border-t border-[#F3EBE1]">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#C87D55]">
                      Datos de Entrega
                    </h4>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#7A685D]">Nombre Completo *</label>
                      <input
                        type="text"
                        placeholder="Ej. María López"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                        className="w-full bg-[#FAF6F0] border border-[#F3EBE1] p-2 rounded-xl text-xs focus:outline-none focus:border-[#C87D55]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#7A685D]">Teléfono *</label>
                        <input
                          type="tel"
                          placeholder="0991234567"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          required
                          className="w-full bg-[#FAF6F0] border border-[#F3EBE1] p-2 rounded-xl text-xs focus:outline-none focus:border-[#C87D55]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#7A685D]">Forma de Pago *</label>
                        <select
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-full bg-[#FAF6F0] border border-[#F3EBE1] p-2 rounded-xl text-xs focus:outline-none focus:border-[#C87D55]"
                        >
                          <option value="Efectivo">Efectivo</option>
                          <option value="Transferencia">Transferencia</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#7A685D]">Dirección de Entrega / Referencia *</label>
                      <input
                        type="text"
                        placeholder="Ej. Av. Central N12-34 y Calle 5, casa blanca"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        required
                        className="w-full bg-[#FAF6F0] border border-[#F3EBE1] p-2 rounded-xl text-xs focus:outline-none focus:border-[#C87D55]"
                      />
                    </div>
                  </form>
                </>
              )}
            </div>

            {/* Footer con Botón de WhatsApp */}
            {cart.length > 0 && (
              <div className="p-4 border-t border-[#F3EBE1] bg-white space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#2D1E18]">
                  <span>Total a Pagar:</span>
                  <span className="text-base text-[#5C3A21]">${cartTotal.toFixed(2)}</span>
                </div>
                <button
                  type="submit"
                  form="whatsapp-form"
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs py-3.5 rounded-xl shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  <span>ENVIAR PEDIDO A WHATSAPP</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* NAVEGACIÓN INFERIOR DINÁMICA */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#F3EBE1] px-4 py-2 shadow-lg">
        <div className="max-w-md mx-auto flex justify-around items-center">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-bold transition-colors ${
              activeTab === 'home' ? 'text-[#5C3A21]' : 'text-[#7A685D]'
            }`}
          >
            <Home size={20} />
            <span>INICIO</span>
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-bold transition-colors ${
              activeTab === 'menu' ? 'text-[#5C3A21]' : 'text-[#7A685D]'
            }`}
          >
            <UtensilsCrossed size={20} />
            <span>MENÚ</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-bold transition-colors ${
              activeTab === 'orders' ? 'text-[#5C3A21]' : 'text-[#7A685D]'
            }`}
          >
            <ClipboardList size={20} />
            <span>PEDIDOS</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-bold transition-colors ${
              activeTab === 'profile' ? 'text-[#5C3A21]' : 'text-[#7A685D]'
            }`}
          >
            <User size={20} />
            <span>CUENTA</span>
          </button>
        </div>
      </nav>

    </div>
  );
}