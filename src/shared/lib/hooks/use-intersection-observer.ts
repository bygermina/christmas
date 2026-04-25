import { useEffect, useState } from 'react';

export const useIntersectionObserver = (elementRef: React.RefObject<HTMLElement | null>) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!elementRef.current) return;

    const observer = new IntersectionObserver(([entry]) =>
      setIsIntersecting(entry.isIntersecting),
    );

    observer.observe(elementRef.current);

    return () => observer.disconnect();
  // elementRef — стабильный RefObject, его identity не меняется между рендерами
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isIntersecting;
};
