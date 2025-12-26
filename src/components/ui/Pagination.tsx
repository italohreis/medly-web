interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    loading?: boolean;
}

export function Pagination({ currentPage, totalPages, onPageChange, loading }: PaginationProps) {
    const pages = [];
    const maxVisible = 5;

    let startPage = Math.max(0, currentPage - Math.floor(maxVisible / 2));
    const endPage = Math.min(totalPages - 1, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(0, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 border-t border-medical-200">
            <div className="flex justify-between sm:hidden w-full">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 0 || loading}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-medical-700 bg-white border border-medical-300 hover:bg-medical-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Anterior
                </button>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1 || loading}
                    className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-medical-700 bg-white border border-medical-300 hover:bg-medical-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Próximo
                </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-medical-700">
                        Página <span className="font-medium">{currentPage + 1}</span> de{' '}
                        <span className="font-medium">{totalPages || 1}</span>
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 0 || loading}
                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-medical-400 ring-1 ring-inset ring-medical-300 hover:bg-medical-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                            </svg>
                        </button>
                        {pages.map((page) => (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                disabled={loading}
                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${page === currentPage
                                    ? 'z-10 bg-primary-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
                                    : 'text-medical-900 ring-1 ring-inset ring-medical-300 hover:bg-medical-50 focus:z-20 focus:outline-offset-0'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {page + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages - 1 || loading}
                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-medical-400 ring-1 ring-inset ring-medical-300 hover:bg-medical-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
}
