import { Particles } from '@/shared/ui/animation/particles/particles';
import { useScreenSizeContext } from '@/shared/lib/providers/use-context';

import { Section } from './section';


export const MainWidget = () => {
  const { screenWidth, screenHeight } = useScreenSizeContext();

  return (
    <>
      <Section key={`${screenWidth}-${screenHeight}`} />
      <Particles />
    </>
  );
};
