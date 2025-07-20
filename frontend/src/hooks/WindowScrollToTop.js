import { useEffect } from "react";


//automatically scrolls the window to the top (position 0,0) when the component is mounted.
const useWindowScrollToTop = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
};

export default useWindowScrollToTop;