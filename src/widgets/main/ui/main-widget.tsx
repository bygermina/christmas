import { Particles } from '@/shared/ui/animation/particles/particles';
import { useLayoutKey } from '@/shared/lib/hooks/use-layout-key';

import { Section } from './section';

export const MainWidget = () => {
  const layoutKey = useLayoutKey();

  return (
    <>
      <Section key={layoutKey} />
      <Particles />
    </>
  );
};
