import { forwardRef } from 'react';

import { BREAKPOINTS } from '@/shared/lib/breakpoints';
import { ImageMask } from '@/shared/ui/animation/image/image-mask';
import { createResponsiveSources } from '@/shared/ui/picture/picture.utils';
import { useScreenSizeContext } from '@/shared/lib/providers/use-context';

import desktop from '../../assets/blue electronic christmas tree.webp';
import mobile from '../../assets/blue electronic christmas tree-600.webp';
import tablet from '../../assets/blue electronic christmas tree-1000.webp';

import styles from './tree-section.module.scss';

export const TreeImage = forwardRef<HTMLImageElement>(function TreeImage(_props, ref) {
  const { screenWidth } = useScreenSizeContext();

  const sources = createResponsiveSources({
    mobile,
    tablet,
    desktop,
  });

  const fallbackSrc =
    screenWidth >= BREAKPOINTS.TABLET
      ? desktop
      : screenWidth >= BREAKPOINTS.MOBILE
        ? tablet
        : mobile;

  return (
    <ImageMask
      key={screenWidth}
      ref={ref}
      className={styles.treeImage}
      imageClassName={styles.image}
      src={fallbackSrc}
      sources={sources}
      alt="Circuit tree"
    />
  );
});
