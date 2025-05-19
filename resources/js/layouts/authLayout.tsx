import { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from './mainLayout';

function AuthLayout({ children, title, description }: PropsWithChildren<{ title: string; description: string }>) {
    return (
        <MainLayout>
            <div className="flex min-h-svh flex-col items-center justify-center rounded-md">
                <div className="flex w-full max-w-md flex-col gap-6 rounded-md bg-white p-6 shadow md:p-8">
                    <Link to={{ pathname: '/' }} className="flex flex-col items-center gap-2 self-center">
                        <h3 className="flex text-2xl font-bold text-gray-900">{title}</h3>
                        <p className="text-base text-gray-600">{description}</p>
                    </Link>

                    <div className="flex flex-col gap-6">{children}</div>
                </div>
            </div>
        </MainLayout>
    );
}

export default AuthLayout;
