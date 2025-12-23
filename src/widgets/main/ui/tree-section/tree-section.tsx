import { useRef, useImperativeHandle, forwardRef, type RefObject } from 'react';

import { useElementDimensions, type Dimensions } from '@/shared/lib/hooks/use-element-dimensions';
import { pathTree, paths } from '@/shared/lib/svg-paths';
import { BREAKPOINTS } from '@/shared/lib/breakpoints';
import { ImageMask } from '@/shared/ui/animation/image/image-mask';
import { createResponsiveSources } from '@/shared/ui/picture/picture.utils';
import { useScreenSizeContext } from '@/shared/lib/providers/use-context';
import { getImageOffset, getScaledPath } from '@/shared/lib/svg';

import desktop from '../../assets/blue electronic christmas tree.jpg';
import mobile from '../../assets/blue circuit tree-500.webp';
import tablet from '../../assets/blue circuit tree-932.webp';

import styles from './tree-section.module.scss';

const IMAGE_BASE_HEIGHT = 826;
const IMAGE_BASE_WIDTH = 826;
const IMAGE_ASPECT_RATIO = IMAGE_BASE_HEIGHT / IMAGE_BASE_WIDTH;
const IMAGE_CENTER_PART = 0.5;

export interface TreeSectionProps {
  isContentReady: boolean;
  containerRef?: RefObject<HTMLElement | null>;
}

type Path = { path: string; start: { x: number; y: number }; delay: number; duration: number };

export interface TreeSectionRef {
  getPath: () => Path;
  getPaths: () => Path[];
  getImageDimensions: () => Dimensions;
}

export const TreeSection = forwardRef<TreeSectionRef, TreeSectionProps>(function TreeSection(
  { isContentReady, containerRef },
  ref,
) {
  const imageRef = useRef<HTMLImageElement>(null);

  const imageDimensions = useElementDimensions(
    imageRef,
    isContentReady,
    IMAGE_BASE_HEIGHT,
    IMAGE_CENTER_PART,
    containerRef,
  );

  const dx = getImageOffset(imageDimensions, IMAGE_ASPECT_RATIO);

  useImperativeHandle(
    ref,
    () => ({
      getPath: () => ({ ...pathTree, path: getScaledPath(imageDimensions, dx, pathTree) }),
      getPaths: () => paths.map((p) => ({ ...p, path: getScaledPath(imageDimensions, dx, p) })),
      getImageDimensions: () => imageDimensions,
    }),
    [dx, imageDimensions],
  );

  return <TreeImage ref={imageRef} />;
});

const TreeImage = forwardRef<HTMLImageElement>(function TreeImage(_props, ref) {
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
