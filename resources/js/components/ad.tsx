import { useAuth } from '@/context/authContext';
import React from 'react';
import { Link } from 'react-router-dom';

const Ad: React.FC = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="w-full bg-black py-2 text-center text-sm text-white relative">
            <div className="container mx-auto flex justify-center items-center">
                <span>Sign up and get 20% off to your first order</span>
                {!isAuthenticated ? (
                    <Link to={{ pathname: '/register' }} className="font-bold underline ml-1">
                        Sign Up Now
                    </Link>
                ) : (
                    <Link to={{ pathname: '/' }} className="font-bold underline ml-1">
                        Go Now
                    </Link>
                )}
            </div>
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white" aria-label="Close">
                ×
            </button>
        </div>
    );
};

export default Ad;
