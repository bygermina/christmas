import { forwardRef, useCallback } from 'react';

import { ImageMask } from '@/shared/ui/animation/image/image-mask';
import {
  createResponsiveSources,
  getResponsiveFallbackSrc,
} from '@/shared/ui/picture/picture.utils';
import { useScreenSizeContext } from '@/shared/lib/providers/use-context';

import desktop from '../../assets/blue electronic christmas tree.webp';
import mobile from '../../assets/blue electronic christmas tree-600.webp';
import tablet from '../../assets/blue electronic christmas tree-1000.webp';

import styles from './tree-section.module.scss';

const TREE_IMAGES = { mobile, tablet, desktop };

interface TreeImageProps {
  onImageLoad?: () => void;
}

export const TreeImage = forwardRef<HTMLImageElement, TreeImageProps>(({ onImageLoad }, ref) => {
    const { screenWidth, screenHeight } = useScreenSizeContext();

    const sources = createResponsiveSources(TREE_IMAGES);
    const fallbackSrc = getResponsiveFallbackSrc(screenWidth, TREE_IMAGES);

    const handleLoad = useCallback(() => onImageLoad?.(), [onImageLoad]);

    return (
      <ImageMask
        ref={ref}
        className={styles.treeImage}
        imageClassName={styles.image}
        src={fallbackSrc}
        sources={sources}
        alt="Circuit tree"
        onLoad={handleLoad}
      />
    );
  },
);
