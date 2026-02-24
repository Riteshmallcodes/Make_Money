import { useEffect, useState } from 'react';

const MOBILE_WIDTH = 767;

export default function useMobileGuard() {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= MOBILE_WIDTH);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}
