import { useState, useMemo } from "react";

function usePagination(items, pageLimit) {
    const [pageNumber, setPageNumber] = useState(0);

    // Calculate pageCount based on the current items array
    const pageCount = Math.ceil(items.length / pageLimit);

    const changePage = (pN) => {
        // Ensure page number stays within valid bounds
        setPageNumber(Math.max(0, Math.min(pN, pageCount - 1)));
    };

    // Memoize the data for the current page to prevent unnecessary re-renders
    const pageData = useMemo(() => {
        const s = pageNumber * pageLimit;
        const e = s + pageLimit;
        return items.slice(s, e);
    }, [pageNumber, pageLimit, items]); // Dependencies: recalculate if pageNumber, pageLimit, or items change

    const nextPage = () => {
        setPageNumber(Math.min(pageNumber + 1, pageCount - 1));
    };

    const previousPage = () => {
        setPageNumber(Math.max(pageNumber - 1, 0));
    };

    return {
        pageNumber,
        pageCount,
        changePage,
        pageData,
        nextPage,
        previousPage,
    };
}

export default usePagination;