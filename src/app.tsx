import { ScreenSizeProvider } from '@/shared/lib/providers/screen-size-provider';
import { CodeBackground } from '@/shared/ui/code-background/code-background';
import { LightFollowCursor } from '@/shared/ui/animation/light';
import { MainWidget } from '@/widgets/main';
import { FooterWidget } from '@/widgets/footer';

import styles from './app.module.scss';
import './app.globals.scss';

export const App = () => {
  return (
    <ScreenSizeProvider>
      <div className={styles.root}>
        <a href="#main-content" className={styles.skipLink}>
          Skip to main content
        </a>
        <div aria-hidden="true">
          <CodeBackground />
        </div>
        <LightFollowCursor />
        <main id="main-content" className={styles.scrollContainer}>
          <MainWidget />
          <FooterWidget />
        </main>
      </div>
    </ScreenSizeProvider>
  );
};

