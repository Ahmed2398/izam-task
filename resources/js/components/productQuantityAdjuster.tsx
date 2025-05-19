import { useCart } from '@/context/cartContext';
import { App } from '@/types';

function ProductQuantityAdjuster({ product }: { product: App.Models.Product }) {
    const { addToCart, findProduct, minisToCart } = useCart();

    return (
        <div className="mt-5 flex h-fit w-fit overflow-hidden rounded-md border border-gray-300 bg-gray-50 text-black shadow-sm">
            <button 
                onClick={() => minisToCart(product.id)} 
                className="cursor-pointer bg-gray-200 px-3 py-2 text-center text-lg font-medium hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-black"
            >
                −
            </button>
            <p className="inline-flex min-w-[40px] items-center justify-center px-2 font-medium text-base">
                {findProduct(product.id)?.quantity || 0}
            </p>
            <button 
                onClick={() => addToCart(product as App.Models.Product)} 
                className="cursor-pointer bg-gray-200 px-3 py-2 text-center text-lg font-medium hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-black"
            >
                +
            </button>
        </div>
    );
}

export default ProductQuantityAdjuster;
