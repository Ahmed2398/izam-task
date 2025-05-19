import { App } from '@/types';
import Button from '../button';
import Label from '../label';
import Loading from '../loading';

interface FilterProps {
    loadingCategories: boolean;
    categories: App.Models.Category[];
    params: URLSearchParams;
    setParams: (params: URLSearchParams | ((prev: URLSearchParams) => URLSearchParams)) => void;
    handleMaxPrice: (value: number) => void;
    handleMinPrice: (value: number) => void;
    isFilterOpen: boolean;
    setIsFilterOpen: (value: boolean) => void;
    clearFilters: () => void;
    handleSleetedCategories: (value: App.Models.Category) => void;
}

const Filter: React.FC<FilterProps> = ({
    loadingCategories,
    categories,
    params,
    handleMaxPrice,
    handleMinPrice,
    isFilterOpen,
    setIsFilterOpen,
    clearFilters,
    handleSleetedCategories,
}) => {
    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isFilterOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
                onClick={() => setIsFilterOpen(false)}
            />
            
            {/* Filter Sidebar */}
            <div
                className={`fixed top-0 left-0 z-[101] h-full w-[320px] transform overflow-auto bg-white shadow-xl transition-transform duration-300 ease-in-out ${
                    isFilterOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 border-b border-gray-100 bg-white px-6 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
                            <button 
                                onClick={clearFilters} 
                                className="hidden text-sm font-medium text-gray-500 hover:text-gray-700 md:block"
                            >
                                Reset
                            </button>
                        </div>
                        <button 
                            onClick={() => setIsFilterOpen(false)} 
                            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Filter Content */}
                <div className="px-6 py-6">
                    <div className="space-y-8">
                        {/* Price Range Section */}
                        <div className="pb-6">
                            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900">Price Range</h3>
                            <div className="px-2">
                                {/* Slider Track */}
                                <div className="relative h-2 w-full rounded-full bg-gray-200">
                                    {/* Active Track */}
                                    <div
                                        className="absolute h-2 rounded-full bg-black"
                                        style={{
                                            left: `${(Number(params.get('min_price') ?? 0) / 1000) * 100}%`,
                                            right: `${100 - (Number(params.get('max_price') ?? 1000) / 1000) * 100}%`,
                                        }}
                                    />
                                    {/* Min Slider */}
                                    <input
                                        type="range"
                                        min="0"
                                        max="1000"
                                        value={params.get('min_price') ?? 0}
                                        onChange={(e) => handleMinPrice(Number(e.target.value))}
                                        className="pointer-events-none absolute h-2 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:shadow-md"
                                    />
                                    {/* Max Slider */}
                                    <input
                                        type="range"
                                        min="0"
                                        max="1000"
                                        value={params.get('max_price') ?? 1000}
                                        onChange={(e) => handleMaxPrice(Number(e.target.value))}
                                        className="pointer-events-none absolute h-2 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:shadow-md"
                                    />
                                </div>
                                {/* Price Display */}
                                <div className="mt-6 flex items-center justify-between">
                                    <div className="rounded-md border border-gray-200 px-3 py-1.5">
                                        <span className="text-xs font-medium text-gray-500">$</span>
                                        <span className="ml-1 text-sm font-medium">{params.get('min_price') ?? 0}</span>
                                    </div>
                                    <div className="rounded-md border border-gray-200 px-3 py-1.5">
                                        <span className="text-xs font-medium text-gray-500">$</span>
                                        <span className="ml-1 text-sm font-medium">{params.get('max_price') ?? 1000}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Categories Section */}
                        {loadingCategories ? (
                            <div className="flex justify-center py-4">
                                <Loading />
                            </div>
                        ) : (
                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900">Categories</h3>
                                <div className="space-y-3 pl-1">
                                    {categories.map((category) => (
                                        <div key={category.id} className="flex items-center gap-3">
                                            <input
                                                checked={(params.get('categories') ?? '').split(',').includes(String(category.id))}
                                                type="checkbox"
                                                id={`cat-${category.id}`}
                                                className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                                                onChange={() => handleSleetedCategories(category)}
                                            />
                                            <Label 
                                                htmlFor={`cat-${category.id}`} 
                                                className="text-sm font-medium text-gray-700 hover:text-gray-900"
                                            >
                                                {category.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 border-t border-gray-100 bg-white px-6 py-4">
                    <Button 
                        onClick={() => setIsFilterOpen(false)} 
                        className="w-full rounded-md py-2.5 text-sm font-medium" 
                        size={'lg'}
                    >
                        Apply Filters
                    </Button>

                    <button 
                        onClick={clearFilters} 
                        className="mt-3 w-full cursor-pointer text-center text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                        Clear all filters
                    </button>
                </div>
            </div>
        </>
    );
};

export default Filter;
