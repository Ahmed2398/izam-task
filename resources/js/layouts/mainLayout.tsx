import Ad from '@/components/ad';
import Header from '@/components/header';
import { PropsWithChildren } from 'react';

function MainLayout({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Ad />
            <Header />
            {children}
        </div>
    );
}

export default MainLayout;
