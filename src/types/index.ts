// Type definitions untuk ARCoffee

// Kategori menu
export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
}

// Produk/menu
export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number; // Harga dasar dalam Rupiah
    image: string;
    categoryId: string;
    isAvailable: boolean;
    options: ProductOption[]; // Opsi yang tersedia untuk produk ini
}

// Opsi kustomisasi
export interface Option {
    id: string;
    group: OptionGroup; // Grup opsi (size, ice, sugar, addon)
    name: string;
    extraPrice: number; // Harga tambahan
}

// Grup opsi
export type OptionGroup = 'size' | 'ice' | 'sugar' | 'addon';

// Relasi produk-opsi
export interface ProductOption {
    productId: string;
    optionId: string;
    option: Option;
}

// Item dalam keranjang
export interface CartItem {
    id: string; // Unique ID untuk cart item
    product: Product;
    quantity: number;
    selectedOptions: Option[]; // Opsi yang dipilih
    notes?: string; // Catatan tambahan
    subtotal: number; // Harga total item (price + options) * quantity
}

// Order/Pesanan
export interface Order {
    id: string;
    items: CartItem[];
    totalPrice: number;
    status: OrderStatus;
    customerName: string;
    customerPhone: string;
    notes?: string;
    createdAt: string; // ISO string dari localStorage
    updatedAt?: string; // ISO string dari localStorage
}

// Status pesanan
export type OrderStatus = 'pending' | 'processing' | 'ready' | 'completed' | 'cancelled';

// Untuk navigasi
export interface NavItem {
    label: string;
    href: string;
    icon?: React.ReactNode;
}
