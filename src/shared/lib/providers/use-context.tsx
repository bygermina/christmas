import { createContext, useContext } from 'react';

import type { useScreenSize } from '@/shared/lib/hooks/use-screen-size';

export const ScreenSizeContext = createContext<ReturnType<typeof useScreenSize> | null>(null);

export const useScreenSizeContext = () => useContext(ScreenSizeContext)!;
