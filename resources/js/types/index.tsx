export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'staff';
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface AuthProps {
    user: User;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    has_products: boolean;
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: number;
    category_id: number;
    name: string;
    slug: string;
    price: number;
    description: string | null;
    is_available: boolean;
    category?: Category;
    ingredients?: ProductIngredient[];
    created_at: string;
    updated_at: string;
}

export interface Table {
    id: number;
    name: string;
    capacity: number;
    seat_count: number;
    status: 'available' | 'occupied';
    created_at: string;
    updated_at: string;
}

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    price: number;
    product?: Product;
}

export interface Unit {
    id: number;
    name: string;
    slug: string;
    created_at: string;
    updated_at: string;
}

export interface Ingredient {
    id: number;
    name: string;
    slug: string;
    unit: string;
    stock: number;
    min_stock: number;
    created_at: string;
    updated_at: string;
}

export interface ProductLowStock {
    product_id: number;
    product_name: string;
    ingredient_id: number;
    ingredient_name: string;
    stock: number;
    min_stock: number;
    unit: string;
    recipe_qty: number;
}

export interface ProductIngredientPivot {
    id: number;
    product_id: number;
    ingredient_id: number;
    quantity: number;
    unit: string;
    created_at: string;
    updated_at: string;
}

export interface ProductIngredient {
    id: number;
    name: string;
    slug: string;
    unit: string;
    stock: number;
    min_stock: number;
    created_at: string;
    updated_at: string;
    pivot: ProductIngredientPivot;
}

export interface Order {
    id: number;
    table_id: number;
    total: number;
    status: 'pending' | 'processed' | 'completed' | 'cancelled';
    table?: Table;
    items?: OrderItem[];
    created_at: string;
    updated_at: string;
}

export interface DashboardStats {
    revenue_today: number;
    total_orders_today: number;
    available_tables: number;
    pending_orders: number;
}
