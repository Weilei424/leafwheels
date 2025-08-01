import React, { useEffect } from "react";
import { motion } from "framer-motion";
import usePagination from "../../../hooks/UsePagination.js";

function Pagination({ items, pageLimit, setPageItems }) {
    const {
        currentPageNumber,
        totalPageCount,
        navigateToPage,
        getCurrentPageItems,
        goToNextPage,
        goToPreviousPage
    } = usePagination(items, pageLimit);

    // Update parent component with current page items whenever page or items change
    useEffect(() => {
        const currentPageItems = getCurrentPageItems();
        setPageItems(currentPageItems);
    }, [currentPageNumber, items]);

    // Don't show pagination if there's only one page or no items
    if (totalPageCount <= 1) {
        return null;
    }

    const isOnFirstPage = currentPageNumber === 0;
    const isOnLastPage = currentPageNumber === totalPageCount - 1;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mt-12"
        >
            {/* Previous page button */}
            <PaginationButton
                onClick={goToPreviousPage}
                isDisabled={isOnFirstPage}
                className="px-4"
                ariaLabel="Go to previous page"
            >
                ←
            </PaginationButton>

            {/* Page number buttons */}
            {Array.from({ length: totalPageCount }, (_, pageIndex) => (
                <PaginationButton
                    key={pageIndex}
                    onClick={() => navigateToPage(pageIndex)}
                    isActive={pageIndex === currentPageNumber}
                    ariaLabel={`Go to page ${pageIndex + 1}`}
                >
                    {pageIndex + 1}
                </PaginationButton>
            ))}

            {/* Next page button */}
            <PaginationButton
                onClick={goToNextPage}
                isDisabled={isOnLastPage}
                className="px-4"
                ariaLabel="Go to next page"
            >
                →
            </PaginationButton>
        </motion.div>
    );
}

function PaginationButton({
                              children,
                              onClick,
                              isDisabled = false,
                              isActive = false,
                              className = "",
                              ariaLabel
                          }) {
    function getButtonStyles() {
        if (isActive) {
            return 'bg-black text-white shadow-lg';
        }

        if (isDisabled) {
            return 'text-black cursor-not-allowed opacity-50';
        }

        return 'text-black hover:bg-black hover:text-white';
    }

    return (
        <motion.button
            onClick={onClick}
            disabled={isDisabled}
            whileHover={!isDisabled ? { scale: 1.05 } : {}}
            whileTap={!isDisabled ? { scale: 0.95 } : {}}
            aria-label={ariaLabel}
            className={`
                min-w-[40px] h-10 px-3 flex items-center justify-center rounded-lg
                transition-all duration-200 font-medium
                ${getButtonStyles()}
                ${className}
            `}
        >
            {children}
        </motion.button>
    );
}

export default Pagination;