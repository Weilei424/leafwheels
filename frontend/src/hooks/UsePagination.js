import { useState } from "react";

function usePagination(items, pageLimit) {
    const [pageNumber, setPageNumber] = useState(0);

    const pageCount = Math.ceil(items.length / pageLimit);

    const changePage = (pN) => {
        setPageNumber(Math.max(0, Math.min(pN, pageCount - 1)));
    };

    const pageData = () => {
        const start = pageNumber * pageLimit;
        return items.slice(start, start + pageLimit);
    };

    const nextPage = () => changePage(pageNumber + 1);
    const previousPage = () => changePage(pageNumber - 1);

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