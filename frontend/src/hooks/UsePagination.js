import { useState, useEffect } from "react";

function usePagination(itemsToPagethrough, itemsPerPage) {
    const [currentPageNumber, setCurrentPageNumber] = useState(0);

    const totalPageCount = Math.ceil(itemsToPagethrough.length / itemsPerPage);

    // Reset to first page when items change (Example  different category selected)
    useEffect(() => {
        setCurrentPageNumber(0);
    }, [itemsToPagethrough.length]);

    function navigateToPage(targetPageNumber) {
        const validPageNumber = Math.max(0, Math.min(targetPageNumber, totalPageCount - 1));
        setCurrentPageNumber(validPageNumber);
    }

    function getCurrentPageItems() {
        const startIndex = currentPageNumber * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return itemsToPagethrough.slice(startIndex, endIndex);
    }

    function goToNextPage() {
        if (currentPageNumber < totalPageCount - 1) {
            navigateToPage(currentPageNumber + 1);
        }
    }

    function goToPreviousPage() {
        if (currentPageNumber > 0) {
            navigateToPage(currentPageNumber - 1);
        }
    }

    return {
        currentPageNumber,
        totalPageCount,
        navigateToPage,
        getCurrentPageItems,
        goToNextPage,
        goToPreviousPage,
    };
}

export default usePagination;