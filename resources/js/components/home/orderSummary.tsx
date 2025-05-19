import { useCart } from '@/context/cartContext';
import { App } from '@/types';
import EmptyCard from '../emptyCard';
import Link from '../link';
import ProductQuantityAdjuster from '../productQuantityAdjuster';

const OrderSummary = () => {
    const { cart, removeFromCart, getSubtotal, getShipping, getTax, getTotal } = useCart();

    return (
        <div className="-order-1 md:order-2">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
                    {cart.length > 0 && (
                        <div className="ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-black text-xs font-medium text-white shadow-sm transition-all duration-200 ease-in-out">
                            {cart.length}
                        </div>
                    )}
                </div>

                {cart.length === 0 && <EmptyCard title="Your cart is empty" description="Add items to it now." />}

                {cart.length > 0 && (
                    <div className="mb-6 space-y-4 divide-y divide-gray-100">
                        {cart.map((product) => (
                            <div key={product.id} className="flex items-start gap-4 pt-4 first:pt-0">
                                {/* Product Image */}
                                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                                    <img 
                                        src={product.image} 
                                        alt={product.name} 
                                        className="h-full w-full object-cover object-center" 
                                    />
                                </div>
                                
                                {/* Product Details */}
                                <div className="flex flex-1 flex-col">
                                    <div className="flex justify-between">
                                        <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</h4>
                                        <button 
                                            onClick={() => removeFromCart(product.id)}
                                            className="ml-2 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-500"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path 
                                                    d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" 
                                                    fill="currentColor"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                    
                                    <div className="mt-1 flex items-end justify-between">
                                       
                                        <p className="text-sm font-medium text-gray-900">${product.price.toFixed(2)}</p>
                                    </div>
                                    <div className="mx-0 my-2">
                                            <ProductQuantityAdjuster  product={product as App.Models.Product} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Order Summary Details */}
                <div className="mt-6 space-y-4">
                    <div className="space-y-2 rounded-md bg-gray-50 p-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">Subtotal</div>
                            <div className="text-sm font-medium text-gray-900">${getSubtotal().toFixed(2)}</div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">Shipping</div>
                            <div className="text-sm font-medium text-gray-900">${getShipping().toFixed(2)}</div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">Tax</div>
                            <div className="text-sm font-medium text-gray-900">${getTax().toFixed(2)}</div>
                        </div>
                        
                        <div className="my-2 border-t border-gray-200"></div>

                        <div className="flex items-center justify-between">
                            <div className="text-base font-semibold text-gray-900">Total</div>
                            <div className="text-base font-semibold text-gray-900">${getTotal().toFixed(2)}</div>
                        </div>
                    </div>
                    
                    {/* Checkout Button */}
                    <Link 
                        to={{ pathname: '/cart' }} 
                        className="mt-4 flex w-full items-center justify-center rounded-md bg-black px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                    >
                        Proceed to Checkout
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;
