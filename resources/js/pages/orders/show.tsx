import Breadcrumbs from '@/components/breadcrumbs';
import Loading from '@/components/loading';
import MainLayout from '@/layouts/mainLayout';
import { App } from '@/types';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function ShowOrder() {
    const [loading, setLoading] = useState<boolean>(true);
    const [order, setOrder] = useState<App.Models.Order>();

    const params = useParams();

    useEffect(() => {
        const fetchOrder = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/orders/${params.id}`);
                setOrder(response.data.order);
            } catch (error) {
                console.error('Error fetching order:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [params]);

    if (loading) {
        return <Loading />;
    }

    return (
        <MainLayout>
            <div className="mx-auto max-w-2xl p-5 lg:p-6 lg:max-w-7xl">
                <Breadcrumbs
                    breadcrumbs={[{ text: 'Home', to: { pathname: '/' } }, { text: 'Orders', to: { pathname: '/orders' } }, { text: 'Order Details' }]}
                />

                {order == null ? (
                    <div className="mt-8 py-12 text-center">
                        <h1 className="text-2xl font-bold text-gray-900">Order not found</h1>
                        <p className="mt-4 text-gray-600">The order you're looking for doesn't exist or has been removed.</p>
                    </div>
                ) : (
                    <div className="mt-6">
                        <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">Order Details</h3>
                        
                        <div className="flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between gap-x-3 border-b border-gray-200 bg-gray-50 px-6 py-4">
                                <h2 className="text-lg font-semibold text-gray-900">Order #{order.id}</h2>
                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize
                                    ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                                    ${order.status === 'processing' ? 'bg-blue-100 text-blue-800' : ''}
                                    ${order.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                                    ${order.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                                `}>
                                    {order.status}
                                </span>
                            </div>

                            <div className="flex flex-col p-6">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6 mb-6 bg-gray-50 p-4 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Order placed</p>
                                        <p className="text-base font-semibold text-gray-900">{new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Total price</p>
                                        <p className="text-base font-semibold text-gray-900">${parseFloat(order.total_price).toFixed(2)}</p>
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                                
                                <div className="space-y-6">
                                    {order.products.map((product, index) => (
                                        <div key={index} className="flex flex-col md:flex-row items-start gap-5 border-b border-gray-200 pb-6 last:border-0">
                                            <div className="w-full md:w-auto">
                                                <img 
                                                    className="h-24 w-24 object-cover rounded-lg border border-gray-200" 
                                                    src={product.image} 
                                                    alt={product.name}
                                                />
                                            </div>

                                            <div className="flex flex-col flex-grow gap-3">
                                                <div>
                                                    <h4 className="text-base font-semibold text-gray-900">{product.name}</h4>
                                                    <p className="text-sm font-medium text-gray-600 mt-1">{product.category.name}</p>
                                                </div>

                                                <div className="flex flex-wrap gap-6 mt-2">
                                                    <div>
                                                        <h5 className="text-xs font-medium text-gray-500 uppercase">Quantity</h5>
                                                        <p className="text-sm font-semibold text-gray-900 mt-1">{product.data.quantity}</p>
                                                    </div>

                                                    <div>
                                                        <h5 className="text-xs font-medium text-gray-500 uppercase">Price</h5>
                                                        <p className="text-sm font-semibold text-gray-900 mt-1">${parseFloat(product.data.price).toFixed(2)}</p>
                                                    </div>
                                                    
                                                    <div>
                                                        <h5 className="text-xs font-medium text-gray-500 uppercase">Subtotal</h5>
                                                        <p className="text-sm font-semibold text-gray-900 mt-1">
                                                            ${(parseFloat(product.data.price) * product.data.quantity).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}

export default ShowOrder;
