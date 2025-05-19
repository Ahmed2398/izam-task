import { Link, To } from 'react-router-dom';

type Breadcrumb = {
    text: string;
    to?: To;
};

type BreadcrumbsProps = {
    breadcrumbs: Breadcrumb[];
};

export default function Breadcrumbs({ breadcrumbs }: BreadcrumbsProps) {
    return (
        <ol className="mb-12 mt-4 flex items-center whitespace-nowrap px-1 py-2">
            {breadcrumbs.map((breadcrumb, index) => (
                <li key={index} className="flex items-center truncate" aria-current="page">
                    {breadcrumb.to ? (
                        <Link 
                            to={breadcrumb.to} 
                            className={`font-medium tracking-wide transition-colors duration-200 hover:opacity-80 ${index === breadcrumbs.length - 1 ? 'text-base text-gray-900 font-semibold' : 'text-sm text-gray-500'}`}
                        >
                            {breadcrumb.text}
                        </Link>
                    ) : (
                        <span className={`font-medium tracking-wide ${index === breadcrumbs.length - 1 ? 'text-base text-gray-900 font-semibold' : 'text-sm text-gray-500'}`}>{breadcrumb.text}</span>
                    )}
                    {index !== breadcrumbs.length - 1 && (
                        <svg
                            className="mx-2.5 size-5 shrink-0 overflow-visible text-gray-400"
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
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    )}
                </li>
            ))}
        </ol>
    );
}
