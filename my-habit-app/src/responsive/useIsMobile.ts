import {useState, useEffect} from 'react';

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 479);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 479);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile;
}

export default useIsMobile;
