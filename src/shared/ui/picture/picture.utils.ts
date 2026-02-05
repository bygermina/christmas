import { BREAKPOINTS } from '@/shared/lib/breakpoints';

export interface ResponsiveImages {
  mobile?: string;
  tablet?: string;
  desktop?: string;
}

export const getResponsiveFallbackSrc = (
  screenWidth: number,
  images: ResponsiveImages,
): string =>
  screenWidth >= BREAKPOINTS.TABLET
    ? images.desktop ?? images.tablet ?? images.mobile ?? ''
    : screenWidth >= BREAKPOINTS.MOBILE
      ? images.tablet ?? images.mobile ?? images.desktop ?? ''
      : images.mobile ?? images.tablet ?? images.desktop ?? '';

export interface PictureSource {
  srcSet: string;
  media?: string;
  type?: string;
  sizes?: string;
}

const defaultMobileMedia = `(max-width: ${BREAKPOINTS.MOBILE - 1}px)`;
const defaultTabletMedia = `(min-width: ${BREAKPOINTS.MOBILE}px) and (max-width: ${BREAKPOINTS.TABLET - 1}px)`;
const defaultDesktopMedia = `(min-width: ${BREAKPOINTS.TABLET}px)`;

export const createResponsiveSources = (
  images: ResponsiveImages,
  options?: {
    mobileBreakpoint?: string;
    tabletBreakpoint?: string;
  },
): PictureSource[] => {
  const {
    mobileBreakpoint = defaultMobileMedia,
    tabletBreakpoint = defaultTabletMedia,
  } = options || {};

  const sources: PictureSource[] = [];

  if (images.desktop) {
    sources.push({
      srcSet: images.desktop,
      media: defaultDesktopMedia,
    });
  }

  if (images.tablet) {
    sources.push({
      srcSet: images.tablet,
      media: tabletBreakpoint,
    });
  }

  if (images.mobile) {
    sources.push({
      srcSet: images.mobile,
      media: mobileBreakpoint,
    });
  }

  return sources;
};


