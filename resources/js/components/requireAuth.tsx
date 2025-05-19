import { useAuth } from '@/context/authContext';
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import Loading from './loading';

const RequireAuth = ({ children }: { children: ReactNode }) => {
    const { loading, isAuthenticated } = useAuth();

    if (loading) {
        return <Loading />;
    }

    return isAuthenticated ? children : <Navigate to={{ pathname: '/login' }} replace />;
};

export default RequireAuth;
