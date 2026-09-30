export interface Category {
  id: string;
  name: string;
  slug: string;
  icon_name?: string;
  image_url?: string;
  order_index: number;
  is_active: boolean;
}

export interface ProductExtra {
  id: string;
  name: string;
  price: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  price_adjustment: number;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  base_price: number;
  has_variants: boolean;
  is_available: boolean;
  is_featured: boolean;
  image_url?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  basePrice: number;
  selectedVariant?: ProductVariant;
  selectedExtras: ProductExtra[];
  notes?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  image_url?: string;
}