import Guest from './components/guest';
import RequireAuth from './components/requireAuth';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import Cart from './pages/cart';
import Home from './pages/home';
import NotFound from './pages/notFound';
import Orders from './pages/orders';
import ShowOrder from './pages/orders/show';

const routes = [
    {
        path: '/',
        element: <Home />,
    },
    {
        path: '/login',
        element: (
            <Guest>
                <Login />
            </Guest>
        ),
    },
    {
        path: '/register',
        element: (
            <Guest>
                <Register />
            </Guest>
        ),
    },
    {
        path: '/cart',
        element: <Cart />,
    },
    {
        path: '/orders',
        element: (
            <RequireAuth>
                <Orders />
            </RequireAuth>
        ),
    },
    {
        path: '/orders/:id',
        element: (
            <RequireAuth>
                <ShowOrder />
            </RequireAuth>
        ),
    },
    {
        path: '*',
        element: <NotFound />,
    },
];

export default routes;
