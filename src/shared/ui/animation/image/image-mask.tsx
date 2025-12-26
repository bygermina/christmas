import { forwardRef } from 'react';

import { cn } from '@/shared/lib/cn';
import { Picture } from '@/shared/ui/picture/picture';
import { type PictureSource } from '@/shared/ui/picture/picture.utils';

import styles from './image-mask.module.scss';

interface ImageMaskProps {
  src: string;
  className?: string;
  imageClassName?: string;
  style?: React.CSSProperties;
  sources?: PictureSource[];
  alt?: string;
}

export const ImageMask = forwardRef<HTMLImageElement, ImageMaskProps>(
  (
    {
      src,
      className,
      imageClassName,
      style,
      sources,
      alt = 'masked',
    },
    ref,
  ) => {
    return (
      <div className={cn(styles.container, className)} style={style}>
        <div
          className={cn(
            styles.imageWrapper,
            styles.imageWrapperAnimated,
            styles.imageWrapperGradient,
            imageClassName,
          )}
        >
          <Picture
            ref={ref}
            src={src}
            alt={alt}
            sources={sources}
            className={styles.picture}
            loading="eager"
            fetchPriority="high"
          />
        </div>
      </div>
    );
  },
);
