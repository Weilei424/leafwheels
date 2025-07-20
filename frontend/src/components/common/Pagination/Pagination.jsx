import React, { useEffect } from "react";
import { motion } from "framer-motion";
import usePagination from "../../../hooks/usePagination.js";

const Pagination = ({ items, pageLimit, setPageItems }) => {
    const { pageNumber, pageCount, changePage, pageData, nextPage, previousPage } = usePagination(items, pageLimit);

    useEffect(() => {
        setPageItems(pageData());
    }, [pageNumber, items]);

    if (pageCount <= 1) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mt-12"
        >
            <PageButton
                onClick={previousPage}
                disabled={pageNumber === 0}
                className="px-4"
            >
                ←
            </PageButton>

            {[...Array(pageCount)].map((_, i) => (
                <PageButton
                    key={i}
                    onClick={() => changePage(i)}
                    active={i === pageNumber}
                >
                    {i + 1}
                </PageButton>
            ))}

            <PageButton
                onClick={nextPage}
                disabled={pageNumber === pageCount - 1}
                className="px-4"
            >
                →
            </PageButton>
        </motion.div>
    );
};

const PageButton = ({ children, onClick, disabled, active, className = "" }) => (
    <motion.button
        onClick={onClick}
        disabled={disabled}
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        className={`
      min-w-[40px] h-10 px-3 flex items-center justify-center rounded-lg
      transition-all duration-200 font-medium
      ${active
            ? 'bg-green-700 text-white shadow-lg'
            : disabled
                ? 'text-green-300 cursor-not-allowed'
                : 'text-green-600 hover:bg-green-100 hover:text-green-700'
        }
      ${className}
    `}
    >
        {children}
    </motion.button>
);

export default Pagination;