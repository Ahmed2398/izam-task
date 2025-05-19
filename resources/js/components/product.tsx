import { useCart } from '@/context/cartContext';
import { App } from '@/types';
import ProductQuantityAdjuster from './productQuantityAdjuster';

interface ProductProps {
    product: App.Models.Product;
    onClick: () => void;
}

function Product({ product, onClick }: ProductProps) {
    const { findProduct } = useCart();

    return (
        <div key={product.id} className="rounded-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md">
            <div className="relative">
                {(findProduct(product.id)?.quantity ?? 0) !== 0 && (
                    <div className="absolute end-3 bottom-3 inline-flex size-9 items-center justify-center rounded-full bg-blue-500 text-white font-medium shadow-sm">
                        {findProduct(product.id)?.quantity || 0}
                    </div>
                )}
                <img src={product.image} alt={product.name} className="w-full object-cover aspect-square" />
            </div>
            <div className='p-4'>
                <button onClick={onClick} className="mt-2 flex w-full cursor-pointer items-center justify-between gap-3">
                    <h4 className="text-lg font-bold line-clamp-1">{product.name}</h4>
                    <div className="w-fit rounded-md bg-gray-100 px-2.5 py-1.5 text-center text-sm font-medium">
                        {product.category.name}
                    </div>
                </button>
                <div className="mt-4 flex items-center justify-between">
                    <p className="text-lg font-bold text-black">${parseFloat(product.price).toFixed(2)}</p>
                    <p className="text-sm font-medium text-gray-600">Stock: {product.quantity}</p>
                </div>
                <ProductQuantityAdjuster product={product as App.Models.Product} />
            </div>
        </div>
    );
}

export default Product;
