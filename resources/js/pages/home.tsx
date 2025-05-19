import Breadcrumbs from '@/components/breadcrumbs';
import EmptyCard from '@/components/emptyCard';
import Filter from '@/components/home/filter';
import OrderSummary from '@/components/home/orderSummary';
import ProductModal from '@/components/home/productModal';
import SearchBar from '@/components/home/searchBar';
import Loading from '@/components/loading';
import Pagination from '@/components/pagination';
import Product from '@/components/product';
import MainLayout from '@/layouts/mainLayout';
import { App } from '@/types';
import axios from 'axios';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const Home: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [products, setProducts] = useState<App.Paginate<App.Models.Product>>();
    const [categories, setCategories] = useState<App.Models.Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
    const [params, setParams] = useSearchParams({
        min_price: '0',
        max_price: '1000',
    });
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [showingProduct, setShowingProduct] = useState<App.Models.Product | null>(null);

    const changeParam = useCallback(
        (key: string, value: string) => {
            const newParams = new URLSearchParams(params);
            if (value !== '') {
                newParams.set(key, value);
            } else {
                newParams.delete(key);
            }
            setParams(newParams);
        },
        [params, setParams],
    );

    const paginate = (pageNumber: number) => {
        changeParam('page', String(pageNumber));
    };

    const handleSearch = (value: string) => {
        changeParam('page', '1');
        changeParam('search', value);
    };

    const handleSleetedCategories = (value: App.Models.Category) => {
        const categories = params.get('categories')?.split(',') ?? [];

        const categorySelection = categories.includes(String(value.id))
            ? categories.filter((id) => id !== String(value.id)).join(',')
            : [...categories, String(value.id)].join(',');

        changeParam('page', '1');

        if (categorySelection.length === 0) {
            changeParam('categories', '');
        } else {
            changeParam('categories', categorySelection);
        }
    };

    const handleMaxPrice = (max: number) => {
        const min = Number(params.get('min_price') ?? 0);
        if (max >= min) {
            changeParam('max_price', String(max));
        }
    };

    const handleMinPrice = (min: number) => {
        const max = Number(params.get('max_price') ?? 1000);
        if (min <= max) {
            changeParam('min_price', String(min));
        }
    };

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/products', {
                params: params,
            });
            setProducts(response.data.products);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    }, [params]);

    const debouncedFetchProducts = useMemo(() => {
        return debounce(fetchProducts, 500);
    }, [fetchProducts]);

    useEffect(() => {
        debouncedFetchProducts();
        return () => {
            debouncedFetchProducts.cancel();
        };
    }, [debouncedFetchProducts]);

    useEffect(() => {
        const fetchCategories = async () => {
            setLoadingCategories(true);
            try {
                const response = await axios.get('/api/categories');
                setCategories(response.data.categories);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);

    const clearFilters = () => {
        changeParam('page', '1');
        changeParam('search', '');
        changeParam('min_price', '0');
        changeParam('max_price', '1000');
        changeParam('categories', '');
        setIsFilterOpen(false);
    };

    return (
        <MainLayout>
            <button
                onClick={() => setIsFilterOpen(true)}
                className="fixed top-40 hidden size-[70px] cursor-pointer items-center justify-center rounded-md bg-white md:inline-flex"
            >
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M32.5832 27.6322C32.5832 27.9223 32.4679 28.2005 32.2628 28.4056C32.0577 28.6108 31.7795 28.726 31.4894 28.726H24.0519C23.8083 29.6344 23.2718 30.437 22.5257 31.0094C21.7795 31.5818 20.8653 31.8921 19.9248 31.8921C18.9844 31.8921 18.0702 31.5818 17.324 31.0094C16.5778 30.437 16.0414 29.6344 15.7978 28.726H4.51025C4.22017 28.726 3.94197 28.6108 3.73686 28.4056C3.53174 28.2005 3.4165 27.9223 3.4165 27.6322C3.4165 27.3422 3.53174 27.064 3.73686 26.8588C3.94197 26.6537 4.22017 26.5385 4.51025 26.5385H15.7978C16.0414 25.6301 16.5778 24.8275 17.324 24.2551C18.0702 23.6826 18.9844 23.3724 19.9248 23.3724C20.8653 23.3724 21.7795 23.6826 22.5257 24.2551C23.2718 24.8275 23.8083 25.6301 24.0519 26.5385H31.4894C31.7795 26.5385 32.0577 26.6537 32.2628 26.8588C32.4679 27.064 32.5832 27.3422 32.5832 27.6322ZM32.5832 8.36766C32.5832 8.65774 32.4679 8.93594 32.2628 9.14106C32.0577 9.34617 31.7795 9.46141 31.4894 9.46141H27.9165C27.6729 10.3698 27.1364 11.1724 26.3902 11.7448C25.6441 12.3173 24.7299 12.6275 23.7894 12.6275C22.849 12.6275 21.9348 12.3173 21.1886 11.7448C20.4424 11.1724 19.9059 10.3698 19.6623 9.46141H4.51025C4.36662 9.46141 4.22439 9.43312 4.09169 9.37815C3.95899 9.32318 3.83842 9.24262 3.73686 9.14106C3.63529 9.03949 3.55473 8.91892 3.49976 8.78622C3.44479 8.65352 3.4165 8.51129 3.4165 8.36766C3.4165 8.22402 3.44479 8.0818 3.49976 7.9491C3.55473 7.8164 3.63529 7.69582 3.73686 7.59426C3.83842 7.4927 3.95899 7.41213 4.09169 7.35716C4.22439 7.3022 4.36662 7.27391 4.51025 7.27391H19.6623C19.9059 6.36555 20.4424 5.56293 21.1886 4.99049C21.9348 4.41806 22.849 4.10779 23.7894 4.10779C24.7299 4.10779 25.6441 4.41806 26.3902 4.99049C27.1364 5.56293 27.6729 6.36555 27.9165 7.27391H31.4894C31.6336 7.27195 31.7767 7.2989 31.9103 7.35317C32.0439 7.40744 32.1652 7.48793 32.2672 7.58989C32.3691 7.69185 32.4496 7.8132 32.5039 7.94679C32.5582 8.08037 32.5851 8.22348 32.5832 8.36766ZM32.5832 17.9927C32.5851 18.1368 32.5582 18.2799 32.5039 18.4135C32.4496 18.5471 32.3691 18.6685 32.2672 18.7704C32.1652 18.8724 32.0439 18.9529 31.9103 19.0071C31.7767 19.0614 31.6336 19.0884 31.4894 19.0864H14.4269C14.1833 19.9948 13.6468 20.7974 12.9007 21.3698C12.1545 21.9423 11.2403 22.2525 10.2998 22.2525C9.35938 22.2525 8.44519 21.9423 7.69901 21.3698C6.95284 20.7974 6.41636 19.9948 6.17275 19.0864H4.51025C4.22017 19.0864 3.94197 18.9712 3.73686 18.7661C3.53174 18.5609 3.4165 18.2827 3.4165 17.9927C3.4165 17.7026 3.53174 17.4244 3.73686 17.2193C3.94197 17.0141 4.22017 16.8989 4.51025 16.8989H6.17275C6.41636 15.9905 6.95284 15.1879 7.69901 14.6155C8.44519 14.0431 9.35938 13.7328 10.2998 13.7328C11.2403 13.7328 12.1545 14.0431 12.9007 14.6155C13.6468 15.1879 14.1833 15.9905 14.4269 16.8989H31.4894C31.7795 16.8989 32.0577 17.0141 32.2628 17.2193C32.4679 17.4244 32.5832 17.7026 32.5832 17.9927Z"
                        fill="black"
                    />
                </svg>
            </button>

            <Filter
                loadingCategories={loadingCategories}
                categories={categories}
                params={params}
                handleMaxPrice={handleMaxPrice}
                handleMinPrice={handleMinPrice}
                setParams={setParams}
                handleSleetedCategories={handleSleetedCategories}
                isFilterOpen={isFilterOpen}
                setIsFilterOpen={setIsFilterOpen}
                clearFilters={clearFilters}
            />

            <ProductModal showingProduct={showingProduct} setShowingProduct={setShowingProduct} />

            <div className="mx-auto max-w-2xl p-4 lg:max-w-7xl">
                <Breadcrumbs breadcrumbs={[{ text: 'Home' }]} />

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
                    <div className="rounded-xl border border-gray-200 bg-white p-4 md:col-span-3">
                        <SearchBar search={params.get('search') ?? ''} handleSearch={handleSearch} handleFilter={() => setIsFilterOpen(true)} />

                        <h3 className="mt-6 text-3xl font-bold">Casual</h3>
                        <p className="mt-6 text-sm text-gray-400">
                            Showing {products?.from || 0} to {products?.to || 0} of {products?.total || 0} Products
                        </p>

                        {loading && <Loading />}
                        <div className="mt-6 grid grid-cols-1 gap-4 md:col-span-3 md:grid-cols-3">
                            {!loading &&
                                products?.data.map((product) => (
                                    <Product key={product.id} product={product} onClick={() => setShowingProduct(product)} />
                                ))}
                        </div>

                        {products?.data.length === 0 && <EmptyCard title="No products found." description="Try searching for something else." />}

                        {products && products.data.length > 0 && (
                            <Pagination last_page={products.last_page} page={Number(params.get('page') ?? 1)} paginate={paginate} />
                        )}
                    </div>

                    <OrderSummary />
                </div>
            </div>
        </MainLayout>
    );
};

export default Home;
