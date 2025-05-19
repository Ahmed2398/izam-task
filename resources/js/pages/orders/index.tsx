import Breadcrumbs from '@/components/breadcrumbs';
import EmptyCard from '@/components/emptyCard';
import Link from '@/components/link';
import Loading from '@/components/loading';
import Pagination from '@/components/pagination';
import MainLayout from '@/layouts/mainLayout';
import { App } from '@/types';
import axios from 'axios';
import { useEffect, useState } from 'react';

function Orders() {
    const [loading, setLoading] = useState<boolean>(true);
    const [orders, setOrders] = useState<App.Paginate<App.Models.Order>>();

    const [page, setPage] = useState<number>(1);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/orders`, { params: { page } });
                setOrders(response.data.orders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [page]);

    const paginate = (pageNumber: number) => {
        setPage(pageNumber);
    };

    return (
        <MainLayout>
            <div className="mx-auto max-w-2xl p-5 lg:p-6 lg:max-w-7xl">
                <Breadcrumbs breadcrumbs={[{ text: 'Home', to: { pathname: '/' } }, { text: 'Orders' }]} />

                <h3 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Your Orders</h3>

                <div className="mt-8 space-y-8">
                    {loading && <div className="flex justify-center py-10"><Loading /></div>}

                    {!loading && orders?.data.length === 0 && (
                        <div className="py-10">
                            <EmptyCard title="No orders found." description="Create an order first." />
                        </div>
                    )}

                    {!loading && orders && orders.data.length > 0 && (
                        <>
                            <OrdersList orders={orders.data} />
                            <div className="mt-8">
                                <Pagination last_page={orders.last_page} page={page} paginate={paginate} />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}

export default Orders;

const OrdersList = ({ orders }: { orders: App.Models.Order[] }) => {
    return (
        <div className="mx-auto w-full">
            <div className="flex flex-col">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-start whitespace-nowrap">
                                            <span className="text-xs font-semibold tracking-wider text-gray-800 uppercase">Order ID</span>
                                        </th>

                                        <th scope="col" className="min-w-64 px-6 py-4 text-start whitespace-nowrap">
                                            <span className="text-xs font-semibold tracking-wider text-gray-800 uppercase">Total Price</span>
                                        </th>

                                        <th scope="col" className="min-w-64 px-6 py-4 text-start whitespace-nowrap">
                                            <span className="text-xs font-semibold tracking-wider text-gray-800 uppercase">Status</span>
                                        </th>

                                        <th scope="col" className="min-w-64 px-6 py-4 text-start whitespace-nowrap">
                                            <span className="text-xs font-semibold tracking-wider text-gray-800 uppercase">Actions</span>
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {orders.map((order) => (
                                        <OrderList key={order.id} order={order} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const OrderList = ({ order }: { order: App.Models.Order }) => {
    return (
        <tr className="hover:bg-gray-50 transition-colors duration-150">
            <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm font-medium text-gray-900">#{order.id}</span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm font-medium text-gray-900">${parseFloat(order.total_price).toFixed(2)}</span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize
                    ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${order.status === 'processing' ? 'bg-blue-100 text-blue-800' : ''}
                    ${order.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                    ${order.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                ">
                    {order.status}
                </span>
            </td>

            <td className="px-6 py-4 whitespace-nowrap">
                <Link 
                    to={{ pathname: `/orders/${order.id}` }}
                    className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800 hover:bg-gray-200 transition-colors duration-150"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                        <circle cx="12" cy="12" r="3"/>
                    </svg>
                    View
                </Link>
            </td>
        </tr>
    );
};
