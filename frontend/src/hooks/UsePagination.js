import { useState, useMemo } from "react";

function usePagination(items, pageLimit, initialPage = 0) {
    const [pageNumber, setPageNumber] = useState(initialPage);

    const pageCount = Math.ceil(items.length / pageLimit);

    const changePage = (pN) => {
        setPageNumber(Math.max(0, Math.min(pN, pageCount - 1)));
    };

    const pageData = useMemo(() => {
        const start = pageNumber * pageLimit;
        const end = start + pageLimit;
        return items.slice(start, end);
    }, [pageNumber, pageLimit, items]);

    const nextPage = () => {
        setPageNumber(prev => Math.min(prev + 1, pageCount - 1));
    };

    const previousPage = () => {
        setPageNumber(prev => Math.max(prev - 1, 0));
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
