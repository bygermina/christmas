import { forwardRef } from 'react';

import { BREAKPOINTS } from '@/shared/lib/breakpoints';
import { useScreenSizeContext } from '@/shared/lib/providers/screen-size-context';

import desktop from '../../assets/blue electronic christmas tree.webp';
import mobile from '../../assets/blue electronic christmas tree-600.webp';
import tablet from '../../assets/blue electronic christmas tree-1000.webp';

import styles from './tree-section.module.scss';

interface TreeImageProps {
  onImageLoad?: () => void;
}

const pickFallback = (screenWidth: number) => {
  if (screenWidth >= BREAKPOINTS.LG) return desktop;
  if (screenWidth >= BREAKPOINTS.MD) return tablet;
  return mobile;
};

export const TreeImage = forwardRef<HTMLImageElement, TreeImageProps>(({ onImageLoad }, ref) => {
  const { screenWidth } = useScreenSizeContext();

  return (
    <picture className={styles.tree}>
      <source srcSet={desktop} media={`(min-width: ${BREAKPOINTS.LG}px)`} />
      <source
        srcSet={tablet}
        media={`(min-width: ${BREAKPOINTS.MD}px) and (max-width: ${BREAKPOINTS.LG - 1}px)`}
      />
      <source srcSet={mobile} media={`(max-width: ${BREAKPOINTS.MD - 1}px)`} />
      <img
        ref={ref}
        src={pickFallback(screenWidth)}
        alt="Circuit tree"
        loading="eager"
        fetchPriority="high"
        onLoad={onImageLoad}
        className={styles.treeMedia}
      />
    </picture>
  );
});

TreeImage.displayName = 'TreeImage';
