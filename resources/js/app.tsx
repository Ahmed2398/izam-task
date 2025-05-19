import '../css/app.css';
import './bootstrap';

import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { AuthProvider } from './context/authContext.jsx';
import { CartProvider } from './context/cartContext';
import routes from './routes';

const rootElement = document.getElementById('root');

const router = createBrowserRouter(routes);

if (rootElement) {
    createRoot(rootElement).render(
        <AuthProvider>
            <CartProvider>
                <RouterProvider router={router} />
            </CartProvider>
        </AuthProvider>,
    );
} else {
    console.error('Root element not found');
}
