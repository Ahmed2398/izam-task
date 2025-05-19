import { App } from '@/types';
import ProductQuantityAdjuster from '../productQuantityAdjuster';

interface ProductModalProps {
    showingProduct: App.Models.Product | null;
    setShowingProduct: (product: App.Models.Product | null) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ showingProduct, setShowingProduct }) => {
    return (
        <>
            {/* Backdrop overlay */}
            <div
                className={`fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${showingProduct ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
                onClick={() => setShowingProduct(null)}
            />

            {/* Modal container */}
            <div
                className={`fixed top-0 right-0 z-[101] h-full w-[350px] transform bg-white shadow-xl transition-transform duration-300 ease-in-out ${
                    showingProduct ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {showingProduct && (
                    <>
                        {/* Modal header */}
                        <div className="sticky top-0 z-10 flex items-center justify-between bg-white px-6 py-5 shadow-sm">
                            <h2 className="text-xl font-bold tracking-tight text-gray-900">{showingProduct.name}</h2>
                            <button 
                                onClick={() => setShowingProduct(null)} 
                                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                                aria-label="Close product details"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="h-5 w-5"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal content */}
                        <div className="h-[calc(100%-72px)] overflow-y-auto">
                            {/* Product image with aspect ratio container */}
                            <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
                                <img 
                                    src={showingProduct.image} 
                                    alt={showingProduct.name} 
                                    className="h-full w-full object-cover" 
                                />
                            </div>
                            
                            {/* Product details */}
                            <div className="px-6 py-5">
                                <div className="mb-6 flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-gray-900">{showingProduct.name}</h3>
                                    <div className="rounded-full bg-gray-100 px-3 py-1 text-center text-xs font-medium text-gray-700">
                                        {showingProduct.category.name}
                                    </div>
                                </div>
                                
                                {/* Price */}
                                <div className="mb-8">
                                    <p className="text-2xl font-bold text-gray-900">${Number(showingProduct.price).toFixed(2)}</p>
                                </div>

                                {/* Product details section */}
                                <div className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-4">
                                    <h4 className="mb-3 font-semibold text-gray-900">Product Details</h4>

                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                                            <h5 className="font-medium text-gray-700">Category:</h5>
                                            <span className="text-gray-900">{showingProduct.category.name}</span>
                                        </div>

                                        <div className="flex items-center justify-between pb-2">
                                            <h5 className="font-medium text-gray-700">Stock:</h5>
                                            <span className={`font-medium ${showingProduct.quantity > 10 ? 'text-green-600' : showingProduct.quantity > 0 ? 'text-amber-600' : 'text-red-600'}`}>
                                                {showingProduct.quantity} {showingProduct.quantity === 1 ? 'item' : 'items'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Quantity adjuster */}
                                <div className="mt-6">
                                    <h4 className="mb-3 font-semibold text-gray-900">Quantity</h4>
                                    <ProductQuantityAdjuster 
                                        product={showingProduct} 
                                        style={{ 
                                            wrapper: "flex w-full items-center justify-between rounded-lg border border-gray-300 p-2",
                                            button: "flex h-8 w-8 items-center justify-center rounded bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200",
                                            input: "w-16 border-0 text-center text-lg font-medium focus:ring-0"
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default ProductModal;
