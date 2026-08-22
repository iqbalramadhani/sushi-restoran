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
