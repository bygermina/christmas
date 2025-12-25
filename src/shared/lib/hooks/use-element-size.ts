import { useEffect, useState } from 'react';
import { getElementDimensions } from './use-element-dimensions';

export const useElementSize = (ref: React.RefObject<HTMLElement | null>) => {
  const [size, setSize] = useState({ left: 0, right: 0, width: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const updateSize = () => {
      setSize({ ...getElementDimensions(element) });
    };

    updateSize();

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [ref]);

  return size;
};
