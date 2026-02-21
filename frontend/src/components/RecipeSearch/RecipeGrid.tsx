import { Recipe } from '../../types/recipe';
import RecipeCard from './RecipeCard';

interface RecipeGridProps {
    recipes: Recipe[];
    onRecipeClick?: (recipe: Recipe) => void;
    isLoading?: boolean;
    emptyMessage?: string;
    // Pagination props
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
}

export default function RecipeGrid({
    recipes,
    onRecipeClick,
    isLoading = false,
    emptyMessage = 'No recipes found. Try adjusting your search criteria.',
    currentPage = 1,
    totalPages = 1,
    onPageChange,
}: RecipeGridProps) {
    // Loading state
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                    <div
                        key={index}
                        className="card animate-pulse"
                        aria-label="Loading recipe"
                    >
                        <div className="w-full h-48 bg-gray-200 rounded-t-lg" />
                        <div className="p-5 space-y-3">
                            <div className="h-6 bg-gray-200 rounded w-3/4" />
                            <div className="h-4 bg-gray-200 rounded w-full" />
                            <div className="h-4 bg-gray-200 rounded w-5/6" />
                            <div className="flex gap-3 pt-2">
                                <div className="h-6 bg-gray-200 rounded w-20" />
                                <div className="h-6 bg-gray-200 rounded w-16" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Empty state
    if (recipes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-24 w-24 text-text-secondary opacity-50 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <p className="text-text-secondary text-lg text-center max-w-md">
                    {emptyMessage}
                </p>
            </div>
        );
    }

    // Recipe grid
    return (
        <div className="space-y-6">
            <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                role="list"
                aria-label="Recipe results"
            >
                {recipes.map((recipe) => (
                    <div key={recipe.id} role="listitem">
                        <RecipeCard recipe={recipe} onClick={onRecipeClick} />
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && onPageChange && (
                <div className="flex items-center justify-center gap-2 pt-4">
                    {/* Previous Button */}
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg border border-border bg-surface text-text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-hover transition-colors"
                        aria-label="Previous page"
                    >
                        Previous
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                        {getPageNumbers(currentPage, totalPages).map((pageNum, index) => {
                            if (pageNum === '...') {
                                return (
                                    <span
                                        key={`ellipsis-${index}`}
                                        className="px-3 py-2 text-text-secondary"
                                    >
                                        ...
                                    </span>
                                );
                            }

                            const page = Number(pageNum);
                            return (
                                <button
                                    key={page}
                                    onClick={() => onPageChange(page)}
                                    className={`px-4 py-2 rounded-lg border transition-colors ${currentPage === page
                                            ? 'bg-primary text-white border-primary'
                                            : 'bg-surface text-text-primary border-border hover:bg-surface-hover'
                                        }`}
                                    aria-label={`Page ${page}`}
                                    aria-current={currentPage === page ? 'page' : undefined}
                                >
                                    {page}
                                </button>
                            );
                        })}
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg border border-border bg-surface text-text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-hover transition-colors"
                        aria-label="Next page"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

// Helper function to generate page numbers with ellipsis
function getPageNumbers(currentPage: number, totalPages: number): (number | string)[] {
    const pages: (number | string)[] = [];
    const maxVisible = 5; // Maximum number of page buttons to show

    if (totalPages <= maxVisible) {
        // Show all pages if total is small
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else {
        // Always show first page
        pages.push(1);

        // Calculate range around current page
        let start = Math.max(2, currentPage - 1);
        let end = Math.min(totalPages - 1, currentPage + 1);

        // Adjust range if at the beginning or end
        if (currentPage <= 3) {
            end = 4;
        } else if (currentPage >= totalPages - 2) {
            start = totalPages - 3;
        }

        // Add ellipsis after first page if needed
        if (start > 2) {
            pages.push('...');
        }

        // Add middle pages
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        // Add ellipsis before last page if needed
        if (end < totalPages - 1) {
            pages.push('...');
        }

        // Always show last page
        pages.push(totalPages);
    }

    return pages;
}
