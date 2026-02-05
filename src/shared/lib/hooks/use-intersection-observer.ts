import { useEffect, useState, useRef } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
  once?: boolean;
}

export const useIntersectionObserver = (
  elementRef: React.RefObject<HTMLElement | null>,
  options: UseIntersectionObserverOptions = {},
) => {
  const { threshold = 0, rootMargin = '0px', root = null, once = false } = options;
  const [isIntersecting, setIsIntersecting] = useState(false);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (!elementRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;

        if (once && hasTriggeredRef.current && !isVisible) {
          return;
        }

        if (once && isVisible && !hasTriggeredRef.current) {
          hasTriggeredRef.current = true;
        }

        setIsIntersecting(isVisible);
      },
      { threshold, rootMargin, root },
    );

    observer.observe(elementRef.current);

    return () => {
      observer.disconnect();
    };
  }, [elementRef, threshold, rootMargin, root, once]);

  return isIntersecting;
};
