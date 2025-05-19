interface PaginationProps {
    last_page: number;
    page: number;
    paginate: (page: number) => void;
}

function Pagination({ last_page, page, paginate }: PaginationProps) {
    const handlePaginate = (page: number, event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        paginate(page);
    };

    return (
        <div className="mt-10 mb-6 flex flex-wrap items-center justify-center md:justify-between gap-3 py-2">
            <button
                onClick={(e) => handlePaginate(page - 1, e)}
                disabled={page === 1}
                className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <svg width="18" height="18" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M12.6668 8.26286H3.3335M3.3335 8.26286L8.00016 12.9295M3.3335 8.26286L8.00016 3.59619"
                        stroke="black"
                        strokeWidth="1.67"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                <span>Previous</span>
            </button>

            <div className="flex items-center gap-2 mx-1">
                {Array.from({ length: last_page }, (_, i) => i + 1).map((number) => (
                    <button
                        key={number}
                        onClick={(e) => handlePaginate(number, e)}
                        className={`flex items-center justify-center rounded-md min-w-[36px] h-9 px-3 py-2 text-sm font-medium transition-colors ${page === number ? 'bg-black text-white shadow-sm' : 'border border-gray-300 hover:bg-gray-50'}`}
                    >
                        {number}
                    </button>
                ))}
            </div>

            <button
                onClick={(e) => handlePaginate(page + 1, e)}
                disabled={page === last_page}
                className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <span>Next</span>
                <svg width="18" height="18" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M3.96484 8.75212H13.2982M13.2982 8.75212L8.63151 4.08545M13.2982 8.75212L8.63151 13.4188"
                        stroke="black"
                        strokeWidth="1.67"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
        </div>
    );
}

export default Pagination;
