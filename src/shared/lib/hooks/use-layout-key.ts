import { useScreenSizeContext } from '@/shared/lib/providers/use-context';
import { getLayoutKey } from '@/shared/lib/layout-key';

export const useLayoutKey = (): string => {
  const { screenWidth, screenHeight } = useScreenSizeContext();
  return getLayoutKey(screenWidth, screenHeight);
};
