import { useAuth } from '@/context/authContext';
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import Loading from './loading';

const Guest = ({ children }: { children: ReactNode }) => {
    const { loading, isAuthenticated } = useAuth();

    if (loading) {
        return <Loading />;
    }

    return !isAuthenticated ? children : <Navigate to={{ pathname: '/' }} replace />;
};

export default Guest;
