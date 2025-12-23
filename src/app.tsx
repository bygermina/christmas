import { ScreenSizeProvider } from '@/shared/lib/providers/screen-size-provider';
import { CodeBackground } from '@/shared/ui/code-background/code-background';
import { MainWidget } from '@/widgets/main';
import { FooterWidget } from '@/widgets/footer';

import styles from './app.module.scss';
import './app.globals.scss';
import { RouteDrawer } from './shared/ui/animation/route-drawer/route-drawer';

export const App = () => {
  return (
    <ScreenSizeProvider>
      <RouteDrawer />
      <div className={styles.root}>
        <a href="#main-content" className={styles.skipLink}>
          Skip to main content
        </a>
        <div aria-hidden="true">
          <CodeBackground />
        </div>
        <main id="main-content" className={styles.scrollContainer}>
          <MainWidget animate={true} />
          <FooterWidget />
        </main>
      </div>
    </ScreenSizeProvider>
  );
};

