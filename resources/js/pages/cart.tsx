import Breadcrumbs from '@/components/breadcrumbs';
import Button from '@/components/button';
import EmptyCard from '@/components/emptyCard';
import ProductQuantityAdjuster from '@/components/productQuantityAdjuster';
import { useAuth } from '@/context/authContext';
import { useCart } from '@/context/cartContext';
import MainLayout from '@/layouts/mainLayout';
import { App } from '@/types';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Cart: React.FC = () => {
    const { cart, clearCart } = useCart();

    const { isAuthenticated } = useAuth();

    const [loading, setLoading] = useState<boolean>(false);

    const navigator = useNavigate();

    const checkout = async () => {
        if (cart.length === 0) {
            Swal.fire({
                title: 'Empty Cart',
                text: 'Your cart is empty',
                icon: 'info',
                confirmButtonText: 'OK'
            });

            return navigator('/');
        }

        if (isAuthenticated === false) {
            Swal.fire({
                title: 'Authentication Required',
                text: 'You must be logged in to checkout',
                icon: 'warning',
                confirmButtonText: 'OK'
            });

            return navigator('/login');
        }

        const products = cart.map((item) => ({
            id: item.id,
            quantity: item.quantity,
        }));

        try {
            setLoading(true);

            const response = await axios.post('/api/orders', { products });

            if (response.status === 204) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Order placed successfully',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            }

            clearCart();

            navigator('/orders');
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="mx-auto max-w-2xl p-4 lg:max-w-7xl">
                <Breadcrumbs breadcrumbs={[{ text: 'Home', to: { pathname: '/' } }, { text: 'Card' }]} />

                <h3 className="text-[40px] font-bold">Your cart</h3>

                <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-5">
                    <div className="col-span-1 rounded-[20px] border border-gray-200 bg-white p-2 md:col-span-3">
                        {cart.length === 0 && <EmptyCard title="Your cart is empty" description="Add items to it now." />}

                        {cart.length > 0 && <CartView />}
                    </div>

                    <OrderSummary loading={loading} checkout={checkout} />
                </div>
            </div>
        </MainLayout>
    );
};

const CartView = () => {
    const { cart, findProduct, removeFromCart } = useCart();

    return (
        <div className="grid gap-4 p-1 md:p-4">
            {cart.map((product) => (
                <div key={product.id} className="flex w-full flex-row gap-2 rounded-lg border border-gray-200 p-4">
                    <div className="relative">
                        {(findProduct(product.id)?.quantity ?? 0) !== 0 && (
                            <div className="absolute end-2 bottom-2 inline-flex size-8 items-center justify-center rounded-full bg-blue-500 text-white">
                                {findProduct(product.id)?.quantity || 0}
                            </div>
                        )}
                        <img src={product.image} alt={product.name} className="h-full w-60" />
                    </div>

                    <div className="w-full">
                        <div className="flex w-full items-center justify-between">
                            <div className="mt-3 flex flex-col justify-between gap-2 md:flex-row md:items-center">
                                <h4 className="text-base font-medium">{product.name}</h4>
                                <div className="w-fit rounded bg-gray-100 p-1 text-center text-xs font-normal text-gray-600">
                                    {product.category.name}
                                </div>
                            </div>

                            <button onClick={() => removeFromCart(product.id)}>
                                <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M17.25 3H13.5V2.25C13.5 1.65326 13.2629 1.08097 12.841 0.65901C12.419 0.237053 11.8467 0 11.25 0H6.75C6.15326 0 5.58097 0.237053 5.15901 0.65901C4.73705 1.08097 4.5 1.65326 4.5 2.25V3H0.75C0.551088 3 0.360322 3.07902 0.21967 3.21967C0.0790178 3.36032 0 3.55109 0 3.75C0 3.94891 0.0790178 4.13968 0.21967 4.28033C0.360322 4.42098 0.551088 4.5 0.75 4.5H1.5V18C1.5 18.3978 1.65804 18.7794 1.93934 19.0607C2.22064 19.342 2.60218 19.5 3 19.5H15C15.3978 19.5 15.7794 19.342 16.0607 19.0607C16.342 18.7794 16.5 18.3978 16.5 18V4.5H17.25C17.4489 4.5 17.6397 4.42098 17.7803 4.28033C17.921 4.13968 18 3.94891 18 3.75C18 3.55109 17.921 3.36032 17.7803 3.21967C17.6397 3.07902 17.4489 3 17.25 3ZM7.5 14.25C7.5 14.4489 7.42098 14.6397 7.28033 14.7803C7.13968 14.921 6.94891 15 6.75 15C6.55109 15 6.36032 14.921 6.21967 14.7803C6.07902 14.6397 6 14.4489 6 14.25V8.25C6 8.05109 6.07902 7.86032 6.21967 7.71967C6.36032 7.57902 6.55109 7.5 6.75 7.5C6.94891 7.5 7.13968 7.57902 7.28033 7.71967C7.42098 7.86032 7.5 8.05109 7.5 8.25V14.25ZM12 14.25C12 14.4489 11.921 14.6397 11.7803 14.7803C11.6397 14.921 11.4489 15 11.25 15C11.0511 15 10.8603 14.921 10.7197 14.7803C10.579 14.6397 10.5 14.4489 10.5 14.25V8.25C10.5 8.05109 10.579 7.86032 10.7197 7.71967C10.8603 7.57902 11.0511 7.5 11.25 7.5C11.4489 7.5 11.6397 7.57902 11.7803 7.71967C11.921 7.86032 12 8.05109 12 8.25V14.25ZM12 3H6V2.25C6 2.05109 6.07902 1.86032 6.21967 1.71967C6.36032 1.57902 6.55109 1.5 6.75 1.5H11.25C11.4489 1.5 11.6397 1.57902 11.7803 1.71967C11.921 1.86032 12 2.05109 12 2.25V3Z"
                                        fill="#FF3333"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="mt-3 flex flex-row items-center justify-between md:flex-col md:items-start">
                            <p className="text-base font-bold text-black">${product.price}</p>
                            <p className="text-sm text-gray-500">Stock: {product.quantity}</p>
                        </div>

                        <ProductQuantityAdjuster product={product as App.Models.Product} />
                    </div>
                </div>
            ))}
        </div>
    );
};

const OrderSummary = ({ loading, checkout }: { loading: boolean; checkout: () => void }) => {
    const { cart, getSubtotal, getShipping, getTax, getTotal } = useCart();

    const date = new Date();
    const formattedDate = new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(date);

    return (
        <div className="col-span-2">
            <div className="rounded-[20px] border border-gray-200 bg-white p-4">
                <div className="flex items-center justify-between">
                    <h4 className="text-xl font-bold">Order Summary</h4>
                    <span className="text-base text-blue-500">{formattedDate}</span>
                </div>

                <div>
                    <div className="space-y-2 py-2">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">Subtotal</div>
                            <div className="text-sm text-black">${getSubtotal().toFixed(2)}</div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">Shipping</div>
                            <div className="text-sm text-black">${getShipping().toFixed(2)}</div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">Tax</div>
                            <div className="text-sm text-black">${getTax().toFixed(2)}</div>
                        </div>
                    </div>

                    <div className="py-2"></div>

                    <div className="flex items-center justify-between">
                        <div className="text-lg font-bold">Total</div>
                        <div className="text-lg font-bold">${getTotal().toFixed(2)}</div>
                    </div>
                </div>

                <Button className="mt-2.5 w-full" onClick={checkout} disabled={cart.length === 0 || loading}>
                    Checkout
                </Button>
            </div>
        </div>
    );
};

export default Cart;