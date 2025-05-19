export namespace App {
    export namespace Models {
        export interface User {
            id: number;
            name: string;
            email: string;
            email_verified_at: string;
            created_at: string;
            updated_at: string;
        }

        export interface Product {
            id: number;
            name: string;
            price: number;
            quantity: number;
            image: string;
            category: Category;
            data: {
                price: number;
                quantity: number;
            };
            created_at: string;
            updated_at: string;
        }

        export interface Cart {
            id: number;
            name: string;
            price: number;
            quantity: number;
            image: string;
            category: Category;
            created_at: string;
            updated_at: string;
        }

        export interface Category {
            id: number;
            name: string;
            created_at: string;
            updated_at: string;
        }

        export interface Order {
            id: number;
            total_price: number;
            status: OrderStatus;
            products: Product[];
            created_at: string;
            updated_at: string;
        }
    }

    export namespace Enums {
        export enum OrderStatus {
            PENDING = 'pending',
            COMPLETED = 'completed',
            CANCELLED = 'cancelled',
        }
    }

    export interface PaginateLink {
        url: string;
        label: string;
        active: boolean;
    }

    export interface Paginate<T> {
        data: T[];
        current_page: number;
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        links: PaginateLink[];
        next_page_url: string;
        path: string;
        per_page: number;
        prev_page_url: string;
        to: number;
        total: number;
    }

    export interface ApiPaginate<T> {
        data: T[];
        links: {
            first?: string;
            last?: string;
            prev?: string;
            next?: string;
        };
        meta: {
            current_page: number;
            from: number;
            last_page: number;
            links: PaginateLink[];
            path: string;
            per_page: number;
            to: number;
            total: number;
        };
    }
}
