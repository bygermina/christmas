import { Particles } from '@/shared/ui/animation/particles/particles';

import { MainWidgetProvider } from '../model/context';
import { Section } from './section';
import { Vignette } from './vignette';

interface MainWidgetProps {
  animate?: boolean;
}

export const MainWidget = ({ animate = true }: MainWidgetProps) => {
  return (
    <MainWidgetProvider animate={animate}>
      <Section />
      <Vignette />
      <Particles />
    </MainWidgetProvider>
  );
};
