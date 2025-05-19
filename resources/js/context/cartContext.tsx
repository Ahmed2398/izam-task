import { App } from '@/types';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';

// Extend the Cart interface to include originalStock
interface CartItem extends App.Models.Cart {
    originalStock: number;
}

interface CartContextProps {
    cart: CartItem[];
    addToCart: (product: App.Models.Product) => void;
    minisToCart: (id: number) => void;
    findProduct: (id: number) => CartItem | undefined;
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, newQuantity: number) => void;
    clearCart: () => void;
    getSubtotal: () => number;
    getShipping: () => number;
    getTax: () => number;
    getTotal: () => number;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const useCart = (): CartContextProps => {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error('useCart must be used within an CartProvider');
    }

    return context;
};

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: App.Models.Product) => {
        // Add detailed logging
        console.log('Adding to cart - Product details:', {
            productId: product.id,
            productName: product.name,
            productStock: product.quantity,
            productInCart: findProduct(product.id)?.quantity || 0,
            entireCart: cart
        });

        // Check if product is out of stock
        if (product.quantity <= 0) {
            console.log('Product is out of stock');
            Swal.fire({
                title: 'Out of Stock',
                text: 'Sorry, this product is out of stock',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        const existingItem = findProduct(product.id);
        if (existingItem) {
            // Check if adding one more would exceed available stock
            const currentCartQuantity = existingItem.quantity;
            // Use the original stock that was saved when the item was first added
            const maxStock = existingItem.originalStock;
            
            console.log('Stock check details:', {
                currentCartQuantity,
                originalMaxStock: maxStock,
                currentProductStock: product.quantity,
                comparison: `${currentCartQuantity} >= ${maxStock}`,
                result: currentCartQuantity >= maxStock
            });
            
            // If trying to add more would exceed the available stock
            if (currentCartQuantity >= maxStock) {
                console.log('Maximum stock reached, showing alert');
                Swal.fire({
                    title: 'Maximum Stock Reached',
                    text: `Sorry, you can't add more of this item. Maximum available stock is ${maxStock}.`,
                    icon: 'warning',
                    confirmButtonText: 'OK'
                });
                return;
            }
            console.log('Adding one more to existing item');
            setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)));
        } else {
            console.log('Adding new item to cart with original stock:', product.quantity);
            // Store the original stock quantity when first adding the item
            setCart([...cart, { ...product, quantity: 1, originalStock: product.quantity }]);
        }
    };

    const findProduct = (id: number) => {
        return cart.find((item) => item.id === id);
    };

    const minisToCart = (id: number) => {
        const existingItem = findProduct(id);
        if (existingItem) {
            if (existingItem.quantity > 1) {
                setCart(cart.map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item)));
            } else {
                removeFromCart(id);
            }
        }
    };

    const removeFromCart = (id: number) => {
        setCart(cart.filter((item) => item.id !== id));
    };

    const updateQuantity = (id: number, newQuantity: number) => {
        console.log('updateQuantity called with:', { id, newQuantity });
        
        if (newQuantity <= 0) {
            console.log('Removing item from cart due to zero/negative quantity');
            removeFromCart(id);
            return;
        }
        
        // Find the item in the cart
        const cartItem = findProduct(id);
        console.log('Found cart item:', cartItem);
        
        if (!cartItem) {
            console.log('Item not found in cart');
            return;
        }
        
        // Use the original stock that was saved when the item was first added
        const maxStock = cartItem.originalStock;
        
        console.log('Stock check details:', {
            requestedQuantity: newQuantity,
            originalMaxStock: maxStock,
            currentProductStock: cartItem.quantity,
            comparison: `${newQuantity} > ${maxStock}`,
            result: newQuantity > maxStock
        });
        
        // Check if requested quantity exceeds available stock
        if (newQuantity > maxStock) {
            console.log('Maximum stock reached, showing alert');
            Swal.fire({
                title: 'Maximum Stock Reached',
                text: `Sorry, you can't add ${newQuantity} items. Maximum available stock is ${maxStock}.`,
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            // Set to maximum available quantity instead
            console.log('Setting quantity to maximum available:', maxStock);
            setCart(cart.map((item) => (item.id === id ? { ...item, quantity: maxStock } : item)));
            return;
        }
        
        console.log('Updating quantity to:', newQuantity);
        setCart(cart.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)));
    };

    const clearCart = () => {
        setCart([]);
    };

    const getSubtotal = () => {
        return cart.reduce((total, product) => {
            const quantity = product.quantity || 0;
            return total + product.price * quantity;
        }, 0);
    };

    const getShipping = () => {
        return getSubtotal() > 0 ? 10 : 0;
    };

    const getTax = () => {
        return getSubtotal() * 0.1; // 10% tax
    };

    const getTotal = () => {
        return getSubtotal() + getShipping() + getTax();
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                minisToCart,
                findProduct,
                removeFromCart,
                updateQuantity,
                clearCart,
                getSubtotal,
                getShipping,
                getTax,
                getTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};