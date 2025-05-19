import { Link } from 'react-router-dom';

function NotFound() {
    const currentYear = new Date().getFullYear();
    
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <header className="bg-white border-b border-gray-200 py-4">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        to={{ pathname: '/' }}
                        className="flex items-center"
                        aria-label="izam"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <circle cx="12" cy="12" r="4"></circle>
                        </svg>
                        <span className="text-xl font-semibold text-black">izam</span>
                    </Link>
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full text-center">
                    <div className="mb-8">
                        <svg className="mx-auto h-32 w-32 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M12 8v4"></path>
                            <path d="M12 16h.01"></path>
                        </svg>
                    </div>
                    
                    <h1 className="text-9xl font-extrabold text-black tracking-tight mb-4">404</h1>
                    
                    <div className="rounded-lg bg-white p-8 shadow-md border border-gray-100 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
                        <p className="text-gray-600 mb-6">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to={{ pathname: '/' }}
                                className="inline-flex items-center justify-center gap-x-2 rounded-md border border-transparent bg-black px-5 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-900 transition-colors duration-200"
                            >
                                <svg
                                    className="size-5 shrink-0"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="m15 18-6-6 6-6"></path>
                                </svg>
                                Back to Home
                            </Link>
                            
                            <Link
                                to={{ pathname: '/contact' }}
                                className="inline-flex items-center justify-center gap-x-2 rounded-md border border-gray-300 bg-white px-5 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors duration-200"
                            >
                                <svg className="size-5 shrink-0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                </svg>
                                Contact Support
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="bg-white border-t border-gray-200 py-6">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-sm text-gray-500">© {currentYear} izam. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default NotFound;
